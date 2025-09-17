// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faBars, faTimes, faCamera } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import API_URL from "../Baseurl/Baseurl";

// IMPORTANT: after successful login, save ONLY the id (no token needed)
// localStorage.setItem("userId", user?.id || user?._id || user?.userId);
// localStorage.setItem("user", JSON.stringify(user || {}));

const BASE_URL = API_URL;
const PROFILE_ENDPOINT = `${BASE_URL}/auth/profile`;

/** Safely parse JSON */
const safeParse = (str) => {
  try { return JSON.parse(str); } catch { return null; }
};

/** Try to pick a plausible id key from any object */
function pickId(obj) {
  if (!obj || typeof obj !== "object") return null;
  const keys = ["id", "_id", "userId", "uid", "sub"];
  for (const k of keys) if (obj[k]) return obj[k];
  // nested
  for (const k of Object.keys(obj)) {
    const nested = obj[k];
    if (nested && typeof nested === "object") {
      const nestedId = pickId(nested);
      if (nestedId) return nestedId;
    }
  }
  return null;
}

/** Get ID from prop, URL, or storage (NO TOKEN) */
function resolveId({ userIdProp, location }) {
  // 1) explicit prop
  if (userIdProp) return userIdProp;

  // 2) query param ?id=
  try {
    const params = new URLSearchParams(location?.search || window.location.search);
    const qid = params.get("id");
    if (qid) return qid;
  } catch {}

  // 3) direct storage keys
  const direct = localStorage.getItem("userId") || sessionStorage.getItem("userId");
  if (direct) return direct;

  // 4) JSON objects in storage
  const jsonKeys = ["user", "profile", "auth", "currentUser", "loginUser"];
  for (const store of [localStorage, sessionStorage]) {
    for (const key of jsonKeys) {
      const obj = safeParse(store.getItem(key));
      const id = pickId(obj);
      if (id) return id;
    }
  }

  // 5) not found
  return null;
}

/** Normalize any backend profile shape to a consistent object */
function normalizeProfile(data) {
  const raw = data?.profile || data?.user || data || null;
  if (!raw) return null;
  return {
    id: pickId(raw),
    name: raw.name || raw.fullName || "",
    email: raw.email || "",
    phone: raw.phone || raw.mobile || "",
    role: raw.role || data?.role || "",
    avatarUrl: raw.avatar || raw.avatarUrl || raw.photo || "",
    ...raw,
  };
}

