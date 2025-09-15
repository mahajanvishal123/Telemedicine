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

  // Caregivers from API
  const [caregivers, setCaregivers] = useState([]);
  const [loadingCaregivers, setLoadingCaregivers] = useState(false);
  const [caregiversError, setCaregiversError] = useState(null);

  // Assignments (UI me dikhne wale rows — ab yahi table me API data bhi render hoga)
  const [assignments, setAssignments] = useState([]);

  // UI state
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedCaregiver, setSelectedCaregiver] = useState("");
  const [assignmentDate, setAssignmentDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [viewingAssignment, setViewingAssignment] = useState(null);

  // New caregiver form (for POST)
  const [newCaregiver, setNewCaregiver] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    certification: "",
    yearsExperience: "",
    skills: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    password: "",
    confirmPassword: "",
    profilePicture: "",
    profilePictureFile: null,
    documents: [],
    documentFiles: []
  });

  const [selectedPatientForNewCaregiver, setSelectedPatientForNewCaregiver] = useState("");
  const [assignmentDateForNewCaregiver, setAssignmentDateForNewCaregiver] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit caregiver (local)
  const [editingCaregiver, setEditingCaregiver] = useState(null);
  const [showEditCaregiverModal, setShowEditCaregiverModal] = useState(false);

  // DELETE API state
  const [deletingCaregiverId, setDeletingCaregiverId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  // PUT update state
  const [updatingCaregiver, setUpdatingCaregiver] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  // ===== Helpers =====
  const resetForm = () => {
    setSelectedPatient("");
    setSelectedCaregiver("");
    setAssignmentDate("");
  };

  const resetNewCaregiverForm = () => {
    setNewCaregiver({
      name: "",
      email: "",
      mobile: "",
      address: "",
      certification: "",
      yearsExperience: "",
      skills: "",
      dateOfBirth: "",
      gender: "",
      bloodGroup: "",
      password: "",
      confirmPassword: "",
      profilePicture: "",
      profilePictureFile: null,
      documents: [],
      documentFiles: []
    });
    setSelectedPatientForNewCaregiver("");
    setAssignmentDateForNewCaregiver("");
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
      age: api.age || "",
      role: api.role || "caregiver",
    };
  };

  // ===== GET /caregiver and seed Assignments table
