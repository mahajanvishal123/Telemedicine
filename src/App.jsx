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
import PatientDashboard from "./Components/PatientDashboard/Dashboard/PatientDashboard";
import Profile from "./Components/PatientDashboard/Profile/Profile";
import MyDoctors from "./Components/PatientDashboard/MyDoctors/MyDoctors";
import MyAppointments from "./Components/PatientDashboard/MyAppointments/MyAppointments";
import BookAppointment from "./Components/PatientDashboard/BookAppointment/BookAppointment";
import ProviderDashboard from "./Components/ProviderDoctor/ProviderDashboard";
import MyProfile from "./Components/ProviderDoctor/MyProfile";
import MyCalendar from "./Components/ProviderDoctor/MyCalendar";  
import ProviderMyAppointments from "./Components/ProviderDoctor/ProviderMyAppointments";


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



                <Route path="/patient/dashboard" element={<PatientDashboard/>} />
                <Route path="/patient/book-appointment" element={<BookAppointment/>} />
                <Route path="/patient/my-appointments" element={<MyAppointments/>} />
                <Route path="/patient/my-doctors" element={<MyDoctors/>} />
                <Route path="/patient/profile" element={<Profile/>} />

                <Route path="/doctor/dashboard" element={<ProviderDashboard/>} />
                <Route path="/doctor/appointments" element={<ProviderMyAppointments/>} />
                <Route path="/doctor/profile" element={<MyProfile/>} />
                <Route path="/doctor/calendar" element={<MyCalendar/>} />
         

              </Routes>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default App;
