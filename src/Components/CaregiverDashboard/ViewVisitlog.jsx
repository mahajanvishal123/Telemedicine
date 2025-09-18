import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../Baseurl/Baseurl"; // Adjust path if needed

const AddCaregiver = () => {
  // ===== STATES =====
  const [patients, setPatients] = useState([]); // For dropdown
  const [selectedPatientId, setSelectedPatientId] = useState(""); // Selected patient

  const [visitLogs, setVisitLogs] = useState([]);
  const [loadingVisitLogs, setLoadingVisitLogs] = useState(false);
  const [visitLogsError, setVisitLogsError] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingVisitLog, setViewingVisitLog] = useState(null);

  const [filterPatientName, setFilterPatientName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ===== FETCH PATIENTS FOR DROPDOWN =====
  const fetchPatients = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user._id) {
        throw new Error("No caregiver found");
      }

      const response = await axios.get(
        `${API_URL}/patient?caregiverId=${user._id}`
      );

      let patientsData = [];
      if (Array.isArray(response.data)) {
        patientsData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        patientsData = response.data.data;
      }

      setPatients(patientsData);
      if (patientsData.length > 0) {
        setSelectedPatientId(patientsData[0]._id); // Auto-select first patient
      }
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  // ===== FETCH VISIT LOGS FOR SELECTED PATIENT =====
  const fetchVisitLogs = async (patientId) => {
    if (!patientId) return;

    setLoadingVisitLogs(true);
    setVisitLogsError(null);

    try {
      const response = await axios.get(
        `${API_URL}/visitlog?patientId=${patientId}`
      );

      if (response.data.status === true) {
        const transformedLogs = response.data.data.map((log) => ({
          id: log._id,
          patientName: log.patientId?.name || "Unknown",
          bloodPressure: log.bloodPressure || "N/A",
          temperature: typeof log.temperature === "number" ? `${log.temperature}°F` : "N/A",
          notes: log.notes || "No notes",
          status: "Completed",
          visitDate: new Date(log.createdAt).toLocaleDateString(),
          visitTime: new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          caregiverName: "Unknown Caregiver",
          patientId: log.patientId?._id || "N/A",
          patientDetails: log.patientId, // Store full object for modal
          ...log
        }));

        setVisitLogs(transformedLogs);
      } else {
        throw new Error("Failed to fetch logs");
      }
    } catch (err) {
      console.error("Failed to fetch visit logs:", err);
      setVisitLogsError("Failed to load visit logs. Please try again.");
    } finally {
      setLoadingVisitLogs(false);
    }
  };

  // ===== ON COMPONENT LOAD — FETCH PATIENTS =====
  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== WHEN PATIENT CHANGES — FETCH LOGS =====
  useEffect(() => {
    if (selectedPatientId) {
      fetchVisitLogs(selectedPatientId);
    }
    // eslint-disable-next-line react-hooks-exhaustive-deps
  }, [selectedPatientId]);

  // ===== HELPERS =====
  const getStatusClass = (status) => "bg-success text-white";

  const handlePatientChange = (e) => {
    setSelectedPatientId(e.target.value);
    setCurrentPage(1); // Reset pagination
  };

  // ===== FILTER & PAGINATION =====
  const filteredVisitLogs = visitLogs.filter(visitLog =>
    filterPatientName
      ? visitLog.patientName.toLowerCase().includes(filterPatientName.toLowerCase())
      : true
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows =
    rowsPerPage === "All" ? filteredVisitLogs : filteredVisitLogs.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages =
    rowsPerPage === "All" ? 1 : Math.ceil(filteredVisitLogs.length / rowsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const resetFilters = () => {
    setFilterPatientName("");
    setCurrentPage(1);
  };

  const handleView = (visitLog) => {
    setViewingVisitLog(visitLog);
    setShowViewModal(true);
  };

  // ===== RENDER =====
  return (
    <div className="">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h3 className="dashboard-heading">View Visit Log</h3>
      </div>

      {/* Patient Selection Dropdown */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label className="form-label">Select Patient</label>
          <select
            className="form-select"
            value={selectedPatientId}
            onChange={handlePatientChange}
          >
            <option value="">-- Select Patient --</option>
            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.name} {patient.age ? `(${patient.age} yrs)` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading and Error States */}
      {loadingVisitLogs && <div className="alert alert-info">Loading visit logs…</div>}
      {visitLogsError && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{visitLogsError}</span>
          <button className="btn btn-sm btn-outline-light" onClick={() => fetchVisitLogs(selectedPatientId)}>Retry</button>
        </div>
      )}

      {/* Filters & Entries */}
      <div className="row">
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
        <div className="mb-4 col-md-9">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-10">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Patient Name..."
                  value={filterPatientName}
                  onChange={(e) => {
                    setFilterPatientName(e.target.value);
                    setCurrentPage(1);
                  }}
                />
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

      {/* Table */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>SN.</th>
                      <th>Patient Name</th>
                      <th>Blood Pressure</th>
                      <th>Temperature</th>
                      <th>Notes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center text-muted">
                          {selectedPatientId ? "No logs found" : "Please select a patient"}
                        </td>
                      </tr>
                    ) : (
                      currentRows.map((visitLog, index) => (
                        <tr key={visitLog.id}>
                          <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                          <td>{visitLog.patientName}</td>
                          <td>{visitLog.bloodPressure}</td>
                          <td>{visitLog.temperature}</td>
                          <td>
                            <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {visitLog.notes}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button 
                                className="btn btn-sm btn-outline-primary" 
                                onClick={() => handleView(visitLog)} 
                                title="View"
                              >
                                <i className="fas fa-eye"></i>
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

      {/* Pagination */}
      {selectedPatientId && rowsPerPage !== "All" && (
        <div className="card-footer bg-light d-flex justify-content-between align-items-center py-3">
          <div className="text-muted small">
            Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredVisitLogs.length)} of {filteredVisitLogs.length} entries
          </div>
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
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingVisitLog && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setShowViewModal(false)}>
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Visit Log Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)} />
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="card mb-3">
                      <div className="card-header bg-danger text-white">
                        <h5 className="mb-0">Patient Information</h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <p><strong>Patient Name:</strong> {viewingVisitLog.patientName}</p>
                            <p><strong>Patient ID:</strong> {viewingVisitLog.patientId || "N/A"}</p>
                            <p><strong>Age:</strong> {viewingVisitLog.patientDetails?.age || "N/A"}</p>
                          </div>
                          <div className="col-md-6">
                            <p><strong>Visit Date:</strong> {viewingVisitLog.visitDate}</p>
                            <p><strong>Visit Time:</strong> {viewingVisitLog.visitTime}</p>
                            <p><strong>Status:</strong> 
                              <span className={`badge ${getStatusClass(viewingVisitLog.status)} ms-2`}>
                                {viewingVisitLog.status}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card mb-3">
                      <div className="card-body">
                        <p><strong>Notes:</strong></p>
                        <p className="border p-3 bg-light">{viewingVisitLog.notes}</p>
                      </div>
                    </div>

                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <p><strong>Blood Pressure:</strong> {viewingVisitLog.bloodPressure}</p>
                          </div>
                          <div className="col-md-6">
                            <p><strong>Temperature:</strong> {viewingVisitLog.temperature}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
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

export default AddCaregiver;