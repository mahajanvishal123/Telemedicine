import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../Baseurl/Baseurl";
import "../../App.css"; // 👈 CSS import

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8); // 👈 dynamic

  // Modal States
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Fetch patients
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/patient`);
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

  // Pagination calculations
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows =
    rowsPerPage === "All" ? patients : patients.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages =
    rowsPerPage === "All" ? 1 : Math.ceil(patients.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="dashboard-heading">Patient Management</h3>
      </div>

      {/* Entries dropdown */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <label className="me-2">Show</label>
          <select
            className="form-select d-inline-block w-auto"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(e.target.value === "All" ? "All" : parseInt(e.target.value));
              setCurrentPage(1); // reset to page 1
            }}
          >
            <option value="5">5</option>
            <option value="8">8</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="All">All</option>
          </select>
          <span className="ms-2">entries</span>
        </div>
      </div>

      {/* Table */}
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
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-4">
                      No patients found.
                    </td>
                  </tr>
                ) : (
                  currentRows.map((patient, index) => (
                    <tr key={patient._id}>
                      <td>{indexOfFirstRow + index + 1}</td>
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
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm" style={{ color: "#FF3100" }}>
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="btn btn-sm" style={{ color: "#FF3100" }}>
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="btn btn-sm" style={{ color: "#FF3100" }}>
                            <i className="fas fa-trash"></i>
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
      {/* Pagination Controls */}
          {rowsPerPage !== "All" && (
            <nav>
              <ul className="pagination justify-content-end mt-3">
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
  );
};

export default PatientManagement;
