import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";

import Navbar from "./Layout/Navbar";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import ForgotPassword from "./Auth/ForgotPassword";
import Sidebar from "./Layout/Sidebar";
import Dashobard from "./Components/AdminDashboard/Dashboard";
import UserManagement from "./Components/AdminDashboard/UserManagement";
import Verification from "./Components/AdminDashboard/Verification";
import Appointments from "./Components/AdminDashboard/Appointments";


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
                <Route path="/admin/dashboard" element={<Dashobard/>} />
                 <Route path="/admin/user-management" element={<UserManagement/>} />
                 <Route path="/admin/verification" element={<Verification/>} />
                 <Route path="/admin/appointments" element={<Appointments/>} />

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