const fetchCaregivers = async () => {
  setLoadingCaregivers(true); // Loading UI show karo
  setCaregiversError(null);   // Purani errors clear karo

  try {
    // ===== YAHAN API CALL HOTI HAI =====
    const res = await axios.get(`${BASE_URL}/caregiver`);

    // Response ko process karo
    const raw = Array.isArray(res?.data)
      ? res.data
      : (Array.isArray(res?.data?.data) ? res.data.data : []);

    // API ke data ko apne local format mein convert karo
    const mapped = raw.map(mapApiCaregiver);

    // State mein daal do
    setCaregivers(mapped);

    // Assignment table ke liye bhi data taiyar karo
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
    // Agar error aaye toh usko handle karo
    console.error("Failed to fetch caregivers:", err);
    setCaregiversError(
      err?.response?.data?.message ||
      err?.message ||
      "Failed to fetch caregivers"
    );
  } finally {
    // Loading hamesha band karo, chahe success ho ya error
    setLoadingCaregivers(false);
  }
};

  useEffect(() => {
    fetchCaregivers();
    
  }, []);

  // ===== Assignment actions (local)
  const handleAssign = () => {
    if (!selectedPatient || !selectedCaregiver || !assignmentDate) {
      alert("Please fill all fields");
      return;
    }
    const patient = patients.find(p => p.id === parseInt(selectedPatient, 10));
    const caregiver = caregivers.find(c => String(c.id) === String(selectedCaregiver));
    if (!patient || !caregiver) {
      alert("Invalid patient or caregiver");
      return;
    }
    const newAssignment = {
      id: Date.now(),
      patientId: patient.id,
      patientName: patient.name,
      caregiverId: caregiver.id,
      caregiverName: caregiver.name,
      dateAssigned: assignmentDate,
      status: "Active",
    };
    setAssignments(prev => [...prev, newAssignment]);
    setShowModal(false);
    resetForm();
  };

  const handleDelete = (assignment) => {
    setSelectedAssignment(assignment);
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  // ====== DELETE caregiver API ======
  const deleteCaregiverFromApi = async (caregiverId) => {
    return axios.delete(`${BASE_URL}/caregiver/${caregiverId}`, {
      headers: {
        // Authorization: `Bearer ${token}`,
      },
    });
  };

  const confirmDelete = async () => {
    if (!selectedAssignment) return;
    const caregiverId = selectedAssignment.caregiverId;

    try {
      setDeletingCaregiverId(caregiverId);
      setDeleteError(null);

      await deleteCaregiverFromApi(caregiverId);

      setCaregivers(prev => prev.filter(c => String(c.id) !== String(caregiverId)));
      setAssignments(prev => prev.filter(a => String(a.caregiverId) !== String(caregiverId)));

      setShowDeleteModal(false);
      setSelectedAssignment(null);
      alert("Caregiver deleted successfully.");
    } catch (err) {
      console.error(err);
      setDeleteError(err?.response?.data?.message || err?.message || "Failed to delete caregiver");
    } finally {
      setDeletingCaregiverId(null);
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

  const handleEdit = (assignment) => {
    const cg = getCaregiverDetails(assignment.caregiverId);
    // start with caregiver details if available so we can PUT them
    setEditingCaregiver({
      ...(cg || {}),
      // ensure fields exist
      id: cg?.id || assignment.caregiverId,
      name: cg?.name || assignment.caregiverName || "",
      email: cg?.email || "",
      gender: cg?.gender || "",
      bloodGroup: cg?.bloodGroup || "",
      age: cg?.age || "",
      dateOfBirth: cg?.dateOfBirth || "",
      role: cg?.role || "caregiver",
      password: "",
      confirmPassword: "",
      profilePicture: cg?.profilePicture || "",
      profileFile: null,            // <-- will hold File for PUT
      certificateFiles: [],         // <-- will hold File(s) for PUT
      documents: cg?.documents || []
    });

    setEditingAssignment(assignment);
    setSelectedPatient(assignment.patientId?.toString?.() || "");
    setSelectedCaregiver(assignment.caregiverId?.toString?.() || "");
    setAssignmentDate(assignment.dateAssigned || "");
    setUpdateError(null);
    setShowEditModal(true);
  };

  const handleView = (assignment) => {
    setViewingAssignment(assignment);
    setShowViewModal(true);
  };

  const handleUpdate = () => {
    if (!selectedPatient || !selectedCaregiver || !assignmentDate) {
      alert("Please fill all fields");
      return;
    }
    const patient = patients.find(p => p.id === parseInt(selectedPatient, 10));
    const caregiver = caregivers.find(c => String(c.id) === String(selectedCaregiver));
    if (!patient || !caregiver) {
      alert("Invalid patient or caregiver");
      return;
    }
    const updatedAssignment = {
      ...editingAssignment,
      patientId: patient.id,
      patientName: patient.name,
      caregiverId: caregiver.id,
      caregiverName: caregiver.name,
      dateAssigned: assignmentDate,
    };
    setAssignments(prev => prev.map(a => (a.id === editingAssignment.id ? updatedAssignment : a)));
    setShowEditModal(false);
    resetForm();
    setEditingAssignment(null);
  };

  // ===== New Caregiver form handlers
  const handleNewCaregiverChange = (e) => {
    const { name, value } = e.target;
    setNewCaregiver(prev => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCaregiver(prev => ({
          ...prev,
          profilePicture: reader.result,
          profilePictureFile: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newDocuments = [...newCaregiver.documents];
    const newDocumentFiles = [...newCaregiver.documentFiles];
    files.forEach(file => {
      newDocuments.push({ name: file.name, url: URL.createObjectURL(file) });
      newDocumentFiles.push(file);
    });
    setNewCaregiver(prev => ({
      ...prev,
      documents: newDocuments,
      documentFiles: newDocumentFiles
    }));
  };

  const handleDocumentRemove = (index) => {
    const newDocuments = [...newCaregiver.documents];
    const newDocumentFiles = [...newCaregiver.documentFiles];
    newDocuments.splice(index, 1);
    newDocumentFiles.splice(index, 1);
    setNewCaregiver(prev => ({ ...prev, documents: newDocuments, documentFiles: newDocumentFiles }));
  };

  // ===== Edit Caregiver (local) =====
  const handleEditCaregiver = (caregiver) => {
    setEditingCaregiver({
      ...caregiver,
      password: "",
      confirmPassword: "",
      profileFile: null,
      certificateFiles: []
    });
    setShowEditCaregiverModal(true);
  };

  const handleCaregiverChange = (e) => {
    const { name, value } = e.target;
    setEditingCaregiver(prev => ({ ...prev, [name]: value }));
  };

  const handleCaregiverProfilePictureUpdate = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingCaregiver(prev => ({
          ...prev,
          profilePicture: reader.result, // preview
          profileFile: file              // real file for PUT
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaregiverCertificateUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setEditingCaregiver(prev => ({
      ...prev,
      certificateFiles: files
    }));
  };

  const handleCaregiverDocumentUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newDocuments = [...(editingCaregiver.documents || [])];
    files.forEach(file => newDocuments.push({ name: file.name, url: URL.createObjectURL(file) }));
    setEditingCaregiver(prev => ({ ...prev, documents: newDocuments }));
  };

  const handleCaregiverDocumentRemove = (index) => {
    const newDocuments = [...(editingCaregiver.documents || [])];
    newDocuments.splice(index, 1);
    setEditingCaregiver(prev => ({ ...prev, documents: newDocuments }));
  };

  // ===== PUT /caregiver/:id (Update) — multipart/form-data
  const handleUpdateCaregiver = async () => {
    if (!editingCaregiver?.name || !editingCaregiver?.email) {
      alert("Please fill required fields (Name, Email)");
      return;
    }

    const caregiverIdForApi =
      editingCaregiver?.id || "68c2d40a66c0d5af532795b7"; // fallback as per your example

    const fd = new FormData();
    // match payload keys you shared
    fd.append("name", String(editingCaregiver.name || "").trim());
    fd.append("email", String(editingCaregiver.email || "").trim());
    if (editingCaregiver.password) {
      fd.append("password", String(editingCaregiver.password || "").trim());
    }
    if (editingCaregiver.gender) fd.append("gender", String(editingCaregiver.gender).trim());
    if (editingCaregiver.profileFile) fd.append("profile", editingCaregiver.profileFile);
    if (editingCaregiver.age) fd.append("age", String(editingCaregiver.age).trim());
    if (editingCaregiver.dateOfBirth) fd.append("dob", String(editingCaregiver.dateOfBirth).trim());
    if (Array.isArray(editingCaregiver.certificateFiles) && editingCaregiver.certificateFiles.length) {
      editingCaregiver.certificateFiles.forEach((file) => fd.append("certificate", file));
    }
    if (editingCaregiver.role) fd.append("role", String(editingCaregiver.role).trim());
    if (editingCaregiver.bloodGroup) fd.append("bloodGroup", String(editingCaregiver.bloodGroup).trim());

    try {
      setUpdatingCaregiver(true);
      setUpdateError(null);

      const res = await axios.put(
        `${BASE_URL}/caregiver/${caregiverIdForApi}`,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // Authorization: `Bearer ${token}`,
          },
        }
      );

      // normalize response
      const updatedApi =
        res?.data?.appointment || // if backend reuses shapes
        res?.data?.data ||
        res?.data?.caregiver ||
        res?.data ||
        null;

      if (!updatedApi) {
        throw new Error("No caregiver returned from server");
      }

      const mapped = mapApiCaregiver(updatedApi);

      // update caregivers list
      setCaregivers((prev) =>
        prev.map((c) =>
          String(c.id) === String(caregiverIdForApi) ? { ...c, ...mapped } : c
        )
      );

      // update any assignment rows that show the name/photo
      setAssignments((prev) =>
        prev.map((a) =>
          String(a.caregiverId) === String(caregiverIdForApi)
            ? { ...a, caregiverName: mapped.name }
            : a
        )
      );

      alert("Caregiver updated successfully.");
      setShowEditCaregiverModal(false);
      setEditingCaregiver(null);
    } catch (err) {
      console.error(err);
      setUpdateError(err?.response?.data?.message || err?.message || "Failed to update caregiver");
    } finally {
      setUpdatingCaregiver(false);
    }
  };


  return (
    <div className="">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h3 className="dashboard-heading">Assign Caregivers</h3>
   
      </div>

      {/* Caregivers fetch state */}
      {loadingCaregivers && <div className="alert alert-info">Loading caregivers…</div>}
      {caregiversError && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{caregiversError}</span>
          <button className="btn btn-sm btn-outline-light" onClick={fetchCaregivers}>Retry</button>
        </div>
      )}

      
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
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
                      assignments.map((assignment,index) => {
                        const caregiver = getCaregiverDetails(assignment.caregiverId);
                        const isDeletingThis = String(deletingCaregiverId) === String(assignment.caregiverId);
                        return (
                          <tr key={assignment.id}>
                            <td>{index+1}</td>
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
                                <button className="btn btn-sm btn-outline-primary" onClick={() => handleView(assignment)} title="View">
                                  <i className="fas fa-eye"></i>
                                </button>
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
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(assignment)}
                                  title="Delete caregiver"
                                  disabled={isDeletingThis}
                                >
                                  {isDeletingThis ? (
                                    <span className="spinner-border spinner-border-sm" />
                                  ) : (
                                    <i className="fas fa-trash"></i>
                                  )}
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
                        {caregiver.name} 
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

      {/* Delete Confirmation Modal (DELETE /caregiver/:id) */}
      {showDeleteModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Caregiver</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)} />
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this caregiver? This will remove their assignments as well.</p>
                <div className="card bg-light">
                  <div className="card-body">
                    <p><strong>Patient:</strong> {selectedAssignment?.patientName || getPatientNameFromApiId(selectedAssignment?.patientId)}</p>
                    <p><strong>Caregiver:</strong> {selectedAssignment?.caregiverName}</p>
                    <p><strong>Date Assigned:</strong> {selectedAssignment?.dateAssigned}</p>
                  </div>
                </div>
                {deleteError && <div className="alert alert-danger mt-3">{deleteError}</div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                  disabled={String(deletingCaregiverId) === String(selectedAssignment?.caregiverId)}
                >
                  {String(deletingCaregiverId) === String(selectedAssignment?.caregiverId)
                    ? (<><span className="spinner-border spinner-border-sm me-2" /> Deleting...</>)
                    : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <div className="col-md-6">
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
                  <div className="col-md-6">
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
                            <p><strong>Address:</strong> {caregiver.address}</p>
                            <p><strong>Experience:</strong> {caregiver.yearsExperience} years</p>
                            <p><strong>Skills:</strong> {caregiver.skills}</p>
                            <p><strong>Date of Birth:</strong> {caregiver.dateOfBirth}</p>
                            <p><strong>Gender:</strong> {caregiver.gender}</p>
                            <p><strong>Blood Group:</strong> {caregiver.bloodGroup}</p>
                            <p><strong>Password:</strong> {caregiver.password}</p>
                            <p><strong>Status:</strong>
                              <span className={`badge ${getStatusClass(caregiver.status)} ms-2`}>{caregiver.status}</span>
                            </p>
                            {caregiver.documents?.length > 0 && (
                              <div className="mt-3">
                                <h6>Documents:</h6>
                                <ul className="list-group">
                                  {caregiver.documents.map((doc, index) => (
                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                      <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.name}</a>
                                      <i className="fas fa-file-pdf text-danger"></i>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <div className="mt-3">
                              <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditCaregiver(caregiver)}>
                                <i className="fas fa-edit me-1" /> Edit Caregiver
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted">Caregiver not found in list.</div>
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

 

      {/* Edit Caregiver Modal (PUT /caregiver/:id) */}
      {showEditCaregiverModal && editingCaregiver && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Caregiver</h5>
                <button type="button" className="btn-close" onClick={() => { setShowEditCaregiverModal(false); setEditingCaregiver(null); }} />
              </div>
              <div className="modal-body">
                {updateError && <div className="alert alert-danger">{updateError}</div>}

                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Full Name*</label>
                    <input type="text" className="form-control mb-2" name="name" value={editingCaregiver.name || ""} onChange={handleCaregiverChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email*</label>
                    <input type="email" className="form-control mb-2" name="email" value={editingCaregiver.email || ""} onChange={handleCaregiverChange} required />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control mb-2" name="password" value={editingCaregiver.password || ""} onChange={handleCaregiverChange} placeholder="Leave blank to keep current password" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Gender</label>
                    <select className="form-select mb-2" name="gender" value={editingCaregiver.gender || ""} onChange={handleCaregiverChange}>
                      <option value="">-- Select Gender --</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Blood Group</label>
                    <select className="form-select mb-2" name="bloodGroup" value={editingCaregiver.bloodGroup || ""} onChange={handleCaregiverChange}>
                      <option value="">-- Select Blood Group --</option>
                      <option value="A+">A+</option><option value="A-">A-</option>
                      <option value="B+">B+</option><option value="B-">B-</option>
                      <option value="AB+">AB+</option><option value="AB-">AB-</option>
                      <option value="O+">O+</option><option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <label className="form-label">Age</label>
                    <input type="number" className="form-control mb-2" name="age" value={editingCaregiver.age || ""} onChange={handleCaregiverChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" className="form-control mb-2" name="dateOfBirth" value={editingCaregiver.dateOfBirth || ""} onChange={handleCaregiverChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Role</label>
                    <input type="text" className="form-control mb-2" name="role" value={editingCaregiver.role || "caregiver"} onChange={handleCaregiverChange} />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Profile Picture</label>
                    <div className="mb-2">
                      <input type="file" className="form-control" accept="image/*" onChange={handleCaregiverProfilePictureUpdate} />
                    </div>
                    {editingCaregiver.profilePicture && (
                      <div className="mt-2">
                        <p className="mb-1">Current / New Profile Picture:</p>
                        <img src={editingCaregiver.profilePicture} alt="Profile" className="rounded-circle" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Upload Certificate(s)</label>
                    <div className="mb-2">
                      <input type="file" className="form-control" multiple onChange={handleCaregiverCertificateUpload} />
                      <small className="text-muted">PDFs or images accepted.</small>
                    </div>
                  </div>
                </div>

                {/* (Optional) keep a local list for previewing non-sent documents */}
                {editingCaregiver.documents?.length > 0 && (
                  <div className="row mt-2">
                    <div className="col-12">
                      <p className="mb-1">Existing Documents:</p>
                      <ul className="list-group">
                        {editingCaregiver.documents.map((doc, index) => (
                          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.name}</a>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleCaregiverDocumentRemove(index)}>
                              <i className="fas fa-trash"></i>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowEditCaregiverModal(false); setEditingCaregiver(null); }}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn text-white"
                  onClick={handleUpdateCaregiver}
                  style={{ backgroundColor: "#F95918" }}
                  disabled={updatingCaregiver}
                >
                  {updatingCaregiver ? (<><span className="spinner-border spinner-border-sm me-2" /> Updating...</>) : "Update Caregiver"}
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