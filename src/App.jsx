import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";

import Navbar from "./Layout/Navbar";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import ForgotPassword from "./Auth/ForgotPassword";
import Sidebar from "./Layout/Sidebar";
import Dashobard from "./Components/AdminDashboard/Dashobard";
import Dashboard from "./Components/CaregiverDashboard/Dashboard";
import Clients from "./Components/CaregiverDashboard/Clients";
// import DepartmentOKRs from "./Component/Okrs-management/Departement/DepartmentOKRs";


function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => window.innerWidth <= 768;
    if (checkIfMobile()) {
      setIsSidebarCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password";

  return (
    <>
      {hideLayout ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      ) : (
        <>
          <Navbar toggleSidebar={toggleSidebar} />
          <div className="main-content">
            <Sidebar
              collapsed={isSidebarCollapsed}
              setCollapsed={setIsSidebarCollapsed}
            />
            <div
              className={`right-side-content ${
                isSidebarCollapsed ? "collapsed" : ""
              }`}
            >
              <Routes>
                <Route path="dashboard" element={<Dashobard />} />
                <Route path="/caregiver/dashboard" element={<Dashboard />} />
                <Route path="/caregiver/clients" element={<Clients />} />
                {/* <Route path="okrs/departmentokrs" element={<DepartmentOKRs />} /> */}
              </Routes>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default App;
