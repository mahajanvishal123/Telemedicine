import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  FaCamera, FaUser, FaEnvelope, FaLock, FaVenusMars, FaCalendarAlt,
  FaIdCard, FaSave, FaCheck, FaTimes, FaEye, FaEyeSlash
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import API_URL from '../../Baseurl/Baseurl';

const CaregiverProfile = () => {
  const BASE_URL = API_URL;

  // Data state
  const [caregiver, setCaregiver] = useState({
    _id: "",
    name: "",
    email: "",
    password: "",
    gender: "",
    profile: "",
    age: "",
    dob: "",
    certificate: "",
    bloodGroup: ""
  });

  // UI state
  const [profileImage, setProfileImage] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // 👁️ Show/Hide password
  const [showPassword, setShowPassword] = useState(false);

  // Refs
  const profileInputRef = useRef(null);
  const certificateInputRef = useRef(null);

  // ---------- helpers ----------
  const safeJSON = (txt) => { try { return JSON.parse(txt); } catch { return null; } };

  // login payload usually stored as 'user' with { token, role, user: {...} }
  const loginBlob = safeJSON(localStorage.getItem('user')) || {};
  const accessToken =
    localStorage.getItem('accessToken') ||
    loginBlob?.token ||
    '';

  const decodeJwtId = () => {
    try {
      if (!accessToken || accessToken.split('.').length !== 3) return null;
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      return payload?.caregiverId || payload?.id || payload?._id || payload?.userId || null;
    } catch {
      return null;
    }
  };

  // STRONG source of truth for ID (no stale LS override)
  const resolveCaregiverId = () => {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get('id');

    const fromUserObj = loginBlob?.user?._id || loginBlob?._id || null; // your login sample uses user._id
    const fromJwt = decodeJwtId();

    // FINAL priority:
    // 1) URL ?id=...
    // 2) logged-in user._id (from login response)
    // 3) JWT id
    // 4) cached profile._id (last resort)
    const cachedProfile = safeJSON(localStorage.getItem('caregiverProfile')) || {};
    const fromCache = cachedProfile?._id || null;

    const resolved =
      fromQuery ||
      fromUserObj ||
      fromJwt ||
      fromCache ||
      null;

    // keep localStorage aligned with the authenticated identity (avoid stale ID)
    if (fromUserObj && resolved !== fromUserObj) {
      localStorage.setItem('caregiverId', fromUserObj);
    } else if (fromJwt && resolved !== fromJwt) {
      localStorage.setItem('caregiverId', fromJwt);
    } else if (resolved) {
      localStorage.setItem('caregiverId', resolved);
    }

    return resolved;
  };

  const trimStr = (v) => (typeof v === 'string' ? v.trim() : v);
  const normalizeDobForInput = (v) => (v ? String(v).trim().slice(0, 10) : '');

  // Ensure we pick by _id even if server returns an array unexpectedly
  const pickFromAnyShapeById = (res, id) => {
    let d = res?.data;
    if (Array.isArray(d)) return d.find(x => String(x?._id) === String(id)) || null;
    if (d?.data !== undefined) {
      if (Array.isArray(d.data)) return d.data.find(x => String(x?._id) === String(id)) || null;
      d = d.data;
    }
    if (d?.caregiver !== undefined) {
      if (Array.isArray(d.caregiver)) return d.caregiver.find(x => String(x?._id) === String(id)) || null;
      d = d.caregiver;
    }
    return d && typeof d === 'object' ? d : null;
  };

  const mapAndSetByDoc = (doc, id) => {
    // if API wrapped it, unwrap again
    const d = Array.isArray(doc) ? doc.find(x => x?._id === id) : doc;
    if (!d || typeof d !== 'object') throw new Error('Invalid caregiver payload');

    const mapped = {
      _id: d?._id || id,
      name: trimStr(d?.name) || '',
      email: trimStr(d?.email) || '',
      // Never prefill hashed password into form
      password: (typeof d?.password === 'string' && d.password.startsWith('$')) ? '' : (trimStr(d?.password) || ''),
      gender: trimStr(d?.gender) || '',
      profile: trimStr(d?.profile) || '',
      age: trimStr(d?.age) || '', // keep age separate
      dob: normalizeDobForInput(d?.dob),
      certificate: trimStr(d?.certificate) || '',
      bloodGroup: trimStr(d?.bloodGroup) || ''
    };

    setCaregiver(mapped);
    if (mapped.profile) setProfileImage(mapped.profile);

    // sync cache to the correct logged-in caregiver
    localStorage.setItem('caregiverId', mapped._id);
    localStorage.setItem('caregiverProfile', JSON.stringify(mapped));
  };

  // ---------- GET by ID ----------
  const fetchCaregiver = async () => {
    const CAREGIVER_ID = resolveCaregiverId();
    if (!CAREGIVER_ID) {
      setIsLoading(false);
      setLoadError('Caregiver ID not found (login required or invalid URL).');
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    const headers = {
      Accept: 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    try {
      // Prefer clean by-id endpoints ONLY
      // 1) /caregiver/:id
      try {
        const res1 = await axios.get(`${BASE_URL}/caregiver/${CAREGIVER_ID}`, { headers });
        const d1 = pickFromAnyShapeById(res1, CAREGIVER_ID) || res1?.data;
        if (d1 && (d1._id || d1?.data || d1?.caregiver)) {
          mapAndSetByDoc((Array.isArray(d1) ? pickFromAnyShapeById({ data: d1 }, CAREGIVER_ID) : d1), CAREGIVER_ID);
          return;
        }
      } catch { /* continue fallback */ }

      // 2) /caregiver?caregiverId=...
      const res2 = await axios.get(`${BASE_URL}/caregiver?caregiverId=${CAREGIVER_ID}`, { headers });
      const d2 = pickFromAnyShapeById(res2, CAREGIVER_ID) || res2?.data;
      if (!d2) throw new Error('Caregiver not found');

      mapAndSetByDoc((Array.isArray(d2) ? pickFromAnyShapeById({ data: d2 }, CAREGIVER_ID) : d2), CAREGIVER_ID);
    } catch (err) {
      console.error('GET caregiver by id failed:', err);
      setLoadError(err?.response?.data?.message || err?.message || 'Failed to load caregiver');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCaregiver();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Submit (PUT by ID) ----------
  // Util: convert dataURL to Blob for multipart
  const dataURLtoBlob = (dataurl) => {
    try {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);
      return new Blob([u8arr], { type: mime });
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    // resolve target id: prefer state._id, else resolver
    const targetId = caregiver._id || resolveCaregiverId();
    if (!targetId) {
      setIsSaving(false);
      setSaveSuccess(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      console.error('No caregiver ID available for PUT');
      return;
    }

    const url = `${BASE_URL}/caregiver/${targetId}`;

    const headersBase = {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    // Decide payload type:
    const isDataUrlProfile = (profileImage || caregiver.profile || '').startsWith('data:');
    const useMultipart = !!certificateFile || isDataUrlProfile;

    try {
      let res;

      if (useMultipart) {
        const form = new FormData();
        form.append('name', caregiver.name || '');
        form.append('email', caregiver.email || '');
        if (caregiver.password && caregiver.password.trim() !== '') {
          form.append('password', caregiver.password.trim());
        }
        form.append('gender', caregiver.gender || '');
        form.append('age', caregiver.age || '');
        form.append('dob', caregiver.dob || '');
        form.append('bloodGroup', caregiver.bloodGroup || '');

        if (isDataUrlProfile) {
          const blob = dataURLtoBlob(profileImage || caregiver.profile);
          if (blob) form.append('profile', blob, 'profile.jpg');
        } else if (caregiver.profile) {
          form.append('profile', caregiver.profile);
        }

        if (certificateFile) {
          form.append('certificate', certificateFile, certificateFile.name);
        } else if (caregiver.certificate) {
          form.append('certificate', caregiver.certificate);
        }

        res = await axios.put(url, form, {
          headers: {
            ...headersBase,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        const payload = {
          name: caregiver.name || '',
          email: caregiver.email || '',
          gender: caregiver.gender || '',
          age: caregiver.age || '',
          dob: caregiver.dob || '',
          bloodGroup: caregiver.bloodGroup || '',
          certificate: caregiver.certificate || '',
          profile: caregiver.profile || '',
          ...(caregiver.password && caregiver.password.trim() !== '' ? { password: caregiver.password.trim() } : {}),
        };

        res = await axios.put(url, payload, {
          headers: {
            ...headersBase,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
      }

      const updatedDoc = pickFromAnyShapeById(res, targetId) || res?.data || {};
      try {
        mapAndSetByDoc(updatedDoc, targetId);
      } catch { /* ignore if server doesn't echo */ }

      setIsSaving(false);
      setSaveSuccess(true);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setSaveSuccess(false);
      }, 2500);
    } catch (err) {
      console.error('PUT caregiver (by id) failed:', err);
      setIsSaving(false);
      setSaveSuccess(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    }
  };

  // ---------- handlers ----------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCaregiver(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
        setCaregiver(prev => ({ ...prev, profile: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCertificateUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertificateFile(file);
      setCaregiver(prev => ({ ...prev, certificate: file.name }));
    }
  };

  const triggerProfileUpload = () => profileInputRef.current?.click();
  const triggerCertificateUpload = () => certificateInputRef.current?.click();

  return (
    <div className="caregiver-profile-container py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="profile-card">
              <div className="profile-header">
                <h2 className="profile-title">Caregiver Profile</h2>
                <p className="profile-subtitle">Manage your personal information and credentials</p>
              </div>

              <div className="profile-body">
                {isLoading && (
                  <div className="d-flex align-items-center mb-3">
                    <span className="spinner-border me-2" role="status" />
                    <span>Loading caregiver...</span>
                  </div>
                )}
                {loadError && !isLoading && (
                  <div className="alert alert-danger">{loadError}</div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Left Column - Profile Picture */}
                    <div className="col-lg-4 profile-left-column">
                      <div className="profile-image-container">
                        <div className="profile-image-wrapper">
                          {profileImage || caregiver.profile ? (
                            <img
                              src={profileImage || caregiver.profile}
                              alt="Profile"
                              className="profile-image"
                            />
                          ) : (
                            <div className="profile-placeholder">
                              <FaUser className="profile-placeholder-icon" />
                            </div>
                          )}
                          <div className="profile-overlay">
                            <button
                              type="button"
                              className="profile-upload-btn"
                              onClick={triggerProfileUpload}
                            >
                              <FaCamera />
                            </button>
                          </div>
                        </div>
                        <input
                          type="file"
                          ref={profileInputRef}
                          className="d-none"
                          accept="image/*"
                          onChange={handleProfileUpload}
                        />
                      </div>

                      <div className="profile-actions">
                        <button
                          type="button"
                          className="btn-upload"
                          onClick={triggerProfileUpload}
                        >
                          <FaCamera className="me-2" /> Upload Photo
                        </button>
                      </div>

                      <div className="profile-info-card">
                        <h3 className="info-card-title">Profile Information</h3>
                        <div className="info-item">
                          <span className="info-label">Name:</span>
                          <span className="info-value">{caregiver.name || "Not provided"}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Email:</span>
                          <span className="info-value">{caregiver.email || "Not provided"}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Gender:</span>
                          <span className="info-value">{caregiver.gender || "Not specified"}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Age:</span>
                          <span className="info-value">{caregiver.age ? `${caregiver.age} years` : "Not provided"}</span>
                        </div>
                        {caregiver.bloodGroup ? (
                          <div className="info-item">
                            <span className="info-label">Blood Group:</span>
                            <span className="info-value">{caregiver.bloodGroup}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Right Column - Form Fields */}
                    <div className="col-lg-8 profile-right-column">
                      <div className="form-section">
                        <h3 className="form-section-title">Personal Information</h3>

                        <div className="row">
                          {/* Name */}
                          <div className="col-md-6 mb-3">
                            <div className="form-group">
                              <label className="form-label">
                                <FaUser className="me-2" /> Full Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={caregiver.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                              />
                            </div>
                          </div>

                          {/* Email */}
                          <div className="col-md-6 mb-3">
                            <div className="form-group">
                              <label className="form-label">
                                <FaEnvelope className="me-2" /> Email Address
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={caregiver.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                              />
                            </div>
                          </div>

                          {/* Password + Eye */}
                          <div className="col-md-6 mb-3">
                            <div className="form-group">
                              <label className="form-label">
                                <FaLock className="me-2" /> Password
                              </label>
                              <div className="pw-wrapper">
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  className="form-control pw-input"
                                  name="password"
                                  value={caregiver.password}
                                  onChange={handleInputChange}
                                  placeholder="Enter your password"
                                  autoComplete="new-password"
                                />
                                <button
                                  type="button"
                                  className="pw-toggle"
                                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                                  onClick={() => setShowPassword(s => !s)}
                                  title={showPassword ? 'Hide' : 'Show'}
                                >
                                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                              </div>
                              <small className="text-muted">Leave blank to keep current password</small>
                            </div>
                          </div>

                          {/* Gender */}
                          <div className="col-md-6 mb-3">
                            <div className="form-group">
                              <label className="form-label">
                                <FaVenusMars className="me-2" /> Gender
                              </label>
                              <select
                                className="form-select"
                                name="gender"
                                value={caregiver.gender}
                                onChange={handleInputChange}
                              >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>

                          {/* Age */}
                          <div className="col-md-6 mb-3">
                            <div className="form-group">
                              <label className="form-label">
                                <FaUser className="me-2" /> Age
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="age"
                                value={caregiver.age}
                                onChange={handleInputChange}
                                placeholder="Enter your age"
                              />
                            </div>
                          </div>

                          {/* Date of Birth */}
                          <div className="col-md-6 mb-3">
                            <div className="form-group">
                              <label className="form-label">
                                <FaCalendarAlt className="me-2" /> Date of Birth
                              </label>
                              <input
                                type="date"
                                className="form-control"
                                name="dob"
                                value={caregiver.dob}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="form-section">
                        <h3 className="form-section-title">Credentials</h3>

                        {/* Certificate */}
                        <div className="form-group">
                          <label className="form-label">
                            <FaIdCard className="me-2" /> Certificate
                          </label>
                          <div className="certificate-upload">
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                value={caregiver.certificate || "No file chosen"}
                                readOnly
                              />
                              <button
                                type="button"
                                className="btn-choose-file"
                                onClick={triggerCertificateUpload}
                              >
                                Choose File
                              </button>
                            </div>
                            <input
                              type="file"
                              ref={certificateInputRef}
                              className="d-none"
                              onChange={handleCertificateUpload}
                            />
                            {certificateFile && (
                              <div className="mt-2 file-badge">
                                <span className="badge bg-primary">{certificateFile.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="form-actions">
                        <button type="submit" className="btn-save" disabled={isSaving}>
                          {isSaving ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <FaSave className="me-2" /> Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div className={`toast show ${saveSuccess ? 'bg-success' : 'bg-danger'} text-white`}>
            <div className="toast-header">
              <strong className="me-auto">Notification</strong>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
            <div className="toast-body d-flex align-items-center">
              {saveSuccess ? (
                <>
                  <FaCheck className="me-2" /> Profile updated successfully!
                </>
              ) : (
                <>
                  <FaTimes className="me-2" /> Failed to update profile. Please try again.
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .caregiver-profile-container { background-color: #f8f9fa; min-height: 100vh; }
        .profile-card { border-radius: 12px; overflow: hidden; margin-bottom: 30px; }
        .profile-header { color: black; padding: 25px 30px; }
        .profile-title { font-size: 28px; font-weight: 700; margin-bottom: 5px; }
        .profile-subtitle { font-size: 16px; opacity: 0.9; margin: 0; }
        .profile-body { padding: 30px; }
        .profile-left-column { position: relative; }
        .profile-image-container { text-align: center; margin-bottom: 25px; }
        .profile-image-wrapper { position: relative; display: inline-block; margin-bottom: 15px; }
        .profile-image { width: 200px; height: 200px; border-radius: 50%; object-fit: cover; border: 5px solid #f0f0f0; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .profile-placeholder { width: 200px; height: 200px; border-radius: 50%; background: linear-gradient(135deg,#f0f0f0 0%,#e0e0e0 100%); display:flex; align-items:center; justify-content:center; border:5px solid #f0f0f0; box-shadow:0 5px 15px rgba(0,0,0,0.1); }
        .profile-placeholder-icon { font-size: 60px; color: #adb5bd; }
        .profile-overlay { position:absolute; top:0; left:0; width:100%; height:100%; border-radius:50%; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity 0.3s ease; }
        .profile-image-wrapper:hover .profile-overlay { opacity:1; }
        .profile-upload-btn { width:50px; height:50px; border-radius:50%; background:white; border:none; color:#4361ee; font-size:18px; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 2px 10px rgba(0,0,0,0.2); transition: transform .3s ease; }
        .profile-upload-btn:hover { transform: scale(1.1); }
        .btn-upload { background:#F95918; color:white; border:none; padding:10px 20px; border-radius:8px; font-weight:600; transition:all .3s ease; position:relative; overflow:hidden; }
        .btn-upload:before { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent); transition:left .7s ease; }
        .btn-upload:hover:before { left:100%; }
        .btn-upload:hover { background:#e04f15; transform: translateY(-2px); box-shadow:0 5px 15px rgba(249,89,24,.4); }
        .profile-info-card { background:#f8f9fa; border-radius:12px; padding:20px; margin-top:30px; }
        .info-card-title { font-size:18px; font-weight:700; margin-bottom:15px; color:#495057; }
        .info-item { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #e9ecef; }
        .info-item:last-child { border-bottom:none; }
        .info-label { font-weight:600; color:#6c757d; }
        .info-value { font-weight:500; color:#212529; }
        .profile-right-column { padding-left:30px; }
        .form-section { margin-bottom:30px; }
        .form-section-title { font-size:20px; font-weight:700; margin-bottom:20px; color:#495057; position:relative; padding-bottom:10px; }
        .form-section-title:after { content:''; position:absolute; bottom:0; left:0; width:50px; height:3px; background:#4361ee; border-radius:3px; }
        .form-group { margin-bottom:20px; }
        .form-label { font-weight:600; color:#495057; margin-bottom:8px; display:flex; align-items:center; }
        .form-control, .form-select { border:1px solid #ced4da; border-radius:8px; padding:12px 15px; font-size:15px; transition:all .3s ease; }
        .form-control:focus, .form-select:focus { border-color:#4361ee; box-shadow:0 0 0 .2rem rgba(67,97,238,.25); }
        .certificate-upload { margin-bottom:10px; }
        .file-badge { margin-top:10px; }
        .form-actions { display:flex; justify-content:flex-end; margin-top:20px; }
        .btn-save { background:#F95918; color:white; border:none; padding:12px 30px; border-radius:8px; font-weight:600; font-size:16px; transition:all .3s ease; position:relative; overflow:hidden; }
        .btn-save:before { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent); transition:left .7s ease; }
        .btn-save:hover:before { left:100%; }
        .btn-save:hover { background:#e04f15; transform: translateY(-2px); box-shadow:0 5px 15px rgba(249,89,24,.4); }
        .btn-save:disabled { background:#6c757d; }
        .btn-choose-file { background:#F95918; color:white; border:1px solid #F95918; padding:8px 16px; border-radius:8px; font-weight:600; font-size:14px; transition:all .3s ease; position:relative; overflow:hidden; }
        .btn-choose-file:before { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent); transition:left .7s ease; }
        .btn-choose-file:hover:before { left:100%; }
        .btn-choose-file:hover { background:#e04f15; border-color:#e04f15; transform: translateY(-2px); box-shadow:0 5px 15px rgba(249,89,24,.4); }
        .toast-container { z-index:1050; }
        .toast { border-radius:8px; box-shadow:0 5px 15px rgba(0,0,0,0.1); }

        /* 👁️ Password field styles */
        .pw-wrapper { position: relative; }
        .pw-input { padding-right: 44px; } /* space for eye button */
        .pw-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 18px;
          color: #6c757d;
          border-radius: 6px;
        }
        .pw-toggle:hover { background: #f1f3f5; color: #343a40; }

        @media (max-width: 991px) {
          .profile-right-column { padding-left:0; margin-top:30px; }
        }
      `}</style>
    </div>
  );
};

export default CaregiverProfile;
