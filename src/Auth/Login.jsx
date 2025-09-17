import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../Baseurl/Baseurl";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Login API Response:", data); // 👈 Debugging ke liye

      if (response.ok) {
        // ✅ Step 1: Response ka structure check karo
        // Agar API returns { status, data: { accessToken, user } }
        let token = data.accessToken || data.token || data?.data?.accessToken || data?.data?.token;
        let userData = data.user || data?.data?.user;

        if (!userData || !userData.role) {
          alert("Role missing in API response!");
          return;
        }

        // ✅ Step 2: Save token & role
        if (token) {
          localStorage.setItem("accessToken", token);
        }
        localStorage.setItem("role", userData.role);
        localStorage.setItem("user", JSON.stringify(userData));

        // ✅ Step 3: Set user
        setUser(userData);
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  // Redirect based on role
  useEffect(() => {
    const role = localStorage.getItem("role");
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
  }, [user, navigate]);

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #ffffffff, #f7e4dcff)",
        padding: "1rem",
      }}
    >
      <div
        className="card shadow w-100"
        style={{
          maxWidth: "950px",
          borderRadius: "1.5rem",
          overflow: "hidden",
          border: "none",
        }}
      >
        <div className="row g-0">
          {/* Left image */}
          <div className="col-md-6 d-none d-md-block">
            <img
              src="https://i.ibb.co/4ZhScbBS/3823521.jpg"
              alt="login"
              className="img-fluid"
              style={{ height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Right form */}
          <div
            className="col-md-6 d-flex align-items-center p-5"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <div className="w-100">
              <h2 className="fw-bold mb-3 text-center" style={{ color: "#FF6B2C" }}>
                Welcome Back!
              </h2>
              <p className="text-muted text-center mb-4">
                Please login to your account
              </p>

              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: "#1B263B" }}>
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    style={{ borderRadius: "0.75rem", borderColor: "#FF6B2C" }}
                    required
                  />
                </div>

                {/* Password */}
                <div className="mb-3 position-relative">
                  <label className="form-label fw-semibold" style={{ color: "#1B263B" }}>
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    style={{ borderRadius: "0.75rem", borderColor: "#FF6B2C" }}
                    required
                  />
                  <span
                    className="position-absolute top-50 end-0 translate-middle-y me-3 mt-3"
                    style={{ cursor: "pointer", color: "#FF6B2C" }}
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
                    <label className="form-check-label" htmlFor="remember">
                      Remember me
                    </label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="small"
                    style={{ color: "#FF6B2C", textDecoration: "none" }}
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn w-100 py-2 fw-bold"
                  style={{
                    backgroundColor: "#FF6B2C",
                    color: "#fff",
                    borderRadius: "0.75rem",
                  }}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              {/* Signup link */}
              <div className="text-center mt-3">
                <p className="mb-1">Don't have an account?</p>
                <Link
                  to="/signup"
                  className="btn w-100 py-2 fw-bold"
                  style={{
                    border: "2px solid #FF6B2C",
                    color: "#FF6B2C",
                    borderRadius: "0.75rem",
                  }}
                >
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
