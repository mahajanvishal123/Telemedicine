import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../Baseurl/Baseurl";

const PatientManagement = () => {
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Modal States
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(null);

  // Loading states for actions
  const [actionLoading, setActionLoading] = useState({ view: false, edit: false, delete: false });

  // 🔹 Filter states
  const [filterName, setFilterName] = useState("");
  const [filterJoinDate, setFilterJoinDate] = useState("");

  // ======================
  // ONLY GET REQUEST — NO VARIABLES, DIRECT URL
  // ======================
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/patient`);
      console.log("Fetched patients:", response.data);
      setPatients(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching patients:", err.response?.data || err.message);
      setError("Failed to load patient data. Please check the API or try again later.");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // ======================
  // HELPER: STATUS BADGE CLASS
  // ======================
  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-success";
      case "Inactive":
        return "bg-secondary";
      default:
        return "bg-secondary";
    }
  };

  // ======================
  // ACTION HANDLERS
  // ======================

  // Handle View
  const handleView = async (patient, index) => {
    setSelectedPatient(patient);
    setActionLoading({ ...actionLoading, view: true });
    setShowViewModal(true);
    setSelectedPatientIndex(index);

    try {
      const res = await axios.get(`${API_URL}/patient/${patient._id}`);
      setSelectedPatient(res.data);
    } catch (err) {
      console.error('Error fetching patient detail:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load',
        text: 'Could not load patient details. Please try again.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-danger'
        }
      });
    } finally {
      setActionLoading({ ...actionLoading, view: false });
    }
  };

  // Handle Edit
  const handleEdit = (patient) => {
    setSelectedPatient({ ...patient });
    setPreviewUrl(patient.profile || ""); // 👈 Initialize preview
    setNewProfileImage(null); // Reset file
    setShowEditModal(true);
  };

  // Handle Delete Confirmation
  const handleDeleteClick = (patient) => {
    setSelectedPatient(patient);
    setShowDeleteModal(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!selectedPatient) return;

    setActionLoading({ ...actionLoading, delete: true });
    try {
      await axios.delete(`${API_URL}/patient/${selectedPatient._id}`);
      setPatients(patients.filter(p => p._id !== selectedPatient._id));
      setShowDeleteModal(false);

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Patient has been deleted successfully.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-success'
        }
      });
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);

      Swal.fire({
        icon: 'error',
        title: 'Failed to Delete',
        text: "Failed to delete patient. Please try again.",
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-danger'
        }
      });
    } finally {
      setActionLoading({ ...actionLoading, delete: false });
    }
  };

  // Handle Edit Form Submit — WITH PROFILE IMAGE
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    setActionLoading({ ...actionLoading, edit: true });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", selectedPatient.name);
      formDataToSend.append("email", selectedPatient.email);
      if (selectedPatient.phone) formDataToSend.append("phone", selectedPatient.phone);
      if (selectedPatient.gender) formDataToSend.append("gender", selectedPatient.gender);
      formDataToSend.append("status", selectedPatient.status);
      if (selectedPatient.createdAt) formDataToSend.append("createdAt", selectedPatient.createdAt);

      if (newProfileImage) {
        formDataToSend.append("profile", newProfileImage);
      }

      await axios.put(`${API_URL}/patient/${selectedPatient._id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowEditModal(false);
      await fetchPatients();

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Patient details updated successfully.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-success'
        }
      });

    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);

      let message = "Failed to update patient.";
      if (err.response?.status === 400) message = "Invalid data. Please check all fields.";
      if (err.response?.status === 404) message = "Patient not found. Refresh the page.";
      if (err.response?.data?.message) message = err.response.data.message;

      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: message,
        confirmButtonText: 'Try Again',
        customClass: {
          confirmButton: 'btn btn-danger'
        }
      });

    } finally {
      setActionLoading({ ...actionLoading, edit: false });
      setNewProfileImage(null);
      setPreviewUrl("");
    }
  };

  // 🔹 Apply Filters
  const filteredPatients = patients.filter(patient => {
    const matchesName = filterName
      ? patient.name.toLowerCase().includes(filterName.toLowerCase())
      : true;

    const matchesJoinDate = filterJoinDate
      ? new Date(patient.createdAt).toLocaleDateString('en-CA') === filterJoinDate // Format: YYYY-MM-DD
      : true;

    return matchesName && matchesJoinDate;
  });

  // Pagination calculations — applied to FILTERED data
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows =
    rowsPerPage === "All" ? filteredPatients : filteredPatients.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages =
    rowsPerPage === "All" ? 1 : Math.ceil(filteredPatients.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 🔹 Reset Filters
  const resetFilters = () => {
    setFilterName("");
    setFilterJoinDate("");
    setCurrentPage(1);
  };

  // ======================
  // RENDERING
  // ======================
  if (loading) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading patients from server...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-5">
        <div className="alert alert-danger">{error}</div>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h3 className="dashboard-heading">Patient Management</h3>
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
      <div className="mb-4 col-md-9">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                id="filterName"
                placeholder="Search by patient name..."
                value={filterName}
                onChange={(e) => {
                  setFilterName(e.target.value);
                  setCurrentPage(1); // Reset to page 1 on filter change
                }}
              />
            </div>
            <div className="col-md-5">
              <input
                type="date"
                className="form-control"
                id="filterJoinDate"
                value={filterJoinDate}
                onChange={(e) => {
                  setFilterJoinDate(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
             <div className="mt-3 col-md-2">
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
     
      {/* Table Section */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="text-center align-middle">
                    <tr>
                      <th>User ID</th>
                      <th>Profile</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Join Date</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-center align-middle">
                    {currentRows.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-4">
                          No patients found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      currentRows.map((patient, index) => (
                        <tr key={patient._id}>
                          <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                          <td className="align-middle">
                            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50px' }}>
                              {patient.profile ? (
                                <img
                                  src={patient.profile}
                                  alt="Profile"
                                  className="rounded-circle"
                                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                />
                              ) : (
                                <i
                                  className="fas fa-user-circle text-muted"
                                  style={{ fontSize: "30px" }}
                                ></i>
                              )}
                            </div>
                          </td>
                          <td>{patient.name}</td>
                          <td>{patient.email}</td>
                          <td>{new Date(patient.createdAt).toLocaleDateString()}</td>
                          <td>{patient.age}</td>
                          <td>{patient.gender || "-"}</td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm"
                                onClick={() => handleView(patient, index)}
                                disabled={actionLoading.view}
                                style={{ color: "#F95918" }}
                              >
                                {actionLoading.view ? (
                                  <span className="spinner-border spinner-border-sm" />
                                ) : (
                                  <i className="fas fa-eye"></i>
                                )}
                              </button>
                              <button
                                className="btn btn-sm"
                                onClick={() => handleEdit(patient)}
                                disabled={actionLoading.edit}
                                style={{ color: "#F95918" }}
                              >
                                {actionLoading.edit ? (
                                  <span className="spinner-border spinner-border-sm" />
                                ) : (
                                  <i className="fas fa-edit"></i>
                                )}
                              </button>
                              <button
                                className="btn btn-sm"
                                onClick={() => handleDeleteClick(patient)}
                                disabled={actionLoading.delete}
                                style={{ color: "#F95918" }}
                              >
                                {actionLoading.delete ? (
                                  <span className="spinner-border spinner-border-sm" />
                                ) : (
                                  <i className="fas fa-trash"></i>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>

            {/* ✅ FOOTER: Showing info + Pagination — Always show if not "All" */}
            <div className="card-footer bg-light d-flex justify-content-between align-items-center py-3">
              <div className="text-muted small">
                Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredPatients.length)} of {filteredPatients.length} entries
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
      {/* ========== VIEW MODAL ========== */}
      {showViewModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Patient Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowViewModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {actionLoading.view ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading patient details...</p>
                  </div>
                ) : selectedPatient ? (
                  <div className="row">
                    {/* Profile Picture Section */}
                    <div className="col-12 text-center mb-4">
                      <div className="d-flex flex-column align-items-center justify-content-center" style={{ gap: '12px' }}>
                        {selectedPatient.profile ? (
                          <img
                            src={selectedPatient.profile}
                            alt="Profile"
                            className="img-fluid rounded-circle border"
                            style={{
                              width: "120px",
                              height: "120px",
                              objectFit: "cover",
                              boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                            }}
                          />
                        ) : (
                          <i className="fas fa-user-circle text-muted" style={{ fontSize: "80px" }}></i>
                        )}
                        <h5 className="mt-0 mb-0">{selectedPatient.name}</h5>
                        <p className="text-muted mb-0">Patient #{selectedPatientIndex + 1}</p>
                      </div>
                    </div>

                    {/* Patient Details - Vertical List */}
                    <div className="col-12">
                      <div className="card p-2 shadow-sm">
                        <div className="row">
                          <div className="col-md-6 ">
                            <p><strong>User ID:</strong> #{selectedPatientIndex + 1}</p>
                          </div>
                          <div className="col-md-6 ">
                            <p><strong>Name:</strong> {selectedPatient.name}</p>
                          </div>
                          <div className="col-md-6 ">
                            <p><strong>Email:</strong> {selectedPatient.email || "-"}</p>
                          </div>
                          <div className="col-md-6 ">
                            <p><strong>Phone:</strong> {selectedPatient.phone || "-"}</p>
                          </div>
                          <div className="col-md-6 ">
                            <p><strong>Age:</strong> {selectedPatient.age || "-"}</p>
                          </div>
                          <div className="col-md-6 ">
                            <p><strong>Gender:</strong> {selectedPatient.gender || "-"}</p>
                          </div>
                          <div className="col-md-6 ">
                            <p><strong>Status:</strong>
                              <span className={`badge ms-2 px-3 py-1 rounded-pill ${getStatusClass(selectedPatient.status)}`}>
                                {selectedPatient.status}
                              </span>
                            </p>
                          </div>
                          <div className="col-md-6 mb-3">
                            <p><strong>Joining Date:</strong> {new Date(selectedPatient.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p>Patient data not available</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== EDIT MODAL ========== */}
      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Patient</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowEditModal(false);
                    setNewProfileImage(null);
                    setPreviewUrl("");
                  }}
                ></button>
              </div>

              {/* Profile Upload Section */}
              <div className="text-center py-3 bg-light border-bottom position-relative">
                <input
                  type="file"
                  id="profileUpload"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setNewProfileImage(file);
                      setPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                  style={{ display: "none" }}
                />

                <label
                  htmlFor="profileUpload"
                  style={{ cursor: "pointer" }}
                  title="Click to upload new profile picture"
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile Preview"
                      className="img-fluid rounded-circle border"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        border: "3px solid #F95918",
                        transition: "all 0.3s",
                      }}
                    />
                  ) : selectedPatient?.profile ? (
                    <img
                      src={selectedPatient.profile}
                      alt="Profile"
                      className="img-fluid rounded-circle border"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        border: "3px solid #ddd",
                      }}
                    />
                  ) : (
                    <i
                      className="fas fa-user-circle text-muted"
                      style={{ fontSize: "80px", color: "#aaa" }}
                    ></i>
                  )}
                </label>

                <h6 className="mt-2 mb-0">{selectedPatient?.name}</h6>
                <p className="text-muted small">
                  <i className="fas fa-info-circle me-1"></i>
                  Click image to upload new photo
                </p>

                {newProfileImage && (
                  <span className="badge bg-success mt-1">
                    <i className="fas fa-check-circle me-1"></i> New image selected
                  </span>
                )}
              </div>

              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedPatient?.name || ""}
                        onChange={(e) =>
                          setSelectedPatient({
                            ...selectedPatient,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={selectedPatient?.email || ""}
                        onChange={(e) =>
                          setSelectedPatient({
                            ...selectedPatient,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={selectedPatient?.phone || ""}
                        onChange={(e) =>
                          setSelectedPatient({
                            ...selectedPatient,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Gender</label>
                      <select
                        className="form-select"
                        value={selectedPatient?.gender || ""}
                        onChange={(e) =>
                          setSelectedPatient({
                            ...selectedPatient,
                            gender: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={selectedPatient?.status || "Active"}
                        onChange={(e) =>
                          setSelectedPatient({
                            ...selectedPatient,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Joining Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={selectedPatient?.createdAt ? selectedPatient.createdAt.split('T')[0] : ""}
                        onChange={(e) =>
                          setSelectedPatient({
                            ...selectedPatient,
                            createdAt: e.target.value,
                          })
                        }
                        disabled={actionLoading.edit}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowEditModal(false);
                      setNewProfileImage(null);
                      setPreviewUrl("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-warning"
                    disabled={actionLoading.edit}
                  >
                    {actionLoading.edit ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========== DELETE CONFIRMATION MODAL ========== */}
      {showDeleteModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete patient: <strong>{selectedPatient?.name}</strong>?</p>
                <p className="text-danger">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                  disabled={actionLoading.delete}
                >
                  {actionLoading.delete ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;