// ================ Profile Modal =================
const ProfileModal = ({ isOpen, onClose, initialProfile }) => {
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    avatar: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialProfile && isOpen) {
      setProfileData((prev) => ({
        ...prev,
        fullName: initialProfile.name ?? "",
        email: initialProfile.email ?? "",
        phone: initialProfile.phone ?? "",
      }));
    }
  }, [initialProfile, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileData((p) => ({ ...p, avatar: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content p-4"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)", backgroundColor: "#fff",
          borderRadius: "10px", width: "90%", maxWidth: "500px",
          maxHeight: "90vh", overflowY: "auto", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", zIndex: 1100,
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">Edit Profile</h5>
          <div className="d-flex gap-2">
            {!isEditing ? (
              <button className="btn btn-sm btn-orange" onClick={() => setIsEditing(true)}>Edit</button>
            ) : (
              <button className="btn btn-sm btn-success" onClick={() => setIsEditing(false)}>Save</button>
            )}
            <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="text-center mb-4 position-relative">
            <div
              onClick={isEditing ? () => fileInputRef.current?.click() : undefined}
              style={{ cursor: isEditing ? "pointer" : "default", display: "inline-block", position: "relative" }}
            >
              {profileData.avatar ? (
                <img src={profileData.avatar} alt="Profile" width="100" height="100" className="rounded-circle border" />
              ) : (
                <FontAwesomeIcon icon={faUserCircle} size="6x" className="text-muted" />
              )}
              {isEditing && (
                <div
                  className="position-absolute bottom-0 end-0 bg-orange text-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "30px", height: "30px", fontSize: "0.8rem" }}
                >
                  <FontAwesomeIcon icon={faCamera} />
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: "none" }} />
            <h5 className="mt-2">{profileData.fullName || "—"}</h5>
            <p className="text-muted">{profileData.email || "—"}</p>
          </div>

          <hr />

          <div className="mb-3">
            <label htmlFor="fullName" className="form-label fw-bold">Full Name</label>
            <input type="text" className="form-control" id="fullName" name="fullName"
              value={profileData.fullName} onChange={handleInputChange} disabled={!isEditing} />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-bold">Email Address</label>
            <input type="email" className="form-control" id="email" name="email"
              value={profileData.email} onChange={handleInputChange} disabled={!isEditing} />
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label fw-bold">Phone Number</label>
            <input type="tel" className="form-control" id="phone" name="phone"
              value={profileData.phone} onChange={handleInputChange} disabled={!isEditing} />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-bold">Change Password (optional)</label>
            <input type="password" className="form-control" id="password" name="password"
              value={profileData.password} onChange={handleInputChange} disabled={!isEditing} />
          </div>

          <div className="d-flex gap-2 justify-content-end mt-4 flex-wrap">
            <button type="button" className="btn btn-outline-secondary w-100 w-md-auto" onClick={onClose}>Close</button>
            {isEditing && <button type="submit" className="btn btn-orange w-100 w-md-auto">Save Changes</button>}
          </div>
        </form>
      </div>
    </div>
  );
};

// ================ Navbar =================
const Navbar = ({ toggleSidebar, userId: userIdProp }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);

  const dropdownRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    async function tryGet(url, config) {
      try {
        const res = await axios.get(url, config);
        if (!res?.data) throw new Error("Empty response");
        return res;
      } catch (e) {
        return { error: e };
      }
    }

    async function fetchProfile() {
      setLoadingProfile(true);
      setProfileError(null);

      const id = resolveId({ userIdProp, location });

      if (!id) {
        if (!cancelled) {
          setProfile(null);
          setProfileError("User ID not found. localStorage me 'userId' save karo ya URL me ?id= pass karo.");
          setLoadingProfile(false);
        }
        return;
      }

      // Try 1: /auth/profile?id=<id> (NO TOKEN)
      let res = await tryGet(PROFILE_ENDPOINT, { params: { id } });

      // Try 2: /users/:id fallback
      if (res.error) {
        res = await tryGet(`${BASE_URL}/users/${id}`, {});
      }

      if (!cancelled) {
        if (res.error) {
          const msg = res.error?.response?.data?.message || res.error?.message || "Failed to load profile";
          setProfile(null);
          setProfileError(msg);
        } else {
          setProfile(normalizeProfile(res.data));
        }
        setLoadingProfile(false);
      }
    }

    fetchProfile();
    return () => { cancelled = true; };
  }, [userIdProp, location?.search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openProfileModal = () => {
    setDropdownOpen(false);
    setIsProfileModalOpen(true);
  };
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const roleDisplay = (profile?.role || "").toString().replace(/^\w/, (c) => c.toUpperCase());

  return (
    <>
      <nav className="navbar navbar-expand px-3 py-2 custom-navbar d-flex justify-content-between align-items-center fixed-top">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-orange p-2" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} />
          </button>
          <img
            src="https://i.ibb.co/xKF1WPkH/image.png"
            alt="Logo"
            height="45"
            width={60}
            className="navbar-logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className="d-flex align-items-center gap-3 position-relative">
          <div className="dropdown" ref={dropdownRef}>
            <div
              className="d-flex align-items-center gap-2 cursor-pointer text-white"
              role="button"
              onClick={() => setDropdownOpen((v) => !v)}
            >
              <FontAwesomeIcon icon={faUserCircle} size="lg" />
              <div className="d-none d-sm-block">
                <small className="text-white mb-0">{loadingProfile ? "Loading..." : "Welcome"}</small>
                <div className="fw-bold" style={{ textTransform: "capitalize" }}>
                  {loadingProfile ? "—" : profile?.role ? roleDisplay : "—"}
                </div>
              </div>
            </div>

            {dropdownOpen && (
              <ul
                className="dropdown-menu show mt-2 shadow-sm"
                style={{ position: "absolute", right: 0, minWidth: "220px", maxWidth: "calc(100vw - 30px)", zIndex: 1000 }}
              >
                <li className="px-3 py-2">
                  {profileError ? (
                    <small className="text-danger">{profileError}</small>
                  ) : (
                    <>
                      <div className="fw-semibold">{profile?.name || "—"}</div>
                      <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                        {profile?.email || "—"}
                      </div>
                      <div className="badge bg-secondary mt-2" style={{ textTransform: "capitalize" }}>
                        {profile?.role || "—"}
                      </div>
                    </>
                  )}
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={openProfileModal} type="button">Profile</button></li>
                <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} initialProfile={profile} />

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1050;
        }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </>
  );
};

export default Navbar;
