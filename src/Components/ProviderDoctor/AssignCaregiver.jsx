// src/pages/Caregiver/AssignCaregiver.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../Baseurl/Baseurl";

const AssignCaregiver = () => {
  const BASE_URL = API_URL;

<<<<<<< HEAD
  // ---------- Resolve current userId (NO TOKEN) ----------
=======
  // ---- auth helpers ----
>>>>>>> dc217746551ed7b3e1c7761eb5e7649887fbd8af
  const safeJSON = (txt) => { try { return JSON.parse(txt); } catch { return null; } };
  const pickId = (obj) => {
    if (!obj || typeof obj !== "object") return null;
    const keys = ["id", "_id", "userId", "uid", "sub"];
    for (const k of keys) if (obj[k]) return obj[k];
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (v && typeof v === "object") {
        const nested = pickId(v);
        if (nested) return nested;
      }
    }
    return null;
  };
  const resolveUserId = () => {
    // 1) URL ?id=
    try {
      const params = new URLSearchParams(window.location.search);
      const qid = params.get("id");
      if (qid) return qid;
    } catch {}
    // 2) direct storage
    const direct = localStorage.getItem("userId") || sessionStorage.getItem("userId");
    if (direct) return direct;
    // 3) JSON blobs
    const jsonKeys = ["user", "profile", "auth", "currentUser", "loginUser"];
    for (const store of [localStorage, sessionStorage]) {
      for (const key of jsonKeys) {
        const obj = safeJSON(store.getItem(key));
        const id = pickId(obj);
        if (id) return id;
      }
    }
    return null;
  };

  const userId = resolveUserId();

  // Patients (static demo)
  const [patients] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", joinDate: "2023-09-15", status: "Active", phone: "555-1234", address: "123 Main St" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", joinDate: "2023-10-05", status: "Inactive", phone: "555-5678", address: "456 Oak Ave" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", joinDate: "2023-08-20", status: "Active", phone: "555-9012", address: "789 Elm St" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", joinDate: "2023-11-01", status: "Active", phone: "555-3456", address: "321 Pine Rd" },
  ]);

  // Caregivers (API)
  const [caregivers, setCaregivers] = useState([]);
  const [loadingCaregivers, setLoadingCaregivers] = useState(false);
  const [caregiversError, setCaregiversError] = useState(null);

  // Assignments (UI)
  const [assignments, setAssignments] = useState([]);

  // UI state
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedCaregiver, setSelectedCaregiver] = useState("");
  const [assignmentDate, setAssignmentDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
<<<<<<< HEAD
  const [viewingAssignment, setViewingAssignment] = useState(null);

  // New caregiver (POST)
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

  // Delete API state
  const [deletingCaregiverId, setDeletingCaregiverId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  // Update caregiver API state
  const [updatingCaregiver, setUpdatingCaregiver] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  // Assign states
=======
>>>>>>> dc217746551ed7b3e1c7761eb5e7649887fbd8af
  const [assignSubmitting, setAssignSubmitting] = useState(false);
  const [assignError, setAssignError] = useState(null);

  // ------------ Helpers ------------
  const resetForm = () => {
    setSelectedPatient("");
    setSelectedCaregiver("");
    setAssignmentDate("");
    setAssignError(null);
  };
<<<<<<< HEAD
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
  const getStatusClass = (status) => (status === "Active" ? "bg-success" : "bg-secondary");
  const getPatientDetails = (patientId) => patients.find(p => String(p.id) === String(patientId));
  const getCaregiverDetails = (caregiverId) => caregivers.find(c => String(c.id) === String(caregiverId));
=======

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

>>>>>>> dc217746551ed7b3e1c7761eb5e7649887fbd8af
  const getPatientNameFromApiId = (pid) => {
    const p = patients.find(p => String(p.id) === String(pid));
    return p?.name || (pid ? `#${pid}` : "-");
  };

  // Map API caregiver -> local
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

  // ---------- ALL API CALLS BY ID (query param userId) ----------
  const fetchCaregivers = async () => {
    if (!userId) {
      setCaregiversError("User ID not found. URL me ?id= pass karo ya localStorage me 'userId' save karo.");
      return;
    }
    setLoadingCaregivers(true);
    setCaregiversError(null);
    try {
      const res = await axios.get(`${BASE_URL}/caregiver`, {
        params: { userId },
      });
      const raw = Array.isArray(res?.data)
        ? res.data
        : (Array.isArray(res?.data?.data) ? res.data.data : []);
      const mapped = raw.map(mapApiCaregiver);
      setCaregivers(mapped);

      // Seed assignments once from caregivers
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

  useEffect(() => { fetchCaregivers(); /* eslint-disable-next-line */ }, []);

  // PUT /caregiver/:id (assign patient) — BY ID
  const putAssignCaregiver = async (caregiverId, patientId, dateISO) => {
<<<<<<< HEAD
    if (!userId) throw new Error("User ID missing.");
=======
>>>>>>> dc217746551ed7b3e1c7761eb5e7649887fbd8af
    const payload = {
      patientId: String(patientId),
      dateAssigned: dateISO,
      assignmentDate: dateISO,
    };
    const res = await axios.put(
      `${BASE_URL}/caregiver/${caregiverId}`,
      payload,
      { params: { userId } }
    );
<<<<<<< HEAD
=======

>>>>>>> dc217746551ed7b3e1c7761eb5e7649887fbd8af
    const updatedApi =
      res?.data?.caregiver ||
      res?.data?.data ||
      res?.data ||
      null;
    return updatedApi;
  };

  // Assign existing caregiver
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

      if (updatedApi && updatedApi._id) {
        const mapped = mapApiCaregiver(updatedApi);
        setCaregivers(prev =>
          prev.some(c => String(c.id) === String(mapped.id))
            ? prev.map(c => (String(c.id) === String(mapped.id) ? { ...c, ...mapped } : c))
            : [...prev, mapped]
        );
      }

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

<<<<<<< HEAD
  // Delete caregiver (BY ID)
  const deleteCaregiverFromApi = async (caregiverId) => {
    if (!userId) throw new Error("User ID missing.");
    return axios.delete(`${BASE_URL}/caregiver/${caregiverId}`, {
      params: { userId },
    });
  };

  const handleDelete = (assignment) => {
    setSelectedAssignment(assignment);
    setDeleteError(null);
    setShowDeleteModal(true);
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

  // Toggle status (UI only)
  const toggleStatus = (assignmentId) => {
    setAssignments(prev =>
      prev.map(assignment =>
        assignment.id === assignmentId
          ? { ...assignment, status: assignment.status === "Active" ? "Inactive" : "Active" }
          : assignment
      )
    );
  };

  // Edit Assignment
=======
  // ===== Edit Assignment (open modal filled)
>>>>>>> dc217746551ed7b3e1c7761eb5e7649887fbd8af
  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setSelectedPatient(assignment.patientId?.toString?.() || "");
    setSelectedCaregiver(assignment.caregiverId?.toString?.() || "");
    setAssignmentDate(assignment.dateAssigned || "");
    setShowEditModal(true);
  };

  // Update Assignment (PUT BY ID)
  const handleUpdate = async () => {
    if (!selectedPatient || !selectedCaregiver || !assignmentDate) {
      alert("Please fill all fields");
      return;
    }
    try {
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

<<<<<<< HEAD
  // New Caregiver form handlers
  const handleNewCaregiverChange = (e) => {
    const { name, value } = e.target;
    setNewCaregiver(prev => ({ ...prev, [name]: value }));
  };
  const handleProfilePictureUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCaregiver(prev => ({ ...prev, profilePicture: reader.result, profilePictureFile: file }));
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
    setNewCaregiver(prev => ({ ...prev, documents: newDocuments, documentFiles: newDocumentFiles }));
  };
  const handleDocumentRemove = (index) => {
    const newDocuments = [...newCaregiver.documents];
    const newDocumentFiles = [...newCaregiver.documentFiles];
    newDocuments.splice(index, 1);
    newDocumentFiles.splice(index, 1);
    setNewCaregiver(prev => ({ ...prev, documents: newDocuments, documentFiles: newDocumentFiles }));
  };

  // Edit caregiver (open modal)
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
        setEditingCaregiver(prev => ({ ...prev, profilePicture: reader.result, profileFile: file }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCaregiverCertificateUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setEditingCaregiver(prev => ({ ...prev, certificateFiles: files }));
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

  // PUT caregiver profile (BY ID)
  const handleUpdateCaregiver = async () => {
    if (!editingCaregiver?.name || !editingCaregiver?.email) {
      alert("Please fill required fields (Name, Email)");
      return;
    }
    if (!userId) {
      alert("User ID not found.");
      return;
    }

    const caregiverIdForApi = editingCaregiver?.id;
    const fd = new FormData();
    fd.append("name", String(editingCaregiver.name || "").trim());
    fd.append("email", String(editingCaregiver.email || "").trim());
    if (editingCaregiver.password) fd.append("password", String(editingCaregiver.password || "").trim());
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
        { params: { userId } }
      );

      const updatedApi =
        res?.data?.appointment ||
        res?.data?.data ||
        res?.data?.caregiver ||
        res?.data ||
        null;

      if (!updatedApi) throw new Error("No caregiver returned from server");

      const mapped = mapApiCaregiver(updatedApi);

      setCaregivers((prev) =>
        prev.map((c) =>
          String(c.id) === String(caregiverIdForApi) ? { ...c, ...mapped } : c
        )
      );

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

  // POST caregiver (Add & Assign) — BY ID
  const handleAddCaregiverAndAssign = async () => {
    if (!newCaregiver.name || !newCaregiver.email || !newCaregiver.mobile || !newCaregiver.gender) {
      alert("Please fill all required caregiver fields (Name, Email, Mobile, Gender)");
      return;
    }
    if (!newCaregiver.password) {
      alert("Please set a password for the caregiver");
      return;
    }
    if (newCaregiver.password !== newCaregiver.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!selectedPatientForNewCaregiver || !assignmentDateForNewCaregiver) {
      alert("Please select a patient and assignment date");
      return;
    }
    if (!userId) {
      alert("User ID not found.");
      return;
    }

    const fd = new FormData();
    fd.append("name", newCaregiver.name.trim());
    fd.append("email", newCaregiver.email.trim());
    fd.append("password", newCaregiver.password);
    fd.append("gender", newCaregiver.gender);
    fd.append("role", "caregiver");
    if (newCaregiver.profilePictureFile) fd.append("profile", newCaregiver.profilePictureFile);
    if (newCaregiver.dateOfBirth) fd.append("dob", newCaregiver.dateOfBirth);
    if (newCaregiver.bloodGroup) fd.append("bloodGroup", newCaregiver.bloodGroup);
    if (newCaregiver.yearsExperience) fd.append("experience", `${newCaregiver.yearsExperience} yrs`);
    if (newCaregiver.address) fd.append("address", newCaregiver.address);
    if (newCaregiver.mobile) fd.append("mobile", newCaregiver.mobile);
    if (newCaregiver.skills) fd.append("skills", newCaregiver.skills);
    if (newCaregiver.documentFiles?.length) newCaregiver.documentFiles.forEach((file) => fd.append("certificate", file));
    fd.append("patientId", String(selectedPatientForNewCaregiver));
    fd.append("dateAssigned", assignmentDateForNewCaregiver);

    try {
      setSubmitting(true);
      const res = await axios.post(`${BASE_URL}/caregiver`, fd, {
        params: { userId }
      });

      const apiData = res?.data?.data || res?.data || {};
      const createdCaregiver = apiData.caregiver || apiData.createdCaregiver || apiData;
      const newId = createdCaregiver?._id ??
        (Math.max(0, ...caregivers.map((c) => Number(c.id) || 0)) + 1);

      const caregiverForState = {
        id: newId,
        name: createdCaregiver?.name?.trim() || newCaregiver.name,
        email: createdCaregiver?.email?.trim() || newCaregiver.email,
        mobile: createdCaregiver?.mobile?.trim?.() || newCaregiver.mobile || "",
        address: createdCaregiver?.address?.trim?.() || newCaregiver.address || "",
        certification: createdCaregiver?.certification || newCaregiver.certification || "",
        yearsExperience: createdCaregiver?.yearsExperience ?? Number(newCaregiver.yearsExperience || 0),
        skills: createdCaregiver?.skills?.trim?.() || newCaregiver.skills || "",
        profilePicture: createdCaregiver?.profile || newCaregiver.profilePicture || "https://via.placeholder.com/80",
        dateOfBirth: createdCaregiver?.dob || newCaregiver.dateOfBirth || "",
        gender: createdCaregiver?.gender || newCaregiver.gender || "",
        bloodGroup: createdCaregiver?.bloodGroup || newCaregiver.bloodGroup || "",
        password: "********",
        status: createdCaregiver?.status || "Active",
        joinDate: createdCaregiver?.createdAt?.slice?.(0, 10) || new Date().toISOString().split("T")[0],
        documents: createdCaregiver?.documents || newCaregiver.documents.map((d) => ({ name: d.name, url: d.url })),
        patientId: createdCaregiver?.patientId || String(selectedPatientForNewCaregiver),
      };

      setCaregivers((prev) => [...prev, caregiverForState]);

      const patient = getPatientDetails(selectedPatientForNewCaregiver);
      const assignmentForState = {
        id: Date.now(),
        patientId: patient?.id || Number(selectedPatientForNewCaregiver),
        patientName: patient?.name || getPatientNameFromApiId(selectedPatientForNewCaregiver),
        caregiverId: newId,
        caregiverName: caregiverForState.name,
        dateAssigned: assignmentDateForNewCaregiver,
        status: "Active",
      };
      setAssignments((prev) => [...prev, assignmentForState]);

      alert("Caregiver created and assigned successfully!");
      setShowAddCaregiverModal(false);
      resetNewCaregiverForm();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.message || "Failed to create caregiver";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
=======
  const toggleStatus = (assignmentId) => {
    setAssignments(prev =>
      prev.map(assignment =>
        assignment.id === assignmentId
          ? { ...assignment, status: assignment.status === "Active" ? "Inactive" : "Active" }
          : assignment
      )
    );
>>>>>>> dc217746551ed7b3e1c7761eb5e7649887fbd8af
  };

  return (
    <div className="">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h3 className="dashboard-heading">Assign Caregivers</h3>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={() => setShowModal(true)} disabled={!userId}>
            + Assign Existing
          </button>
<<<<<<< HEAD
          <button className="btn text-white" style={{ backgroundColor: "#F95918" }} onClick={() => setShowAddCaregiverModal(true)} disabled={!userId}>
            + Add Caregiver & Assign
          </button>
=======
>>>>>>> dc217746551ed7b3e1c7761eb5e7649887fbd8af
        </div>
      </div>

      {!userId && (
        <div className="alert alert-warning">
          User ID not found. URL me <code>?id=YOUR_ID</code> pass karo ya <code>localStorage.setItem('userId','YOUR_ID')</code> set karo.
        </div>
      )}

      {/* Caregivers fetch state */}
      {loadingCaregivers && <div className="alert alert-info">Loading caregivers…</div>}
      {caregiversError && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{caregiversError}</span>
          <button className="btn btn-sm btn-outline-light" onClick={fetchCaregivers} disabled={!userId}>Retry</button>
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

      {/* Add Assignment Modal */}
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
                  <select className="form-select" value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} disabled={!userId}>
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
                  <select className="form-select" value={selectedCaregiver} onChange={(e) => setSelectedCaregiver(e.target.value)} disabled={!userId}>
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
                  <input type="date" className="form-control" value={assignmentDate} onChange={(e) => setAssignmentDate(e.target.value)} disabled={!userId} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                  Cancel
                </button>
                <button type="button" className="btn text-white" onClick={handleAssign} style={{ backgroundColor: "#F95918" }} disabled={assignSubmitting || !userId}>
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
                  <select className="form-select" value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} disabled={!userId}>
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
                  <select className="form-select" value={selectedCaregiver} onChange={(e) => setSelectedCaregiver(e.target.value)} disabled={!userId}>
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
                  <input type="date" className="form-control" value={assignmentDate} onChange={(e) => setAssignmentDate(e.target.value)} disabled={!userId} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowEditModal(false); resetForm(); setEditingAssignment(null); }}>
                  Cancel
                </button>
                <button type="button" className="btn text-white" onClick={handleUpdate} style={{ backgroundColor: "#F95918" }} disabled={!userId}>
                  Update Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
<<<<<<< HEAD

      {/* Delete Confirmation Modal */}
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
                  disabled={String(deletingCaregiverId) === String(selectedAssignment?.caregiverId) || !userId}
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

      {/* Add Caregiver & Assign Modal (POST) */}
      {showAddCaregiverModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Caregiver & Assign to Patient</h5>
                <button type="button" className="btn-close" onClick={() => { setShowAddCaregiverModal(false); resetNewCaregiverForm(); }} />
              </div>
              <div className="modal-body">
                {/* Add your caregiver form fields here and bind with newCaregiver + handlers */}
                {/* Example fields: */}
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Name</label>
                    <input className="form-control" name="name" value={newCaregiver.name} onChange={handleNewCaregiverChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input className="form-control" name="email" value={newCaregiver.email} onChange={handleNewCaregiverChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Mobile</label>
                    <input className="form-control" name="mobile" value={newCaregiver.mobile} onChange={handleNewCaregiverChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Gender</label>
                    <select className="form-select" name="gender" value={newCaregiver.gender} onChange={handleNewCaregiverChange}>
                      <option value="">-- Select --</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" name="password" value={newCaregiver.password} onChange={handleNewCaregiverChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" name="confirmPassword" value={newCaregiver.confirmPassword} onChange={handleNewCaregiverChange} />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Assign to Patient</label>
                    <select className="form-select" value={selectedPatientForNewCaregiver} onChange={(e) => setSelectedPatientForNewCaregiver(e.target.value)}>
                      <option value="">-- Choose Patient --</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name} (ID: {patient.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Assignment Date</label>
                    <input type="date" className="form-control" value={assignmentDateForNewCaregiver} onChange={(e) => setAssignmentDateForNewCaregiver(e.target.value)} />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Profile Picture</label>
                    <input type="file" className="form-control" onChange={handleProfilePictureUpload} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Certificates (optional)</label>
                    <input type="file" className="form-control" multiple onChange={handleDocumentUpload} />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowAddCaregiverModal(false); resetNewCaregiverForm(); }}>
                  Cancel
                </button>
                <button type="button" className="btn text-white" onClick={handleAddCaregiverAndAssign} style={{ backgroundColor: "#F95918" }} disabled={submitting || !userId}>
                  {submitting ? "Saving..." : "Add Caregiver & Assign"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Caregiver Modal */}
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
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Name</label>
                    <input className="form-control" name="name" value={editingCaregiver.name} onChange={handleCaregiverChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input className="form-control" name="email" value={editingCaregiver.email} onChange={handleCaregiverChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Gender</label>
                    <select className="form-select" name="gender" value={editingCaregiver.gender} onChange={handleCaregiverChange}>
                      <option value="">-- Select --</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">New Password (optional)</label>
                    <input type="password" className="form-control" name="password" value={editingCaregiver.password} onChange={handleCaregiverChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">DOB</label>
                    <input className="form-control" name="dateOfBirth" value={editingCaregiver.dateOfBirth} onChange={handleCaregiverChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Blood Group</label>
                    <input className="form-control" name="bloodGroup" value={editingCaregiver.bloodGroup} onChange={handleCaregiverChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Profile</label>
                    <input type="file" className="form-control" onChange={handleCaregiverProfilePictureUpdate} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Certificates</label>
                    <input type="file" className="form-control" multiple onChange={handleCaregiverCertificateUpload} />
                  </div>
                </div>
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
                  disabled={updatingCaregiver || !userId}
                >
                  {updatingCaregiver ? (<><span className="spinner-border spinner-border-sm me-2" /> Updating...</>) : "Update Caregiver"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
=======
>>>>>>> dc217746551ed7b3e1c7761eb5e7649887fbd8af
    </div>
  );
};

export default AssignCaregiver;