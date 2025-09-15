import React, { useState, useEffect } from "react";
import API_URL from "../../Baseurl/Baseurl";
import axios from "axios";

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDoctorForView, setSelectedDoctorForView] = useState(null);
  const [formData, setFormData] = useState({});
  const [actionLoading, setActionLoading] = useState({}); // 🔹 Track button spinners

  // 🔹 GET API Call
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/doctor`);
        setDoctors(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError("Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // 🟠 Edit Handler
  const handleEdit = (doctor) => {
    setSelectedUser(doctor);
    setFormData(doctor);
    setShowModal(true);
  };

  // 🟠 Save Edited Doctor (PUT API)
  const handleSave = async () => {
    if (selectedUser) {
      try {
        setActionLoading({ edit: selectedUser._id });
        await axios.put(`${API_URL}/doctor/${selectedUser._id}`, formData);
        setDoctors((prev) =>
          prev.map((d) =>
            d._id === selectedUser._id ? { ...d, ...formData } : d
          )
        );
        alert("Doctor updated successfully");
      } catch (error) {
        console.error("Error updating doctor:", error);
        alert("Failed to update doctor");
      } finally {
        setActionLoading({});
        handleCloseModal();
      }
    }
  };

  // 🟠 Delete Doctor (DELETE API)
  const handleDelete = async (doctorId) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        setActionLoading({ delete: doctorId });
        await axios.delete(`${API_URL}/doctor/${doctorId}`);
        setDoctors(doctors.filter((d) => d._id !== doctorId));
        alert("Doctor deleted successfully");
      } catch (error) {
        console.error("Error deleting doctor:", error);
        alert("Failed to delete doctor");
      } finally {
        setActionLoading({});
      }
    }
  };

  const handleView = (doctor) => {
    setActionLoading({ view: doctor._id });
    setSelectedDoctorForView(doctor);
    setShowViewModal(true);
    setTimeout(() => setActionLoading({}), 500); // simulate small delay
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({});
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedDoctorForView(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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

  return (
    <div className="">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
        <h3>Doctor Management</h3>
      </div>

      {/* Loader / Error */}
      {loading && <p>Loading doctors...</p>}
      {error && <p className="text-danger">{error}</p>}

      {/* Table */}
      {!loading && !error && (
        <div className="card shadow mt-3">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Photo</th>
                    <th>Full Name</th>
                    <th>Gender</th>
                    <th>Specialty</th>
                    <th>Licence</th>
                    <th>Experience</th>
                    <th>Fee</th>
                    <th>Opening</th>
                    <th>Closing</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((d, index) => (
                    <tr key={d._id}>
                      <td>{index + 1}</td>
                      <td>
                        {d.profilePicture ? (
                          <img
                            src={d.profilePicture}
                            alt="Profile"
                            className="rounded-circle"
                            style={{ width: "40px", height: "40px" }}
                          />
                        ) : (
                          <i
                            className="fas fa-user-circle text-muted"
                            style={{ fontSize: "30px" }}
                          ></i>
                        )}
                      </td>
                      <td>{d.name}</td>
                      <td>{d.gender}</td>
                      <td>{d.specialty}</td>
                      <td>{d.medicalLicence}</td>
                      <td>{d.yearsExperience} yrs</td>
                      <td>₹{d.consultationFee}</td>
                      <td>{d.openingTime}</td>
                      <td>{d.closingTime}</td>
                      <td>
                        <span className={`badge ${getStatusClass(d.status)}`}>
                          {d.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          {/* View */}
                          <button
                            className="btn btn-sm"
                            onClick={() => handleView(d)}
                            disabled={actionLoading.view === d._id}
                            style={{ color: "#0d6efd" }}
                          >
                            {actionLoading.view === d._id ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : (
                              <i className="fas fa-eye"></i>
                            )}
                          </button>

                          {/* Edit */}
                          <button
                            className="btn btn-sm"
                            onClick={() => handleEdit(d)}
                            disabled={actionLoading.edit === d._id}
                            style={{ color: "#f39c12" }}
                          >
                            {actionLoading.edit === d._id ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : (
                              <i className="fas fa-edit"></i>
                            )}
                          </button>

                          {/* Delete */}
                          <button
                            className="btn btn-sm"
                            onClick={() => handleDelete(d._id)}
                            disabled={actionLoading.delete === d._id}
                            style={{ color: "#dc3545" }}
                          >
                            {actionLoading.delete === d._id ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : (
                              <i className="fas fa-trash"></i>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {doctors.length === 0 && (
                    <tr>
                      <td colSpan="13" className="text-center text-muted">
                        No doctors found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Edit Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Doctor</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                {/* Form Fields */}
                <input
                  className="form-control mb-2"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                />
                <input
                  className="form-control mb-2"
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleInputChange}
                  placeholder="Gender"
                />
                <input
                  className="form-control mb-2"
                  name="specialty"
                  value={formData.specialty || ""}
                  onChange={handleInputChange}
                  placeholder="Specialty"
                />
                <input
                  className="form-control mb-2"
                  name="medicalLicence"
                  value={formData.medicalLicence || ""}
                  onChange={handleInputChange}
                  placeholder="Medical Licence"
                />
                <input
                  className="form-control mb-2"
                  name="yearsExperience"
                  value={formData.yearsExperience || ""}
                  onChange={handleInputChange}
                  placeholder="Years of Experience"
                />
                <input
                  className="form-control mb-2"
                  name="consultationFee"
                  value={formData.consultationFee || ""}
                  onChange={handleInputChange}
                  placeholder="Consultation Fee"
                />
                <input
                  className="form-control mb-2"
                  name="availableDays"
                  value={formData.availableDays || ""}
                  onChange={handleInputChange}
                  placeholder="Available Days"
                />
                <input
                  className="form-control mb-2"
                  name="openingTime"
                  value={formData.openingTime || ""}
                  onChange={handleInputChange}
                  placeholder="Opening Time"
                />
                <input
                  className="form-control mb-2"
                  name="closingTime"
                  value={formData.closingTime || ""}
                  onChange={handleInputChange}
                  placeholder="Closing Time"
                />
                <select
                  className="form-control mb-2"
                  name="status"
                  value={formData.status || "Active"}
                  onChange={handleInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button
                  className="btn text-white"
                  style={{ backgroundColor: "#F95918" }}
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 View Modal */}
      {showViewModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Doctor Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseViewModal}
                ></button>
              </div>
              <div className="modal-body">
                {selectedDoctorForView && (
                  <>
                    <p><strong>User ID:</strong> {selectedDoctorForView._id}</p>
                    <p><strong>Full Name:</strong> {selectedDoctorForView.name}</p>
                    <p><strong>Gender:</strong> {selectedDoctorForView.gender}</p>
                    <p><strong>Specialty:</strong> {selectedDoctorForView.specialty}</p>
                    <p><strong>Medical Licence:</strong> {selectedDoctorForView.medicalLicence}</p>
                    <p><strong>Experience:</strong> {selectedDoctorForView.yearsExperience} yrs</p>
                    <p><strong>Consultation Fee:</strong> ₹{selectedDoctorForView.consultationFee}</p>
                    <p><strong>Opening Time:</strong> {selectedDoctorForView.openingTime}</p>
                    <p><strong>Closing Time:</strong> {selectedDoctorForView.closingTime}</p>
                    <p><strong>Status:</strong> {selectedDoctorForView.status}</p>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={handleCloseViewModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;
