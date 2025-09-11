import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faCalendarAlt,
  faUserMd,
  faUsers,
  faUser,
  faClipboardList,
  faStethoscope,
  faUserShield,
  faCheckCircle,
  faCalendarCheck,
  faBars,
  faTimes,
<<<<<<< HEAD
  faDemocrat,
  faCakeCandles,
  faCarOn,
  faHardDrive,
  faUserDoctor,
  faDedent,
  faCaretRight,
=======
  faRightFromBracket, // 👈 Logout ke liye icon
>>>>>>> 82912612c79d0e7e1f3e35da36a8229c6b86f672
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const role = localStorage.getItem("role");

  // 👇 Logout function
  const handleLogout = () => {
    localStorage.clear(); // ya phir sirf relevant items clear karein
    navigate("/login", { replace: true });

    if (isMobile) {
      setMobileMenuOpen(false);
      setCollapsed(true);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileMenuOpen(false);
      setCollapsed(true);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      setCollapsed(false);
    } else {
      setCollapsed(true);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      } else {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setCollapsed]);

  // Menus for each dashboard
  const patientMenuItems = [
    { label: "Dashboard", path: "/patient/dashboard", icon: faTachometerAlt },
    { label: "Book Appointment", path: "/patient/book-appointment", icon: faCalendarAlt },
    { label: "My Appointments", path: "/patient/my-appointments", icon: faClipboardList },
    { label: "My Doctors", path: "/patient/my-doctors", icon: faUserMd },
    { label: "My Caregiver", path: "/patient/my-caregiver", icon: faCaretRight },
    { label: "Profile", path: "/patient/profile", icon: faUser },
  ];

  const providerMenuItems = [
    { label: "Dashboard", path: "/doctor/dashboard", icon: faTachometerAlt },
    { label: "My Calendar", path: "/doctor/calendar", icon: faCalendarAlt },
    { label: "My Appointments", path: "/doctor/appointments", icon: faClipboardList },
    { label: "Assign Caregiver", path: "/doctor/assign-caregiver", icon: faDedent },

    { label: "My Profile", path: "/doctor/profile", icon: faUser },
  ];

  const caregiverMenuItems = [
    { label: "Dashboard", path: "/caregiver/dashboard", icon: faTachometerAlt },
    { label: "My Clients", path: "/caregiver/clients", icon: faUsers },
    { label: "Visit Log", path: "/caregiver/visit-log", icon: faStethoscope },
  ];

  const adminMenuItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: faTachometerAlt },
    { label: "User Management", path: "/admin/user-management", icon: faUserShield },
<<<<<<< HEAD
    // { label: "Patients", path: "/admin/patients", icon: faUser },
    // { label: "Providers", path: "/admin/providers", icon: faUserMd },
  
   { label: "Add Caregiver", path: "/admin/caregiver", icon: faUsers},
=======
>>>>>>> 82912612c79d0e7e1f3e35da36a8229c6b86f672
    { label: "Verification", path: "/admin/verification", icon: faCheckCircle },
    { label: "Appointments", path: "/admin/appointments", icon: faCalendarCheck },
  ];

  const getMenuItems = () => {
    switch (role) {
      case "Admin":
        return adminMenuItems;
      case "Patient":
        return patientMenuItems;
      case "Doctor":
        return providerMenuItems;
      case "Caregiver":
        return caregiverMenuItems;
      default:
        return [];
    }
  };

  const menus = getMenuItems();

  // 👇 Logout menu item — sabhi roles ke liye common
  const logoutMenuItem = {
    label: "Logout",
    icon: faRightFromBracket,
    action: handleLogout, // 👈 path ki jagah action, kyunki navigate nahi, function call karna hai
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {isMobile && (
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
        </button>
      )}

      {isMobile && mobileMenuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      <div
        className={`sidebar-container ${collapsed ? "collapsed" : ""} ${isMobile ? "mobile" : ""
          } ${mobileMenuOpen ? "mobile-open" : ""}`}
      >
        <div className="sidebar">
          <ul className="menu">
            {menus.map((menu, index) => (
              <li
                key={index}
                className={`menu-item ${isActive(menu.path) ? "active" : ""}`}
                onClick={() => handleNavigate(menu.path)}
                data-tooltip={collapsed ? menu.label : ""}
              >
                <div className="menu-link">
                  <FontAwesomeIcon icon={menu.icon} className="menu-icon" />
                  {!collapsed && <span className="menu-text">{menu.label}</span>}
                </div>
              </li>
            ))}

            {/* 👇 Logout Menu Item — Har role ke liye last mein */}
            <li
              className="menu-item logout-item"
              onClick={logoutMenuItem.action} // 👈 handleLogout call hoga
              data-tooltip={collapsed ? logoutMenuItem.label : ""}
            >
              <div className="menu-link">
                <FontAwesomeIcon icon={logoutMenuItem.icon} className="menu-icon" />
                {!collapsed && <span className="menu-text">{logoutMenuItem.label}</span>}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;