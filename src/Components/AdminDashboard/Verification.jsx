import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Base_Url from "../../Baseurl/Baseurl"

const Verification = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Function to format opening/closing time (e.g., "10" + "6" → "10:00 AM - 6:00 PM")
  const formatOpeningHours = (open, close) => {
    const openHour = parseInt(open);
    const closeHour = parseInt(close);
    const ampmOpen = openHour >= 12 ? (openHour === 12 ? "12" : openHour - 12) : openHour;
    const ampmClose = closeHour >= 12 ? (closeHour === 12 ? "12" : closeHour - 12) : closeHour;
    const periodOpen = openHour >= 12 ? "PM" : "AM";
    const periodClose = closeHour >= 12 ? "PM" : "AM";
    return `${ampmOpen}:00 ${periodOpen} - ${ampmClose}:00 ${periodClose}`;
  };

 
  const getFileNameFromUrl = (url) => {
    if (!url) return 'No document';
    return url.split('/').pop().split('?')[0]; // Remove query params if any
  };

  const transformDoctorData = (apiDoctor) => ({
    id: apiDoctor._id,
    profile: apiDoctor.profile || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    name: apiDoctor.name || 'Unknown',
    gender: apiDoctor.gender || 'Not specified',
    email: apiDoctor.email || 'N/A',
    specialty: apiDoctor.specialty || 'N/A',
    license: apiDoctor.licenseNo || 'N/A',
    signupDate: new Date(apiDoctor.createdAt).toLocaleDateString('en-CA'), // Format: YYYY-MM-DD
    availableDays: apiDoctor.availableDay?.replace(/\s+/g, '-') || 'N/A', // "Mon - Fri" → "Mon-Fri"
    openingClosingTime: apiDoctor.openingTime && apiDoctor.closingTime
      ? formatOpeningHours(apiDoctor.openingTime, apiDoctor.closingTime)
      : 'N/A',
    experience: apiDoctor.experience || 'N/A',
    consultationFee: apiDoctor.fee ? `$${apiDoctor.fee}` : '$0',
    documents: apiDoctor.documents ? [getFileNameFromUrl(apiDoctor.documents)] : ['No document uploaded'],
  });

  // Fetch doctors from API on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${Base_Url}/doctor`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Optional: if auth required
          },
        });
        const pendingDoctors = response.data.filter(doc => !doc.isVerify); // Only pending verifications
        const transformed = pendingDoctors.map(transformDoctorData);
        setDoctors(transformed);
        setError(null);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctor verification data. Please try again later.');
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Handle approval of a doctor
  const handleApprove = async (doctorId) => {
    try {
      await axios.put(`${API_BASE_URL}/doctors/${doctorId}/approve`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
    } catch (err) {
      console.error('Approval failed:', err);
      alert('Failed to approve doctor. Please try again.');
    }
  };

  // Handle rejection of a doctor
  const handleReject = async (doctorId) => {
    try {
      await axios.put(`${API_BASE_URL}/doctors/${doctorId}/reject`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
    } catch (err) {
      console.error('Rejection failed:', err);
      alert('Failed to reject doctor. Please try again.');
    }
  };

  // View documents (opens in new tab)
  const viewDocuments = (documents) => {
    if (!documents || documents.length === 0) {
      alert('No document available.');
      return;
    }
    const fileUrl = documents[0]; // In real app, this should be the full URL
    // If you have the actual file URL stored in API, use it here instead of filename
    // For now, we assume filename is just for display; actual link might be in API doc field
    alert(`Document: ${documents[0]}\n\nIn a real app, this would open: ${fileUrl}`);
    // Uncomment below if you want to open actual URL (if stored in API):
    // window.open(fileUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="dashboard-heading">Verification</h3>
      </div>

      {/* Info Card */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm" style={{ borderLeft: `4px solid #F95918` }}>
            <div className="card-body">
              <h5 className="card-title" style={{ color: '#F95918' }}>Pending Verifications</h5>
              <p className="card-text">
                This section displays doctors who have signed up but not been approved yet.
                Review their information and documents before approving or rejecting their application.
              </p>
              <p className="card-text mb-0">
                <strong>Total pending verifications:</strong> {doctors.length} doctors
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow">
            <div className="card-header">
              <h5 className="mb-0">Doctors Awaiting Approval</h5>
            </div>
            <div className="card-body">
              {doctors.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
                  <h5>All doctors have been verified!</h5>
                  <p className="text-muted">There are no pending verification requests.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover" width="100%" cellSpacing="0">
                    <thead>
                      <tr>
                        <th>Doctor ID</th>
                        <th>Profile</th>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Email</th>
                        <th>Specialty</th>
                        <th>License No.</th>
                        <th>Signup Date</th>
                        <th>Available Days</th>
                        <th>Opening-Closing Time</th>
                        <th>Experience</th>
                        <th>Consultation Fee</th>
                        <th>Documents</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map(doctor => (
                        <tr key={doctor.id}>
                          <td>#{doctor.id}</td>
                          <td>
                            <img src={doctor.profile} alt="Profile" className="img-fluid rounded-circle" style={{ width: '50px', height: '50px' }} />
                          </td>
                          <td>
                            <strong>{doctor.name}</strong>
                          </td>
                          <td>{doctor.gender}</td>
                          <td>{doctor.email}</td>
                          <td>
                            <span className="badge bg-secondary">{doctor.specialty}</span>
                          </td>
                          <td>{doctor.license}</td>
                          <td>{doctor.signupDate}</td>
                          <td>{doctor.availableDays}</td>
                          <td>{doctor.openingClosingTime}</td>
                          <td>{doctor.experience}</td>
                          <td>{doctor.consultationFee}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => viewDocuments(doctor.documents)}
                            >
                              <i className="fas fa-file-alt"></i> View Documents
                            </button>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-success flex-fill"
                                onClick={() => handleApprove(doctor.id)}
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger flex-fill"
                                onClick={() => handleReject(doctor.id)}
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="row mt-4">
        <div className="col-12 col-sm-6 col-md-4 mb-3">
          <div
            style={{
              backgroundColor: "#e3f2fd",
              color: "#0d47a1",
              textAlign: "center",
              borderRadius: "12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              padding: "20px",
              height: "100%",
            }}
          >
            <h5 style={{ fontWeight: "600" }}>Total Verified</h5>
            <h2 style={{ fontWeight: "700" }}>42</h2>
            <p>Doctors</p>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-4 mb-3">
          <div
            style={{
              backgroundColor: "#fff8e1",
              color: "#f57f17",
              textAlign: "center",
              borderRadius: "12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              padding: "20px",
              height: "100%",
            }}
          >
            <h5 style={{ fontWeight: "600" }}>Pending Verification</h5>
            <h2 style={{ fontWeight: "700" }}>{doctors.length}</h2>
            <p>Doctors</p>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-4 mb-3">
          <div
            style={{
              backgroundColor: "#ffebee",
              color: "#b71c1c",
              textAlign: "center",
              borderRadius: "12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              padding: "20px",
              height: "100%",
            }}
          >
            <h5 style={{ fontWeight: "600" }}>Rejected</h5>
            <h2 style={{ fontWeight: "700" }}>8</h2>
            <p>Applications</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;