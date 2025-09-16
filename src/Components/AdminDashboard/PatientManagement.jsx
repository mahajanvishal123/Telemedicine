import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../Baseurl/Baseurl";

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal States
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(null);

  // Loading states for actions
  const [actionLoading, setActionLoading] = useState({ view: false, edit: false, delete: false });

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

      // ✅ SweetAlert Success
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

      // ✅ SweetAlert Error
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

  // Handle Edit Form Submit — NO DOB IN PAYLOAD!
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    setActionLoading({ ...actionLoading, edit: true });

    try {
      const payload = {
        name: selectedPatient.name,
        email: selectedPatient.email,
        phone: selectedPatient.phone,
        address: selectedPatient.address,
        gender: selectedPatient.gender,
        status: selectedPatient.status,
      };

      await axios.put(`${API_URL}/patient/${selectedPatient._id}`, payload);

      setShowEditModal(false);
      await fetchPatients();

      // ✅ SweetAlert Success
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

      // ✅ SweetAlert Error
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
    }
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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-1">
        <h3 className="dashboard-heading">Patient Management</h3>
      </div>

      {/* Table Section */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="text-center">
                    <tr>
                      <th>User ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Join Date</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {patients.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center py-4">
                          No patients found.
                        </td>
                      </tr>
                    ) : (
                      patients.map((patient, index) => (
                        <tr key={patient._id}>
                          <td>{index + 1}</td>
                          <td>{patient.name}</td>
                          <td>{patient.email}</td>
                          <td>{new Date(patient.createdAt).toLocaleDateString()}</td>
                          <td>{patient.age}</td>
                          <td>{patient.gender || "-"}</td>
                          <td>{patient.phone || "-"}</td>
                          <td>
                            <span className={`badge ${getStatusClass(patient.status)}`}>
                              {patient.status}
                            </span>
                          </td>
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

      {/* ========== VIEW MODAL ========== */}
{/* ========== VIEW MODAL - Vertical Layout ========== */}
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
                {selectedPatient.profilePicture ? (
                  <img
                    src={selectedPatient.profilePicture}
                    alt="Profile"
                    className="img-fluid rounded-circle border"
                    style={{ width: "120px", height: "120px", objectFit: "cover" }}
                  />
                ) : (
                  <i className="fas fa-user-circle text-muted" style={{ fontSize: "80px" }}></i>
                )}
                <h5 className="mt-3">{selectedPatient.name}</h5>
                <p className="text-muted">Patient #{selectedPatientIndex + 1}</p>
              </div>

              {/* Patient Details - Vertical List */}
              <div className="col-12">
                <div className="card p-4 shadow-sm">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <p><strong>User ID:</strong> #{selectedPatientIndex + 1}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <p><strong>Name:</strong> {selectedPatient.name}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <p><strong>Email:</strong> {selectedPatient.email || "-"}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <p><strong>Phone:</strong> {selectedPatient.phone || "-"}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <p><strong>Age:</strong> {selectedPatient.age || "-"}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <p><strong>Gender:</strong> {selectedPatient.gender || "-"}</p>
                    </div>
                    <div className="col-md-6 mb-3">
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
                  onClick={() => setShowEditModal(false)}
                ></button>
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
                    onClick={() => setShowEditModal(false)}
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