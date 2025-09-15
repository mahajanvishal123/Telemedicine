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
  const handleView = async (patient) => {
    setSelectedPatient(patient);
    setActionLoading({ ...actionLoading, view: true });
    setShowViewModal(true);

    try {
      const res = await axios.get(`${API_URL}/patient/${patient._id}`);
      setSelectedPatient(res.data);
    } catch (err) {
      console.error('Error fetching patient detail:', err);
    } finally {
      setActionLoading({ ...actionLoading, view: false });
    }
  };

  // Handle Edit
  const handleEdit = (patient) => {
    setSelectedPatient({ ...patient });
    setActionLoading({ ...actionLoading, edit: true });
    setShowEditModal(true);
    setActionLoading({ ...actionLoading, edit: false });
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
      alert("Patient deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      alert("Failed to delete patient. Please try again.");
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
        // 👇👇👇 DO NOT INCLUDE dob — IT'S INVALID ("22") AND CAUSES ERROR
        // dob: selectedPatient.dob,  // ← DELETED! BACKEND WILL IGNORE IT
      };

      const response = await axios.put(
        `${API_URL}/patient/${selectedPatient._id}`,
        payload
      );

   
      setShowEditModal(false);
      await fetchPatients()
      alert("Patient updated successfully!");
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);

      let message = "Failed to update patient.";
      if (err.response?.status === 400) message = "Invalid data. Please check all fields.";
      if (err.response?.status === 404) message = "Patient not found. Refresh the page.";
      if (err.response?.data?.message) message = err.response.data.message;

      alert(message);
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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h3 className="dashboard-heading">Patient Management</h3>
      </div>

      {/* Table Section */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Join Date</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Phone</th>
                      {/* <th>Address</th> */}
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="text-center py-4">
                          No patients found.
                        </td>
                      </tr>
                    ) : (
                      patients.map((patient,index) => (
                        <tr key={patient._id}>
                          <td>{index+1}</td>
                          <td>{patient.name}</td>
                          <td>{patient.email}</td>
                          <td>{new Date(patient.createdAt).toLocaleDateString()}</td>
                          <td>{patient.age}</td>
                          <td>{patient.gender || "-"}</td>
                          <td>{patient.phone || "-"}</td>
                          {/* <td>{patient.address || "-"}</td> */}
                          <td>
                            <span className={`badge ${getStatusClass(patient.status)}`}>
                              {patient.status}
                            </span>
                          </td>
                       <td>
  <div className="d-flex"> {/* 👈 gap-2 → gap-1 */}
    {/* View */}
    <button
      className="btn btn-sm"
      onClick={() => handleView(patient)}
      disabled={actionLoading.view}
      style={{ color: "#121E34" }}
    >
      {actionLoading.view ? (
        <span className="spinner-border spinner-border-sm" />
      ) : (
        <i className="fas fa-eye"></i>
      )}
    </button>

    {/* Edit */}
    <button
      className="btn btn-sm"
      onClick={() => handleEdit(patient)}
      disabled={actionLoading.edit}
      style={{ color: "#FF6600" }}
    >
      {actionLoading.edit ? (
        <span className="spinner-border spinner-border-sm" />
      ) : (
        <i className="fas fa-edit"></i>
      )}
    </button>

    {/* Delete */}
    <button
      className="btn btn-sm"
      onClick={() => handleDeleteClick(patient)}
      disabled={actionLoading.delete}
      style={{ color: "#FF3100" }}
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
                {selectedPatient ? (
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Profile</strong> {selectedPatient.profile || "-"}</p>
                      <p><strong>User ID:</strong> #{selectedPatient._id}</p>
                      <p><strong>Name:</strong> {selectedPatient.name}</p>
                      <p><strong>Email:</strong> {selectedPatient.email}</p>
                      <p><strong>Phone:</strong> {selectedPatient.phone || "-"}</p>
                      {/* 👇 DOB IS CORRUPTED — HIDDEN */}
                      {/* <p><strong>DOB:</strong> {selectedPatient.dob || "-"}</p> */}
                      <p><strong>Age:</strong> {selectedPatient.age || "-"}</p> {/* ✅ SAFE & DIRECT */}
                      
                    </div>
                    <div className="col-md-6">
                       <p><strong>DOB:</strong> {selectedPatient.dob || "-"}</p>
                      <p><strong>Blood Group:</strong> {selectedPatient.bloodGroup || "-"}</p>
                      <p><strong>Gender:</strong> {selectedPatient.gender || "-"}</p>
                
                      <p><strong>Status:</strong> 
                        <span className={`badge ms-2 ${getStatusClass(selectedPatient.status)}`}>
                          {selectedPatient.status}
                        </span>
                      </p>
                      <p><strong>Joined:</strong> {new Date(selectedPatient.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ) : (
                  <p>Loading...</p>
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
        createdAt: e.target.value, // Format: YYYY-MM-DD
      })
    }
    disabled={actionLoading.edit} // Optional: disable during loading
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