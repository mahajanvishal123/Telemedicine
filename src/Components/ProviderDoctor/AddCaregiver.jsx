import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../Baseurl/Baseurl";


const AddCaregiver = () => {
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

  
  

  // Caregivers state
  const [caregivers, setCaregivers] = useState([]);
  const [loadingCaregivers, setLoadingCaregivers] = useState(false);
  const [caregiversError, setCaregiversError] = useState(null);

  // UI state
  const [showAddCaregiverModal, setShowAddCaregiverModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [viewingCaregiver, setViewingCaregiver] = useState(null);
  const [editingCaregiver, setEditingCaregiver] = useState(null);
  const [deletingCaregiver, setDeletingCaregiver] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  // New caregiver form
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

  // ===== Helpers =====
  const resetForm = () => {
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
    setError(null);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Active": return "bg-success";
      case "Inactive": return "bg-secondary";
      default: return "bg-secondary";
    }
  };

  // ===== Map API caregiver to local format =====
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

  // ===== GET /caregiver =====
  const fetchCaregivers = async () => {
    setLoadingCaregivers(true);
    setCaregiversError(null);
    try {
      const res = await axios.get(`${BASE_URL}/caregiver`, {
        headers: { ...authHeaders() }
      });
      
      // Handle different response structures
      const raw = Array.isArray(res?.data)
        ? res.data
        : (Array.isArray(res?.data?.data) ? res.data.data : []);
        
      const mapped = raw.map(mapApiCaregiver);
      setCaregivers(mapped);
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

  // ===== POST /caregiver (Add Caregiver) =====
  const handleAddCaregiver = async () => {
    if (!newCaregiver.name || !newCaregiver.email || !newCaregiver.mobile || !newCaregiver.gender) {
      setError("Please fill all required fields (Name, Email, Mobile, Gender)");
      return;
    }
    if (!newCaregiver.password) {
      setError("Please set a password for the caregiver");
      return;
    }
    if (newCaregiver.password !== newCaregiver.confirmPassword) {
      setError("Passwords do not match");
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

    try {
      setSubmitting(true);
      setError(null);
      
      const res = await axios.post(`${BASE_URL}/caregiver`, fd, {
        headers: { "Content-Type": "multipart/form-data", ...authHeaders() }
      });

      // Extract data from API response matching the structure in the image
      const apiData = res.data;
      const createdCaregiver = apiData.caregiver; // Directly access caregiver object from response

      // Map the API caregiver to our local format
      const mappedCaregiver = mapApiCaregiver(createdCaregiver);

      // Update caregivers state with the new caregiver
      setCaregivers(prev => [...prev, mappedCaregiver]);

      alert("Caregiver created successfully!");
      setShowAddCaregiverModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.message || "Failed to create caregiver";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ===== PUT /caregiver/:id (Update Caregiver) =====
  const handleUpdateCaregiver = async () => {
    if (!editingCaregiver?.name || !editingCaregiver?.email) {
      setError("Please fill required fields (Name, Email)");
      return;
    }

    const caregiverId = editingCaregiver?.id;

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
    if (editingCaregiver.mobile) fd.append("mobile", String(editingCaregiver.mobile).trim());
    if (editingCaregiver.address) fd.append("address", String(editingCaregiver.address).trim());
    if (editingCaregiver.skills) fd.append("skills", String(editingCaregiver.skills).trim());
    if (editingCaregiver.yearsExperience) fd.append("experience", `${editingCaregiver.yearsExperience} yrs`);

    try {
      setUpdating(true);
      setError(null);

      const res = await axios.put(
        `${BASE_URL}/caregiver/${caregiverId}`,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...authHeaders(),
          },
        }
      );

      const updatedApi = res?.data?.caregiver || res?.data?.data || res?.data;

      if (!updatedApi) {
        throw new Error("No caregiver returned from server");
      }

      const mapped = mapApiCaregiver(updatedApi);

      setCaregivers((prev) =>
        prev.map((c) =>
          String(c.id) === String(caregiverId) ? { ...c, ...mapped } : c
        )
      );

      alert("Caregiver updated successfully.");
      setShowEditModal(false);
      setEditingCaregiver(null);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err?.message || "Failed to update caregiver");
    } finally {
      setUpdating(false);
    }
  };

  // ===== DELETE /caregiver/:id =====
  const handleDeleteCaregiver = async () => {
    if (!deletingCaregiver) return;
    
    try {
      setDeleting(true);
      setError(null);

      await axios.delete(`${BASE_URL}/caregiver/${deletingCaregiver.id}`, {
        headers: { ...authHeaders() },
      });

      setCaregivers(prev => prev.filter(c => String(c.id) !== String(deletingCaregiver.id)));

      alert("Caregiver deleted successfully.");
      setShowDeleteModal(false);
      setDeletingCaregiver(null);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err?.message || "Failed to delete caregiver");
    } finally {
      setDeleting(false);
    }
  };

  // ===== Form Handlers =====
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCaregiver(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingCaregiver(prev => ({ ...prev, [name]: value }));
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

  const handleEditProfilePictureUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingCaregiver(prev => ({
          ...prev,
          profilePicture: reader.result,
          profileFile: file
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

  const handleEditDocumentUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setEditingCaregiver(prev => ({
      ...prev,
      certificateFiles: files
    }));
  };

  const handleDocumentRemove = (index) => {
    const newDocuments = [...newCaregiver.documents];
    const newDocumentFiles = [...newCaregiver.documentFiles];
    newDocuments.splice(index, 1);
    newDocumentFiles.splice(index, 1);
    setNewCaregiver(prev => ({ ...prev, documents: newDocuments, documentFiles: newDocumentFiles }));
  };

  const handleEditDocumentRemove = (index) => {
    const newDocuments = [...(editingCaregiver.documents || [])];
    newDocuments.splice(index, 1);
    setEditingCaregiver(prev => ({ ...prev, documents: newDocuments }));
  };

  // ===== Action Handlers =====
  const handleView = (caregiver) => {
    setViewingCaregiver(caregiver);
    setShowViewModal(true);
  };

  const handleEdit = (caregiver) => {
    setEditingCaregiver({
      ...caregiver,
      password: "",
      confirmPassword: "",
      profileFile: null,
      certificateFiles: []
    });
    setShowEditModal(true);
  };

  const handleDelete = (caregiver) => {
    setDeletingCaregiver(caregiver);
    setShowDeleteModal(true);
    setError(null);
  };

  return (
    <div className="">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h3 className="dashboard-heading">Manage Caregivers</h3>
        <div className="d-flex gap-2">
          <button className="btn text-white" style={{ backgroundColor: "#F95918" }} onClick={() => setShowAddCaregiverModal(true)}>
            + Add Caregiver
          </button>
        </div>
      </div>

      {/* Loading and Error States */}
      {loadingCaregivers && <div className="alert alert-info">Loading caregivers…</div>}
      {caregiversError && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{caregiversError}</span>
          <button className="btn btn-sm btn-outline-light" onClick={fetchCaregivers}>Retry</button>
        </div>
      )}

      {/* ======= Caregivers Table ======= */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {caregivers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center text-muted">No caregivers found.</td>
                      </tr>
                    ) : (
                      caregivers.map((caregiver,index) => (
                        <tr key={caregiver.id}>
                          <td>{index+1}</td>
                          <td>{caregiver.name}</td>
                          <td>{caregiver.email}</td>
                          <td>{caregiver.phone}</td>
                          <td>{caregiver.role}</td>
                          <td>
                            <span className={`badge ${getStatusClass(caregiver.status)}`}>
                              {caregiver.status}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button 
                                className="btn btn-sm btn-outline-primary" 
                                onClick={() => handleView(caregiver)} 
                                title="View"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button 
                                className="btn btn-sm" 
                                onClick={() => handleEdit(caregiver)} 
                                style={{ color: "#F95918" }} 
                                title="Edit"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(caregiver)}
                                title="Delete"
                                disabled={deleting && deletingCaregiver?.id === caregiver.id}
                              >
                                {deleting && deletingCaregiver?.id === caregiver.id ? (
                                  <span className="spinner-border spinner-border-sm" />
                                ) : (
                                  <i className="fas fa-trash"></i>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="text-muted small">Caregivers loaded: {caregivers.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Caregiver Modal */}
      {showAddCaregiverModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Caregiver</h5>
                <button type="button" className="btn-close" onClick={() => { setShowAddCaregiverModal(false); resetForm(); }} />
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="mb-3">Personal Information</h6>
                    <div className="mb-3">
                      <label className="form-label">Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" name="name" value={newCaregiver.name} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email <span className="text-danger">*</span></label>
                      <input type="email" className="form-control" name="email" value={newCaregiver.email} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Mobile <span className="text-danger">*</span></label>
                      <input type="tel" className="form-control" name="mobile" value={newCaregiver.mobile} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Gender <span className="text-danger">*</span></label>
                      <select className="form-select" name="gender" value={newCaregiver.gender} onChange={handleInputChange} required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Password <span className="text-danger">*</span></label>
                      <input type="password" className="form-control" name="password" value={newCaregiver.password} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Confirm Password <span className="text-danger">*</span></label>
                      <input type="password" className="form-control" name="confirmPassword" value={newCaregiver.confirmPassword} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Date of Birth</label>
                      <input type="date" className="form-control" name="dateOfBirth" value={newCaregiver.dateOfBirth} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Blood Group</label>
                      <select className="form-select" name="bloodGroup" value={newCaregiver.bloodGroup} onChange={handleInputChange}>
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="mb-3">Professional Information</h6>
                    <div className="mb-3">
                      <label className="form-label">Address</label>
                      <textarea className="form-control" name="address" value={newCaregiver.address} onChange={handleInputChange} rows="2"></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Years of Experience</label>
                      <input type="number" className="form-control" name="yearsExperience" value={newCaregiver.yearsExperience} onChange={handleInputChange} min="0" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Skills</label>
                      <textarea className="form-control" name="skills" value={newCaregiver.skills} onChange={handleInputChange} rows="2"></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Profile Picture</label>
                      <input type="file" className="form-control" accept="image/*" onChange={handleProfilePictureUpload} />
                      {newCaregiver.profilePicture && (
                        <div className="mt-2">
                          <img src={newCaregiver.profilePicture} alt="Profile" className="img-thumbnail" style={{ maxHeight: "100px" }} />
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Documents/Certificates</label>
                      <input type="file" className="form-control" multiple onChange={handleDocumentUpload} />
                      {newCaregiver.documents.length > 0 && (
                        <div className="mt-2">
                          <ul className="list-group">
                            {newCaregiver.documents.map((doc, index) => (
                              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                <span>{doc.name}</span>
                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDocumentRemove(index)}>
                                  <i className="fas fa-trash"></i>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowAddCaregiverModal(false); resetForm(); }}>
                  Cancel
                </button>
                <button type="button" className="btn text-white" onClick={handleAddCaregiver} style={{ backgroundColor: "#F95918" }} disabled={submitting}>
                  {submitting ? "Saving..." : "Add Caregiver"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Caregiver Modal */}
      {showViewModal && viewingCaregiver && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Caregiver Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)} />
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4">
                    <div className="text-center mb-3">
                      <img
                        src={viewingCaregiver.profilePicture || "https://via.placeholder.com/150"}
                        alt={viewingCaregiver.name}
                        className="rounded-circle img-thumbnail"
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                        onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/150"; }}
                      />
                      <h5 className="mt-2">{viewingCaregiver.name}</h5>
                      <p className="text-muted">{viewingCaregiver.role}</p>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="card mb-3">
                      <div className="card-body">
                        <h6 className="card-title">Personal Information</h6>
                        <p><strong>Email:</strong> {viewingCaregiver.email}</p>
                        <p><strong>Mobile:</strong> {viewingCaregiver.mobile}</p>
                        <p><strong>Gender:</strong> {viewingCaregiver.gender}</p>
                        <p><strong>Date of Birth:</strong> {viewingCaregiver.dateOfBirth || "N/A"}</p>
                        <p><strong>Blood Group:</strong> {viewingCaregiver.bloodGroup || "N/A"}</p>
                        <p><strong>Status:</strong>
                          <span className={`badge ${getStatusClass(viewingCaregiver.status)} ms-2`}>
                            {viewingCaregiver.status}
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="card mb-3">
                      <div className="card-body">
                        <h6 className="card-title">Professional Information</h6>
                        <p><strong>Address:</strong> {viewingCaregiver.address || "N/A"}</p>
                        <p><strong>Experience:</strong> {viewingCaregiver.yearsExperience} years</p>
                        <p><strong>Skills:</strong> {viewingCaregiver.skills || "N/A"}</p>
                        <p><strong>Join Date:</strong> {viewingCaregiver.joinDate}</p>
                      </div>
                    </div>
                    
                    {viewingCaregiver.documents?.length > 0 && (
                      <div className="card">
                        <div className="card-body">
                          <h6 className="card-title">Documents</h6>
                          <ul className="list-group">
                            {viewingCaregiver.documents.map((doc, index) => (
                              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.name}</a>
                                <i className="fas fa-file-pdf text-danger"></i>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                  Close
                </button>
                <button 
                  type="button" 
                  className="btn text-white" 
                  style={{ backgroundColor: "#F95918" }}
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(viewingCaregiver);
                  }}
                >
                  Edit Caregiver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Caregiver Modal */}
      {showEditModal && editingCaregiver && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Caregiver</h5>
                <button type="button" className="btn-close" onClick={() => { setShowEditModal(false); setEditingCaregiver(null); }} />
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="mb-3">Personal Information</h6>
                    <div className="mb-3">
                      <label className="form-label">Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" name="name" value={editingCaregiver.name} onChange={handleEditInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email <span className="text-danger">*</span></label>
                      <input type="email" className="form-control" name="email" value={editingCaregiver.email} onChange={handleEditInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Mobile</label>
                      <input type="tel" className="form-control" name="mobile" value={editingCaregiver.mobile} onChange={handleEditInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Gender</label>
                      <select className="form-select" name="gender" value={editingCaregiver.gender} onChange={handleEditInputChange}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Date of Birth</label>
                      <input type="date" className="form-control" name="dateOfBirth" value={editingCaregiver.dateOfBirth} onChange={handleEditInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Blood Group</label>
                      <select className="form-select" name="bloodGroup" value={editingCaregiver.bloodGroup} onChange={handleEditInputChange}>
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">New Password (leave blank to keep current)</label>
                      <input type="password" className="form-control" name="password" value={editingCaregiver.password} onChange={handleEditInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Confirm New Password</label>
                      <input type="password" className="form-control" name="confirmPassword" value={editingCaregiver.confirmPassword} onChange={handleEditInputChange} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="mb-3">Professional Information</h6>
                    <div className="mb-3">
                      <label className="form-label">Address</label>
                      <textarea className="form-control" name="address" value={editingCaregiver.address} onChange={handleEditInputChange} rows="2"></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Years of Experience</label>
                      <input type="number" className="form-control" name="yearsExperience" value={editingCaregiver.yearsExperience} onChange={handleEditInputChange} min="0" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Skills</label>
                      <textarea className="form-control" name="skills" value={editingCaregiver.skills} onChange={handleEditInputChange} rows="2"></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Profile Picture</label>
                      <input type="file" className="form-control" accept="image/*" onChange={handleEditProfilePictureUpload} />
                      {editingCaregiver.profilePicture && (
                        <div className="mt-2">
                          <img src={editingCaregiver.profilePicture} alt="Profile" className="img-thumbnail" style={{ maxHeight: "100px" }} />
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Certificates/Documents</label>
                      <input type="file" className="form-control" multiple onChange={handleEditDocumentUpload} />
                      {editingCaregiver.documents?.length > 0 && (
                        <div className="mt-2">
                          <ul className="list-group">
                            {editingCaregiver.documents.map((doc, index) => (
                              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                <span>{doc.name}</span>
                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleEditDocumentRemove(index)}>
                                  <i className="fas fa-trash"></i>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowEditModal(false); setEditingCaregiver(null); }}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn text-white"
                  onClick={handleUpdateCaregiver}
                  style={{ backgroundColor: "#F95918" }}
                  disabled={updating}
                >
                  {updating ? (<><span className="spinner-border spinner-border-sm me-2" /> Updating...</>) : "Update Caregiver"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingCaregiver && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Caregiver</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)} />
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this caregiver?</p>
                <div className="card bg-light">
                  <div className="card-body">
                    <p><strong>Name:</strong> {deletingCaregiver.name}</p>
                    <p><strong>Email:</strong> {deletingCaregiver.email}</p>
                    <p><strong>Role:</strong> {deletingCaregiver.role}</p>
                  </div>
                </div>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteCaregiver}
                  disabled={deleting}
                >
                  {deleting ? (<><span className="spinner-border spinner-border-sm me-2" /> Deleting...</>) : "Delete"}
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