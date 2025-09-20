import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  FaCamera, FaUser, FaEnvelope, FaLock, FaVenusMars, FaCalendarAlt,
  FaIdCard, FaSave, FaCheck, FaTimes, FaEye, FaDownload
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
<<<<<<< HEAD
    certificate: "", // Holds data URL or server URL
=======
    certificate: "",       // URL or empty
    certificateName: "",   // ORIGINAL file name we want to show/persist
>>>>>>> 758afd2789adcc6cf93d30d1d25f2d672233ed62
    bloodGroup: ""
  });

  // UI state
  const [profileImage, setProfileImage] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null); // File object for upload
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Refs
  const profileInputRef = useRef(null);
  const certificateInputRef = useRef(null);

  // ---------- helpers ----------
  const safeJSON = (txt) => { try { return JSON.parse(txt); } catch { return null; } };

<<<<<<< HEAD
=======
  // keep a tiny map of original names per caregiver in LS
  const CERT_MAP_KEY = 'cg_cert_names';
  const readCertNameMap = () => safeJSON(localStorage.getItem(CERT_MAP_KEY)) || {};
  const writeCertNameMap = (id, name) => {
    const m = readCertNameMap();
    if (id) {
      if (name) m[id] = name;
      else delete m[id];
      localStorage.setItem(CERT_MAP_KEY, JSON.stringify(m));
    }
  };

  // derive a friendly name from a URL as a last resort
  const nameFromUrl = (url) => {
    if (!url) return "";
    try {
      const last = decodeURIComponent(url.split('/').pop().split('?')[0]);
      // strip very long Cloudinary public-ids (optional)
      if (!last || last.length > 80) return "";
      return last;
    } catch {
      return "";
    }
  };

  // login payload usually stored as 'user' with { token, role, user: {...} }
>>>>>>> 758afd2789adcc6cf93d30d1d25f2d672233ed62
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

  const resolveCaregiverId = () => {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get('id');
<<<<<<< HEAD
    const fromUserObj = loginBlob?.user?._id || loginBlob?._id || null;
    const fromJwt = decodeJwtId();
=======

    const fromUserObj = loginBlob?.user?._id || loginBlob?._id || null;
    const fromJwt = decodeJwtId();

>>>>>>> 758afd2789adcc6cf93d30d1d25f2d672233ed62
    const cachedProfile = safeJSON(localStorage.getItem('caregiverProfile')) || {};
    const fromCache = cachedProfile?._id || null;

    const resolved =
      fromQuery ||
      fromUserObj ||
      fromJwt ||
      fromCache ||
      null;

<<<<<<< HEAD
    if (fromUserObj && resolved !== fromUserObj) {
      localStorage.setItem('caregiverId', fromUserObj);
    } else if (fromJwt && resolved !== fromJwt) {
      localStorage.setItem('caregiverId', fromJwt);
    } else if (resolved) {
      localStorage.setItem('caregiverId', resolved);
    }

=======
    if (resolved) localStorage.setItem('caregiverId', resolved);
>>>>>>> 758afd2789adcc6cf93d30d1d25f2d672233ed62
    return resolved;
  };

  const trimStr = (v) => (typeof v === 'string' ? v.trim() : v);
  const normalizeDobForInput = (v) => (v ? String(v).trim().slice(0, 10) : '');

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
    const d = Array.isArray(doc) ? doc.find(x => x?._id === id) : doc;
    if (!d || typeof d !== 'object') throw new Error('Invalid caregiver payload');

    // Pull a remembered original name if API doesn't send certificateName
    const rememberedName = readCertNameMap()[id] || "";
    const derivedName = nameFromUrl(trimStr(d?.certificate));
    const finalCertName = trimStr(d?.certificateName) || rememberedName || derivedName || '';

    const mapped = {
      _id: d?._id || id,
      name: trimStr(d?.name) || '',
      email: trimStr(d?.email) || '',
      password: (typeof d?.password === 'string' && d.password.startsWith('$')) ? '' : (trimStr(d?.password) || ''),
      gender: trimStr(d?.gender) || '',
      profile: trimStr(d?.profile) || '',
      age: trimStr(d?.age) || '',
      dob: normalizeDobForInput(d?.dob),
<<<<<<< HEAD
      certificate: trimStr(d?.certificate) || '', // Assume it's URL or data URL from server
=======
      certificate: trimStr(d?.certificate) || '',
      certificateName: finalCertName,
>>>>>>> 758afd2789adcc6cf93d30d1d25f2d672233ed62
      bloodGroup: trimStr(d?.bloodGroup) || ''
    };

    setCaregiver(mapped);
    if (mapped.profile) setProfileImage(mapped.profile);

<<<<<<< HEAD
=======
    // persist to LS for refresh safety
>>>>>>> 758afd2789adcc6cf93d30d1d25f2d672233ed62
    localStorage.setItem('caregiverId', mapped._id);
    localStorage.setItem('caregiverProfile', JSON.stringify(mapped));

    // also refresh our name map if API now has a name
    if (finalCertName) writeCertNameMap(mapped._id, finalCertName);
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
<<<<<<< HEAD
=======
      // Try clean by-id endpoint
>>>>>>> 758afd2789adcc6cf93d30d1d25f2d672233ed62
      try {
        const res1 = await axios.get(`${BASE_URL}/caregiver/${CAREGIVER_ID}`, { headers });
        const d1 = pickFromAnyShapeById(res1, CAREGIVER_ID) || res1?.data;
        if (d1 && (d1._id || d1?.data || d1?.caregiver)) {
          mapAndSetByDoc((Array.isArray(d1) ? pickFromAnyShapeById({ data: d1 }, CAREGIVER_ID) : d1), CAREGIVER_ID);
          return;
        }
      } catch { /* continue */ }

<<<<<<< HEAD
=======
      // Fallback query
>>>>>>> 758afd2789adcc6cf93d30d1d25f2d672233ed62
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

    const targetId = caregiver._id || resolveCaregiverId();
    if (!targetId) {
      setIsSaving(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No caregiver ID available. Please login again.',
        confirmButtonColor: '#F95918',
      });
      return;
    }

    const url = `${BASE_URL}/caregiver/${targetId}`;
    const headersBase = {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    const isDataUrlProfile = (profileImage || caregiver.profile || '').startsWith('data:');
    const useMultipart = !!certificateFile || isDataUrlProfile;

    try {
      Swal.fire({
        title: 'Updating Profile',
        text: 'Please wait while we update your profile...',
        icon: 'info',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

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

        // profile
        if (isDataUrlProfile) {
          const blob = dataURLtoBlob(profileImage || caregiver.profile);
          if (blob) form.append('profile', blob, 'profile.jpg');
        }

        // certificate: send file if picked, otherwise keep server-side as is (do not send URL string here)
        if (certificateFile) {
          form.append('certificate', certificateFile, certificateFile.name);
<<<<<<< HEAD
        } else if (caregiver.certificate) {
          if (caregiver.certificate.startsWith('data:')) {
            const certBlob = dataURLtoBlob(caregiver.certificate);
            if (certBlob) {
              const fileName = certificateFile?.name || 'certificate.pdf';
              form.append('certificate', certBlob, fileName);
            }
          } else {
            form.append('certificate', caregiver.certificate);
          }
=======
>>>>>>> 758afd2789adcc6cf93d30d1d25f2d672233ed62
        }

        // send original name always (best effort)
        form.append(
          'certificateName',
          certificateFile ? certificateFile.name : (caregiver.certificateName || '')
        );

        res = await axios.put(url, form, {
          headers: {
            ...headersBase,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // JSON update (no new files)
        const payload = {
          name: caregiver.name || '',
          email: caregiver.email || '',
          gender: caregiver.gender || '',
          age: caregiver.age || '',
          dob: caregiver.dob || '',
          bloodGroup: caregiver.bloodGroup || '',
          // keep existing certificate URL untouched
          certificate: caregiver.certificate || '',
          certificateName: caregiver.certificateName || '',
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
<<<<<<< HEAD
      } catch {}

      setIsSaving(false);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Profile updated successfully!',
        confirmButtonColor: '#F95918',
        confirmButtonText: 'OK',
      });

    } catch (err) {
      console.error('PUT caregiver (by id) failed:', err);
      setIsSaving(false);

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err?.response?.data?.message || 'Failed to update profile. Please try again.',
        confirmButtonColor: '#F95918',
      });
=======
      } catch {
        // if server didn't echo, at least persist the chosen name locally
        const name = certificateFile?.name || caregiver.certificateName || '';
        if (name) writeCertNameMap(targetId, name);
        const patched = { ...caregiver, certificateName: name };
        localStorage.setItem('caregiverProfile', JSON.stringify(patched));
        setCaregiver(patched);
      }

      // persist chosen name to our local map (so refresh keeps it)
      const latestName = certificateFile?.name || caregiver.certificateName || '';
      if (latestName) writeCertNameMap(targetId, latestName);

      setIsSaving(false);
      setSaveSuccess(true);
      setShowToast(true);

      Swal.fire({
        title: 'Success!',
        text: 'Your profile has been updated successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      setTimeout(() => {
        setShowToast(false);
        setSaveSuccess(false);
      }, 2500);
    } catch (err) {
      console.error('PUT caregiver (by id) failed:', err);
      setIsSaving(false);
      setSaveSuccess(false);
      setShowToast(true);

      Swal.fire({
        title: 'Error!',
        text: err?.response?.data?.message || err?.message || 'Failed to update profile',
        icon: 'error',
        confirmButtonText: 'OK'
      });

      setTimeout(() => setShowToast(false), 3500);
>>>>>>> 758afd2789adcc6cf93d30d1d25f2d672233ed62
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
      // ✅ DO NOT overwrite certificate URL with file.name
      setCertificateFile(file);
<<<<<<< HEAD

      const reader = new FileReader();
      reader.onload = (event) => {
        setCaregiver(prev => ({ ...prev, certificate: event.target.result })); // Store data URL
      };
      reader.readAsDataURL(file);
=======
      setCaregiver(prev => ({
        ...prev,
        certificateName: file.name,  // keep the original name
        // keep prev.certificate as-is (URL will come from server after upload)
      }));
>>>>>>> 758afd2789adcc6cf93d30d1d25f2d672233ed62
    }
  };

  const triggerProfileUpload = () => profileInputRef.current?.click();
  const triggerCertificateUpload = () => certificateInputRef.current?.click();

  // A single, always-correct display name for the input
  const certificateDisplayName =
    (certificateFile && certificateFile.name) ||
    caregiver.certificateName ||
    nameFromUrl(caregiver.certificate) ||
    "No file chosen";

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

                          <div className="col-md-6 mb-3">
                            <div className="form-group">
                              <label className="form-label">
                                <FaLock className="me-2" /> Password
                              </label>
                              <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={caregiver.password}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                              />
                              <small className="text-muted">Leave blank to keep current password</small>
                            </div>
                          </div>

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

                        <div className="form-group">
                          <label className="form-label">
                            <FaIdCard className="me-2" /> Certificate
                          </label>
                          <div className="certificate-upload">
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
<<<<<<< HEAD
                                value={caregiver.certificate ? "File uploaded" : "No file chosen"}
