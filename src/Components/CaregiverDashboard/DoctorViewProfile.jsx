// DoctorViewProfile.jsx
import React, { useState } from 'react';

const DoctorViewProfile = () => {
  // Sample doctor data (would typically come from props or API)
  const [doctorData, setDoctorData] = useState({
    fullName: "Dr. Vighnraj Gurjar",
    email: "sarah.johnson@example.com",
    phoneNumber: "+1 (555) 123-4567",
    specialty: "Neurology",
    consultationFee: 150,
    bio: "Dr. Vighnraj Gurjar is a renowned neurologist with over 15 years of experience...",
    availability: "Available for consultations",
    profilePicture: "https://via.placeholder.com/150",
    password: "" // Add password field
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Handle Save Changes with SweetAlert (Centered Modal by Default)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate API call or validation
    try {
      // Example: Validate required fields
      if (!doctorData.fullName.trim()) {
        throw new Error("Full Name is required.");
      }
      if (!doctorData.email.trim()) {
        throw new Error("Email is required.");
      }

      // 💡 In real app: await axios.put('/api/doctor/profile', doctorData)

      // ✅ Show Success Alert — CENTERED MODAL BY DEFAULT
      Swal.fire({
        icon: 'success',
        title: '✅ Updated Successfully!',
        text: 'Your profile has been successfully updated.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-success'
        },
        // Optional: Add animation or auto-close
        // timer: 2000,
        // showConfirmButton: false
      });

      // 🔄 Optional: Reset password field after save
      setDoctorData(prev => ({
        ...prev,
        password: "" // Clear password after save for security
      }));

    } catch (err) {
      // ❌ Show Error Alert — ALSO CENTERED
      Swal.fire({
        icon: 'error',
        title: '❌ Update Failed',
        text: err.message || "Something went wrong. Please try again.",
        confirmButtonText: 'Try Again',
        customClass: {
          confirmButton: 'btn btn-danger'
        }
      });
    }
  };

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header healthcare-btn-primary text-white text-center py-2">
              <h4 className="dashboard-heading">My Profile</h4>
              <small>Manage your professional information and availability</small>
            </div>
            
            {/* ✅ Wrap form around content */}
            <form onSubmit={handleSubmit}>
              <div className="card-body p-4">
                <h5 className="card-title mb-4">Professional Profile</h5>
                
                <div className="row mb-4">
                  <div className="col-md-4 text-center">
                    <img 
                      src={doctorData.profilePicture} 
                      alt="Profile" 
                      className="img-fluid rounded-circle mb-2"
                      style={{width: '120px', height: '120px', objectFit: 'cover'}}
                    />
                    <div className="text-muted small">Profile Picture</div>
                  </div>
                  
                  <div className="col-md-8">
                    <div className="row mb-3">
                      <div className="col-sm-4">
                        <strong className="small">Full Name</strong>
                      </div>
                      <div className="col-sm-8">
                        <input 
                          type="text" 
                          className="form-control form-control-sm" 
                          name="fullName"
                          value={doctorData.fullName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="row mb-3">
                      <div className="col-sm-4">
                        <strong className="small">Email Address</strong>
                      </div>
                      <div className="col-sm-8">
                        <input 
                          type="email" 
                          className="form-control form-control-sm" 
                          name="email"
                          value={doctorData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Enhanced Mobile Number Field */}
                    <div className="row mb-3">
                      <div className="col-sm-4">
                        <strong className="small">Phone Number</strong>
                      </div>
                      <div className="col-sm-8">
                        <input 
                          type="tel" 
                          className="form-control form-control-lg"
                          style={{ fontSize: '1.1rem' }}
                          name="phoneNumber"
                          value={doctorData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    
                    <div className="row mb-3">
                      <div className="col-sm-4">
                        <strong className="small">Specialty</strong>
                      </div>
                      <div className="col-sm-8">
                        <input 
                          type="text" 
                          className="form-control form-control-sm" 
                          name="specialty"
                          value={doctorData.specialty}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="row mb-3">
                      <div className="col-sm-4">
                        <strong className="small">Consultation Fee ($)</strong>
                      </div>
                      <div className="col-sm-8">
                        <input 
                          type="number" 
                          className="form-control form-control-sm" 
                          name="consultationFee"
                          value={doctorData.consultationFee}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Password Field with Toggle */}
                    <div className="row mb-3">
                      <div className="col-sm-4">
                        <strong className="small">Password</strong>
                      </div>
                      <div className="col-sm-8 position-relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          className="form-control form-control-sm pe-5" 
                          name="password"
                          value={doctorData.password}
                          onChange={handleInputChange}
                          placeholder="Enter new password"
                        />
                        <span 
                          className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
                          style={{ cursor: 'pointer' }}
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <i className="bi bi-eye-slash"></i>
                          ) : (
                            <i className="bi bi-eye"></i>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <strong className="small d-block mb-2">Bio</strong>
                  <textarea 
                    className="form-control" 
                    rows="3"
                    name="bio"
                    value={doctorData.bio}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <strong className="small d-block mb-2">Availability Status</strong>
                  <select 
                    className="form-select form-select-sm w-auto"
                    name="availability"
                    value={doctorData.availability}
                    onChange={handleInputChange}
                  >
                    <option value="Available for consultations">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>

                <div className="text-end">
                  <button type="submit" className="btn btn-primary px-4">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorViewProfile;