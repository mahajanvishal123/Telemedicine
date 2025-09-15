import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../Baseurl/Baseurl";

const Caregiver = () => {
  // ====== CONFIG ======
  const BASE_URL = API_URL;
  
  // Patients (static)
  const [patients] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", joinDate: "2023-09-15", status: "Active", phone: "555-1234", address: "123 Main St" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", joinDate: "2023-10-05", status: "Inactive", phone: "555-5678", address: "456 Oak Ave" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", joinDate: "2023-08-20", status: "Active", phone: "555-9012", address: "789 Elm St" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", joinDate: "2023-11-01", status: "Active", phone: "555-3456", address: "321 Pine Rd" },
  ]);
  
  // Doctors (static)
  const [doctors] = useState([
    { id: 1, name: "Dr. Smith", specialty: "Cardiologist" },
    { id: 2, name: "Dr. Johnson", specialty: "Neurologist" },
    { id: 3, name: "Dr. Williams", specialty: "Pediatrician" },
    { id: 4, name: "Dr. Brown", specialty: "Orthopedic" },
  ]);
  
  // Caregivers from API
  const [caregivers, setCaregivers] = useState([]);
  const [loadingCaregivers, setLoadingCaregivers] = useState(false);
  const [caregiversError, setCaregiversError] = useState(null);
  
  // Assignments (UI me dikhne wale rows — ab yahi table me API data bhi render hoga)
  const [assignments, setAssignments] = useState([]);
  
  // UI state for view only
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingAssignment, setViewingAssignment] = useState(null);
  
  // ===== Helpers =====
  const getStatusClass = (status) => {
    switch (status) {
      case "Active": return "bg-success";
      case "Inactive": return "bg-secondary";
      default: return "bg-secondary";
    }
  };
  
  const getPatientDetails = (patientId) =>
    patients.find(p => String(p.id) === String(patientId));
  
  const getCaregiverDetails = (caregiverId) =>
    caregivers.find(c => String(c.id) === String(caregiverId));
    
  const getDoctorDetails = (doctorId) =>
    doctors.find(d => String(d.id) === String(doctorId));
    
  const getPatientNameFromApiId = (pid) => {
    const p = patients.find(p => String(p.id) === String(pid));
    return p?.name || (pid ? `#${pid}` : "-");
  };
  
  const getDoctorNameFromApiId = (did) => {
    const d = doctors.find(d => String(d.id) === String(did));
    return d?.name || (did ? `Dr. #${did}` : "-");
  };
  
  // ===== Map API caregiver -> local caregiver object
  const mapApiCaregiver = (api) => {
    const trim = (v) => (typeof v === "string" ? v.trim() : v);
    const expYears = (() => {
      const e = trim(api.experience);
      if (!e) return 0;
      const m = String(e).match(/(\d+)/);
      return m ? Number(m[1]) : 0;
    })();
    const docs = [];
    if (api.certificate && String(api.certificate).length > 0) {
      const fileName = String(api.certificate).split("/").pop() || "Certificate";
      docs.push({ name: fileName, url: api.certificate });
    }
    return {
      id: api._id,
      name: trim(api.name) || "",
      email: trim(api.email) || "",
      joinDate: api.createdAt ? String(api.createdAt).slice(0, 10) : "",
      status: "Active",
      certification: "",
      yearsExperience: expYears,
      mobile: trim(api.mobile) || "",
      address: trim(api.address) || "",
      skills: trim(api.skills) || "",
      profilePicture: trim(api.profile) || "https://via.placeholder.com/80",
      dateOfBirth: trim(api.dob) || "",
      gender: trim(api.gender) || "",
      bloodGroup: trim(api.bloodGroup) || "",
      password: "********",
      documents: docs,
      patientId: trim(api.patientId) || "",
      doctorId: trim(api.doctorId) || "",  // Added doctorId
      age: api.age || "",
      role: api.role || "caregiver",
    };
  };
  
  // ===== GET /caregiver and seed Assignments table
  const fetchCaregivers = async () => {
    setLoadingCaregivers(true);
    setCaregiversError(null);
    try {
      const res = await axios.get(`${BASE_URL}/caregiver`);
      const raw = Array.isArray(res?.data)
        ? res.data
        : (Array.isArray(res?.data?.data) ? res.data.data : []);
      const mapped = raw.map(mapApiCaregiver);
      setCaregivers(mapped);
      
      setAssignments(prev => {
        if (prev.length > 0) return prev;
        const seeded = mapped.map((c, idx) => ({
          id: c.id || (Date.now() + idx),
          patientId: c.patientId || "",
          patientName: getPatientNameFromApiId(c.patientId),
          caregiverId: c.id,
          caregiverName: c.name,
          doctorId: c.doctorId || (idx % 4) + 1,  // Assign a doctor if not provided
          doctorName: getDoctorNameFromApiId(c.doctorId || (idx % 4) + 1),
          dateAssigned: c.joinDate || new Date().toISOString().slice(0, 10),
          status: c.status || "Active",
        }));
        return seeded;
      });
    } catch (err) {
      console.error("Failed to fetch caregivers:", err);
      setCaregiversError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch caregivers"
      );
    } finally {
      setLoadingCaregivers(false);
    }
  };
  
  useEffect(() => {
    fetchCaregivers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // View Assignment Handler
  const handleView = (assignment) => {
    setViewingAssignment(assignment);
    setShowViewModal(true);
  };
  
  return (
    <div className="">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h3 className="dashboard-heading">Caregiver Assignments</h3>
        <div className="text-muted">
          Showing which doctor assigned which caregiver to which patient
        </div>
      </div>
      
      {/* Caregivers fetch state */}
      {loadingCaregivers && <div className="alert alert-info">Loading caregivers…</div>}
      {caregiversError && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{caregiversError}</span>
          <button className="btn btn-sm btn-outline-light" onClick={fetchCaregivers}>Retry</button>
        </div>
      )}
      
      {/* Assignments Table */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                       <th>ID</th>
                      <th>Assignment ID</th>
                      <th>Patient</th>
                      <th>Caregiver</th>
                      <th>Assigned By (Doctor)</th>
                      <th>Photo</th>
                      <th>Date Assigned</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center text-muted">No assignments yet.</td>
                      </tr>
                    ) : (
                      assignments.map((assignment, index) => {
                        const caregiver = getCaregiverDetails(assignment.caregiverId);
                        return (
                          <tr key={assignment.id}>
                                <td>{index+1}</td>
                            <td>#{assignment.id}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="ms-2">
                                  <div className="fw-bold">{assignment.patientName || getPatientNameFromApiId(assignment.patientId)}</div>
                                  <div className="text-muted small">ID: {assignment.patientId}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={caregiver?.profilePicture || "https://via.placeholder.com/40"}
                                  alt={caregiver?.name || "caregiver"}
                                  className="rounded-circle me-2"
                                  style={{ width: "30px", height: "30px", objectFit: "cover" }}
                                  onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/40"; }}
                                />
                                <div>
                                  <div className="fw-bold">{assignment.caregiverName}</div>
                                  <div className="text-muted small">ID: {assignment.caregiverId}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar avatar-sm me-2">
                                  <span className="avatar-title rounded-circle bg-primary text-white">
                                    {assignment.doctorName?.charAt(0) || 'D'}
                                  </span>
                                </div>
                                <div>
                                  <div className="fw-bold">{assignment.doctorName}</div>
                                  <div className="text-muted small">ID: {assignment.doctorId}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <img
                                src={caregiver?.profilePicture || "https://via.placeholder.com/40"}
                                alt={caregiver?.name || "caregiver"}
                                className="rounded-circle"
                                style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/40"; }}
                              />
                            </td>
                            <td>{assignment.dateAssigned || "-"}</td>
                            <td>
                              <span className={`badge ${getStatusClass(assignment.status)}`}>{assignment.status}</span>
                            </td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary" onClick={() => handleView(assignment)} title="View">
                                <i className="fas fa-eye"></i>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <div className="text-muted small">Caregivers loaded: {caregivers.length}</div>
            </div>
          </div>
        </div>
      </div>
 
      {/* View Assignment Modal */}
      {showViewModal && viewingAssignment && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assignment Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)} />
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4">
                    <h6 className="mb-3">Patient Information</h6>
                    {(() => {
                      const patient = getPatientDetails(viewingAssignment.patientId);
                      return patient ? (
                        <div className="card mb-3">
                          <div className="card-body">
                            <p><strong>Name:</strong> {patient.name}</p>
                            <p><strong>Email:</strong> {patient.email}</p>
                            <p><strong>Phone:</strong> {patient.phone}</p>
                            <p><strong>Address:</strong> {patient.address}</p>
                            <p><strong>Join Date:</strong> {patient.joinDate}</p>
                            <p><strong>Status:</strong>
                              <span className={`badge ${getStatusClass(patient.status)} ms-2`}>{patient.status}</span>
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted">Patient: {getPatientNameFromApiId(viewingAssignment.patientId)}</div>
                      );
                    })()}
                  </div>
                  <div className="col-md-4">
                    <h6 className="mb-3">Caregiver Information</h6>
                    {(() => {
                      const caregiver = getCaregiverDetails(viewingAssignment.caregiverId);
                      return caregiver ? (
                        <div className="card mb-3">
                          <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                              <img
                                src={caregiver.profilePicture || "https://via.placeholder.com/80"}
                                alt={caregiver.name}
                                className="rounded-circle me-3"
                                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/80"; }}
                              />
                              <div>
                                <h5 className="mb-1">{caregiver.name}</h5>
                                <p className="mb-0">{caregiver.certification}</p>
                              </div>
                            </div>
                            <p><strong>Email:</strong> {caregiver.email}</p>
                            <p><strong>Mobile:</strong> {caregiver.mobile}</p>
                            <p><strong>Experience:</strong> {caregiver.yearsExperience} years</p>
                            <p><strong>Skills:</strong> {caregiver.skills}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted">Caregiver not found in list.</div>
                      );
                    })()}
                  </div>
                  <div className="col-md-4">
                    <h6 className="mb-3">Doctor Information</h6>
                    {(() => {
                      const doctor = getDoctorDetails(viewingAssignment.doctorId);
                      return doctor ? (
                        <div className="card mb-3">
                          <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                              <div className="avatar avatar-lg me-3">
                                <span className="avatar-title rounded-circle bg-primary text-white">
                                  {doctor.name?.charAt(0) || 'D'}
                                </span>
                              </div>
                              <div>
                                <h5 className="mb-1">{doctor.name}</h5>
                                <p className="mb-0">{doctor.specialty}</p>
                              </div>
                            </div>
                            <p><strong>Doctor ID:</strong> {doctor.id}</p>
                            <p><strong>Specialty:</strong> {doctor.specialty}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted">Doctor: {getDoctorNameFromApiId(viewingAssignment.doctorId)}</div>
                      );
                    })()}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <h6 className="mb-3">Assignment Information</h6>
                    <div className="card">
                      <div className="card-body">
                        <p><strong>Assignment ID:</strong> #{viewingAssignment.id}</p>
                        <p><strong>Patient:</strong> {viewingAssignment.patientName || getPatientNameFromApiId(viewingAssignment.patientId)}</p>
                        <p><strong>Caregiver:</strong> {viewingAssignment.caregiverName}</p>
                        <p><strong>Assigned By (Doctor):</strong> {viewingAssignment.doctorName}</p>
                        <p><strong>Date Assigned:</strong> {viewingAssignment.dateAssigned || "-"}</p>
                        <p><strong>Status:</strong>
                          <span className={`badge ${getStatusClass(viewingAssignment.status)} ms-2`}>{viewingAssignment.status}</span>
                        </p>
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

export default Caregiver;