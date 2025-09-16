import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../Baseurl/Baseurl";

const AssignCaregiver = () => {
  // ====== CONFIG ======
  const BASE_URL = API_URL;

  // ---- auth helpers ----
  const safeJSON = (txt) => { try { return JSON.parse(txt); } catch { return null; } };
  const loginBlob = safeJSON(localStorage.getItem("user")) || {};
  const accessToken =
    localStorage.getItem("accessToken") ||
    loginBlob?.token ||
    "";
  const authHeaders = () =>
    accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  // Patients (static)
  const [patients] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", joinDate: "2023-09-15", status: "Active", phone: "555-1234", address: "123 Main St" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", joinDate: "2023-10-05", status: "Inactive", phone: "555-5678", address: "456 Oak Ave" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", joinDate: "2023-08-20", status: "Active", phone: "555-9012", address: "789 Elm St" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", joinDate: "2023-11-01", status: "Active", phone: "555-3456", address: "321 Pine Rd" },
  ]);

  // Caregivers from API
  const [caregivers, setCaregivers] = useState([]);
  const [loadingCaregivers, setLoadingCaregivers] = useState(false);
  const [caregiversError, setCaregiversError] = useState(null);

  // Assignments (UI table)
  const [assignments, setAssignments] = useState([]);

  // UI state
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedCaregiver, setSelectedCaregiver] = useState("");
  const [assignmentDate, setAssignmentDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [assignSubmitting, setAssignSubmitting] = useState(false);
  const [assignError, setAssignError] = useState(null);

  // ===== Helpers =====
  const resetForm = () => {
    setSelectedPatient("");
    setSelectedCaregiver("");
    setAssignmentDate("");
    setAssignError(null);
  };

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

  const getPatientNameFromApiId = (pid) => {
    const p = patients.find(p => String(p.id) === String(pid));
    return p?.name || (pid ? `#${pid}` : "-");
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
      patientId: trim(api.patientId) || "",
      age: api.age || "",
      role: api.role || "caregiver",
    };
  };

  // ===== GET /caregiver and seed Assignments table
  const fetchCaregivers = async () => {
    setLoadingCaregivers(true);
    setCaregiversError(null);
    try {
      const res = await axios.get(`${BASE_URL}/caregiver`, {
        headers: { ...authHeaders() }
      });
      const raw = Array.isArray(res?.data)
        ? res.data
        : (Array.isArray(res?.data?.data) ? res.data.data : []);
      const mapped = raw.map(mapApiCaregiver);
      setCaregivers(mapped);

      // seed into assignments table once
      setAssignments(prev => {
        if (prev.length > 0) return prev;
        const seeded = mapped.map((c, idx) => ({
          id: c.id || (Date.now() + idx),
          patientId: c.patientId || "",
          patientName: getPatientNameFromApiId(c.patientId),
          caregiverId: c.id,
          caregiverName: c.name,
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

  // ===== PUT /caregiver/:id — (Assign/Update patient to caregiver)
  const putAssignCaregiver = async (caregiverId, patientId, dateISO) => {
    const payload = {
      patientId: String(patientId),
      dateAssigned: dateISO,
      assignmentDate: dateISO,
    };

    const res = await axios.put(
      `${BASE_URL}/caregiver/${caregiverId}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...authHeaders(),
        },
      }
    );

    const updatedApi =
      res?.data?.caregiver ||
      res?.data?.data ||
      res?.data ||
      null;

    return updatedApi;
  };

  // ===== Assignment actions: CREATE (Assign Existing) with PUT
  const handleAssign = async () => {
    if (!selectedPatient || !selectedCaregiver || !assignmentDate) {
      setAssignError("Please fill all fields.");
      return;
    }
    setAssignSubmitting(true);
    setAssignError(null);

    try {
      const updatedApi = await putAssignCaregiver(
        selectedCaregiver,
        selectedPatient,
        assignmentDate
      );

      // Update caregivers list if server echoed updated caregiver
      if (updatedApi && updatedApi._id) {
        const mapped = mapApiCaregiver(updatedApi);
        setCaregivers(prev =>
          prev.some(c => String(c.id) === String(mapped.id))
            ? prev.map(c => (String(c.id) === String(mapped.id) ? { ...c, ...mapped } : c))
            : [...prev, mapped]
        );
      }

      // Add/Update assignment row in UI
      const patient = patients.find(p => p.id === parseInt(selectedPatient, 10));
      const caregiver = caregivers.find(c => String(c.id) === String(selectedCaregiver));

      const newAssignment = {
        id: Date.now(),
        patientId: patient?.id || Number(selectedPatient),
        patientName: patient?.name || getPatientNameFromApiId(selectedPatient),
        caregiverId: caregiver?.id || selectedCaregiver,
        caregiverName: caregiver?.name || "Caregiver",
        dateAssigned: assignmentDate,
        status: "Active",
      };
      setAssignments(prev => [...prev, newAssignment]);

      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
      setAssignError(err?.response?.data?.message || err?.message || "Failed to assign caregiver");
    } finally {
      setAssignSubmitting(false);
    }
  };

  // ===== Edit Assignment (open modal filled)
  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setSelectedPatient(assignment.patientId?.toString?.() || "");
    setSelectedCaregiver(assignment.caregiverId?.toString?.() || "");
    setAssignmentDate(assignment.dateAssigned || "");
    setShowEditModal(true);
  };

  // ===== PUT for Edit Assignment
  const handleUpdate = async () => {
    if (!selectedPatient || !selectedCaregiver || !assignmentDate) {
      alert("Please fill all fields");
      return;
    }
    try {
      // Call same PUT assign
      await putAssignCaregiver(selectedCaregiver, selectedPatient, assignmentDate);

      const patient = patients.find(p => p.id === parseInt(selectedPatient, 10));
      const caregiver = caregivers.find(c => String(c.id) === String(selectedCaregiver));

      const updatedAssignment = {
        ...editingAssignment,
        patientId: patient?.id || Number(selectedPatient),
        patientName: patient?.name || getPatientNameFromApiId(selectedPatient),
        caregiverId: caregiver?.id || selectedCaregiver,
        caregiverName: caregiver?.name || "Caregiver",
        dateAssigned: assignmentDate,
      };
      setAssignments(prev => prev.map(a => (a.id === editingAssignment.id ? updatedAssignment : a)));
      setShowEditModal(false);
      resetForm();
      setEditingAssignment(null);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || err?.message || "Failed to update assignment");
    }
  };

  const toggleStatus = (assignmentId) => {
    setAssignments(prev =>
      prev.map(assignment =>
        assignment.id === assignmentId
          ? { ...assignment, status: assignment.status === "Active" ? "Inactive" : "Active" }
          : assignment
      )
    );
  };

  return (
    <div className="">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h3 className="dashboard-heading">Assign Caregivers</h3>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={() => setShowModal(true)}>
            + Assign Existing
          </button>
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

      {/* ======= Assignments Table ======= */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Assignment ID</th>
                      <th>Patient</th>
                      <th>Caregiver</th>
                      <th>Photo</th>
                      <th>Date Assigned</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center text-muted">No assignments yet.</td>
                      </tr>
                    ) : (
                      assignments.map((assignment) => {
                        const caregiver = getCaregiverDetails(assignment.caregiverId);
                        return (
                          <tr key={assignment.id}>
                            <td>#{assignment.id}</td>
                            <td>{assignment.patientName || getPatientNameFromApiId(assignment.patientId)}</td>
                            <td>{assignment.caregiverName}</td>
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
                              <div className="d-flex gap-2">
                                <button className="btn btn-sm" onClick={() => handleEdit(assignment)} style={{ color: "#F95918" }} title="Edit">
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  className={`btn btn-sm ${assignment.status === "Active" ? "btn-outline-danger" : "btn-outline-success"}`}
                                  onClick={() => toggleStatus(assignment.id)}
                                  title={assignment.status === "Active" ? "Deactivate" : "Activate"}
                                >
                                  {assignment.status === "Active" ? <i className="fas fa-user-slash"></i> : <i className="fas fa-user-check"></i>}
                                </button>
                              </div>
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

      {/* Add Assignment Modal (assign existing) */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assign Caregiver to Patient</h5>
                <button type="button" className="btn-close" onClick={() => { setShowModal(false); resetForm(); }} />
              </div>
              <div className="modal-body">
                {assignError && <div className="alert alert-danger py-2">{assignError}</div>}
                <div className="mb-3">
                  <label className="form-label">Select Patient</label>
                  <select className="form-select" value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}>
                    <option value="">-- Choose Patient --</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} (ID: {patient.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Select Caregiver</label>
                  <select className="form-select" value={selectedCaregiver} onChange={(e) => setSelectedCaregiver(e.target.value)}>
                    <option value="">-- Choose Caregiver --</option>
                    {caregivers.map((caregiver) => (
                      <option key={caregiver.id} value={caregiver.id}>
                        {caregiver.name} (ID: {caregiver.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Assignment Date</label>
                  <input type="date" className="form-control" value={assignmentDate} onChange={(e) => setAssignmentDate(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                  Cancel
                </button>
                <button type="button" className="btn text-white" onClick={handleAssign} style={{ backgroundColor: "#F95918" }} disabled={assignSubmitting}>
                  {assignSubmitting ? "Assigning..." : "Assign Caregiver"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Assignment Modal */}
      {showEditModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Assignment</h5>
                <button type="button" className="btn-close" onClick={() => { setShowEditModal(false); resetForm(); setEditingAssignment(null); }} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Select Patient</label>
                  <select className="form-select" value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}>
                    <option value="">-- Choose Patient --</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} (ID: {patient.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Select Caregiver</label>
                  <select className="form-select" value={selectedCaregiver} onChange={(e) => setSelectedCaregiver(e.target.value)}>
                    <option value="">-- Choose Caregiver --</option>
                    {caregivers.map((caregiver) => (
                      <option key={caregiver.id} value={caregiver.id}>
                        {caregiver.name} (ID: {caregiver.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Assignment Date</label>
                  <input type="date" className="form-control" value={assignmentDate} onChange={(e) => setAssignmentDate(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowEditModal(false); resetForm(); setEditingAssignment(null); }}>
                  Cancel
                </button>
                <button type="button" className="btn text-white" onClick={handleUpdate} style={{ backgroundColor: "#F95918" }}>
                  Update Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignCaregiver;