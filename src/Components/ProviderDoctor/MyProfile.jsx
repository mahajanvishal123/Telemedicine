import React, { useState, useEffect, useRef } from 'react';

const MyProfile = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Get profile image from localStorage if available, otherwise use default
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem('profileImage') || 'https://via.placeholder.com/150'
  );
  
  const fileInputRef = useRef(null);
  
  const [profileData, setProfileData] = useState({
    fullName: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    specialty: 'Cardiology',
    bio: 'Board-certified cardiologist with over 10 years of experience. Specializing in preventive cardiology and heart disease management.',
    consultationFee: 150
  });

  const specialties = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Psychiatry',
    'Oncology',
    'Endocrinology'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target.result;
        setProfileImage(imageDataUrl);
        // Save to localStorage for persistence
        localStorage.setItem('profileImage', imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Save profile data to localStorage
    localStorage.setItem('profileData', JSON.stringify(profileData));
    localStorage.setItem('isAvailable', isAvailable.toString());
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1500);
  };

  // Load saved data on component mount
  useEffect(() => {
    const savedProfileData = localStorage.getItem('profileData');
    const savedAvailability = localStorage.getItem('isAvailable');
    
    if (savedProfileData) {
      setProfileData(JSON.parse(savedProfileData));
    }
    
    if (savedAvailability) {
      setIsAvailable(savedAvailability === 'true');
    }
  }, []);

  // Animation effect for section entrance
  useEffect(() => {
    const elements = document.querySelectorAll('.profile-section');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animate-in');
      }, 100 * index);
    });
  }, []);

  return (
    <div className="">
      <div className="">
        <div className="">
          {/* Header Section */}
          <div className="mb-4">
            <h1 className="h3 fw-bold mb-2">My Profile</h1>
            <p className="text-muted mb-0">Manage your professional information and availability</p>
          </div>
          
          <div className="card shadow-sm border-0 overflow-hidden">
            <div className="card-header py-3">
              <h2 className="h5 mb-0">Professional Profile</h2>
            </div>
            
            <div className="card-body p-3 p-md-4">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Left Column - Form Fields */}
                  <div className="col-md-7 order-2 order-md-1">
                    <div className="profile-section">
                      <div className="mb-3">
                        <label htmlFor="fullName" className="form-label fw-semibold">Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="fullName"
                          name="fullName"
                          value={profileData.fullName}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>
                    
                    <div className="profile-section">
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>
                    
                    <div className="profile-section">
                      <div className="mb-3">
                        <label htmlFor="phone" className="form-label fw-semibold">Phone Number</label>
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                    
                    <div className="profile-section">
                      <div className="mb-3">
                        <label htmlFor="specialty" className="form-label fw-semibold">Specialty</label>
                        <select
                          className="form-select"
                          id="specialty"
                          name="specialty"
                          value={profileData.specialty}
                          onChange={handleInputChange}
                        >
                          {specialties.map((spec, index) => (
                            <option key={index} value={spec}>{spec}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="profile-section">
                      <div className="mb-3">
                        <label htmlFor="consultationFee" className="form-label fw-semibold">Consultation Fee ($)</label>
                        <input
                          type="number"
                          className="form-control"
                          id="consultationFee"
                          name="consultationFee"
                          value={profileData.consultationFee}
                          onChange={handleInputChange}
                          placeholder="Set your consultation fee"
                        />
                      </div>
                    </div>
                    
                    <div className="profile-section">
                      <div className="mb-3">
                        <label htmlFor="bio" className="form-label fw-semibold">Bio</label>
                        <textarea
                          className="form-control"
                          id="bio"
                          name="bio"
                          rows="4"
                          value={profileData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell patients about your background and expertise"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - Profile Picture & Availability */}
                  <div className="col-md-5 order-1 order-md-2">
                    <div className="profile-section">
                      <div className="text-center mb-3">
                        <div className="position-relative d-inline-block">
                          <div className="profile-img-container">
                            <img
                              src={profileImage}
                              className="rounded-circle img-thumbnail profile-img"
                              alt="Profile"
                              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            />
                            <div className="profile-overlay rounded-circle">
                              <label htmlFor="profileUpload" className="profile-upload-btn">
                                <i className="fas fa-camera"></i>
                                <input 
                                  type="file" 
                                  id="profileUpload" 
                                  ref={fileInputRef}
                                  className="d-none" 
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                />
                              </label>
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="mb-1 fw-semibold small">Profile Picture</p>
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => fileInputRef.current.click()}
                            >
                              Upload New Photo
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="profile-section">
                      <div className="availability-container p-3 rounded-3 shadow-sm mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h5 className="fw-bold mb-1 small">Availability Status</h5>
                            <p className="text-muted small mb-0">
                              {isAvailable ? 'Available for consultations' : 'Not available for consultations'}
                            </p>
                          </div>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="availabilityToggle"
                              checked={isAvailable}
                              onChange={() => setIsAvailable(!isAvailable)}
                              style={{ 
                                backgroundColor: isAvailable ? '#F95918' : '#ccc', 
                                borderColor: '#F95918',
                                width: '2.5rem',
                                height: '1.25rem'
                              }}
                            />
                          </div>
                        </div>
                        
                        <div className={`status-indicator mt-2 ${isAvailable ? 'available' : 'unavailable'}`}>
                          <span className="status-dot"></span>
                          <span className="status-text small">
                            {isAvailable ? 'Available' : 'Not Available'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="profile-section">
                      <div className="d-grid mt-3 mb-3">
                        <button
                          type="submit"
                          className="btn text-white py-2 fw-bold save-btn"
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Saving...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </button>
                        
                        {saveSuccess && (
                          <div className="alert alert-success mt-2 d-flex align-items-center small py-2" role="alert">
                            <i className="fas fa-check-circle me-2"></i>
                            Profile updated successfully!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .profile-section {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .profile-section.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .profile-img-container {
          position: relative;
          display: inline-block;
        }
        
        .profile-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .profile-img-container:hover .profile-overlay {
          opacity: 1;
        }
        
        .profile-upload-btn {
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        
        .profile-upload-btn:hover {
          transform: scale(1.2);
        }
        
        .profile-img {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .profile-img-container:hover .profile-img {
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(249, 89, 24, 0.4);
        }
        
        .availability-container {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-left: 3px solid #F95918;
        }
        
        .status-indicator {
          display: flex;
          align-items: center;
          font-weight: 600;
        }
        
        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 8px;
        }
        
        .status-indicator.available .status-dot {
          background-color: #28a745;
          box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.3);
        }
        
        .status-indicator.unavailable .status-dot {
          background-color: #dc3545;
          box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.3);
        }
        
        .save-btn {
          background: #F95918;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .save-btn:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.7s ease;
        }
        
        .save-btn:hover:before {
          left: 100%;
        }
        
        .save-btn:hover {
          background: #e04f15;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(249, 89, 24, 0.4);
        }
        
        .form-control, .form-select {
          transition: all 0.3s ease;
          border: 1px solid #dee2e6;
          padding: 0.5rem 0.75rem;
          font-size: 0.9rem;
        }
        
        .form-control:focus, .form-select:focus {
          border-color: #F95918;
          box-shadow: 0 0 0 0.2rem rgba(249, 89, 24, 0.25);
        }
        
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1) !important;
        }
        
        .alert {
          animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MyProfile;