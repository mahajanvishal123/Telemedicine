import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "admin", // Default role
  });

  const [user, setUser] = useState(null);
  const role = localStorage.getItem("role");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle login submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Save role in localStorage
    localStorage.setItem("role", formData.role);

    // Fake login (replace with API later)
    setUser({ email: formData.email });
  };

  // Redirect based on role
  useEffect(() => {
    if (user && role) {
      switch (role.toLowerCase()) {
        case "patient":
          navigate("/patient/dashboard");
          break;
        case "doctor":
          navigate("/doctor/dashboard");
          break;
        case "caregiver":
          navigate("/caregiver/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/");
      }
    }
  }, [user, role, navigate]);

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div className="card shadow w-100" style={{ maxWidth: "950px", borderRadius: "1.5rem" }}>
        <div className="row g-0">
          {/* Left image */}
          <div className="col-md-6 d-none d-md-block">
            <img
              src="https://img.freepik.com/free-vector/login-concept-illustration_114360-739.jpg"
              alt="login"
              className="img-fluid rounded-start"
              style={{ height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Right form */}
          <div className="col-md-6 d-flex align-items-center p-5">
            <div className="w-100">
              <h2 className="fw-bold mb-3 text-center">Welcome Back!</h2>
              <p className="text-muted text-center mb-4">Please login to your account</p>

              <form onSubmit={handleSubmit}>
                {/* Role Select */}
                <div className="mb-3">
                  <label className="form-label">Select Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Patient">Patient</option>
                    <option value="Doctor">Provider / Doctor</option>
                    <option value="Caregiver">Caregiver</option>

                  </select>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                {/* Password */}
                <div className="mb-3 position-relative">
                  <label className="form-label">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                  <span
                    className="position-absolute top-50 end-0 translate-middle-y me-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <i className="bi bi-eye-slash-fill"></i>
                    ) : (
                      <i className="bi bi-eye-fill"></i>
                    )}
                  </span>
                </div>

                {/* Remember me + forgot */}
                <div className="mb-3 d-flex justify-content-between align-items-center">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="remember" />
                    <label className="form-check-label" htmlFor="remember">Remember me</label>
                  </div>
                  <Link to="/forgot-password" className="text-decoration-none small">Forgot Password?</Link>
                </div>

                {/* Submit */}
                <button type="submit" className="btn btn-warning w-100 py-2">
                  Login
                </button>
              </form>

              {/* Signup link */}
              <div className="text-center mt-3">
                <p className="mb-1">Don't have an account?</p>
                <Link to="/signup" className="btn btn-outline-warning w-100 py-2">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
