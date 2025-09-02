import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faSearch,
  faUserCircle,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
// import logo from "./your-logo-path.png"; // Replace with your logo path

const Navbar = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar navbar-expand px-3 py-2 bg-light shadow-sm d-flex justify-content-between align-items-center fixed-top">
      {/* Sidebar Toggle + Logo */}
      <div className="d-flex align-items-center gap-3">
        {/* Toggle Button - Always visible */}
        <button
          className="btn btn-outline-secondary p-2"
          onClick={toggleSidebar}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        {/* Logo */}
        <img src="" alt="Logo" height="40" className="navbar-logo" />
      </div>

      {/* Search */}
      <div className="d-flex align-items-center">
        <div className="input-group d-none d-sm-flex">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search"
            aria-label="Search"
          />
          <span className="input-group-text">
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </div>

        {/* Search icon for mobile */}
        <button className="btn btn-sm d-sm-none ms-2">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      {/* Notification and User */}
      <div className="d-flex align-items-center gap-3 position-relative">
        {/* Notification */}
        <div className="position-relative">
          <FontAwesomeIcon icon={faBell} size="lg" className="text-dark" />
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            3
          </span>
        </div>

        {/* User Profile */}
        <div className="dropdown" ref={dropdownRef}>
          <div
            className="d-flex align-items-center gap-2 cursor-pointer"
            role="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FontAwesomeIcon icon={faUserCircle} size="lg" className="text-dark" />
            <div className="d-none d-sm-block">
              <small className="text-muted mb-0">Welcome</small>
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
                maxWidth: "calc(100vw - 30px)", // Prevent overflow on small screens
                zIndex: 1000,
              }}
            >
              <li>
                <a className="dropdown-item" href="#">
                  Profile
                </a>
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
