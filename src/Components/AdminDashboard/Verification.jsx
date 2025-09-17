import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Base_Url from "../../Baseurl/Baseurl";

const Verification = () => {
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState(null);

  // 🔹 Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // 🔹 Filter states
  const [filterName, setFilterName] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");

  // Fetch ALL doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${Base_Url}/doctor`);

        if (!response?.data) {
          throw new Error("Server returned empty response.");
        }

        let doctorsData;
        if (Array.isArray(response.data)) {
          doctorsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          doctorsData = response.data.data;
        } else {
          console.warn("Unexpected API response:", response.data);
          throw new Error("Server returned data in an unexpected format.");
        }

        setAllDoctors(doctorsData);

      } catch (err) {
        console.error("Error fetching doctors:", err);

        if (err.response?.status === 401) {
          setError("Authentication failed. Please log in again.");
        } else if (err.response?.status === 404) {
          setError("The endpoint '/api/doctor' was not found. Check server configuration.");
        } else if (err.response?.data?.error) {
          setError(err.response.data.error + ": " + (err.response.data.message || ""));
        } else if (err.request) {
          setError("Network error. Please check your connection.");
        } else {
          setError("Failed to load doctors. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Derived Stats
  const pendingDoctors = allDoctors.filter(
    doctor => doctor.isVerify === "0" || doctor.isVerify === false || doctor.isVerify === "false"
  );

  const verifiedDoctors = allDoctors.filter(
    doctor => doctor.isVerify === "1" || doctor.isVerify === true || doctor.isVerify === "true"
  );

  const rejectedDoctors = allDoctors.filter(
    doctor => doctor.isVerify === "2"
  );

  // 🔹 Extract unique specialties from PENDING doctors
  const specialties = [...new Set(pendingDoctors.map(d => d.specialty).filter(Boolean))];

  // 🔹 Apply Filters to PENDING doctors
  const filteredPendingDoctors = pendingDoctors.filter(doctor => {
    const matchesName = filterName
      ? doctor.name.toLowerCase().includes(filterName.toLowerCase())
      : true;

    const matchesSpecialty = filterSpecialty === "all"
      ? true
      : doctor.specialty === filterSpecialty;

    return matchesName && matchesSpecialty;
  });

  // 🔹 Pagination Logic — Applied to FILTERED pending doctors
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows =
    rowsPerPage === "All" ? filteredPendingDoctors : filteredPendingDoctors.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages =
    rowsPerPage === "All" ? 1 : Math.ceil(filteredPendingDoctors.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 🔹 Reset Filters
  const resetFilters = () => {
    setFilterName("");
    setFilterSpecialty("all");
    setCurrentPage(1);
  };

  // Handle approve action
  const handleApprove = async (doctorId) => {
    try {
      await axios.put(`${Base_Url}/doctor/${doctorId}`, {
        isVerify: "1",
      });

      setAllDoctors(prev =>
        prev.map(doctor =>
          doctor._id === doctorId ? { ...doctor, isVerify: "1" } : doctor
        )
      );

      Swal.fire({
        icon: 'success',
        title: 'Approved!',
        text: 'Doctor has been successfully approved.',
        timer: 2000,
        showConfirmButton: false,
        position: 'center',
        background: '#e8f5e9',
        color: '#2e7d32',
        heightAuto: false,
        width: '300px',
        padding: '20px',
        willClose: () => {},
      });
    } catch (err) {
      console.error("Error approving doctor:", err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to approve doctor. Please try again.',
        timer: 2500,
        showConfirmButton: false,
        position: 'center',
        background: '#ffebee',
        color: '#c62828',
        heightAuto: false,
        width: '300px',
        padding: '20px',
        willClose: () => {},
      });
    }
  };

  // Handle reject action
  const handleReject = async (doctorId) => {
    try {
      await axios.put(`${Base_Url}/doctor/${doctorId}`, {
        isVerify: "2",
      });

      setAllDoctors(prev =>
        prev.map(doctor =>
          doctor._id === doctorId ? { ...doctor, isVerify: "2" } : doctor
        )
      );

      Swal.fire({
        icon: 'success',
        title: 'Rejected!',
        text: 'Doctor has been successfully rejected.',
        timer: 2000,
        showConfirmButton: false,
        position: 'center',
        background: '#ffebee',
        color: '#c62828',
        heightAuto: false,
        width: '300px',
        padding: '20px',
        willClose: () => {},
      });
    } catch (err) {
      console.error("Error rejecting doctor:", err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to reject doctor. Please try again.',
        timer: 2500,
        showConfirmButton: false,
        position: 'center',
        background: '#ffebee',
        color: '#c62828',
        heightAuto: false,
        width: '300px',
        padding: '20px',
        willClose: () => {},
      });
    }
  };

  // View documents
  const viewDocuments = (documents) => {
    if (!documents || typeof documents !== 'string') {
      Swal.fire({
        icon: 'warning',
        title: 'No Documents',
        text: 'No documents available.',
        timer: 1500,
        showConfirmButton: false,
        position: 'center',
        background: '#fff3e0',
        color: '#e65100',
        heightAuto: false,
        width: '280px',
        padding: '16px',
      });
      return;
    }

    const trimmed = documents.trim();

    if (!trimmed) {
      Swal.fire({
        icon: 'warning',
        title: 'No Documents',
        text: 'No documents available.',
        timer: 1500,
        showConfirmButton: false,
        position: 'center',
        background: '#fff3e0',
        color: '#e65100',
        heightAuto: false,
        width: '280px',
        padding: '16px',
      });
      return;
    }

    const docList = trimmed.includes(',')
      ? trimmed.split(',').map(d => d.trim()).filter(d => d)
      : [trimmed];

    setSelectedDocuments(docList);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="container-fluid">
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
                <strong>Total pending verifications:</strong> {pendingDoctors.length} doctors
              </p>
            </div>
          </div>
        </div>
      </div>

     <div className="row">
 {/* Entries dropdown */}
      <div className="d-flex justify-content-between align-items-center mb-3 col-md-3">
        <div>
          <label className="me-2">Show</label>
          <select
            className="form-select d-inline-block w-auto"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(e.target.value === "All" ? "All" : parseInt(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="8">8</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="All">All</option>
          </select>
          <span className="ms-2">entries</span>
        </div>
      </div>

       {/* 🔹 FILTERS SECTION */}
      <div className="card shadow-sm mb-4 col-md-9">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                id="filterName"
                placeholder="Search by doctor name..."
                value={filterName}
                onChange={(e) => {
                  setFilterName(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="col-md-5">
              <select
                className="form-select"
                id="filterSpecialty"
                value={filterSpecialty}
                onChange={(e) => {
                  setFilterSpecialty(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Specialties</option>
                {specialties.map((spec, i) => (
                  <option key={i} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={resetFilters}
            >
              <i className="fas fa-sync me-1"></i> Reset Filters
            </button>
          
          </div>
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
              {pendingDoctors.length === 0 ? (
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
                      {currentRows.length === 0 ? (
                        <tr>
                          <td colSpan="14" className="text-center py-4">No pending doctors found matching your filters.</td>
                        </tr>
                      ) : (
                        currentRows.map((doctor, index) => (
                          <tr key={doctor._id}>
                            <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                            <td>
                              <img
                                src={(doctor.profile || '').trim() || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}
                                alt="Profile"
                                className="img-fluid rounded-circle"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                            </td>
                            <td><strong>{doctor.name}</strong></td>
                            <td>{doctor.gender || 'N/A'}</td>
                            <td>{doctor.email}</td>
                            <td><span className="badge bg-secondary">{doctor.specialty}</span></td>
                            <td>{doctor.licenseNo}</td>
                            <td>{new Date(doctor.createdAt).toLocaleDateString()}</td>
                            <td>{doctor.availableDay || 'N/A'}</td>
                            <td>{doctor.openingTime} - {doctor.closingTime}</td>
                            <td>{doctor.experience}</td>
                            <td>${doctor.fee}</td>
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
                                  onClick={() => handleApprove(doctor._id)}
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger flex-fill"
                                  onClick={() => handleReject(doctor._id)}
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            
          </div>
        </div>
      </div>
{/* ✅ FOOTER: Always show pagination if not "All" */}
            <div className="card-footer bg-light d-flex justify-content-between align-items-center py-3">
              <div className="text-muted small">
                Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredPendingDoctors.length)} of {filteredPendingDoctors.length} entries
              </div>

              {rowsPerPage !== "All" && (
                <nav>
                  <ul className="pagination mb-0">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                        Prev
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, i) => (
                      <li
                        key={i}
                        className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                      >
                        <button className="page-link" onClick={() => paginate(i + 1)}>
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
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
            <h2 style={{ fontWeight: "700" }}>{verifiedDoctors.length}</h2>
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
            <h2 style={{ fontWeight: "700" }}>{pendingDoctors.length}</h2>
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
            <h2 style={{ fontWeight: "700" }}>{rejectedDoctors.length}</h2>
            <p>Applications</p>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {selectedDocuments && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={() => setSelectedDocuments(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">Documents</h4>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setSelectedDocuments(null)}
                style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer' }}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {Array.isArray(selectedDocuments) ? (
              selectedDocuments.length === 0 ? (
                <p className="text-muted text-center py-4">No documents uploaded.</p>
              ) : (
                <ul className="list-group">
                  {selectedDocuments.map((doc, index) => (
                    <li key={index} className="list-group-item border-0 pb-2">
                      <a
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none text-primary"
                        style={{ fontSize: '1rem', display: 'block' }}
                      >
                        <i className="fas fa-file-alt me-2"></i>
                        Document {index + 1}
                      </a>
                      <br />
                      <small className="text-muted" style={{ wordBreak: 'break-all' }}>
                        {doc}
                      </small>
                    </li>
                  ))}
                </ul>
              )
            ) : (
              <p className="text-muted text-center py-4">No documents available.</p>
            )}

            <div className="text-end mt-4">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setSelectedDocuments(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verification;