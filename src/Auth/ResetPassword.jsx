import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
const ResetPassword = () => {
    const { token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPassword = e.target[0].value;
        const confirmPassword = e.target[1].value;

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post("https://g5kqw2tn-3000.inc1.devtunnels.ms/api/auth/resetpassword", {password: newPassword, token });
            alert("Password reset successful!");
        } catch (error) {
            console.error("Error resetting password:", error);
            alert("Failed to reset password.");
        }
    };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center p-4" style={{ background: "linear-gradient(135deg, #ffffffff, #f7e4dcff)" }}>
      <div
        className="card border-0 shadow-lg w-100"
        style={{ maxWidth: "500px", borderRadius: "2rem" }}
      >
        <div className="p-5 text-center">
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
          <form onSubmit={handleSubmit}>
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