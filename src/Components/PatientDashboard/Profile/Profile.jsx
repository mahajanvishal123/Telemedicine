import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faUserCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import './Profile.css';

const Profile = () => {
  // State for form data
  const [profileData, setProfileData] = useState({
    fullName: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    dob: "1990-05-15",
    bloodGroup: "O+",
    password: "",
    avatar: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Auto-calculate age when DOB changes
  useEffect(() => {
    if (profileData.dob) {
      const calculateAge = (dobString) => {
        const today = new Date();
        const birthDate = new Date(dobString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      };
      setProfileData(prev => ({
        ...prev,
        age: calculateAge(profileData.dob)
      }));
    }
  }, [profileData.dob]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
        setProfileData((prev) => ({
          ...prev,
          avatar: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove uploaded image
  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setPreviewUrl(null);
    setProfileData((prev) => ({
      ...prev,
      avatar: null,
    }));
    fileInputRef.current.value = '';
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
    console.log("Updated Profile Data:", profileData);
    // Here you can call API to save data
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0 rounded-3">
            {/* Header */}
            <div className="card-header bg-danger text-white py-4">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  {previewUrl || profileData.avatar ? (
                    <img
                      src={previewUrl || profileData.avatar}
                      alt="Profile"
                      width="70"
                      height="70"
                      className="rounded-circle border border-3 border-white"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      size="3x"
                      className="text-white"
                    />
                  )}
                </div>
                <div>
                  <h4 className="mb-1">Personal Information</h4>
                  <p className="mb-0 opacity-75">Keep your profile up to date for better healthcare experience.</p>
                </div>
              </div>
            </div>

            <div className="card-body p-4">
              {/* Profile Photo Upload Section */}
              <div className="text-center mb-5">
                <div
                  className="d-inline-block position-relative"
                  onClick={handleImageClick}
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto"
                    style={{
                      width: '150px',
                      height: '150px',
                      backgroundImage: previewUrl || profileData.avatar ? `url(${previewUrl || profileData.avatar})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: '4px solid #f8f9fa',
                    }}
                  >
                    {!(previewUrl || profileData.avatar) && (
                      <FontAwesomeIcon icon={faUserCircle} size="5x" className="text-secondary" />
                    )}
                  </div>
                  <div className="position-absolute bottom-0 end-0 bg-danger text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <FontAwesomeIcon icon={faCamera} />
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="d-none"
                />
                {previewUrl && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger mt-2"
                    onClick={handleRemoveImage}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Remove Photo
                  </button>
                )}
                <p className="text-muted mt-2 mb-0 small">Click profile picture to upload a new photo</p>
              </div>

              {/* Editable Form */}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Full Name */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Full Name *</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Email Address *</label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Date of Birth *</label>
                    <input
                      type="date"
                      className="form-control form-control-lg"
                      name="dob"
                      value={profileData.dob}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Age (Auto-calculated, non-editable) */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Age</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={profileData.age || ''}
                      disabled
                    />
                  </div>

                  {/* Blood Group */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Blood Group *</label>
                    <select
                      className="form-select form-select-lg"
                      name="bloodGroup"
                      value={profileData.bloodGroup}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  {/* Password (Optional) */}
                  <div className="col-12">
                    <label className="form-label fw-bold">Change Password (optional)</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      name="password"
                      value={profileData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <hr className="my-4" />


                {/* Action Buttons */}
                <div className="d-flex justify-content-end gap-3 flex-wrap">
                  <button type="button" className="btn btn-lg btn-outline-secondary px-4">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-lg btn-danger px-5">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;