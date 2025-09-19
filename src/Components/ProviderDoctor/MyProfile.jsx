import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_URL from '../../Baseurl/Baseurl';
import Swal from 'sweetalert2';

const MyProfile = () => {
  const BASE_URL = API_URL;

  // ---------- helpers ----------
  const safeJSON = (txt) => { try { return JSON.parse(txt); } catch { return null; } };
  const storedUser = safeJSON(localStorage.getItem('user')) || {};
  const accessToken = localStorage.getItem('accessToken') || storedUser?.token || '';

  const getDoctorIdFromToken = () => {
    try {
      const t = accessToken;
      if (!t || t.split('.').length !== 3) return null;
      const payload = JSON.parse(atob(t.split('.')[1]));
      return payload?.id || payload?._id || payload?.userId || null;
    } catch {
      return null;
    }
  };

  const loggedInDoctorId =
    storedUser?.user?._id ||
    storedUser?.doctor?._id ||
    storedUser?._id ||
    getDoctorIdFromToken() ||
    null;

  // fallback (dev only)
  const DOCTOR_ID = loggedInDoctorId || '68c2befc249f86eca552142d';

  // ---------- ui state ----------
  const [isAvailable, setIsAvailable] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem('profileImage') || 'https://via.placeholder.com/150'
  );
  const [profileFile, setProfileFile] = useState(null);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [existingDocumentUrl, setExistingDocumentUrl] = useState('');
  const fileInputRef = useRef(null);
  const documentInputRef = useRef(null);

  // 👁️ password visibility
  const [showPassword, setShowPassword] = useState(false);

  // filled by GET
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialty: '',
    bio: '',
    // IMPORTANT: keep raw fee from payload EXACTLY as-is (with symbols/commas)
    consultationFee: '',
    licenseNo: '',
    experience: '',
    availableDay: '',
    openingTime: '',
    closingTime: '',
    gender: '',
    password: '',
  });

  // make specialties dynamic so API value can be injected as an option
  const [specialties, setSpecialties] = useState([
    'Cardiology','Dermatology','Neurology','Pediatrics',
    'Orthopedics','Psychiatry','Oncology','Endocrinology'
  ]);

  // ---------- generic handlers ----------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((p) => ({ ...p, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target.result;
        setProfileImage(imageDataUrl);
        localStorage.setItem('profileImage', imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentsUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setDocumentFiles(files);
  };

  const removeDocuments = () => {
    setDocumentFiles([]);
    if (documentInputRef.current) documentInputRef.current.value = '';
  };

  // ---------- fee utils ----------
  // sanitize a raw fee (number or string like "₹1,200/-", "500 INR", " 600.50 ")
  const extractNumericFee = (raw) => {
    if (raw === null || raw === undefined) return '';
    if (typeof raw === 'number' && isFinite(raw)) return String(raw);
    const s = String(raw).trim();
    // pick a number (with optional thousands commas & decimal)
    const m = s.replace(/\s+/g, '').match(/-?\d{1,3}(?:,\d{3})*(?:\.\d+)?|-?\d+(?:\.\d+)?/);
    if (!m) return '';
    const cleaned = m[0].replace(/,/g, '');
    return cleaned;
  };

  // ---------- mapping ----------
  const apiToUi = (d) => {
    // Never prefill password from API (security)
    const safePassword = '';

    // helper: dynamic key match by partial name
    const findByKeyIncludes = (obj, keys) => {
      for (const k of Object.keys(obj || {})) {
        const lk = k.toLowerCase();
        if (keys.some(s => lk.includes(s))) return obj[k];
      }
      return undefined;
    };

    // Try multiple possible field names for specialty
    const specialtyValue =
      d?.specialty ||
      d?.specialization ||
      d?.speciality ||
      d?.field ||
      d?.expertise ||
      d?.department ||
      findByKeyIncludes(d, ['special', 'dept', 'expert']) ||
      '';

    // Get RAW fee exactly as payload
    const rawFeeCandidate =
      d?.fee ?? d?.consultationFee ?? d?.charges ??
      d?.consultFee ?? d?.consultation_fee ?? d?.amount ??
      d?.price ?? findByKeyIncludes(d, ['fee','consult','charge','amount','price']);

    const feeRaw = rawFeeCandidate === null || rawFeeCandidate === undefined
      ? ''
      : String(rawFeeCandidate); // <-- preserve EXACT payload display

    return {
      fullName: d?.name || d?.fullName || '',
      email: d?.email || '',
      phone: d?.phone || '',
      specialty: specialtyValue,
      bio: d?.bio || d?.about || '',
      licenseNo: d?.licenseNo || d?.licenseNumber || '',
      experience: d?.experience ?? d?.yearsOfExperience ?? '',
      availableDay: d?.availableDay ?? d?.availableDays ?? '',
      openingTime: d?.openingTime != null ? String(d.openingTime) : '',
      closingTime: d?.closingTime != null ? String(d.closingTime) : '',
      gender: d?.gender || '',
      consultationFee: feeRaw,    // <-- show EXACT as payload
      password: safePassword,
    };
  };

  const uiToFormData = () => {
    const fd = new FormData();
    fd.append('name', (profileData.fullName || '').trim());
    fd.append('email', (profileData.email || '').trim());
    fd.append('specialty', profileData.specialty || '');
    fd.append('licenseNo', profileData.licenseNo || '');
    fd.append('experience', profileData.experience || '');
    fd.append('availableDay', profileData.availableDay || '');
    fd.append('openingTime', profileData.openingTime || '');
    fd.append('closingTime', profileData.closingTime || '');
    fd.append('gender', profileData.gender || '');

    // send numeric-only fee to backend (display remains raw)
    const feeToSend = extractNumericFee(profileData.consultationFee);
    fd.append('fee', feeToSend);

    if ((profileData.password || '').trim()) {
      fd.append('password', profileData.password || '');
    }
    if (profileFile) fd.append('profile', profileFile);
    documentFiles.forEach((f) => fd.append('documents', f));
    return fd;
  };

  const extractDoctor = (res) => {
    let d = res?.data;
    if (d?.data !== undefined) d = d.data;
    if (d?.doctor !== undefined) d = d.doctor;
    if (Array.isArray(d)) d = d[0];
    return d;
  };

  // ---------- GET by logged-in id ----------
  const fetchDoctor = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = `${BASE_URL}/doctor?doctorId=${DOCTOR_ID}`;
      const res = await axios.get(apiUrl, {
        headers: {
          Accept: 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      const d = extractDoctor(res);
      if (!d || typeof d !== 'object') throw new Error('Doctor not found');

      const mapped = apiToUi(d);

      // ensure specialty option exists in dropdown
      if (mapped.specialty && !specialties.includes(mapped.specialty)) {
        setSpecialties(prev => [...new Set([...prev, mapped.specialty])]);
      }

      setProfileData((prev) => ({ ...prev, ...mapped }));

      if (d?.profile) {
        setProfileImage(d.profile);
        localStorage.setItem('profileImage', d.profile);
      }

      setExistingDocumentUrl(
        typeof d?.documents === 'string' && d.documents.trim() ? d.documents : ''
      );
      localStorage.setItem('profileData', JSON.stringify(mapped));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load profile'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- PUT update ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      localStorage.setItem('profileData', JSON.stringify(profileData));
      localStorage.setItem('isAvailable', isAvailable.toString());
      const fd = uiToFormData();

      // Show loading SweetAlert
      Swal.fire({
        title: 'Updating Profile',
        text: 'Please wait while we update your profile...',
        icon: 'info',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const url = `${BASE_URL}/doctor/${DOCTOR_ID}`;
      const res = await axios.put(url, fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      const updated = extractDoctor(res) || res?.data;
      if (updated?.profile) {
        setProfileImage(updated.profile);
        localStorage.setItem('profileImage', updated.profile);
      }
      if (typeof updated?.documents === 'string' && updated.documents.trim()) {
        setExistingDocumentUrl(updated.documents);
      }

      // Show success SweetAlert
      Swal.fire({
        title: 'Success!',
        text: 'Your profile has been updated successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update profile';
      setError(msg);
      
      // Show error SweetAlert
      Swal.fire({
        title: 'Error!',
        text: msg,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ---------- effects ----------
  useEffect(() => {
    const savedAvailability = localStorage.getItem('isAvailable');
    if (savedAvailability) setIsAvailable(savedAvailability === 'true');
    fetchDoctor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DOCTOR_ID]);

  useEffect(() => {
    const els = document.querySelectorAll('.profile-section');
    els.forEach((el, i) => setTimeout(() => el.classList.add('animate-in'), 100 * i));
  }, [isLoading]);

  // ---------- ui ----------
  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="mb-4">
            <h1 className="dashboard-heading mb-2">My Profile</h1>
            <p className="text-muted mb-0">Manage your professional information and availability</p>
          </div>
          <div className="card shadow-sm border-0 overflow-hidden">
            <div className="card-header py-3">
              <h2 className="h5 mb-0">Professional Profile</h2>
            </div>
            <div className="card-body p-3 p-md-4">
              {isLoading ? (
                <div className="d-flex align-items-center">
                  <span className="spinner-border me-2" role="status" />
                  <span>Loading profile...</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger small" role="alert">
                      {error}
                    </div>
                  )}
                  <div className="row">
                    {/* Left Column */}
                    <div className="col-md-7 order-2 order-md-1">
                      <div className="profile-section">
                        <div className="mb-3">
                          <label htmlFor="fullName" className="form-label fw-semibold">Full Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="fullName"
                            name="fullName"
                            value={profileData.fullName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>

                      <div className="profile-section">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email address"
                          />
                        </div>
                      </div>

                      <div className="profile-section">
                        <div className="mb-3">
                          <label htmlFor="phone" className="form-label fw-semibold">Phone Number</label>
                          <input
                            type="tel"
                            className="form-control"
                            id="phone"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>

                      <div className="profile-section">
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="specialty" className="form-label fw-semibold">Specialty</label>
                            <select
                              className="form-select"
                              id="specialty"
                              name="specialty"
                              value={profileData.specialty}
                              onChange={handleInputChange}
                            >
                              <option value="">-- Select Specialty --</option>
                              {specialties.map((spec, index) => (
                                <option key={index} value={spec}>{spec}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="licenseNo" className="form-label fw-semibold">License No.</label>
                            <input
                              type="text"
                              className="form-control"
                              id="licenseNo"
                              name="licenseNo"
                              value={profileData.licenseNo}
                              onChange={handleInputChange}
                              placeholder="e.g. 5678"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="profile-section">
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="experience" className="form-label fw-semibold">Experience</label>
                            <input
                              type="text"
                              className="form-control"
                              id="experience"
                              name="experience"
                              value={profileData.experience}
                              onChange={handleInputChange}
                              placeholder="e.g. 25"
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="gender" className="form-label fw-semibold">Gender</label>
                            <select
                              className="form-select"
                              id="gender"
                              name="gender"
                              value={profileData.gender}
                              onChange={handleInputChange}
                            >
                              <option value="">-- Select --</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="profile-section">
                        <div className="row">
                          <div className="col-md-4 mb-3">
                            <label htmlFor="availableDay" className="form-label fw-semibold">Available Days</label>
                            <input
                              type="text"
                              className="form-control"
                              id="availableDay"
                              name="availableDay"
                              value={profileData.availableDay}
                              onChange={handleInputChange}
                              placeholder="Mon - Fri"
                            />
                          </div>
                          <div className="col-md-4 mb-3">
                            <label htmlFor="openingTime" className="form-label fw-semibold">Opening Time</label>
                            <input
                              type="text"
                              className="form-control"
                              id="openingTime"
                              name="openingTime"
                              value={profileData.openingTime}
                              onChange={handleInputChange}
                              placeholder="10:00"
                            />
                          </div>
                          <div className="col-md-4 mb-3">
                            <label htmlFor="closingTime" className="form-label fw-semibold">Closing Time</label>
                            <input
                              type="text"
                              className="form-control"
                              id="closingTime"
                              name="closingTime"
                              value={profileData.closingTime}
                              onChange={handleInputChange}
                              placeholder="18:00"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="profile-section">
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="consultationFee" className="form-label fw-semibold">Consultation Fee</label>
                            <input
                              // SHOW EXACT PAYLOAD VALUE (no cleaning in UI)
                              type="text"
                              className="form-control"
                              id="consultationFee"
                              name="consultationFee"
                              value={profileData.consultationFee}
                              onChange={(e) => {
                                setProfileData((p) => ({ ...p, consultationFee: e.target.value }));
                              }}
                              placeholder="e.g. ₹1,000/- or 600.50"
                            />
                            <div className="form-text">
                              Display shows payload as-is. On save, we'll send the numeric value to the server.
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="password" className="form-label fw-semibold">Password</label>

                            {/* 👁️ input group with eye toggle */}
                            <div className="input-group">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                id="password"
                                name="password"
                                value={profileData.password}
                                onChange={handleInputChange}
                                placeholder="Update password"
                              />
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPassword((s) => !s)}
                                title={showPassword ? "Hide password" : "Show password"}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                tabIndex={-1}
                              >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                              </button>
                            </div>

                            <div className="form-text">
                              For security, your current password isn't fetched. Enter a new one to update.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="profile-section">
                        <div className="mb-3">
                          <label htmlFor="bio" className="form-label fw-semibold">Bio</label>
                          <textarea
                            className="form-control"
                            id="bio"
                            name="bio"
                            rows="4"
                            value={profileData.bio}
                            onChange={handleInputChange}
                            placeholder="Tell patients about your background and expertise"
                          ></textarea>
                        </div>
                      </div>

                      <div className="profile-section">
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Documents (Certificates, Licenses etc.)</label>
                          <input
                            type="file"
                            className="form-control"
                            multiple
                            onChange={handleDocumentsUpload}
                            ref={documentInputRef}
                          />
                          {existingDocumentUrl && documentFiles.length === 0 && (
                            <div className="mt-2 small">
                              <span className="text-muted me-2">Current document:</span>
                              <a href={existingDocumentUrl} target="_blank" rel="noreferrer">
                                {existingDocumentUrl}
                              </a>
                            </div>
                          )}
                          {documentFiles.length > 0 && (
                            <div className="mt-2">
                              <ul className="list-group">
                                {documentFiles.map((f, idx) => (
                                  <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                    <span className="small">{f.name}</span>
                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={removeDocuments}>
                                      Clear
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-md-5 order-1 order-md-2">
                      <div className="profile-section">
                        <div className="text-center mb-3">
                          <div className="position-relative d-inline-block">
                            <div className="profile-img-container">
                              <img
                                src={profileImage}
                                className="rounded-circle img-thumbnail profile-img"
                                alt="Profile"
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                              />
                              <div className="profile-overlay rounded-circle">
                                <label htmlFor="profileUpload" className="profile-upload-btn">
                                  <i className="fas fa-camera"></i>
                                  <input
                                    type="file"
                                    id="profileUpload"
                                    ref={fileInputRef}
                                    className="d-none"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                  />
                                </label>
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="mb-1 fw-semibold small">Profile Picture</p>
                              <button
                                type="button"
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                Upload New Photo
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="profile-section">
                        <div className="availability-container p-3 rounded-3 shadow-sm mb-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h5 className="fw-bold mb-1 small">Availability Status</h5>
                              <p className="text-muted small mb-0">
                                {isAvailable ? 'Available for consultations' : 'Not available for consultations'}
                              </p>
                            </div>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="availabilityToggle"
                                checked={isAvailable}
                                onChange={() => setIsAvailable(!isAvailable)}
                                style={{
                                  backgroundColor: isAvailable ? '#F95918' : '#ccc',
                                  borderColor: '#F95918',
                                  width: '2.5rem',
                                  height: '1.25rem'
                                }}
                              />
                            </div>
                          </div>
                          <div className={`status-indicator mt-2 ${isAvailable ? 'available' : 'unavailable'}`}>
                            <span className="status-dot"></span>
                            <span className="status-text small">
                              {isAvailable ? 'Available' : 'Not Available'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="profile-section">
                        <div className="d-grid mt-3 mb-3">
                          <button
                            type="submit"
                            className="btn text-white py-2 fw-bold save-btn"
                            disabled={isSaving}
                          >
                            {isSaving ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Saving...
                              </>
                            ) : (
                              'Save Changes'
                            )}
                          </button>
                          {saveSuccess && (
                            <div className="alert alert-success mt-2 d-flex align-items-center small py-2" role="alert">
                              <i className="fas fa-check-circle me-2"></i>
                              Profile updated successfully!
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-section { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; }
        .profile-section.animate-in { opacity: 1; transform: translateY(0); }
        .profile-img-container { position: relative; display: inline-block; }
        .profile-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.3); border-radius: 50%; opacity: 0; transition: opacity 0.3s ease; display: flex; align-items: center; justify-content: center; }
        .profile-img-container:hover .profile-overlay { opacity: 1; }
        .profile-upload-btn { color: white; font-size: 1.2rem; cursor: pointer; transition: transform 0.3s ease; }
        .profile-upload-btn:hover { transform: scale(1.2); }
        .profile-img { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .profile-img-container:hover .profile-img { transform: scale(1.05); box-shadow: 0 0 15px rgba(249, 89, 24, 0.4); }
        .availability-container { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 3px solid #F95918; }
        .status-indicator { display: flex; align-items: center; font-weight: 600; }
        .status-dot { width: 10px; height: 10px; border-radius: 50%; margin-right: 8px; }
        .status-indicator.available .status-dot { background-color: #28a745; box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.3); }
        .status-indicator.unavailable .status-dot { background-color: #dc3545; box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.3); }
        .save-btn { background: #F95918; transition: all 0.3s ease; position: relative; overflow: hidden; }
        .save-btn:before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent); transition: left 0.7s ease; }
        .save-btn:hover:before { left: 100%; }
        .save-btn:hover { background: #e04f15; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(249, 89, 24, 0.4); }
        .form-control, .form-select { transition: all 0.3s ease; border: 1px solid #dee2e6; padding: 0.5rem 0.75rem; font-size: 0.9rem; }
        .form-control:focus, .form-select:focus { border-color: #F95918; box-shadow: 0 0 0 0.2rem rgba(249, 89, 24, 0.25); }
        .card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card:hover { transform: translateY(-3px); box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1) !important; }
        .alert { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default MyProfile;