=======
                                value={certificateDisplayName}
>>>>>>> 758afd2789adcc6cf93d30d1d25f2d672233ed62
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
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={handleCertificateUpload}
                            />

                            {/* ✅ FIXED: VIEW & DOWNLOAD BUTTONS */}
                            {caregiver.certificate && (
                              <div className="mt-3 certificate-actions">
                                <div className="d-flex align-items-center gap-2">
                                  <span className="badge bg-primary">
                                    {certificateFile?.name || 'Uploaded File'}
                                  </span>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => {
                                      // Open in new tab for reliable preview
                                      const win = window.open();
                                      win.document.write(`
                                        <html>
                                          <head><title>Preview</title></head>
                                          <body style="margin:0; padding:0; display:flex; justify-content:center; align-items:center; height:100vh; background:#f5f5f5;">
                                            ${caregiver.certificate.startsWith('data:image') 
                                              ? `<img src="${caregiver.certificate}" style="max-width:90vw; max-height:90vh; object-fit:contain;" />`
                                              : `<iframe src="${caregiver.certificate}" width="90%" height="90%" style="border:none;"></iframe>`
                                            }
                                          </body>
                                        </html>
                                      `);
                                      win.document.close();
                                    }}
                                  >
                                    <FaEye className="me-1" /> View
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-success"
                                    onClick={() => {
                                      const link = document.createElement('a');
                                      link.href = caregiver.certificate;
                                      link.download = certificateFile?.name || 'certificate.pdf';
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                    }}
                                  >
                                    <FaDownload className="me-1" /> Download
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

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
        .btn-choose-file { background:#F95918; color:white; border:1px solid #F95918; padding:8px 16px; border-radius:8px; font-weight:600; font-size:14px; transition:all .3s ease; position:relative; overflow:hidden; }
        .btn-choose-file:before { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent); transition:left .7s ease; }
        .btn-choose-file:hover:before { left:100%; }
        .btn-choose-file:hover { background:#e04f15; border-color:#e04f15; transform: translateY(-2px); box-shadow:0 5px 15px rgba(249,89,24,.4); }
        .form-actions { display:flex; justify-content:flex-end; margin-top:20px; }
        .btn-save { background:#F95918; color:white; border:none; padding:12px 30px; border-radius:8px; font-weight:600; font-size:16px; transition:all .3s ease; position:relative; overflow:hidden; }
        .btn-save:before { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent); transition:left .7s ease; }
        .btn-save:hover:before { left:100%; }
        .btn-save:hover { background:#e04f15; transform: translateY(-2px); box-shadow:0 5px 15px rgba(249,89,24,.4); }
        .btn-save:disabled { background:#6c757d; }
<<<<<<< HEAD
        .certificate-actions .btn {
          padding: 4px 10px;
          font-size: 13px;
=======
        .btn-choose-file { background:#F95918; color:white; border:1px solid #F95918; padding:8px 16px; border-radius:8px; font-weight:600; font-size:14px; transition:all .3s ease; position:relative; overflow:hidden; }
        .btn-choose-file:before { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent); transition:left .7s ease; }
        .btn-choose-file:hover:before { left:100%; }
        .btn-choose-file:hover { background:#e04f15; border-color:#e04f15; transform: translateY(-2px); box-shadow:0 5px 15px rgba(249,89,24,.4); }
        .toast-container { z-index:1050; }
        .toast { border-radius:8px; box-shadow:0 5px 15px rgba(0,0,0,0.1); }

        /* 👁️ Password field styles */
        .pw-wrapper { position: relative; }
        .pw-input { padding-right: 44px; }
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
>>>>>>> 758afd2789adcc6cf93d30d1d25f2d672233ed62
        }
        .certificate-actions .btn i {
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default CaregiverProfile;