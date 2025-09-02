import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faSearch,
  faUserCircle,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false); // 🔔 notification state
  const dropdownRef = useRef();
  const notifRef = useRef();

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

  return (
    <nav className="navbar navbar-expand px-3 py-2 custom-navbar d-flex justify-content-between align-items-center fixed-top">
      {/* Sidebar Toggle + Logo */}
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-orange p-2" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <img src="" alt="Logo" height="40" className="navbar-logo" />
      </div>

      {/* Search */}
      <div className="d-flex align-items-center">
        <div className="input-group d-none d-sm-flex">
          <input
            type="text"
            className="form-control form-control-sm bg-white text-dark border-0"
            placeholder="Search"
            aria-label="Search"
          />
          <span className="input-group-text bg-orange border-0 text-white">
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </div>
        <button className="btn btn-sm text-white d-sm-none ms-2">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      {/* Notification and User */}
      <div className="d-flex align-items-center gap-3 position-relative">
        {/* 🔔 Notification Dropdown */}
        <div className="dropdown" ref={notifRef}>
          <div
            className="position-relative cursor-pointer text-white"
            role="button"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <FontAwesomeIcon icon={faBell} size="lg" />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-orange">
              3
            </span>
          </div>

          {notifOpen && (
            <ul
              className="dropdown-menu show mt-2 shadow-sm"
              style={{
                position: "absolute",
                right: 0,
                minWidth: "250px",
                maxHeight: "300px",
                overflowY: "auto",
                zIndex: 1000,
              }}
            >
              <li className="dropdown-header fw-bold text-dark">
                Notifications
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  🔔 New user registered
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  📩 You have 5 new messages
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  ⚠️ Server downtime alert
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  ✅ Backup completed successfully
                </a>
              </li>
              {/* <li>
                <hr className="dropdown-divider" />
              </li> */}
              {/* <li>
                <a className="dropdown-item text-center text-primary" href="#">
                  View all notifications
                </a>
              </li> */}
            </ul>
          )}
        </div>

        {/* 👤 User Profile */}
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
                <Link className="dropdown-item" to="/profile">
                  Profile
                </Link>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Settings
                </a>
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
  );
};

export default Navbar;
