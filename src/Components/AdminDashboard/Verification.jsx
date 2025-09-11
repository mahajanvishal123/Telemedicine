import React, { useState } from 'react';

const Verification = () => {
  // Sample data for doctors awaiting approval
 const [doctors, setDoctors] = useState([
    {
      id: 1,
      profile: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
      name: 'Dr. Sarah Wilson',
      gender:'Female',
      email: 'sarah@example.com',
      specialty: 'Cardiology',
      license: 'MD12345',
      signupDate: '2023-10-15',
      // UPDATED FIELDS
      availableDays: 'Mon-Sat',
      openingClosingTime: '9:00 AM - 5:00 PM',
      experience: '8 years',
      documents: ['medical_license.pdf', 'id_proof.pdf']
    },
    {
      id: 2,
      profile: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
      name: 'Dr. James Miller',
      gender:'Male',
      email: 'james@example.com',
      specialty: 'Pediatrics',
      license: 'MD67890',
      signupDate: '2023-10-18',
      // UPDATED FIELDS
      availableDays: 'Mon-Fri',
      openingClosingTime: '10:00 AM - 6:00 PM',
      experience: '5 years',
      documents: ['medical_certificate.pdf', 'resume.pdf']
    },
    {
      id: 3,
      profile: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
      name: 'Dr. Lisa Taylor',
      gender:'Female',
      email: 'lisa@example.com',
      specialty: 'Dermatology',
      license: 'MD54321',
      signupDate: '2023-10-20',
      // UPDATED FIELDS
      availableDays: 'Tue-Sun',
      openingClosingTime: '8:00 AM - 4:00 PM',
      experience: '10 years',
      documents: ['license_copy.pdf', 'degree_certificate.pdf']
    },
    {
      id: 4,
      profile: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
      name: 'Dr. David Clark',
      gender:'Male',
      email: 'david@example.com',
      specialty: 'Orthopedics',
      license: 'MD09876',
      signupDate: '2023-10-22',
      // UPDATED FIELDS
      availableDays: 'Mon-Sat',
      openingClosingTime: '11:00 AM - 7:00 PM',
      experience: '7 years',
      documents: ['certification.pdf', 'id_card.pdf']
    }
  ]);

  // Function to handle approval of a doctor
  const handleApprove = (doctorId) => {
    setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
    // In a real application, you would also update the backend
  };

  // Function to handle rejection of a doctor
  const handleReject = (doctorId) => {
    setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
    // In a real application, you would also update the backend
  };

  // Function to view documents (would typically open a modal or new tab)
  const viewDocuments = (documents) => {
    alert(`Documents available: ${documents.join(', ')}\n\nIn a real application, this would open a document viewer.`);
  };

  return (
    <div className="">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center">
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
                        {/* NEW COLUMNS ADDED IN HEADER */}
                        <th>Available Days</th>
                        <th>Opening-Closing Time</th>
                        <th>Experience</th>
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
                          <td>
                            {doctor.gender}
                          </td>
                          <td>{doctor.email}</td>
                          <td>
                            <span className="badge bg-secondary">{doctor.specialty}</span>
                          </td>
                          <td>{doctor.license}</td>
                          <td>{doctor.signupDate}</td>
                          {/* NEW COLUMNS ADDED IN BODY */}
                          <td>{doctor.availableDays}</td>
                          <td>{doctor.openingClosingTime}</td>
                          <td>{doctor.experience}</td>
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
        backgroundColor: "#e3f2fd", // light blue
        color: "#0d47a1",
        textAlign: "center",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        padding: "20px",
        height: "100%", // equal height cards
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
        backgroundColor: "#fff8e1", // light yellow
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
        backgroundColor: "#ffebee", // light red/pink
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