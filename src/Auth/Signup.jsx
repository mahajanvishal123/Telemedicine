import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("patient");
  const [fullName, setFullName] = useState(""); // 👈 Replaces firstName & lastName
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [timeError, setTimeError] = useState(""); // For time validation
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Doctor-specific fields
  const [specialty, setSpecialty] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [experience, setExperience] = useState("");
  const [consultationFee, setConsultationFee] = useState(""); // 👈 NEW: Consultation Fee
  const [availableDays, setAvailableDays] = useState("Monday-Saturday");
  const [openingTime, setOpeningTime] = useState("10:00");
  const [closingTime, setClosingTime] = useState("18:00");
  const [documents, setDocuments] = useState(null);

  // Patient-specific fields 👇
  const [dob, setDob] = useState(""); // Date of Birth
  const [age, setAge] = useState(""); // Age (can be auto-calculated or manual)
  const [bloodGroup, setBloodGroup] = useState(""); // Blood Group

  // Profile Image & Gender (for both roles)
  const [profileImage, setProfileImage] = useState(null);
  const [gender, setGender] = useState("");

  const navigate = useNavigate();

  // Auto-calculate age when DOB changes (optional enhancement)
  const handleDobChange = (e) => {
    const selectedDob = e.target.value;
    setDob(selectedDob);
    if (selectedDob) {
      const today = new Date();
      const birthDate = new Date(selectedDob);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge.toString());
    } else {
      setAge("");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    // Validate time if doctor
    if (role === "doctor") {
      if (closingTime <= openingTime) {
        setTimeError("Closing time must be after opening time");
        return;
      } else {
        setTimeError("");
      }
    }

    setIsLoading(true);
    setPasswordMismatch(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userData = {
        role,
        fullName, // 👈 Single field now
        email,
        gender,
        profileImage: profileImage ? profileImage.name : null,
        ...(role === "doctor" && {
          specialty,
          licenseNo,
          experience,
          consultationFee, // 👈 Included here
          availableDays,
          openingTime,
          closingTime,
          documents: documents ? documents.name : null,
        }),
        ...(role === "patient" && {
          dob,
          age,
          bloodGroup,
        }),
      };

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", role);

      if (role === "doctor") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center p-4"
      style={{ background: "linear-gradient(135deg, #ffffffff, #f7e4dcff)" }}
    >
      <div
        className="card border-0 shadow-lg w-100"
        style={{
          maxWidth: "500px",
          borderRadius: "2rem",
          background: "linear-gradient(135deg, #ffffffff, #f7e4dcff)",
        }}
      >
        <div className="p-5 text-center">
          <div className="d-flex align-items-center mb-4">
            <img
              src="https://i.ibb.co/xKF1WPkH/image.png" 
              alt="Logo"
              style={{
                width: "50px",
                height: "50px",
                cursor: "pointer",
                borderRadius: "8px",
                objectFit: "cover",
                marginRight: "16px",
                transition: "transform 0.2s ease, opacity 0.2s ease",
              }}
              onClick={() => navigate("/")}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            />
            <div>
              <h2
                className="h4 fw-bold mb-1"
                style={{
                  background: "linear-gradient(90deg, #FF6A00, #FF2D00)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                  fontSize: "1.75rem",
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                Create an Account
              </h2>
              <p className="text-muted mb-0" style={{ fontSize: "0.95rem", fontWeight: "400", color: "#6c757d", marginTop: "4px" }}>
                Fill in your details to register
              </p>
            </div>
          </div>

          <form onSubmit={handleSignup}>
            {/* Role Selection */}
            <div className="mb-4">
              <label className="form-label fw-semibold d-block text-center">I am a</label>
              <div className="d-flex gap-3 justify-content-center">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="role"
                    id="patient"
                    value="patient"
                    checked={role === "patient"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="patient">
                    Patient
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="role"
                    id="doctor"
                    value="doctor"
                    checked={role === "doctor"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="doctor">
                    Doctor
                  </label>
                </div>
              </div>
            </div>

            {/* 👇 Full Name (Replaces First + Last Name) */}
            <div className="mb-3 position-relative">
              <i
                className="bi bi-person position-absolute top-50 start-0 translate-middle-y ms-3"
                style={{ color: "#FF6A00" }}
              ></i>
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-3 position-relative">
              <i
                className="bi bi-envelope position-absolute top-50 start-0 translate-middle-y ms-3"
                style={{ color: "#FF6A00" }}
              ></i>
              <input
                type="email"
                className="form-control ps-5"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3 position-relative">
              <i
                className="bi bi-lock position-absolute top-50 start-0 translate-middle-y ms-3"
                style={{ color: "#FF6A00", fontSize: "1.2rem" }}
              ></i>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control ps-5 pe-5"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordMismatch(false); // ✅ Clear error on typing
                }}
                required
                minLength="3"
                style={{ paddingRight: "48px" }} // Prevents text overlap
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} 
                  position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer`}
                style={{
                  color: "#6b7280",
                  fontSize: "1.2rem",
                  transition: "color 0.2s ease",
                }}
                role="button"
                onClick={() => setShowPassword(!showPassword)}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#FF6A00")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
              ></i>
            </div>

            {/* Confirm Password */}
            <div className="mb-3 position-relative">
              <i
                className="bi bi-shield-lock position-absolute top-50 start-0 translate-middle-y ms-3"
                style={{ color: "#FF6A00", fontSize: "1.2rem" }}
              ></i>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control ps-5 pe-5"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordMismatch(false); // ✅ Clear error on typing
                }}
                required
                style={{ paddingRight: "48px" }}
              />
              <i
                className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"} 
                  position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer`}
                style={{
                  color: "#6b7280",
                  fontSize: "1.2rem",
                  transition: "color 0.2s ease",
                }}
                role="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#FF6A00")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
              ></i>
            </div>

            {passwordMismatch && (
              <p className="text-danger small mb-3">Passwords do not match</p>
            )}

            {/* Profile & Gender */}
            {role && (
              <>
                <hr className="my-4" />


                {/* Gender */}
                <div className="mb-3 text-start">
                  <label className="form-label">Gender</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        id="male"
                        value="Male"
                        checked={gender === "Male"}
                        onChange={(e) => setGender(e.target.value)}
                        required
                      />
                      <label className="form-check-label" htmlFor="male">Male</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        id="female"
                        value="Female"
                        checked={gender === "Female"}
                        onChange={(e) => setGender(e.target.value)}
                        required
                      />
                      <label className="form-check-label" htmlFor="female">Female</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        id="other"
                        value="Other"
                        checked={gender === "Other"}
                        onChange={(e) => setGender(e.target.value)}
                        required
                      />
                      <label className="form-check-label" htmlFor="other">Other</label>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ===== PATIENT-SPECIFIC FIELDS ===== */}
            {role === "patient" && (
              <>
                <hr className="my-4" />
                <h6 className="fw-bold text-start mb-3">Patient Details</h6>

                {/* Age (auto-filled or editable) */}
                <div className="mb-3 text-start">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Auto-calculated or enter manually"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="0"
                  />
                </div>

                {/* Blood Group */}
                <div className="mb-3 text-start">
                  <label className="form-label">Blood Group</label>
                  <select
                    className="form-select"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    required
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </>
            )}

            {/* ===== DOCTOR-SPECIFIC FIELDS ===== */}
            {role === "doctor" && (
              <>
                <hr className="my-4" />
                <h6 className="fw-bold text-start mb-3">Doctor Details</h6>

                {/* Specialty */}
                <div className="mb-3 position-relative">
                  <i
                    className="bi bi-heart-pulse position-absolute top-50 start-0 translate-middle-y ms-3"
                    style={{ color: "#FF6A00" }}
                  ></i>
                  <input
                    type="text"
                    className="form-control ps-5"
                    placeholder="Specialty (e.g., Cardiologist)"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    required
                  />
                </div>

                {/* License No. */}
                <div className="mb-3 position-relative">
                  <i
                    className="bi bi-file-earmark-medical position-absolute top-50 start-0 translate-middle-y ms-3"
                    style={{ color: "#FF6A00" }}
                  ></i>
                  <input
                    type="text"
                    className="form-control ps-5"
                    placeholder="Medical License Number"
                    value={licenseNo}
                    onChange={(e) => setLicenseNo(e.target.value)}
                    required
                  />
                </div>

                {/* Experience */}
                <div className="mb-3 position-relative">
                  <i
                    className="bi bi-mortarboard position-absolute top-50 start-0 translate-middle-y ms-3"
                    style={{ color: "#FF6A00" }}
                  ></i>
                  <input
                    type="number"
                    className="form-control ps-5"
                    placeholder="Years of Experience"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    required
                    min="0"
                  />
                </div>

                {/* 👇 Consultation Fee (NEW FIELD) */}
                <div className="mb-3 position-relative">
                <i
  className="bi bi-currency-dollar position-absolute top-50 start-0 translate-middle-y ms-3"
  style={{ color: "#FF6A00" }}
></i>
                  <input
                    type="number"
                    className="form-control ps-5"
                    placeholder="Consultation Fee (e.g., $50)"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                    required
                    min="0"
                  />
                </div>

                {/* Available Days */}
                <div className="mb-3 text-start">
                  <label className="form-label">Available Days</label>
                  <select
                    className="form-select"
                    value={availableDays}
                    onChange={(e) => setAvailableDays(e.target.value)}
                  >
                    <option value="Monday-Saturday">Monday - Saturday</option>
                    <option value="Monday-Friday">Monday - Friday</option>
                    <option value="Monday-Thursday">Monday - Thursday</option>
                    <option value="Saturday-Sunday">Weekends Only</option>
                  </select>
                </div>

                {/* Opening Time */}
                <div className="mb-3 text-start">
                  <label className="form-label">Opening Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                    required
                  />
                </div>

                {/* Closing Time */}
                <div className="mb-3 text-start">
                  <label className="form-label">Closing Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    required
                  />
                </div>

                {timeError && (
                  <p className="text-danger small mb-3">{timeError}</p>
                )}

                {/* Documents Upload */}
                <div className="mb-3 text-start">
                  <label className="form-label">Upload Documents (License, Certificates)</label>
                  <input
                    type="file"
                    className="form-control"
                    accept=".pdf,.jpg,.png"
                    onChange={(e) => setDocuments(e.target.files[0])}
                  />
                  {documents && (
                    <small className="text-muted d-block mt-1">
                      Selected: {documents.name}
                    </small>
                  )}
                </div>
              </>
            )}

            {/* Signup Button */}
            <button
              type="submit"
              className="btn w-100 fw-semibold my-4"
              style={{
                background: "linear-gradient(90deg, #FF6A00, #FF2D00)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "12px 0",
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            <div className="text-center">
              <span className="text-muted">Already have an account? </span>
              <Link
                to="/login"
                className="fw-semibold text-decoration-none"
                style={{
                  background: "linear-gradient(90deg, #FF6A00, #FF2D00)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;