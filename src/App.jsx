import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";

import Navbar from "./Layout/Navbar";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import ForgotPassword from "./Auth/ForgotPassword";
import Sidebar from "./Layout/Sidebar";
import Dashobard from "./Components/AdminDashboard/Dashobard";
import PatientDashboard from "./Components/PatientDashboard/Dashboard/PatientDashboard";
import Profile from "./Components/PatientDashboard/Profile/Profile";
import MyDoctors from "./Components/PatientDashboard/MyDoctors/MyDoctors";
import MyAppointments from "./Components/PatientDashboard/MyAppointments/MyAppointments";
import BookAppointment from "./Components/PatientDashboard/BookAppointment/BookAppointment";


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
                {/* <Route path="okrs/departmentokrs" element={<DepartmentOKRs />} /> */}



                <Route path="/patient/dashboard" element={<PatientDashboard/>} />
                <Route path="/patient/book-appointment" element={<BookAppointment/>} />
                <Route path="/patient/my-appointments" element={<MyAppointments/>} />
                <Route path="/patient/my-doctors" element={<MyDoctors/>} />
                <Route path="/patient/profile" element={<Profile/>} />
         

              </Routes>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default App;
