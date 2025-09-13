import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faSearch,
  faUserCircle,
  faBars,
  faTimes,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import { Link,useNavigate} from "react-router-dom";
import "./Navbar.css";

// Profile Modal Component (Editable)
const ProfileModal = ({ isOpen, onClose }) => {
  const [profileData, setProfileData] = useState({
    fullName: "Admin User",
    email: "admin@example.com",
    phone: "+91 98765 43210",
    password: "", // for change password field
    avatar: null, // for future avatar upload
  });

  const [isEditing, setIsEditing] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({
          ...prev,
          avatar: reader.result, // base64 string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate save
    alert("Profile updated successfully!");
    setIsEditing(false);
    // In real app: API call to update profile
    console.log("Updated Profile:", profileData);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content p-4"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          borderRadius: "10px",
          width: "90%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          zIndex: 1100,
        }}
      >
        {/* Modal Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">Edit Profile</h5>
          <div className="d-flex gap-2">
            {!isEditing ? (
              <button className="btn btn-sm btn-orange" onClick={handleEditToggle}>
                Edit
              </button>
            ) : (
              <button className="btn btn-sm btn-success" onClick={handleSubmit}>
                Save
              </button>
            )}
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Avatar Section */}
          <div className="text-center mb-4 position-relative">
            <div
              onClick={isEditing ? handleAvatarClick : null}
              style={{
                cursor: isEditing ? "pointer" : "default",
                display: "inline-block",
                position: "relative",
              }}
            >
              {profileData.avatar ? (
                <img
                  src={profileData.avatar}
                  alt="Profile"
                  width="100"
                  height="100"
                  className="rounded-circle border"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faUserCircle}
                  size="6x"
                  className="text-muted"
                />
              )}
              {isEditing && (
                <div
                  className="position-absolute bottom-0 end-0 bg-orange text-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "30px",
                    height: "30px",
                    fontSize: "0.8rem",
                  }}
                >
                  <FontAwesomeIcon icon={faCamera} />
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />
            <h5 className="mt-2">{profileData.fullName}</h5>
            <p className="text-muted">{profileData.email}</p>
          </div>

          <hr />

          {/* Form Fields */}
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label fw-bold">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              id="fullName"
              name="fullName"
              value={profileData.fullName}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-bold">
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label fw-bold">
              Phone Number
            </label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              value={profileData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-bold">
              Change Password (leave blank to keep current)
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={profileData.password}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="••••••••"
            />
          </div>

          {/* Action Buttons (Mobile Responsive) */}
          <div className="d-flex gap-2 justify-content-end mt-4 flex-wrap">
            <button
              type="button"
              className="btn btn-outline-secondary w-100 w-md-auto"
              onClick={onClose}
            >
              Cancel
            </button>
            {isEditing && (
              <button type="submit" className="btn btn-orange w-100 w-md-auto">
                Save Changes
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

const Navbar = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const dropdownRef = useRef();
  const notifRef = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openProfileModal = () => {
    setDropdownOpen(false);
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

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
          />
        </div>

        <div className="d-flex align-items-center gap-3 position-relative">
          <div className="dropdown" ref={dropdownRef}>
            <div
              className="d-flex align-items-center gap-2 cursor-pointer text-white"
              role="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FontAwesomeIcon icon={faUserCircle} size="lg" />
              <div className="d-none d-sm-block">
                <small className="text-white mb-0">Welcome</small>
                <div className="fw-bold">Admin</div>
              </div>
            </div>

            {dropdownOpen && (
              <ul
                className="dropdown-menu show mt-2 shadow-sm"
                style={{
                  position: "absolute",
                  right: 0,
                  minWidth: "180px",
                  maxWidth: "calc(100vw - 30px)",
                  zIndex: 1000,
                }}
              >
                <li>
                  <button
                    className="dropdown-item"
                    onClick={openProfileModal}
                    type="button"
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link className="dropdown-item" to="/login">
                    Logout
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />

      <style jsx>{`
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
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default Navbar;