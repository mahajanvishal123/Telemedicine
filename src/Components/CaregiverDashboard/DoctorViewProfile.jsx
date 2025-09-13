// DoctorViewProfile.jsx
import React from 'react';

const DoctorViewProfile = () => {
  // Sample doctor data (would typically come from props or API)
  const doctorData = {
    fullName: "Dr. Vighnraj Gurjar",
    email: "sarah.johnson@example.com",
    phoneNumber: "+1 (555) 123-4567",
    specialty: "Neurology",
    consultationFee: 150,
    bio: "Dr. Vighnraj Gurjar is a renowned neurologist with over 15 years of experience...",
    availability: "Available for consultations",
    profilePicture: "https://via.placeholder.com/150"
  };

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header healthcare-btn-primary text-white text-center py-2">
              <h4 className="dashboard-heading">My Profile</h4>
              <small>Manage your professional information and availability</small>
            </div>
            
            <div className="card-body p-3">
              <h5 className="card-title mb-3">Professional Profile</h5>
              
              <div className="row mb-3">
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
                  <div className="row mb-2">
                    <div className="col-sm-4">
                      <strong className="small">Full Name</strong>
                    </div>
                    <div className="col-sm-8">
                      <span className="small">{doctorData.fullName}</span>
                    </div>
                  </div>
                  
                  <div className="row mb-2">
                    <div className="col-sm-4">
                      <strong className="small">Email Address</strong>
                    </div>
                    <div className="col-sm-8">
                      <span className="small">{doctorData.email}</span>
                    </div>
                  </div>
                  
                  <div className="row mb-2">
                    <div className="col-sm-4">
                      <strong className="small">Phone Number</strong>
                    </div>
                    <div className="col-sm-8">
                      <span className="small">{doctorData.phoneNumber}</span>
                    </div>
                  </div>
                  
                  <div className="row mb-2">
                    <div className="col-sm-4">
                      <strong className="small">Specialty</strong>
                    </div>
                    <div className="col-sm-8">
                      <span className="small">{doctorData.specialty}</span>
                    </div>
                  </div>
                  
                  <div className="row mb-2">
                    <div className="col-sm-4">
                      <strong className="small">Consultation Fee ($)</strong>
                    </div>
                    <div className="col-sm-8">
                      <span className="small">{doctorData.consultationFee}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <strong className="small">Bio</strong>
                <div className="mt-1 p-2 bg-light rounded small">
                  {doctorData.bio}
                </div>
              </div>
              
              <div className="mb-2">
                <strong className="small">Availability Status</strong>
                <div className="mt-1">
                  <span className="badge bg-success small">{doctorData.availability}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorViewProfile;