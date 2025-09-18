// src/Components/PatientDashboard/Profile/Profile.jsx
import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faUserCircle, faTimes, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
<<<<<<< HEAD
=======
// import Swal from "sweetalert2";
// import 'sweetalert2/dist/sweetalert2.min.css';
>>>>>>> 8bdc9c13d8d47cda1033252c2394f59adfd6a5fa
import API_URL from "../../../Baseurl/Baseurl";

// ---------- Theme ----------
const BRAND_ORANGE = '#ff6b00';

// ---------- Helpers (module-scope) ----------
const isValidDateISO = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
// Freeze "today" to YYYY-MM-DD (avoid timezone gotchas)
const todayISO = new Date().toISOString().slice(0, 10);
const isFutureDate = (s) => isValidDateISO(s) && new Date(s) > new Date(todayISO);
// Always clamp to 0 and block future DOB
const calculateAge = (dobString) => {
  if (!isValidDateISO(dobString) || isFutureDate(dobString)) return '';
  const t = new Date(todayISO);
  const d = new Date(dobString);
  let age = t.getFullYear() - d.getFullYear();
  const m = t.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < d.getDate())) age--;
  return String(Math.max(0, age));
};

// Center success modal — "Done"
const showCenterSuccess = (msg = "Patient updated") => {
  return Swal.fire({
    icon: 'success',
    title: 'Done',
    text: msg,
    confirmButtonText: 'OK',
    confirmButtonColor: BRAND_ORANGE,
    backdrop: true,
    allowOutsideClick: false,
  });
};

