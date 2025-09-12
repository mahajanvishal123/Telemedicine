import React from "react";
import { Link } from "react-router-dom";
const ResetPassword = () => {
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center p-4" style={{ background: "linear-gradient(135deg, #ffffffff, #f7e4dcff)" }}>
      <div
        className="card border-0 shadow-lg w-100"
        style={{ maxWidth: "500px", borderRadius: "2rem" }}
      >
        <div className="p-5 text-center">
          {/* Logo (Optional - Uncomment if you have one) */}
          {/* <div className="d-flex justify-content-center align-items-center mb-4">
            <img
              src="https://i.postimg.cc/mZHz3k1Q/Whats-App-Image-2025-07-23-at-12-38-03-add5b5dd-removebg-preview-1.png"
              alt="logo"
              className="navbar-logo m-2"
              style={{ height: "51px" }}
            />
          </div> */}

          <h2
            className="h5 fw-bold"
            style={{
              background: "linear-gradient(90deg, #FF6A00, #FF2D00)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Reset Your Password
          </h2>
          <p className="text-muted mb-4">
            Enter a new password below to secure your account.
          </p>

          {/* Success Message (Hidden by default) */}
          <div className="alert alert-success d-none">
            ✅ Password updated successfully! Redirecting to login...
          </div>

          {/* Error Message (Hidden by default) */}
          <div className="alert alert-danger d-none">
            The reset link has expired or is invalid. Please request a new one.
          </div>

          {/* Form */}
          <form>
            {/* New Password */}
            <div className="mb-3 position-relative">
              <i
                className="bi bi-lock position-absolute top-50 start-0 translate-middle-y ms-3"
                style={{ color: "#FF6A00" }}
              ></i>
              <input
                type="password"
                className="form-control ps-5"
                placeholder="New Password"
                required
                minLength="6"
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-4 position-relative">
              <i
                className="bi bi-lock-fill position-absolute top-50 start-0 translate-middle-y ms-3"
                style={{ color: "#FF6A00" }}
              ></i>
              <input
                type="password"
                className="form-control ps-5"
                placeholder="Confirm New Password"
                required
                minLength="6"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn w-100 fw-semibold mb-3"
              style={{
                background: "linear-gradient(90deg, #FF6A00, #FF2D00)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
              }}
            >
              Update Password
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center mt-3">
            <Link
              to="/login"
              className="fw-semibold text-decoration-none"
              style={{
                background: "linear-gradient(90deg, #FF6A00, #FF2D00)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;