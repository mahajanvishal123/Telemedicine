import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../Baseurl/Baseurl";

const Caregiver = () => {
  // ====== CONFIG ======
  const BASE_URL = API_URL;
  const DEFAULT_PROFILE_PICTURE = "https://via.placeholder.com/150";
  
  // Caregivers from API
  const [caregivers, setCaregivers] = useState([]);
  const [loadingCaregivers, setLoadingCaregivers] = useState(false);
  const [caregiversError, setCaregiversError] = useState(null);
  
  // UI state for view only
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingCaregiver, setViewingCaregiver] = useState(null);
  
  // ===== Helpers =====
  const getStatusClass = (status) => {
    switch (status) {
      case "Active": return "bg-success";
      case "Inactive": return "bg-secondary";
      default: return "bg-secondary";
    }
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
      // Use default profile picture if no profile exists
      profilePicture: trim(api.profile) ? trim(api.profile) : DEFAULT_PROFILE_PICTURE,
      dateOfBirth: trim(api.dob) || "",
      gender: trim(api.gender) || "",
      bloodGroup: trim(api.bloodGroup) || "",
      password: "********",
      documents: docs,
      age: api.age || "",
      role: api.role || "caregiver",
    };
  };
  
  // ===== GET /caregiver
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
  
  // View Caregiver Handler
  const handleView = (caregiver) => {
    setViewingCaregiver(caregiver);
    setShowViewModal(true);
  };
  
  // Handle image loading error
  
  const handleImageError = (e) => {
  // Set fallback to a clean user icon
  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E";
};
  
  return (
    <div className="">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h3 className="dashboard-heading">Caregivers List</h3>
        <div className="text-muted">
          Showing all caregivers from the system
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
      
      {/* Caregivers Table */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Photo</th> {/* New Photo Column */}
                      <th>Name</th>
                      <th>Email</th>
                      <th>Gender</th>
                      <th>Role</th>
                      <th>Experience</th>
                      <th>Address</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {caregivers.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center text-muted">No caregivers found.</td>
                      </tr>
                    ) : (
                      caregivers.map((caregiver, index) => (
                        <tr key={caregiver.id}>
                          <td>{index + 1}</td>
                          <td className="text-center"> {/* New Photo Column */}
                            <img
                              src={caregiver.profilePicture}
                              alt={caregiver.name || "caregiver"}
                              className="rounded-circle"
                              style={{ width: "40px", height: "40px", objectFit: "cover" }}
                              onError={handleImageError}
                            />
                          </td>
                          <td>{caregiver.name}</td> {/* Name without image */}
                          <td>{caregiver.email}</td>
                          <td>{caregiver.gender}</td>
                          <td>{caregiver.role}</td>
                          <td>{caregiver.yearsExperience} years</td>
                          <td>{caregiver.address}</td>
                          <td>
                            <span className={`badge ${getStatusClass(caregiver.status)}`}>
                              {caregiver.status}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-primary" 
                              onClick={() => handleView(caregiver)} 
                              title="View"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
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
                        src={viewingCaregiver.profilePicture}
                        alt={viewingCaregiver.name}
                        className="rounded-circle img-fluid"
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                        onError={handleImageError}
                      />
                    </div>
                    <h4 className="text-center">{viewingCaregiver.name}</h4>
                    <p className="text-center text-muted">{viewingCaregiver.role}</p>
                  </div>
                  <div className="col-md-8">
                    <div className="card mb-3">
                      <div className="card-body">
                        <h5 className="card-title">Personal Information</h5>
                        <div className="row">
                          <div className="col-sm-6">
                            <p><strong>Email:</strong> {viewingCaregiver.email}</p>
                            <p><strong>Phone:</strong> {viewingCaregiver.mobile}</p>
                            <p><strong>Gender:</strong> {viewingCaregiver.gender}</p>
                            <p><strong>Date of Birth:</strong> {viewingCaregiver.dateOfBirth}</p>
                          </div>
                          <div className="col-sm-6">
                            <p><strong>Blood Group:</strong> {viewingCaregiver.bloodGroup}</p>
                            <p><strong>Age:</strong> {viewingCaregiver.age}</p>
                            <p><strong>Join Date:</strong> {viewingCaregiver.joinDate}</p>
                            <p><strong>Status:</strong>
                              <span className={`badge ${getStatusClass(viewingCaregiver.status)} ms-2`}>
                                {viewingCaregiver.status}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card mb-3">
                      <div className="card-body">
                        <h5 className="card-title">Professional Information</h5>
                        <p><strong>Experience:</strong> {viewingCaregiver.yearsExperience} years</p>
                        <p><strong>Skills:</strong> {viewingCaregiver.skills}</p>
                        <p><strong>Certification:</strong> {viewingCaregiver.certification}</p>
                        
                        {viewingCaregiver.documents && viewingCaregiver.documents.length > 0 && (
                          <div className="mt-3">
                            <h6>Documents:</h6>
                            <ul className="list-group">
                              {viewingCaregiver.documents.map((doc, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                  {doc.name}
                                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                    View
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Contact Information</h5>
                        <p><strong>Address:</strong> {viewingCaregiver.address}</p>
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