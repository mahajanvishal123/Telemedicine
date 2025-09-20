import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const PricingPage = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  // ✅ Patient Signup Modal Component (Embedded)
// ✅ Patient Signup Modal Component (Embedded) — UPDATED: Password removed, Place added
const PatientSignupModal = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Patient-specific fields
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [place, setPlace] = useState(""); // ✅ NEW FIELD: Place

  // Profile Image & Gender
  const [profile, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [gender, setGender] = useState("");

  // Auto-calculate age
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

  // Handle profile image
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setProfileImage(null);
      setPreviewUrl("");
    }
  };

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle Signup (Only for Patient) — WITHOUT PASSWORD
  const handleSignup = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("name", fullName);
      formData.append("email", email);
      formData.append("gender", gender);
      if (profile) formData.append("profile", profile);
      formData.append("dob", dob);
      formData.append("age", age);
      formData.append("bloodGroup", bloodGroup);
      formData.append("place", place); // ✅ Sending place to backend

      const url = `${API_URL}/patient`; // ✅ Hardcoded for patient
      console.log("Signup URL:", url);

      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const userData = response.data.user || response.data;
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", "patient");

      // Success Alert
      Swal.fire({
        title: 'Success!',
        text: 'Your account has been created successfully! Redirecting to login...',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        backdrop: true,
        didClose: () => {
          navigate("/login");
          handleClose();
        }
      });

    } catch (error) {
      console.error("Signup failed:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data ||
        "Signup failed. Please check your details and try again.";

      setErrorMessage(errorMsg);

      Swal.fire({
        title: 'Error!',
        text: errorMsg,
        icon: 'error',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#d33',
      });

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Patient Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSignup}>
          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* ❌ Password Fields REMOVED */}

          {/* Gender */}
          <div className="mb-3">
            <label className="form-label">Gender</label>
            <div>
              <div className="form-check form-check-inline">
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
              <div className="form-check form-check-inline">
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
              <div className="form-check form-check-inline">
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

          {/* Profile Picture */}
          <div className="mb-3">
            <label className="form-label">Profile Picture (Optional)</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleProfileImageChange}
            />
            {previewUrl && (
              <div className="mt-2">
                <img
                  src={previewUrl}
                  alt="Profile Preview"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #d35400",
                  }}
                />
              </div>
            )}
          </div>

          {/* DOB */}
          <div className="mb-3">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              value={dob}
              onChange={handleDobChange}
              required
            />
          </div>

          {/* Age (Auto-filled) */}
          <div className="mb-3">
            <label className="form-label">Age</label>
            <input
              type="number"
              className="form-control"
              value={age}
              readOnly
              placeholder="Auto-calculated from DOB"
            />
          </div>

          {/* Blood Group */}
          <div className="mb-3">
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

          {/* ✅ NEW FIELD: Place */}
          <div className="mb-3">
            <label className="form-label">Place / City</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your city or locality"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              required
            />
          </div>

          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}

          <div className="d-grid mt-4">
            <button
              type="submit"
              className="btn"
              disabled={isLoading}
              style={{
                backgroundColor: '#d35400',
                borderColor: '#d35400',
                color: 'white',
                fontWeight: '600',
                padding: '10px',
                borderRadius: '8px',
              }}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};
  return (
    <div className="bg-light">
      {/* Hero Section */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold text-dark">Healthcare that fits your budget</h1>
            <p className="lead text-muted mt-3">
              Choose the plan that works for you. No hidden fees, no surprises—just transparent, affordable healthcare when you need it.
            </p>
          </div>

          {/* Pricing Cards */}
          <Row className="g-4 justify-content-center">
            {/* Pay Per Visit */}
            <Col md={4}>
              <div className="border border-gray-200 rounded-4 p-4 shadow-sm h-100">
                <h3 className="fw-bold text-dark text-center">Pay Per Visit</h3>
                <p className="text-muted text-center">Perfect for occasional care needs</p>
                <div className="mb-4 text-center">
                  <span className="h2 fw-bold text-dark">From $29</span>
                  <span className="text-muted ms-1">per consultation</span>
                </div>

                <ul className="mt-4 list-unstyled">
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Direct access to verified doctors
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Transparent pricing upfront
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    E-prescriptions and lab orders
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Visit summaries and care plans
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Multi-language support
                  </li>
                  <li className="d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    24/7 customer support
                  </li>
                </ul>
                <Button
                  variant="light"
                  className="w-100 py-2 border-0 text-white mt-4"
                  style={{
                    backgroundColor: '#d35400',
                    borderColor: '#d35400',
                    fontWeight: '600',
                    borderRadius: '8px',
                  }}
                  onClick={handleShow} // ✅ Open Modal
                >
                  Book Now →
                </Button>
              </div>
            </Col>

            {/* Care Membership (Most Popular) */}
            <Col md={4} className="position-relative">
              <div
                className="border-2 rounded-4 p-4 shadow-sm h-100"
                style={{ borderColor: '#ff6600ff', boxShadow: '0 6px 12px rgba(0,0,0,0.05)' }}
              >
                <div className="position-absolute top-0 start-50 translate-middle-x">
                  <span
                    className="badge px-3 py-1 text-white rounded-pill"
                    style={{ fontSize: '0.8rem', fontWeight: '600', background: "#d35400" }}
                  >
                    Most Popular
                  </span>
                </div>
                <h3 className="fw-bold text-dark text-center mt-2">Care Membership</h3>
                <p className="text-muted text-center">For ongoing health management</p>
                <div className="mb-4 text-center">
                  <span className="h2 fw-bold text-dark">$99</span>
                  <span className="text-muted ms-1">per month</span>
                </div>

                <ul className="mt-4 list-unstyled">
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Everything in Pay Per Visit
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Unlimited consultations
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Priority booking
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Care Circles for family
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Health monitoring & reminders
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Wellness coaching sessions
                  </li>
                  <li className="d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Annual health assessments
                  </li>
                </ul>
                <Button
                  variant="danger"
                  className="w-100 py-2"
                  style={{
                    backgroundColor: '#d35400',
                    borderColor: '#d35400',
                    fontWeight: '600',
                    borderRadius: '8px',
                  }}
                  onClick={handleShow} // ✅ Open Modal
                >
                  Book Now →
                </Button>
              </div>
            </Col>

            {/* Family Plan */}
            <Col md={4}>
              <div className="border border-gray-200 rounded-4 p-4 shadow-sm h-100">
                <h3 className="fw-bold text-dark text-center">Family Plan</h3>
                <p className="text-muted text-center">Complete care for your whole family</p>
                <div className="mb-4 text-center">
                  <span className="h2 fw-bold text-dark">$179</span>
                  <span className="text-muted ms-1">per month</span>
                </div>

                <ul className="mt-4 list-unstyled">
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Everything in Care Membership
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Up to 6 family members
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Pediatric and elderly care
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Family health coordination
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    CareBridge home visits
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Shared health records
                  </li>
                  <li className="d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Family wellness programs
                  </li>
                </ul>
                <Button
                  variant="danger"
                  className="w-100 py-2 mt-2"
                  style={{
                    backgroundColor: '#d35400',
                    borderColor: '#d35400',
                    fontWeight: '600',
                    borderRadius: '8px',
                  }}
                  onClick={handleShow} // ✅ Open Modal
                >
                  Book Now →
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ✅ Render Modal Here */}
      <PatientSignupModal />
    </div>
  );
};

export default PricingPage;