import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import './Profile.css';

const Profile = () => {
  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        {/* Red Header Section */}
        <div className="card-header  text-dark py-3">
          <h4 className="mb-1 fw-bold">Personal Information</h4>
          <p className="mb-0">Keep your profile up to date for better healthcare experience.</p>
        </div>
        
        <div className="card-body p-4">
          {/* Profile Photo Section */}
          <div className="text-center mb-4">
            <div className="profile-photo-container position-relative d-inline-block">
              <div className="profile-photo  rounded-circle d-flex align-items-center justify-content-center">
                <i className="bi bi-camera-fill camera-icon text-white"></i>
              </div>
            </div>
            <p className="text-muted mt-2 mb-0">Click the camera icon to upload a new photo</p>
          </div>
          
          {/* Form Section */}
          <form>
            <div className="row mb-3">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Full Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  defaultValue="John Smith" 
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Email Address *</label>
                <input 
                  type="email" 
                  className="form-control" 
                  defaultValue="john.smith@example.com" 
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Phone Number *</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  defaultValue="(555) 123-4567" 
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Date of Birth *</label>
                <input 
                  type="date" 
                  className="form-control" 
                  defaultValue="1990-05-15" 
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