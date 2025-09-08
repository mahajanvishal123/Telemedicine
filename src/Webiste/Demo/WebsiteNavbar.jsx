import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./WebsiteNavbar.css";

const WebsiteNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar-custom">
        <div className="nav-container d-flex justify-content-between align-items-center">
          {/* Left: Logo */}
          <Link to="/" className="nav-logo" onClick={closeMenu}>
            <img
              src="https://i.ibb.co/xKF1WPkH/image.png"
              alt="Website Logo"
            />
          </Link>

          {/* Center: Navigation Menu */}
          <ul className="nav-menu mt-1">
            <li className="nav-item">
              <a href="/#about" className="nav-link" onClick={closeMenu}>
                About Us
              </a>
            </li>
            <li className="nav-item">
              <a href="/#features" className="nav-link" onClick={closeMenu}>
                Features
              </a>
            </li>
            <li className="nav-item">
              <a href="/#patients" className="nav-link" onClick={closeMenu}>
                For Patients
              </a>
            </li>
            <li className="nav-item">
              <a href="/#doctors" className="nav-link" onClick={closeMenu}>
                For Doctors
              </a>
            </li>
            <li className="nav-item">
              <a href="/#carebridge" className="nav-link" onClick={closeMenu}>
                CareBridge
              </a>
            </li>
            <li className="nav-item">
              <a href="/#pricing" className="nav-link" onClick={closeMenu}>
                Pricing
              </a>
            </li>
            <li className="nav-item">
              <Link
                to="/investorspage"
                className="nav-link"
                onClick={closeMenu}
              >
                Investors
              </Link>
            </li>
          </ul>

          {/* Right: Auth Buttons */}
          <div className="auth-buttons d-none d-lg-flex gap-3">
            <Link to="/login" className="btn-signin" onClick={closeMenu}>
              Sign In
            </Link>
            <Link to="/signup" className="btn-getstarted" onClick={closeMenu}>
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="menu-toggle d-lg-none" onClick={toggleMenu}>
            <span className={isMenuOpen ? "bar open" : "bar"}></span>
            <span className={isMenuOpen ? "bar open" : "bar"}></span>
            <span className={isMenuOpen ? "bar open" : "bar"}></span>
          </div>
        </div>

        {/* Mobile Dropdown (Menus + Buttons together) */}
        {isMenuOpen && (
          <div className="mobile-menu d-lg-none">
            <ul className="nav-menu-mobile">
              <li>
                <a href="#about" className="nav-link" onClick={closeMenu}>
                  About Us
                </a>
              </li>
              <li>
                <a href="#features" className="nav-link" onClick={closeMenu}>
                  Features
                </a>
              </li>
              <li>
                <a href="#patients" className="nav-link" onClick={closeMenu}>
                  For Patients
                </a>
              </li>
              <li>
                <a href="#doctors" className="nav-link" onClick={closeMenu}>
                  For Doctors
                </a>
              </li>
              <li>
                <a href="#carebridge" className="nav-link" onClick={closeMenu}>
                  CareBridge
                </a>
              </li>
              <li>
                <a href="#pricing" className="nav-link" onClick={closeMenu}>
                  Pricing
                </a>
              </li>
              <li>
                <Link
                  to="/investorspage"
                  className="nav-link"
                  onClick={closeMenu}
                >
                  Investors
                </Link>
              </li>
            </ul>

            <div className="d-flex flex-column gap-2 mt-3">
              <Link to="/login" className="btn-signin" onClick={closeMenu}>
                Sign In
              </Link>
              <Link to="/signup" className="btn-getstarted" onClick={closeMenu}>
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default WebsiteNavbar;
