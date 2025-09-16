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
  const [selectedDoctorIndex, setSelectedDoctorIndex] = useState(null);

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
        window.Swal.fire({
          title: "Error!",
          text: "Failed to fetch doctors",
          icon: "error",
          confirmButtonText: "OK",
        });
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
        await axios.put(`${API_URL}/doctor/${selectedUser._id}`, formData);
        setDoctors((prev) =>
          prev.map((d) =>
            d._id === selectedUser._id ? { ...d, ...formData } : d
          )
        );
        window.Swal.fire({
          title: "Success!",
          text: "Doctor updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
          timer: 3000,
          timerProgressBar: true,
        });
      } catch (error) {
        console.error("Error updating doctor:", error);
        window.Swal.fire({
          title: "Error!",
          text: "Failed to update doctor",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        handleCloseModal();
      }
    }
  };

  // 🟠 Delete Doctor (DELETE API)
  const handleDelete = async (doctorId) => {
    const result = await window.Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F95918",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/doctor/${doctorId}`);
        setDoctors(doctors.filter((d) => d._id !== doctorId));
        window.Swal.fire({
          title: "Deleted!",
          text: "Doctor deleted successfully",
          icon: "success",
          confirmButtonText: "OK",
          timer: 2500,
          timerProgressBar: true,
        });
      } catch (error) {
        console.error("Error deleting doctor:", error);
        window.Swal.fire({
          title: "Error!",
          text: "Failed to delete doctor",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleView = (doctor, index) => {
    setSelectedDoctorForView(doctor);
    setShowViewModal(true);
    setSelectedDoctorIndex(index);
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

  // 🔹 Simplified status: Only "Active" or "Inactive"
  const getDisplayStatus = (isVerify) => {
    if (isVerify === true || isVerify === "true" || isVerify === "1") {
      return "Active";
    } else {
      return "Inactive"; // Everything else = Inactive (including 0, 2, false, null)
    }
  };

  // Filter active doctors for display
  const activeDoctors = doctors.filter(
    (d) => getDisplayStatus(d.isVerify) === "Active"
  );

  return (
    <div className="">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3 mt-2">
        <h3>Doctor Management</h3>
      </div>

      {/* Loader / Error */}
      {loading && <p>Loading doctors...</p>}
      {error && <p className="text-danger">{error}</p>}

      {/* Table — ONLY ACTIVE DOCTORS */}
      {!loading && !error && (
        <div className="card shadow mt-3">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="text-center">
                  <tr>
                    <th>User ID</th>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Specialty</th>
                    <th>Experience</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {activeDoctors.map((d, index) => (
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
                      <td>{d.email}</td>
                      <td>{d.gender}</td>
                      <td>{d.specialty}</td>
                      <td>{d.experience}</td>
                      <td>
                        <span
                          className={`badge px-3 py-2 rounded-pill fw-medium ${
                            getDisplayStatus(d.isVerify) === "Active"
                              ? "bg-success"
                              : "bg-secondary text-white"
                          }`}
                          style={{
                            fontSize: "0.85rem",
                            cursor: "default",
                            border: "none",
                            transition: "all 0.2s",
                          }}
                        >
                          {getDisplayStatus(d.isVerify)}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-sm"
                            onClick={() => handleView(d, index)}
                            style={{ color: "#F95918" }}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            className="btn btn-sm"
                            onClick={() => handleEdit(d)}
                            style={{ color: "#F95918" }}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-sm"
                            onClick={() => handleDelete(d._id)}
                            style={{ color: "#F95918" }}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {activeDoctors.length === 0 && (
                    <tr>
                      <td colSpan="9" className="text-center text-muted">
                        No active doctors found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
{/* 🔹 Edit Modal - Enhanced UI with Profile Picture & Labels */}
{showModal && (
  <div
    className="modal fade show d-block"
    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    onClick={handleCloseModal}
  >
    <div
      className="modal-dialog modal-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-content">
        <div className="modal-header bg-light">
          <h5 className="modal-title text-primary">
            <i className="fas fa-user-md me-2"></i>
            Edit Doctor Profile
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={handleCloseModal}
          ></button>
        </div>

        {/* 👇 Profile Picture Preview Section */}
        {selectedUser && (
          <div className="text-center py-3 bg-light border-bottom">
            {selectedUser.profilePicture ? (
              <img
                src={selectedUser.profilePicture}
                alt="Profile"
                className="img-fluid rounded-circle border"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            ) : (
              <i
                className="fas fa-user-circle text-muted"
                style={{ fontSize: "80px" }}
              ></i>
            )}
            <h6 className="mt-2 mb-0">{selectedUser.name}</h6>
            <p className="text-muted small">{selectedUser.specialty}</p>
          </div>
        )}

        <div className="modal-body p-4">
          <div className="row g-3">
            {/* Full Name */}
            <div className="col-md-6">
              <label htmlFor="name" className="form-label fw-bold text-dark">
                <i className="fas fa-signature me-1"></i> Full Name
              </label>
              <input
                id="name"
                className="form-control"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                placeholder="Enter full name"
              />
            </div>

            {/* Email */}
            <div className="col-md-6">
              <label htmlFor="email" className="form-label fw-bold text-dark">
                <i className="fas fa-envelope me-1"></i> Email
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                placeholder="Enter email address"
              />
            </div>

            {/* Gender */}
            <div className="col-md-6">
              <label htmlFor="gender" className="form-label fw-bold text-dark">
                <i className="fas fa-venus-mars me-1"></i> Gender
              </label>
              <input
                id="gender"
                className="form-control"
                name="gender"
                value={formData.gender || ""}
                onChange={handleInputChange}
                placeholder="e.g., Male / Female / Other"
              />
            </div>

            {/* Specialty */}
            <div className="col-md-6">
              <label htmlFor="specialty" className="form-label fw-bold text-dark">
                <i className="fas fa-stethoscope me-1"></i> Specialty
              </label>
              <input
                id="specialty"
                className="form-control"
                name="specialty"
                value={formData.specialty || ""}
                onChange={handleInputChange}
                placeholder="e.g., Cardiologist"
              />
            </div>

            {/* License Number */}
            <div className="col-md-6">
              <label htmlFor="licenseNo" className="form-label fw-bold text-dark">
                <i className="fas fa-id-card me-1"></i> Medical License No.
              </label>
              <input
                id="licenseNo"
                className="form-control"
                name="licenseNo"
                value={formData.licenseNo || ""}
                onChange={handleInputChange}
                placeholder="Enter license number"
              />
            </div>

            {/* Experience */}
            <div className="col-md-6">
              <label htmlFor="experience" className="form-label fw-bold text-dark">
                <i className="fas fa-briefcase me-1"></i> Years of Experience
              </label>
              <input
                id="experience"
                type="number"
                className="form-control"
                name="experience"
                value={formData.experience || ""}
                onChange={handleInputChange}
                placeholder="e.g., 5"
              />
            </div>

            {/* Fee */}
            <div className="col-md-6">
              <label htmlFor="fee" className="form-label fw-bold text-dark">
                <i className="fas fa-dollar-sign me-1"></i> Consultation Fee ($)
              </label>
              <input
                id="fee"
                type="number"
                className="form-control"
                name="fee"
                value={formData.fee || ""}
                onChange={handleInputChange}
                placeholder="e.g., 100"
              />
            </div>

            {/* Available Days */}
            <div className="col-md-6">
              <label htmlFor="availableDay" className="form-label fw-bold text-dark">
                <i className="fas fa-calendar-alt me-1"></i> Available Days
              </label>
              <input
                id="availableDay"
                className="form-control"
                name="availableDay"
                value={formData.availableDay || ""}
                onChange={handleInputChange}
                placeholder="e.g., Mon-Fri"
              />
            </div>

            {/* Opening Time */}
            <div className="col-md-6">
              <label htmlFor="openingTime" className="form-label fw-bold text-dark">
                <i className="fas fa-clock me-1"></i> Opening Time
              </label>
              <input
                id="openingTime"
                type="time"
                className="form-control"
                name="openingTime"
                value={formData.openingTime || ""}
                onChange={handleInputChange}
              />
            </div>

            {/* Closing Time */}
            <div className="col-md-6">
              <label htmlFor="closingTime" className="form-label fw-bold text-dark">
                <i className="fas fa-clock me-1"></i> Closing Time
              </label>
              <input
                id="closingTime"
                type="time"
                className="form-control"
                name="closingTime"
                value={formData.closingTime || ""}
                onChange={handleInputChange}
              />
            </div>

            {/* Status — SIMPLIFIED */}
            <div className="col-md-12">
              <label htmlFor="isVerify" className="form-label fw-bold text-dark d-block">
                <i className="fas fa-user-check me-1"></i> Status
              </label>
              <select
                id="isVerify"
                className="form-select"
                name="isVerify"
                value={
                  formData.isVerify === true ||
                  formData.isVerify === "true" ||
                  formData.isVerify === "1"
                    ? "1"
                    : "0"
                }
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    isVerify: e.target.value,
                  });
                }}
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-secondary px-4"
            onClick={handleCloseModal}
          >
            <i className="fas fa-times me-1"></i> Cancel
          </button>
          <button
            className="btn text-white px-4"
            style={{ backgroundColor: "#F95918" }}
            onClick={handleSave}
          >
            <i className="fas fa-save me-1"></i> Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* 🔹 View Modal - Enhanced UI with Simplified Status */}
      {showViewModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Doctor Profile</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseViewModal}
                ></button>
              </div>
              <div className="modal-body">
                {selectedDoctorForView && (
                  <div className="row">
                    {/* Profile Picture */}
                    <div className="col-md-4 text-center mb-3">
                      {selectedDoctorForView.profilePicture ? (
                        <img
                          src={selectedDoctorForView.profile}
                          alt="Profile"
                          className="img-fluid rounded-circle border"
                          style={{ width: "150px", height: "150px", objectFit: "cover" }}
                        />
                      ) : (
                        <i
                          className="fas fa-user-circle text-muted"
                          style={{ fontSize: "100px" }}
                        ></i>
                      )}
                      <h5 className="mt-2">{selectedDoctorForView.name}</h5>
                      <p className="text-muted">{selectedDoctorForView.specialty}</p>
                    </div>

                    {/* Doctor Details */}
                    <div className="col-md-8">
                      <div className="card p-3 shadow-sm">
                        <h6 className="text-muted">Basic Information</h6>
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item">
                            <strong>User ID:</strong> #{selectedDoctorIndex + 1}
                          </li>
                          <li className="list-group-item">
                            <strong>Email:</strong> {selectedDoctorForView.email}
                          </li>
                          <li className="list-group-item">
                            <strong>Gender:</strong> {selectedDoctorForView.gender}
                          </li>
                          <li className="list-group-item">
                            <strong>Experience:</strong> {selectedDoctorForView.experience} years
                          </li>
                          <li className="list-group-item">
                            <strong>License No:</strong> {selectedDoctorForView.licenseNo}
                          </li>
                          <li className="list-group-item">
                            <strong>Consultation Fee:</strong> ${selectedDoctorForView.fee}
                          </li>
                          <li className="list-group-item">
                            <strong>Available Days:</strong> {selectedDoctorForView.availableDay}
                          </li>
                          <li className="list-group-item">
                            <strong>Timings:</strong> {selectedDoctorForView.openingTime} - {selectedDoctorForView.closingTime}
                          </li>
                          <li className="list-group-item">
                            <strong>Status:</strong>
                            <span
                              className={`badge ms-2 px-3 py-1 rounded-pill fw-medium ${
                                getDisplayStatus(selectedDoctorForView.isVerify) === "Active"
                                  ? "bg-success"
                                  : "bg-secondary"
                              }`}
                            >
                              {getDisplayStatus(selectedDoctorForView.isVerify)}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
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