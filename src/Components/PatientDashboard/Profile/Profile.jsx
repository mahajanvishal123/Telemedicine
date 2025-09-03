import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.css';

const Profile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setPreviewUrl(null);
    fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle form submission including the image
    console.log("Form submitted with image:", profileImage);
    alert('Profile updated successfully!');
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        {/* Red Header Section */}
        <div className="card-header  text-dark py-3">
          <h4 className="mb-1 dashboard-heading">Personal Information</h4>
          <p className="mb-0">Keep your profile up to date for better healthcare experience.</p>
        </div>
        
        <div className="card-body p-4">
          {/* Profile Photo Section */}
          <div className="text-center mb-4">
            <div className="profile-photo-container position-relative d-inline-block">
              <div 
                className="profile-photo rounded-circle d-flex align-items-center justify-content-center"
                onClick={handleImageClick}
                style={{
                  backgroundImage: previewUrl ? `url(${previewUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  cursor: 'pointer'
                }}
              >
                {!previewUrl && (
                  <i className="bi bi-camera-fill camera-icon text-white fs-1"></i>
                )}
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
                  className="btn btn-sm btn-danger position-absolute rounded-circle p-0"
                  style={{ bottom: '5px', right: '5px', width: '28px', height: '28px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
            <p className="text-muted mt-2 mb-0">Click the camera icon to upload a new photo</p>
          </div>
          
          {/* Form Section */}
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Full Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  defaultValue="John Smith" 
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Email Address *</label>
                <input 
                  type="email" 
                  className="form-control" 
                  defaultValue="john.smith@example.com" 
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Phone Number *</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  defaultValue="(555) 123-4567" 
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Date of Birth *</label>
                <input 
                  type="date" 
                  className="form-control" 
                  defaultValue="1990-05-15" 
                  required
                />
              </div>
            </div>
            
            {/* Additional Information Section */}
            <h5 className="mt-4 mb-3 fw-bold">Additional Information</h5>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Account Status</label>
                <input 
                  type="text" 
                  className="form-control" 
                  defaultValue="Active" 
                  disabled 
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Member Since</label>
                <input 
                  type="text" 
                  className="form-control" 
                  defaultValue="Jan 2024" 
                  disabled 
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Plan</label>
                <input 
                  type="text" 
                  className="form-control" 
                  defaultValue="Premium" 
                  disabled 
                />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="d-flex justify-content-end mt-4">
              <button type="button" className="btn btn-outline-secondary me-2 px-4">Cancel</button>
              <button type="submit" className="btn btn-danger px-4">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;