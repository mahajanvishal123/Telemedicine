import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate sending reset link
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setIsLoading(false);
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center p-4" style={{ background: "linear-gradient(135deg, #ffffffff, #f7e4dcff)",}}>
      <div
        className="card border-0 shadow-lg w-100"
        style={{ maxWidth: "500px", borderRadius: "2rem" }}
      >
        <div className="p-5 text-center">
          {/* Logo and Title */}
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
            Forgot Password?
          </h2>
          <p className="text-muted mb-4">
            Enter your email to receive a password reset link.
          </p>

          {isSubmitted ? (
            <div className="alert alert-success">
              Password reset link has been sent to <strong>{email}</strong>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Email Input */}
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          )}

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
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
