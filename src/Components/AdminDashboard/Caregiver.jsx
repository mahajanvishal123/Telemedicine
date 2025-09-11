import React, { useState } from "react";
const Caregiver = () => {
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCaregiverForView, setSelectedCaregiverForView] = useState(null);
  const [formData, setFormData] = useState({});
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    skills: "",
    experience: "",
    joinDate: "",
    status: "Active",
    type: "caregivers",
    certification: "",
    yearsExperience: "",
    document: "",
    profilePicture: "",
  });
  
  const [caregivers, setCaregivers] = useState([
    {
      id: 201,
      name: "Amy Rodriguez",
      email: "amy@example.com",
      joinDate: "2023-09-25",
      status: "Active",
      type: "caregivers",
      certification: "CNA",
      yearsExperience: 5,
      mobile: "555-9012",
      address: "789 Care St",
      skills: "BP Monitoring, Insulin Injection, Elderly Care",
      document: "certification.pdf",
      profilePicture: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 202,
      name: "Michael Johnson",
      email: "michael@example.com",
      joinDate: "2023-08-15",
      status: "Active",
      type: "caregivers",
      certification: "RN",
      yearsExperience: 8,
      mobile: "555-3456",
      address: "321 Health Ave",
      skills: "Wound Care, Medication Administration, Physical Therapy",
      document: "license.pdf",
      profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 203,
      name: "Sarah Williams",
      email: "sarah@example.com",
      joinDate: "2023-10-10",
      status: "Inactive",
      type: "caregivers",
      certification: "LPN",
      yearsExperience: 6,
      mobile: "555-7890",
      address: "654 Nurse Lane",
      skills: "Patient Hygiene, Vital Signs Monitoring, Dementia Care",
      document: "certification.pdf",
      profilePicture: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ]);
  
  const handleEdit = (caregiver) => {
    setSelectedUser(caregiver);
    setFormData(caregiver);
    setShowModal(true);
  };
  
  const handleView = (caregiver) => {
    setSelectedCaregiverForView(caregiver);
    setShowViewModal(true);
  };
  
  const handleDelete = (caregiverId) => {
    if (window.confirm("Are you sure you want to delete this caregiver?")) {
      setCaregivers(caregivers.filter(caregiver => caregiver.id !== caregiverId));
    }
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({});
  };
  
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewUserData({
      name: "",
      email: "",
      mobile: "",
      address: "",
      skills: "",
      experience: "",
      joinDate: "",
      status: "Active",
      type: "caregivers",
      certification: "",
      yearsExperience: "",
      document: "",
      profilePicture: "",
    });
  };
  
  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedCaregiverForView(null);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (selectedUser) {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setNewUserData({
        ...newUserData,
        [name]: value,
      });
    }
  };
  
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const fileName = files[0].name;
      if (selectedUser) {
        setFormData({
          ...formData,
          [name]: fileName,
        });
      } else {
        setNewUserData({
          ...newUserData,
          [name]: fileName,
        });
      }
    }
  };
  
  const handleImageUrlChange = (e) => {
    const { name, value } = e.target;
    if (selectedUser) {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setNewUserData({
        ...newUserData,
        [name]: value,
      });
    }
  };
  
  const handleSave = () => {
    if (selectedUser) {
      setCaregivers((prevCaregivers) =>
        prevCaregivers.map((caregiver) =>
          caregiver.id === selectedUser.id ? { ...caregiver, ...formData } : caregiver
        )
      );
    }
    handleCloseModal();
  };
  
  const handleAddUser = () => {
    setCaregivers((prevCaregivers) => [
      ...prevCaregivers,
      { ...newUserData, id: Date.now() },
    ]);
    handleCloseAddModal();
  };
  
  const toggleStatus = (caregiverId) => {
    setCaregivers((prevCaregivers) =>
      prevCaregivers.map((caregiver) =>
        caregiver.id === caregiverId
          ? {
              ...caregiver,
              status: caregiver.status === "Active" ? "Inactive" : "Active",
            }
          : caregiver
      )
    );
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-success";
      case "Inactive":
        return "bg-secondary";
      case "Pending":
        return "bg-warning text-dark";
      default:
        return "bg-secondary";
    }
  };
  
  return (
    <div className="">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h3 className="dashboard-heading">Caregiver Management</h3>
        <button
          className="btn text-white"
          style={{ backgroundColor: "#F95918" }}
          onClick={() => setShowAddModal(true)}
        >
          + Add Caregiver
        </button>
      </div>

      {/* Table Section */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Caregiver ID</th>
                      <th>Photo</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Certification</th>
                      <th>Experience</th>
                      <th>Document</th>
                      <th>Join Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {caregivers.map((caregiver) => (
                      <tr key={caregiver.id}>
                        <td>#{caregiver.id}</td>
                        <td>
                          {caregiver.profilePicture ? (
                            <img 
                              src={caregiver.profilePicture} 
                              alt="Profile" 
                              className="rounded-circle" 
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                          ) : (
                            <i className="fas fa-user-circle text-muted" style={{ fontSize: '30px' }}></i>
                          )}
                        </td>
                        <td>{caregiver.name}</td>
                        <td>{caregiver.email}</td>
                        <td>{caregiver.certification}</td>
                        <td>{caregiver.yearsExperience} years</td>
                        <td>
                          {caregiver.document ? (
                            <a href="#" className="text-decoration-none">
                              <i className="fas fa-file-pdf text-danger me-1"></i>
                              {caregiver.document}
                            </a>
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </td>
                        <td>{caregiver.joinDate}</td>
                        <td>
                          <span className={`badge ${getStatusClass(caregiver.status)}`}>
                            {caregiver.status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm"
                              onClick={() => handleView(caregiver)}
                              style={{
                                color: "#F95918",
                              }}
                              title="View"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              className="btn btn-sm"
                              onClick={() => handleEdit(caregiver)}
                              style={{
                                color: "#F95918",
                              }}
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className={`btn btn-sm ${caregiver.status === "Active"
                                ? "btn-outline-danger"
                                : "btn-outline-success"
                                }`}
                              onClick={() => toggleStatus(caregiver.id)}
                              title={caregiver.status === "Active" ? "Deactivate" : "Activate"}
                            >
                              {caregiver.status === "Active" ? (
                                <i className="fas fa-user-slash"></i>
                              ) : (
                                <i className="fas fa-user-check"></i>
                              )}
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(caregiver.id)}
                              title="Delete"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Caregiver Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Caregiver: {selectedUser?.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control mb-2"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      placeholder="Email"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      name="mobile"
                      value={formData.mobile || ""}
                      onChange={handleInputChange}
                      placeholder="Mobile Number"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleInputChange}
                      placeholder="Address"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Certification</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      name="certification"
                      value={formData.certification || ""}
                      onChange={handleInputChange}
                      placeholder="Certification"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Years of Experience</label>
                    <input
                      type="number"
                      className="form-control mb-2"
                      name="yearsExperience"
                      value={formData.yearsExperience || ""}
                      onChange={handleInputChange}
                      placeholder="Years of Experience"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Skills</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      name="skills"
                      value={formData.skills || ""}
                      onChange={handleInputChange}
                      placeholder="Skills (comma separated)"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Join Date</label>
                    <input
                      type="date"
                      className="form-control mb-2"
                      name="joinDate"
                      value={formData.joinDate || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Document</label>
                    <input
                      type="file"
                      className="form-control mb-2"
                      name="document"
                      onChange={handleFileChange}
                    />
                    {formData.document && (
                      <div className="mt-1">
                        <a href="#" className="text-decoration-none">
                          <i className="fas fa-file-pdf text-danger me-1"></i>
                          {formData.document}
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Profile Picture</label>
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control mb-2"
                        name="profilePicture"
                        value={formData.profilePicture || ""}
                        onChange={handleImageUrlChange}
                        placeholder="Image URL"
                      />
                      <input
                        type="file"
                        className="form-control"
                        name="profilePictureFile"
                        onChange={handleFileChange}
                      />
                    </div>
                    {formData.profilePicture && (
                      <div className="mt-2">
                        <img 
                          src={formData.profilePicture} 
                          alt="Profile" 
                          className="rounded-circle" 
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn text-white"
                  onClick={handleSave}
                  style={{ backgroundColor: "#F95918" }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Caregiver Modal */}
      {showAddModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Caregiver</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseAddModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Full Name*</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      name="name"
                      value={newUserData.name}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email*</label>
                    <input
                      type="email"
                      className="form-control mb-2"
                      name="email"
                      value={newUserData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Mobile Number*</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      name="mobile"
                      value={newUserData.mobile}
                      onChange={handleInputChange}
                      placeholder="Mobile Number"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      name="address"
                      value={newUserData.address}
                      onChange={handleInputChange}
                      placeholder="Address"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Certification</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      name="certification"
                      value={newUserData.certification}
                      onChange={handleInputChange}
                      placeholder="Certification"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Years of Experience</label>
                    <input
                      type="number"
                      className="form-control mb-2"
                      name="yearsExperience"
                      value={newUserData.yearsExperience}
                      onChange={handleInputChange}
                      placeholder="Years of Experience"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Skills</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      name="skills"
                      value={newUserData.skills}
                      onChange={handleInputChange}
                      placeholder="Skills (comma separated)"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Join Date</label>
                    <input
                      type="date"
                      className="form-control mb-2"
                      name="joinDate"
                      value={newUserData.joinDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Document</label>
                    <input
                      type="file"
                      className="form-control mb-2"
                      name="document"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Profile Picture</label>
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control mb-2"
                        name="profilePicture"
                        value={newUserData.profilePicture}
                        onChange={handleImageUrlChange}
                        placeholder="Image URL"
                      />
                      <input
                        type="file"
                        className="form-control"
                        name="profilePictureFile"
                        onChange={handleFileChange}
                      />
                    </div>
                    {newUserData.profilePicture && (
                      <div className="mt-2">
                        <img 
                          src={newUserData.profilePicture} 
                          alt="Profile" 
                          className="rounded-circle" 
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseAddModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn text-white"
                  onClick={handleAddUser}
                  style={{ backgroundColor: "#F95918" }}
                >
                  Add Caregiver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Caregiver Modal */}
      {showViewModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Caregiver Details: {selectedCaregiverForView?.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseViewModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4 text-center">
                    {selectedCaregiverForView?.profilePicture ? (
                      <img 
                        src={selectedCaregiverForView.profilePicture} 
                        alt="Profile" 
                        className="rounded-circle mb-3" 
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                      />
                    ) : (
                      <i className="fas fa-user-circle text-muted" style={{ fontSize: '120px' }}></i>
                    )}
                    <h5>{selectedCaregiverForView?.name}</h5>
                    <span className={`badge ${getStatusClass(selectedCaregiverForView?.status)}`}>
                      {selectedCaregiverForView?.status}
                    </span>
                  </div>
                  <div className="col-md-8">
                    <div className="row mb-2">
                      <div className="col-5"><strong>Email:</strong></div>
                      <div className="col-7">{selectedCaregiverForView?.email}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5"><strong>Mobile:</strong></div>
                      <div className="col-7">{selectedCaregiverForView?.mobile}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5"><strong>Address:</strong></div>
                      <div className="col-7">{selectedCaregiverForView?.address}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5"><strong>Certification:</strong></div>
                      <div className="col-7">{selectedCaregiverForView?.certification}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5"><strong>Experience:</strong></div>
                      <div className="col-7">{selectedCaregiverForView?.yearsExperience} years</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5"><strong>Skills:</strong></div>
                      <div className="col-7">{selectedCaregiverForView?.skills}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5"><strong>Join Date:</strong></div>
                      <div className="col-7">{selectedCaregiverForView?.joinDate}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5"><strong>Document:</strong></div>
                      <div className="col-7">
                        {selectedCaregiverForView?.document ? (
                          <a href="#" className="text-decoration-none">
                            <i className="fas fa-file-pdf text-danger me-1"></i>
                            {selectedCaregiverForView.document}
                          </a>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseViewModal}
                >
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