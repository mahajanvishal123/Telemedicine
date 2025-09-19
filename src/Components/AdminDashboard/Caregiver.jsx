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

  // 🔹 Document Preview Modal State
  const [showDocModal, setShowDocModal] = useState(false);
  const [docToView, setDocToView] = useState(null);
  const [showDocOptions, setShowDocOptions] = useState(true); // Start with options screen

  // 🔹 Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default 5

  // 🔹 Filter states
  const [filterName, setFilterName] = useState("");
  const [filterEmail, setFilterEmail] = useState("");

  // ===== Helpers =====
  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-success text-white";
      case "Inactive":
        return "bg-secondary text-white";
      default:
        return "bg-secondary text-white";
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
      let certUrl = api.certificate;
      // Ensure URL is absolute
      if (certUrl && !certUrl.startsWith('http')) {
        certUrl = `${BASE_URL}${certUrl.startsWith('/') ? '' : '/'}${certUrl}`;
      }
      const fileName = String(certUrl).split("/").pop() || "Certificate";
      // Determine file type from extension
      const fileExtension = fileName.split('.').pop().toLowerCase();
      docs.push({ 
        name: fileName, 
        url: certUrl,
        type: fileExtension
      });
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
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : [];
      const mapped = raw.map(mapApiCaregiver);
      setCaregivers(mapped);
    } catch (err) {
      console.error("Failed to fetch caregivers:", err);
      setCaregiversError(
        err?.response?.data?.message || err?.message || "Failed to fetch caregivers"
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
    e.currentTarget.src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E";
  };

  // Handle document view - show options modal
  const handleViewDocument = (doc) => {
    setDocToView(doc);
    setShowDocOptions(true); // Show options first
    setShowDocModal(true);
  };

  // Handle option selection
  const handleViewOption = (option) => {
    if (option === 'download') {
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = docToView.url;
      link.download = docToView.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowDocModal(false);
    } else if (option === 'newTab') {
      window.open(docToView.url, '_blank');
      setShowDocModal(false);
    } else if (option === 'preview') {
      setShowDocOptions(false); // Switch to preview
    }
  };

  // 🔹 Apply Filters
  const filteredCaregivers = caregivers.filter(caregiver => {
    const matchesName = filterName
      ? caregiver.name.toLowerCase().includes(filterName.toLowerCase())
      : true;

    const matchesEmail = filterEmail
      ? caregiver.email.toLowerCase().includes(filterEmail.toLowerCase())
      : true;

    return matchesName && matchesEmail;
  });

  // 🔹 Pagination Logic — Applied to FILTERED data
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows =
    rowsPerPage === "All"
      ? filteredCaregivers
      : filteredCaregivers.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages =
    rowsPerPage === "All" ? 1 : Math.ceil(filteredCaregivers.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 🔹 Reset Filters
  const resetFilters = () => {
    setFilterName("");
    setFilterEmail("");
    setCurrentPage(1);
  };

  // Get file icon based on file type
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return 'fa-file-pdf text-danger';
      case 'doc':
      case 'docx':
        return 'fa-file-word text-primary';
      case 'xls':
      case 'xlsx':
        return 'fa-file-excel text-success';
      case 'ppt':
      case 'pptx':
        return 'fa-file-powerpoint text-warning';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'fa-file-image text-info';
      default:
        return 'fa-file text-secondary';
    }
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h3 className="dashboard-heading">Caregivers List</h3>
      </div>

      <div className="row mb-3">
        {/* Top: Entries Dropdown */}
        <div className="mb-3 d-flex align-items-center col-md-3">
          <label className="me-2 mb-0">Show</label>
          <select
            className="form-select form-select-sm w-auto"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(e.target.value === "All" ? "All" : parseInt(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="All">All</option>
          </select>
          <span className="ms-2 mb-0">Entries</span>
        </div>
        {/* 🔹 FILTERS SECTION */}
        <div className="col-md-9">
          <div className="card-header bg-light"></div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  id="filterName"
                  placeholder="Search by caregiver name..."
                  value={filterName}
                  onChange={(e) => {
                    setFilterName(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="col-md-5">
                <input
                  type="email"
                  className="form-control"
                  id="filterEmail"
                  placeholder="Search by email..."
                  value={filterEmail}
                  onChange={(e) => {
                    setFilterEmail(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="mt-3 col-md-2">
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
      {loadingCaregivers && <div className="alert alert-info">Loading caregivers…</div>}
      {caregiversError && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{caregiversError}</span>
          <button className="btn btn-sm btn-outline-light" onClick={fetchCaregivers}>
            Retry
          </button>
        </div>
      )}

      {!loadingCaregivers && !caregiversError && (
        <div className="card shadow ">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Role</th>
                    <th>Experience</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center text-muted">
                        No caregivers found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    currentRows.map((caregiver, index) => (
                      <tr key={caregiver.id}>
                        <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                        <td className="text-center">
                          <img
                            src={caregiver.profilePicture}
                            alt={caregiver.name}
                            className="rounded-circle"
                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                            onError={handleImageError}
                          />
                        </td>
                        <td>{caregiver.name}</td>
                        <td>{caregiver.email}</td>
                        <td>{caregiver.gender}</td>
                        <td>{caregiver.role}</td>
                        <td>{caregiver.yearsExperience} years</td>
                        <td>
                          <span className={`badge ${getStatusClass(caregiver.status)} rounded-pill`}>
                            {caregiver.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm"
                            onClick={() => handleView(caregiver)}
                            title="View"
                          >
                            <i className="fas fa-eye" style={{ color: "#FF3500" }}></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Footer: Pagination */}
      <div className="card-footer bg-light d-flex justify-content-between align-items-center py-3">
        <div className="text-muted small">
          Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredCaregivers.length)} of {filteredCaregivers.length} entries
        </div>

        {rowsPerPage !== "All" && (
          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
              </li>

              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>

      {/* View Caregiver Modal */}
      {showViewModal && viewingCaregiver && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowViewModal(false)}
        >
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Caregiver Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowViewModal(false)}
                />
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
                            <p>
                              <strong>Status:</strong>{" "}
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
                                <li
                                  key={index}
                                  className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                  <div className="d-flex align-items-center">
                                    <i className={`fas ${getFileIcon(doc.type)} me-2`}></i>
                                    {doc.name}
                                  </div>
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => handleViewDocument(doc)}
                                  >
                                    View
                                  </button>
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
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📄 Document Options Modal */}
      {showDocModal && docToView && showDocOptions && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowDocModal(false)}
        >
          <div className="modal-dialog modal-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className={`fas ${getFileIcon(docToView.type)} me-2`}></i>
                  {docToView.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDocModal(false)}
                />
              </div>
              <div className="modal-body">
                <div className="text-center mb-4">
                  <p className="mb-4">How would you like to view this document?</p>
                  <div className="d-grid gap-3">
                    <button
                      className="btn btn-primary d-flex align-items-center justify-content-center"
                      onClick={() => handleViewOption('preview')}
                    >
                      <i className="fas fa-eye me-2"></i>
                      Preview in Browser
                    </button>
                    <button
                      className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                      onClick={() => handleViewOption('newTab')}
                    >
                      <i className="fas fa-external-link-alt me-2"></i>
                      Open in New Tab
                    </button>
                    <button
                      className="btn btn-outline-success d-flex align-items-center justify-content-center"
                      onClick={() => handleViewOption('download')}
                    >
                      <i className="fas fa-download me-2"></i>
                      Download Document
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDocModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

{/* 📄 Document Preview Modal */}
{showDocModal && docToView && (
  <div
    className="modal fade show d-block"
    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    onClick={() => setShowDocModal(false)}
  >
    <div
      className="modal-dialog modal-xl"
      style={{ maxWidth: "95%", height: "90%" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-content" style={{ height: "100%" }}>
        <div className="modal-header">
          <h5 className="modal-title">{docToView.name}</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowDocModal(false)}
          />
        </div>

        <div className="modal-body p-0" style={{ height: "calc(100% - 56px)" }}>
          {docToView.url.match(/\.(jpeg|jpg|png|gif|png)$/i) ? (
            <img
              src={docToView.url}
              alt={docToView.name}
              className="w-100 h-100"
              style={{ objectFit: "contain" }}
            />
          ) : docToView.url.match(/\.pdf$/i) ? (
            <iframe
              src={docToView.url}
              title={docToView.name}
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          ) : (
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(
                docToView.url
              )}&embedded=true`}
              title={docToView.name}
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          )}
        </div>
      </div>
    </div>
  </div>
)}



    </div>
  );
};

export default Caregiver;