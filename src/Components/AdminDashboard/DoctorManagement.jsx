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

  const getDisplayStatus = (isVerify) => {
    return isVerify === true || isVerify === "true" ? "Active" : "Inactive";
  };

  return (
    <div className="">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3 mt-2">
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
              <thead className="text-center">
                  <tr>
                    <th>User ID</th>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Specialty</th>
                    <th>Licence</th>
                    <th>Experience</th>
                    <th>Fee</th>
                    <th>Available Days</th>
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
                        {d.profile ? (
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
                      <td>{d.licenseNo}</td>
                      <td>{d.experience}</td>
                      <td>${d.fee}</td>
                      <td>{d.availableDay}</td>
                      <td>{d.openingTime}</td>
                      <td>{d.closingTime}</td>
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
                        <div className="d-flex">
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
                <input
                  className="form-control mb-2"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                />
                <input
                  className="form-control mb-2"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  placeholder="Email"
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
                  name="licenseNo"
                  value={formData.licenseNo || ""}
                  onChange={handleInputChange}
                  placeholder="Medical Licence"
                />
                <input
                  className="form-control mb-2"
                  name="experience"
                  value={formData.experience || ""}
                  onChange={handleInputChange}
                  placeholder="Years of Experience"
                />
                <input
                  className="form-control mb-2"
                  name="fee"
                  value={formData.fee || ""}
                  onChange={handleInputChange}
                  placeholder="Consultation Fee"
                />
                <input
                  className="form-control mb-2"
                  name="availableDay"
                  value={formData.availableDay || ""}
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
                  name="isVerify"
                  value={
                    formData.isVerify === true || formData.isVerify === "true"
                      ? "true"
                      : "false"
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isVerify: e.target.value === "true",
                    })
                  }
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
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
                    <p>
                      <strong>User ID:</strong> {selectedDoctorForView._id}
                    </p>
                    <p>
                      <strong>Name:</strong> {selectedDoctorForView.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedDoctorForView.email}
                    </p>
                    <p>
                      <strong>Gender:</strong> {selectedDoctorForView.gender}
                    </p>
                    <p>
                      <strong>Specialty:</strong>{" "}
                      {selectedDoctorForView.specialty}
                    </p>
                    <p>
                      <strong>Documents:</strong>{" "}
                      {selectedDoctorForView.documents}
                    </p>
                    <p>
                      <strong>Medical Licence:</strong>{" "}
                      {selectedDoctorForView.licenseNo}
                    </p>
                    <p>
                      <strong>Experience:</strong>{" "}
                      {selectedDoctorForView.experience} yrs
                    </p>
                    <p>
                      <strong>Consultation Fee:</strong> $
                      {selectedDoctorForView.fee}
                    </p>
                    <p>
                      <strong>Available Days:</strong>{" "}
                      {selectedDoctorForView.availableDay}
                    </p>
                    <p>
                      <strong>Opening Time:</strong>{" "}
                      {selectedDoctorForView.openingTime}
                    </p>
                    <p>
                      <strong>Closing Time:</strong>{" "}
                      {selectedDoctorForView.closingTime}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {getDisplayStatus(selectedDoctorForView.isVerify)}
                    </p>
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