const Profile = ({ userId: userIdProp }) => {
  const BASE_URL = API_URL;

  // ---------------- Helpers ----------------
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  const readIdFromStorage = (storage) => {
    for (const k of ['userId', 'id', '_id']) {
      const v = storage.getItem(k);
      if (v && v !== 'undefined' && v !== 'null') {
        if (/^[a-f0-9]{24}$/i.test(v) || /^[0-9a-f-]{16,}$/i.test(v)) return v;
        try {
          const obj = JSON.parse(v);
          if (obj?._id || obj?.id) return obj._id || obj.id;
          if (obj?.user?._id || obj?.user?.id) return obj.user._id || obj.user.id;
          if (obj?.data?._id || obj?.data?.id) return obj.data._id || obj.data.id;
        } catch {}
      }
    }
    for (const k of ['user', 'authUser', 'currentUser', 'profile', 'patient', 'userData', 'loginUser']) {
      const v = storage.getItem(k);
      if (!v) continue;
      try {
        const obj = JSON.parse(v);
        if (obj?._id || obj?.id) return obj._id || obj.id;
        if (obj?.user?._id || obj?.user?.id) return obj.user._id || obj.user.id;
        if (Array.isArray(obj) && obj[0]?._id) return obj[0]._id;
      } catch {}
    }
    return null;
  };

  const getPatientId = () => {
    const fromLocal = readIdFromStorage(localStorage) || readIdFromStorage(sessionStorage);
    if (fromLocal) return fromLocal;

    if (userIdProp) return userIdProp;

    const params = new URLSearchParams(window.location.search);
    if (params.get('id')) return params.get('id');

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      const payload = parseJwt(token);
      if (payload?.id) return payload.id;
      if (payload?._id) return payload._id;
    }
    return null;
  };

  // Pick record by id from various response shapes
  const pickRecordById = (raw, id) => {
    if (!raw) return null;

    if (raw._id || raw.id) {
      if (!id || raw._id === id || raw.id === id) return raw;
    }

    const wrappers = [raw.data, raw.patient, raw.user];
    for (const w of wrappers) {
      if (!w) continue;
      if (Array.isArray(w)) {
        const found = w.find(r => (r?._id === id || r?.id === id));
        if (found) return found;
      } else if (typeof w === 'object') {
        if (!id || w._id === id || w.id === id) return w;
      }
    }

    if (Array.isArray(raw)) {
      const found = raw.find(r => (r?._id === id || r?.id === id));
      if (found) return found;
      return raw[0] || null;
    }

    return typeof raw === 'object' ? raw : null;
  };

  // Normalize any API shape -> our form state
  const normalizePatient = (raw) => {
    if (!raw || typeof raw !== 'object') return {};
    const p = raw.data || raw.patient || raw.user || raw;

    const fullName =
      (p.fullName ?? p.name ?? [p.firstName, p.lastName].filter(Boolean).join(' ').trim()) || '';

    const email = p.email ?? p.mail ?? '';

    const phone =
      p.phone ??
      p.mobile ??
      p.phoneNumber ??
      p.contact ??
      '';

    const dobRaw = p.dob ?? p.dateOfBirth ?? '';
    const dob = isValidDateISO(dobRaw) ? dobRaw : '';

    const serverAge = (p.age != null && p.age !== '') ? String(p.age) : '';
    const age = dob ? calculateAge(dob) : serverAge; // prefer DOB-derived

    const bloodGroup = p.bloodGroup ?? p.blood_group ?? p.bloodgroup ?? '';

    const avatar = p.profile ?? p.avatar ?? p.photo ?? p.profileImage ?? null;

    const gender = p.gender ?? '';

    return { fullName, email, phone, dob, age, bloodGroup, avatar, gender, _rawDob: dobRaw, _id: p._id || p.id };
  };

  // ---------------- State ----------------
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    bloodGroup: "",
    password: "",
    avatar: null,
    age: "",
    gender: ""
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [rawDobWarning, setRawDobWarning] = useState("");
  const [dobError, setDobError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // 👁️ Password show/hide state (new)
  const [showPassword, setShowPassword] = useState(false);

  // ---------------- Fetch by ID (GET /patient/:id) ----------------
  useEffect(() => {
    const id = getPatientId();
    if (!id) {
      setFetchError("User ID not found. localStorage/sessionStorage me userId/id/_id ya user/authUser JSON me _id rakhein, ya ?id= pass karein.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setFetchError("");

        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        const res = await axios.get(`${BASE_URL}/patient/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        const raw = res.data?.data ?? res.data ?? {};
        const picked = pickRecordById(raw, id) || {};
        const normalized = normalizePatient(picked);

        setProfileData(prev => ({
          ...prev,
          fullName: normalized.fullName || "",
          email: normalized.email || "",
          phone: normalized.phone || "",
          dob: normalized.dob || "",
          age: normalized.age || "",
          bloodGroup: normalized.bloodGroup || "",
          avatar: normalized.avatar || null,
          gender: normalized.gender || "",
          password: ""
        }));
        setPreviewUrl(normalized.avatar || null);

        if (normalized._rawDob && !isValidDateISO(normalized._rawDob)) {
          setRawDobWarning(`Server DOB is "${normalized._rawDob}" (not YYYY-MM-DD). Date field left blank.`);
        } else {
          setRawDobWarning("");
        }
      } catch (err) {
        setFetchError(err?.response?.data?.message || err?.message || "Failed to fetch patient profile.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIdProp, BASE_URL]);

  // DOB change -> age hamesha recompute + future DOB guard
  useEffect(() => {
    if (!profileData.dob) {
      setDobError("");
      setProfileData(prev => ({ ...prev, age: "" }));
      return;
    }
    const future = isFutureDate(profileData.dob);
    setDobError(future ? "DOB future nahi ho sakta." : "");
    const nextAge = calculateAge(profileData.dob);
    setProfileData(prev => ({ ...prev, age: nextAge })); // overwrite every time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData.dob]);

  // ---------------- Handlers ----------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
        setProfileData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setPreviewUrl(null);
    setProfileData(prev => ({ ...prev, avatar: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Build payload expected by backend
  const buildUpdatePayload = () => {
    const safeDob = (isValidDateISO(profileData.dob) && !isFutureDate(profileData.dob))
      ? profileData.dob
      : "";

    const safeAge = safeDob ? calculateAge(safeDob) : "";

    const payload = {
      name: profileData.fullName?.trim() || "",
      email: profileData.email?.trim() || "",
      phone: profileData.phone?.trim() || "",
      bloodGroup: profileData.bloodGroup || "",
      dob: safeDob,           // never future/invalid
      age: safeAge,           // never negative
      profile: profileData.avatar || "",
      gender: profileData.gender || undefined,
    };

    if (profileData.password && profileData.password.trim().length >= 4) {
      payload.password = profileData.password.trim();
    }

    Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);
    return payload;
  };

  // ---------------- PUT /patient/:id ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = getPatientId();
    if (!id) {
      await Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: 'User ID not found. Update aborted.',
        confirmButtonColor: BRAND_ORANGE
      });
      return;
    }

    // If DOB invalid/future, prevent submit
    if (profileData.dob && (!isValidDateISO(profileData.dob) || isFutureDate(profileData.dob))) {
      setDobError("Valid DOB (YYYY-MM-DD) required aur future date allow nahi.");
      await Swal.fire({
        icon: 'warning',
        title: 'Invalid DOB',
        text: 'Please enter a valid, non-future date of birth.',
        confirmButtonColor: BRAND_ORANGE
      });
      return;
    }

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const payload = buildUpdatePayload();

    try {
      setIsSubmitting(true);

      const res = await axios.put(`${BASE_URL}/patient/${id}`, payload, { headers });

      // Optionally re-normalize from server response
      const updated = res.data?.patient || res.data?.data || res.data || {};
      const normalized = normalizePatient(updated);

      setProfileData(prev => ({
        ...prev,
        fullName: normalized.fullName || payload.name,
        email: normalized.email || payload.email,
        phone: normalized.phone || payload.phone,
        dob: normalized.dob || payload.dob,
        age: normalized.age || payload.age,
        bloodGroup: normalized.bloodGroup || payload.bloodGroup,
        avatar: normalized.avatar || payload.profile || null,
        gender: normalized.gender || payload.gender || "",
        password: ""
      }));
      setPreviewUrl(normalized.avatar || payload.profile || null);

      // ✅ Centered SweetAlert "Done"
      await showCenterSuccess(res?.data?.message || "Patient updated");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to update patient.";
      await Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: msg,
        confirmButtonColor: BRAND_ORANGE
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- UI ----------------
  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="text-center py-5">Loading profile...</div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="container-fluid mt-4">
        <div className="alert alert-danger" role="alert">
          {fetchError}
        </div>
      </div>
    );
  }

  const avatarSrc = previewUrl || profileData.avatar || "";

  return (
    <div className="container-fluid mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0 rounded-3">
            {/* Header */}
            <div className="card-header text-black py-4">
              <div className="d-flex align-items-center">
                <div>
                  <h4 className="mb-1">Personal Information</h4>
                  <p className="mb-0 opacity-75">Keep your profile up to date for better healthcare experience.</p>
                </div>
              </div>
            </div>

            <div className="card-body p-4">
              {/* Profile Photo Upload Section (perfectly centered) */}
              <div className="mb-5 d-flex flex-column align-items-center">
                <div
                  className="position-relative"
                  onClick={handleImageClick}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Circular, centered avatar */}
                  <div
                    style={{
                      width: 150,
                      height: 150,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '4px solid #f8f9fa',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                      background: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt="Profile"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <FontAwesomeIcon icon={faUserCircle} size="5x" className="text-secondary" />
                    )}
                  </div>

                  {/* Orange camera badge (overlay) */}
                  <div
                    className="position-absolute"
                    style={{
                      bottom: 0,
                      right: 0,
                      transform: 'translate(20%, 20%)',
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: BRAND_ORANGE,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 6px 14px rgba(255,107,0,0.3)'
                    }}
                  >
                    <FontAwesomeIcon icon={faCamera} />
                  </div>
                </div>

                {/* file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="d-none"
                />

                {/* Remove button */}
                {(previewUrl || profileData.avatar) && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="btn btn-sm mt-3 d-block mx-auto"
                    style={{ borderColor: BRAND_ORANGE, color: BRAND_ORANGE, backgroundColor: '#fff' }}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Remove Photo
                  </button>
                )}

                <p className="text-muted mt-2 mb-0 small text-center">
                  Click profile picture to upload a new photo
                </p>
              </div>

              {/* Editable Form */}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Full Name */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Full Name *</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="fullName"
                      value={profileData.fullName || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Email Address *</label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      name="email"
                      value={profileData.email || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      name="phone"
                      value={profileData.phone || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Date of Birth *</label>
                    <input
                      type="date"
                      className="form-control form-control-lg"
                      name="dob"
                      value={profileData.dob || ""}
                      onChange={handleInputChange}
                      required
                      max={todayISO}
                    />
                    {rawDobWarning && <div className="form-text text-warning">{rawDobWarning}</div>}
                    {dobError && <div className="form-text text-danger">{dobError}</div>}
                  </div>

                  {/* Age (Auto-calculated, non-editable) */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Age</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={profileData.age || ""}
                      disabled
                    />
                  </div>

                  {/* Blood Group */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Blood Group *</label>
                    <select
                      className="form-select form-select-lg"
                      name="bloodGroup"
                      value={profileData.bloodGroup || ""}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  {/* Password (Optional) + 👁️ toggle */}
                  <div className="col-12">
                    <label className="form-label fw-bold">Change Password (optional)</label>
                    <div className="input-group input-group-lg">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        name="password"
                        value={profileData.password || ""}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(s => !s)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                {/* Action Buttons (Orange) */}
                <div className="d-flex justify-content-end gap-3 flex-wrap">
                  <button
                    type="button"
                    className="btn btn-lg px-4"
                    disabled={isSubmitting}
                    style={{ backgroundColor: '#fff', color: BRAND_ORANGE, borderColor: BRAND_ORANGE }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-lg px-5"
                    disabled={isSubmitting}
                    style={{ backgroundColor: BRAND_ORANGE, borderColor: BRAND_ORANGE, color: '#fff' }}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
