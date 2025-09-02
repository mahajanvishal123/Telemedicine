import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faGear,
  faChartBar,
  faUsers,
  faFileAlt,
  faUserGear,
  faChartLine,
  faCalculator,
  faAddressBook,
  faCircleDot,
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const isActive = (path) => location.pathname === path;

  const handleNavigate = (path) => {
    navigate(path);
    if (window.innerWidth <= 768) setCollapsed(true);
  };

  const menus = [
    {
      name: "OKRs Management",
      icon: faCircleDot,
      key: "okrs",
      subItems: [
        { label: "Set Company OKRs", path: "/okrs/company" },
        { label: "Department OKRs", path: "/okrs/departmentokrs" },
        { label: "Individual OKRs", path: "/okrs/individual" },
        { label: "OKR Progress Tracker", path: "/okrs/tracker" },
        { label: "Alignment & Dependencies", path: "/okrs/alignment" },
        { label: "OKR Reports", path: "/okrs/reports" },
      ],
    },
    {
      name: "KPI Tracking",
      icon: faChartLine,
      key: "kpi",
      subItems: [
        { label: "Define KPIs", path: "/kpi/define" },
        { label: "Team KPIs", path: "/kpi/team" },
        { label: "Performance Dashboards", path: "/kpi/performance" },
        { label: "KPI Trends & Analytics", path: "/kpi/trends" },
        { label: "Alerts / Threshold Management", path: "/kpi/alerts" },
      ],
    },
    {
      name: "Financial Ratio Analysis",
      icon: faCalculator,
      key: "finance",
      subItems: [
        { label: "Financial Overview", path: "/finance/overview" },
        { label: "Ratio Analysis", path: "/finance/ratio" },
        { label: "Liquidity Ratios", path: "/finance/liquidity" },
        { label: "Profitability Ratios", path: "/finance/profitability" },
        { label: "Efficiency Ratios", path: "/finance/efficiency" },
        { label: "Solvency Ratios", path: "/finance/solvency" },
        { label: "Balance Sheet / P&L", path: "/finance/balance" },
        { label: "Custom Financial Metrics", path: "/finance/custom" },
      ],
    },
    {
      name: "CRM",
      icon: faAddressBook,
      key: "crm",
      subItems: [
        { label: "Leads & Prospects", path: "/crm/leads" },
        { label: "Customer Pipeline", path: "/crm/pipeline" },
        { label: "Contact & Company Database", path: "/crm/database" },
        { label: "Follow-ups & Tasks", path: "/crm/tasks" },
        { label: "Sales Forecasting", path: "/crm/forecast" },
        { label: "CRM Reports", path: "/crm/reports" },
      ],
    },
    {
      name: "Reports",
      icon: faFileAlt,
      key: "reports",
      subItems: [
        { label: "View Reports", path: "/reports/view" },
        { label: "Export Data", path: "/reports/export" },
      ],
    },
    {
      name: "Settings",
      icon: faGear,
      key: "settings",
      subItems: [
        { label: "User Settings", path: "/settings/user" },
        { label: "System Preferences", path: "/settings/system" },
      ],
    },
  ];

  return (
    <div className={`sidebar-container ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar">
        <ul className="menu">
          {menus.map((menu, index) => (
            <li key={index} className="menu-item">
              <div
                className="menu-link"
                onClick={() => toggleMenu(menu.key)}
              >
                <FontAwesomeIcon icon={menu.icon} className="menu-icon" />
                {!collapsed && <span className="menu-text">{menu.name}</span>}
                {!collapsed && (
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className={`arrow-icon ${activeMenu === menu.key ? "rotate" : ""}`}
                  />
                )}
              </div>
              {!collapsed && activeMenu === menu.key && (
                <ul className="submenu">
                  {menu.subItems.map((sub, subIndex) => (
                    <ul
                      key={subIndex}
                      className={`submenu-item ${isActive(sub.path) ? "active-sub" : ""}`}
                      onClick={() => handleNavigate(sub.path)}
                    >
                      {sub.label}
                    </ul>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;