import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("patient");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [timeError, setTimeError] = useState(""); // For time validation

  // Doctor-specific fields
  const [specialty, setSpecialty] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [experience, setExperience] = useState("");
  const [availableDays, setAvailableDays] = useState("Monday-Saturday");
  const [openingTime, setOpeningTime] = useState("10:00"); // Default 10 AM
  const [closingTime, setClosingTime] = useState("18:00"); // Default 6 PM
  const [documents, setDocuments] = useState(null);

  const navigate = useNavigate();

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
        firstName,
        lastName,
        email,
        ...(role === "doctor" && {
          specialty,
          licenseNo,
          experience,
          availableDays,
          openingTime,
          closingTime,
          documents: documents ? documents.name : null,
        }),
      };

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(userData));

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
          <h2
            className="h4 fw-bold mb-4"
            style={{
              background: "linear-gradient(90deg, #FF6A00, #FF2D00)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Create an Account
          </h2>
          <p className="text-muted mb-4">Fill in your details to register</p>

          <form onSubmit={handleSignup}>
            {/* Role Selection */}
            <div className="mb-4">
              <label className="form-label fw-semibold d-block text-start">I am a</label>
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

            {/* First Name */}
            <div className="mb-3 position-relative">
              <i
                className="bi bi-person position-absolute top-50 start-0 translate-middle-y ms-3"
                style={{ color: "#FF6A00" }}
              ></i>
              <input
                type="text"
                className="form-control ps-5"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            {/* Last Name */}
            <div className="mb-3 position-relative">
              <i
                className="bi bi-person-fill position-absolute top-50 start-0 translate-middle-y ms-3"
                style={{ color: "#FF6A00" }}
              ></i>
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
                style={{ color: "#FF6A00" }}
              ></i>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control ps-5 pe-5"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="3"
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"
                  } position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer`}
                style={{ color: "#6b7280" }}
                role="button"
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            {/* Confirm Password */}
            <div className="mb-3 position-relative">
              <i
                className="bi bi-shield-lock position-absolute top-50 start-0 translate-middle-y ms-3"
                style={{ color: "#FF6A00" }}
              ></i>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control ps-5"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {passwordMismatch && (
              <p className="text-danger small mb-3">Passwords do not match</p>
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