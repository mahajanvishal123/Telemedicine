import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";

import Navbar from "./Layout/Navbar";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import ForgotPassword from "./Auth/ForgotPassword";
import Sidebar from "./Layout/Sidebar";
import Dashboard from "./Components/CaregiverDashboard/Dashboard";
import Clients from "./Components/CaregiverDashboard/Clients";
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
import AssignCaregiver from "./Components/ProviderDoctor/AssignCaregiver";
import ProviderMyAppointments from "./Components/ProviderDoctor/ProviderMyAppointments";
import Visitlog from "./Components/CaregiverDashboard/Visitlog";
import Landing from "./Webiste/Pages/Landing";
import InvestorsPage from "./Webiste/Pages/InvestorsPage";
import Caregiver from "./Components/AdminDashboard/Caregiver";


// import Home from "./Webiste/Pages/Home";
// import AboutUs from "./Webiste/Pages/AboutUs";
// import ForProviders from "./Webiste/Pages/ForProviders";
// import ForPatients from "./Webiste/Pages/ForPatients";
// import CareBridge from "./Webiste/Pages/CareBridge";
// import ContactUs from "./Webiste/Pages/ContactUs";
import ScrollToTop from "./Webiste/ScrollToTop/ScrollToTop";
import PrivacyPolicy from "./Webiste/Pages/PrivacyPolicy";
import TermsConditions from "./Webiste/Pages/TermsConditions";
import DoctorViewProfile from "./Components/CaregiverDashboard/DoctorViewProfile";
import MyCaregiver from "./Components/PatientDashboard/MyCaregiver.jsx/MyCaregiver";

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
    location.pathname === "/forgot-password" ||
    location.pathname === "/" ||
    location.pathname === "/aboutus" ||
    location.pathname === "/forprovider" ||
    location.pathname === "/forpatients" ||
    location.pathname === "/carebridge" ||
    location.pathname === "/contactus" ||
    location.pathname === "/privacypolicy" ||
    location.pathname === "/termsconditions" ||
    location.pathname === "/investorspage";

  return (
    <>
      {/* ✅ Yeh har route change pe scroll karega top par */}
      <ScrollToTop />

      {hideLayout ? (
        <Routes>
          <Route path="/investorspage" element={<InvestorsPage />} />
          <Route path="/" element={<Landing />} />

          {/* <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/forprovider" element={<ForProviders />} />
          <Route path="/forpatients" element={<ForPatients />} />
          <Route path="/carebridge" element={<CareBridge />} />
          <Route path="/contactus" element={<ContactUs />} /> */}

          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/termsconditions" element={<TermsConditions />} />

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
              className={`right-side-content ${isSidebarCollapsed ? "collapsed" : ""
                }`}
            >
              <Routes>
                <Route path="dashboard" element={<Dashobard />} />
                <Route path="/caregiver/dashboard" element={<Dashboard />} />
                <Route path="/caregiver/clients" element={<Clients />} />
                <Route path="/caregiver/visit-log" element={<Visitlog />} />
                <Route path="/admin/dashboard" element={<Dashobard />} />
                <Route
                  path="/admin/user-management"
                  element={<UserManagement />}
                />
                <Route path="/admin/verification" element={<Verification />} />
                <Route path="/admin/appointments" element={<Appointments />} />
                <Route path="/admin/dashboard" element={<Dashobard />} />
                <Route path="/admin/user-management" element={<UserManagement />} />
                <Route path="/admin/verification" element={<Verification />} />
                <Route path="/admin/appointments" element={<Appointments />} />
                 <Route
                  path="/admin/caregiver"
                  element={<Caregiver />}
                />
                <Route path="/caregiver/clients/profile" element={<DoctorViewProfile />} />


                {/* <Route path="okrs/departmentokrs" element={<DepartmentOKRs />} /> */}

                <Route
                  path="/patient/dashboard"
                  element={<PatientDashboard />}
                />
                <Route
                  path="/patient/book-appointment"
                  element={<BookAppointment />}
                />
                <Route
                  path="/patient/my-appointments"
                  element={<MyAppointments />}
                />
                <Route
                  path="/patient/my-doctors"
                  element={<MyDoctors />}
                />
                 <Route path="/patient/my-caregiver" element={<MyCaregiver/>} />

                <Route path="/patient/profile" element={<Profile />} />

                <Route
                  path="/doctor/dashboard"
                  element={<ProviderDashboard />}
                />
                <Route
                  path="/doctor/appointments"
                  element={<ProviderMyAppointments />}
                />
                 <Route path="/doctor/assign-caregiver" element={<AssignCaregiver />} />
                <Route path="/doctor/profile" element={<MyProfile />} />
                <Route path="/doctor/calendar" element={<MyCalendar />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default App;
