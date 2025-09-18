import React, { useState, useEffect } from "react";

const AddCaregiver = () => {
  // Visit Logs state
  const [visitLogs, setVisitLogs] = useState([]);
  const [loadingVisitLogs, setLoadingVisitLogs] = useState(false);
  const [visitLogsError, setVisitLogsError] = useState(null);

  // UI state
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingVisitLog, setViewingVisitLog] = useState(null);

  // 🔹 Filter states
  const [filterPatientName, setFilterPatientName] = useState("");

  // 🔹 Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ===== Helpers =====
  const getStatusClass = (status) => {
    switch (status) {
      case "Completed": return "bg-success text-white";
      case "Pending": return "bg-warning text-white";
      case "Cancelled": return "bg-danger text-white";
      default: return "bg-secondary text-white";
    }
  };

  // ===== GET /visit-logs =====
  const fetchVisitLogs = async () => {
    setLoadingVisitLogs(true);
    setVisitLogsError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // ✅✅✅ DUMMY DATA - Hardcoded sample data
      const dummyVisitLogs = [
        {
          id: 1,
          patientName: "John Doe",
          bloodPressure: "120/80",
          temperature: "98.6°F",
          notes: "Regular checkup completed successfully",
          status: "Completed",
          visitDate: "2024-01-15",
          visitTime: "10:00 AM",
          caregiverName: "Sarah Johnson",
          patientId: "P001",
          symptoms: ["No pain", "Good appetite"],
          medicationsGiven: ["Aspirin 81mg", "Vitamin D"],
          nextAppointment: "2024-02-15"
        },
        {
          id: 2,
          patientName: "Jane Smith",
          bloodPressure: "135/85",
          temperature: "99.1°F",
          notes: "Slight fever, prescribed rest and fluids",
          status: "Completed",
          visitDate: "2024-01-16",
          visitTime: "2:30 PM",
          caregiverName: "Mike Williams",
          patientId: "P002",
          symptoms: ["Mild headache", "Fatigue"],
          medicationsGiven: ["Tylenol 500mg"],
          nextAppointment: "2024-01-23"
        },
        {
          id: 3,
          patientName: "Robert Brown",
          bloodPressure: "145/90",
          temperature: "98.2°F",
          notes: "Blood pressure slightly elevated, recommended diet changes",
          status: "Pending",
          visitDate: "2024-01-17",
          visitTime: "11:00 AM",
          caregiverName: "Emily Davis",
          patientId: "P003",
          symptoms: ["Dizziness", "Shortness of breath"],
          medicationsGiven: [],
          nextAppointment: "2024-01-24"
        },
        {
          id: 4,
          patientName: "Lisa Wilson",
          bloodPressure: "118/75",
          temperature: "97.8°F",
          notes: "Follow-up visit, all vitals normal",
          status: "Completed",
          visitDate: "2024-01-18",
          visitTime: "9:15 AM",
          caregiverName: "David Miller",
          patientId: "P004",
          symptoms: ["None reported"],
          medicationsGiven: ["Multivitamin"],
          nextAppointment: "2024-02-18"
        },
        {
          id: 5,
          patientName: "Michael Johnson",
          bloodPressure: "160/95",
          temperature: "98.9°F",
          notes: "High blood pressure, urgent follow-up needed",
          status: "Pending",
          visitDate: "2024-01-19",
          visitTime: "3:45 PM",
          caregiverName: "Sarah Johnson",
          patientId: "P005",
          symptoms: ["Chest pain", "Headache"],
          medicationsGiven: ["Lisinopril 10mg"],
          nextAppointment: "2024-01-20"
        },
        {
          id: 6,
          patientName: "Patricia Taylor",
          bloodPressure: "122/78",
          temperature: "98.4°F",
          notes: "Routine checkup, patient doing well",
          status: "Completed",
          visitDate: "2024-01-20",
          visitTime: "1:30 PM",
          caregiverName: "Mike Williams",
          patientId: "P006",
          symptoms: ["Good energy levels"],
          medicationsGiven: [],
          nextAppointment: "2024-02-20"
        },
        {
          id: 7,
          patientName: "Thomas Anderson",
          bloodPressure: "138/88",
          temperature: "100.2°F",
          notes: "Fever and elevated BP, monitoring required",
          status: "Pending",
          visitDate: "2024-01-21",
          visitTime: "10:30 AM",
          caregiverName: "Emily Davis",
          patientId: "P007",
          symptoms: ["Fever", "Body aches"],
          medicationsGiven: ["Ibuprofen 400mg"],
          nextAppointment: "2024-01-24"
        },
        {
          id: 8,
          patientName: "Barbara White",
          bloodPressure: "115/72",
          temperature: "98.0°F",
          notes: "Post-operative check, healing well",
          status: "Completed",
          visitDate: "2024-01-22",
          visitTime: "11:45 AM",
          caregiverName: "David Miller",
          patientId: "P008",
          symptoms: ["Mild discomfort at incision site"],
          medicationsGiven: ["Antibiotic", "Pain reliever"],
          nextAppointment: "2024-01-29"
        },
        {
          id: 9,
          patientName: "Christopher Lee",
          bloodPressure: "152/92",
          temperature: "98.7°F",
          notes: "Hypertension management, medication adjustment",
          status: "Cancelled",
          visitDate: "2024-01-23",
          visitTime: "2:00 PM",
          caregiverName: "Sarah Johnson",
          patientId: "P009",
          symptoms: ["None reported"],
          medicationsGiven: ["Increased dosage of medication"],
          nextAppointment: "2024-01-30"
        },
        {
          id: 10,
          patientName: "Jennifer Hall",
          bloodPressure: "128/82",
          temperature: "99.0°F",
          notes: "Follow-up for diabetes management",
          status: "Completed",
          visitDate: "2024-01-24",
          visitTime: "4:15 PM",
          caregiverName: "Mike Williams",
          patientId: "P010",
          symptoms: ["Slight fatigue"],
          medicationsGiven: ["Insulin adjustment"],
          nextAppointment: "2024-02-07"
        }
      ];
      
      setVisitLogs(dummyVisitLogs);
    } catch (err) {
      console.error("Failed to fetch visit logs:", err);
      setVisitLogsError("Failed to fetch visit logs");
    } finally {
      setLoadingVisitLogs(false);
    }
  };

  useEffect(() => {
    fetchVisitLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔹 Apply Filters
  const filteredVisitLogs = visitLogs.filter(visitLog => {
    const matchesPatientName = filterPatientName
      ? visitLog.patientName.toLowerCase().includes(filterPatientName.toLowerCase())
      : true;
    return matchesPatientName;
  });

  // 🔹 Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows =
    rowsPerPage === "All" ? filteredVisitLogs : filteredVisitLogs.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages =
    rowsPerPage === "All" ? 1 : Math.ceil(filteredVisitLogs.length / rowsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 🔹 Reset Filters
  const resetFilters = () => {
    setFilterPatientName("");
    setCurrentPage(1);
  };

  // ===== Action Handlers =====
  const handleView = (visitLog) => {
    setViewingVisitLog(visitLog);
    setShowViewModal(true);
  };

  return (
    <div className="">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h3 className="dashboard-heading">View Visit Log</h3>
      </div>

      {/* Loading and Error States */}
      {loadingVisitLogs && <div className="alert alert-info">Loading visit logs…</div>}
      {visitLogsError && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{visitLogsError}</span>
          <button className="btn btn-sm btn-outline-light" onClick={fetchVisitLogs}>Retry</button>
        </div>
      )}

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
              <div className="col-md-10">
                <input
                  type="text"
                  className="form-control"
                  id="filterPatientName"
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

      {/* ======= Visit Logs Table ======= */}
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
                        <td colSpan={6} className="text-center text-muted">No visit logs found matching your filters.</td>
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

      {/* ✅ FOOTER: Pagination */}
      <div className="card-footer bg-light d-flex justify-content-between align-items-center py-3">
        <div className="text-muted small">
          Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredVisitLogs.length)} of {filteredVisitLogs.length} entries
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

      {/* View Visit Log Modal */}
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
                            <p><strong>Patient ID:</strong> {viewingVisitLog.patientId}</p>
                            <p><strong>Caregiver:</strong> {viewingVisitLog.caregiverName}</p>
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
                             <div className="card-body">
                        <p><strong>Notes:</strong></p>
                        <p className="border p-3 bg-light">{viewingVisitLog.notes}</p>
                        
                       
                      </div>
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