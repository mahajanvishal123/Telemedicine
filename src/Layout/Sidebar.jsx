import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";


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
  faDedent,
  faRightLeft,
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const role = localStorage.getItem("role"); // Get user role from localStorage

  const handleNavigate = (path) => {
    navigate(path);

    // Mobile view में menu item click पर sidebar close कर दो
    if (isMobile) {
      setMobileMenuOpen(false);
      setCollapsed(true); // ensure sidebar collapses in mobile
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

  // Menus for each role
  const patientMenuItems = [
    { label: "Dashboard", path: "/patient/dashboard", icon: faTachometerAlt },
    { label: "Book Appointment", path: "/patient/book-appointment", icon: faCalendarAlt },
    { label: "My Appointments", path: "/patient/my-appointments", icon: faClipboardList },
    { label: "My Doctors", path: "/patient/my-doctors", icon: faUserMd },
    { label: "My Caregiver", path: "/patient/my-caregiver", icon: faRightLeft },
    { label: "Profile", path: "/patient/profile", icon: faUser },
  ];

  const doctorMenuItems = [
    { label: "Dashboard", path: "/doctor/dashboard", icon: faTachometerAlt },
    { label: "My Calendar", path: "/doctor/calendar", icon: faCalendarAlt },
    { label: "My Appointments", path: "/doctor/appointments", icon: faClipboardList },
    { label: "Add Caregiver", path: "/doctor/add-caregiver", icon: faStethoscope},
    { label: "Assign Caregiver", path: "/doctor/assign-caregiver", icon: faDedent },
    { label: "Availability Planner", path: "/doctor/availabilityPlanner", icon: faCalendarAlt },
    { label: "My Profile", path: "/doctor/profile", icon: faUser },
  ];

  const caregiverMenuItems = [
    { label: "Dashboard", path: "/caregiver/dashboard", icon: faTachometerAlt },
    { label: "My Clients", path: "/caregiver/clients", icon: faUsers },
    { label: "Visit Log", path: "/caregiver/visit-log", icon: faStethoscope },
    { label: "View Visit Log", path: "/caregiver/view-visit-log", icon: faEye },
    { label: "My Profile", path: "/caregiver/profile", icon: faUser },
    
  ];

  const adminMenuItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: faTachometerAlt },
    // { label: "User Management", path: "/admin/user-management", icon: faUserShield },
    
    { label: "All Doctor", path: "/admin/doctor", icon: faUsers },
    { label: " All Caregiver", path: "/admin/caregiver", icon: faUsers },

    { label: "All Patient", path: "/admin/patient", icon: faUsers },
    { label: "Verification", path: "/admin/verification", icon: faCheckCircle },
    { label: "Appointments", path: "/admin/appointments", icon: faCalendarCheck },
  ];

  // Decide menu based on role
  const getMenuItems = () => {
    switch (role?.toLowerCase()) {
      case "admin":
        return adminMenuItems;
      case "patient":
        return patientMenuItems;
      case "doctor":
        return doctorMenuItems;
      case "caregiver":
        return caregiverMenuItems;
      default:
        return [];
    }
  };

  const menus = getMenuItems();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile menu toggle */}
      {isMobile && (
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
        </button>
      )}

      {/* Overlay for mobile */}
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
                  {!collapsed && (
                    <span className="menu-text">{menu.label}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;