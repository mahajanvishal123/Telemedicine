import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    setIsLoading(true);
    setPasswordMismatch(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.setItem("isAuthenticated", "true");
      navigate("/user/dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center p-4" style={{ background: "linear-gradient(135deg, #ffffffff, #f7e4dcff)",}}>
      <div
        className="card border-0 shadow-lg w-100"
        style={{
          maxWidth: "1000px",
          borderRadius: "2rem",
          background: "linear-gradient(135deg, #ffffffff, #f7e4dcff)",
        }}
      >
        <div className="row g-0">
          {/* Left Form Section */}
          <div className="col-12 col-md-6 p-5 text-center">
            <h2
              className="h4 fw-bold"
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
                <p className="text-danger small mb-3">
                  Passwords do not match
                </p>
              )}

              {/* Signup Button */}
              <button
                type="submit"
                className="btn w-100 fw-semibold mb-3"
                style={{
                  background: "linear-gradient(90deg, #FF6A00, #FF2D00)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
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

          {/* Right Illustration */}
          <div className="col-md-6 d-none d-md-block">
            <div className="h-100 position-relative">
              <img
                src="https://i.ibb.co/tppWP015/Mar-Business-18.jpg"
                alt="Signup Illustration"
                className="img-fluid h-100 w-100 object-fit-cover"
                style={{
                  borderTopRightRadius: "2rem",
                  borderBottomRightRadius: "2rem",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
