import React, { useState } from "react";
const AssignCaregiver = () => {
  // Sample patients data
  const [patients] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      joinDate: "2023-09-15",
      status: "Active",
      phone: "555-1234",
      address: "123 Main St",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      joinDate: "2023-10-05",
      status: "Inactive",
      phone: "555-5678",
      address: "456 Oak Ave",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert@example.com",
      joinDate: "2023-08-20",
      status: "Active",
      phone: "555-9012",
      address: "789 Elm St",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      joinDate: "2023-11-01",
      status: "Active",
      phone: "555-3456",
      address: "321 Pine Rd",
    },
  ]);
  
  // Sample caregivers data - now updatable
  const [caregivers, setCaregivers] = useState([
    {
      id: 201,
      name: "Amy Rodriguez",
      email: "amy@example.com",
      joinDate: "2023-09-25",
      status: "Active",
      certification: "CNA",
      yearsExperience: 5,
      mobile: "555-9012",
      address: "789 Care St",
      skills: "BP Monitoring, Insulin Injection, Elderly Care",
      profilePicture: "https://randomuser.me/api/portraits/women/44.jpg",
      documents: [
        { name: "Certification.pdf", url: "https://example.com/cert1.pdf" },
        { name: "BackgroundCheck.pdf", url: "https://example.com/bg1.pdf" }
      ]
    },
    {
      id: 202,
      name: "Michael Johnson",
      email: "michael@example.com",
      joinDate: "2023-08-15",
      status: "Active",
      certification: "RN",
      yearsExperience: 8,
      mobile: "555-3456",
      address: "321 Health Ave",
      skills: "Wound Care, Medication Administration, Physical Therapy",
      profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
      documents: [
        { name: "License.pdf", url: "https://example.com/license1.pdf" }
      ]
    },
    {
      id: 203,
      name: "Sarah Williams",
      email: "sarah@example.com",
      joinDate: "2023-10-10",
      status: "Inactive",
      certification: "LPN",
      yearsExperience: 6,
      mobile: "555-7890",
      address: "654 Nurse Lane",
      skills: "Patient Hygiene, Vital Signs Monitoring, Dementia Care",
      profilePicture: "https://randomuser.me/api/portraits/women/68.jpg",
      documents: []
    },
  ]);
  
  // State for assignments
  const [assignments, setAssignments] = useState([
    {
      id: 1001,
      patientId: 1,
      patientName: "John Doe",
      caregiverId: 201,
      caregiverName: "Amy Rodriguez",
      dateAssigned: "2023-10-15",
      status: "Active",
    },
    {
      id: 1002,
      patientId: 3,
      patientName: "Robert Johnson",
      caregiverId: 202,
      caregiverName: "Michael Johnson",
      dateAssigned: "2023-10-20",
      status: "Active",
    },
  ]);
  
  // State for form
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedCaregiver, setSelectedCaregiver] = useState("");
  const [assignmentDate, setAssignmentDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddCaregiverModal, setShowAddCaregiverModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [viewingAssignment, setViewingAssignment] = useState(null);
  
  // State for new caregiver form
  const [newCaregiver, setNewCaregiver] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    certification: "",
    yearsExperience: "",
    skills: "",
    joinDate: "",
    profilePicture: "",
    profilePictureFile: null,
    documents: [],
    documentFiles: []
  });
  const [selectedPatientForNewCaregiver, setSelectedPatientForNewCaregiver] = useState("");
  const [assignmentDateForNewCaregiver, setAssignmentDateForNewCaregiver] = useState("");
  
  // State for editing caregiver
  const [editingCaregiver, setEditingCaregiver] = useState(null);
  const [showEditCaregiverModal, setShowEditCaregiverModal] = useState(false);
  
  // Handle form submission for assignment
  const handleAssign = () => {
    if (!selectedPatient || !selectedCaregiver || !assignmentDate) {
      alert("Please fill all fields");
      return;
    }
    
    const patient = patients.find(p => p.id === parseInt(selectedPatient));
    const caregiver = caregivers.find(c => c.id === parseInt(selectedCaregiver));
    
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
    
    setAssignments([...assignments, newAssignment]);
    setShowModal(false);
    resetForm();
  };
  
  // Reset form
  const resetForm = () => {
    setSelectedPatient("");
    setSelectedCaregiver("");
    setAssignmentDate("");
  };
  
  // Handle assignment deletion
  const handleDelete = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    setAssignments(assignments.filter(a => a.id !== selectedAssignment.id));
    setShowDeleteModal(false);
    setSelectedAssignment(null);
  };
  
  // Toggle assignment status
  const toggleStatus = (assignmentId) => {
    setAssignments(assignments.map(assignment => 
      assignment.id === assignmentId 
        ? { 
            ...assignment, 
            status: assignment.status === "Active" ? "Inactive" : "Active" 
          } 
        : assignment
    ));
  };
  
  // Handle edit
  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setSelectedPatient(assignment.patientId.toString());
    setSelectedCaregiver(assignment.caregiverId.toString());
    setAssignmentDate(assignment.dateAssigned);
    setShowEditModal(true);
  };
  
  // Handle view
  const handleView = (assignment) => {
    setViewingAssignment(assignment);
    setShowViewModal(true);
  };
  
  // Handle update
  const handleUpdate = () => {
    if (!selectedPatient || !selectedCaregiver || !assignmentDate) {
      alert("Please fill all fields");
      return;
    }
    
    const patient = patients.find(p => p.id === parseInt(selectedPatient));
    const caregiver = caregivers.find(c => c.id === parseInt(selectedCaregiver));
    
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
    
    setAssignments(assignments.map(a => 
      a.id === editingAssignment.id ? updatedAssignment : a
    ));
    
    setShowEditModal(false);
    resetForm();
    setEditingAssignment(null);
  };
  
  // Handle new caregiver form input changes
  const handleNewCaregiverChange = (e) => {
    const { name, value } = e.target;
    setNewCaregiver({
      ...newCaregiver,
      [name]: value
    });
  };
  
  // Handle profile picture upload
  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCaregiver({
          ...newCaregiver,
          profilePicture: reader.result,
          profilePictureFile: file
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle document upload
  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocuments = [...newCaregiver.documents];
    const newDocumentFiles = [...newCaregiver.documentFiles];
    
    files.forEach(file => {
      newDocuments.push({
        name: file.name,
        url: URL.createObjectURL(file)
      });
      newDocumentFiles.push(file);
    });
    
    setNewCaregiver({
      ...newCaregiver,
      documents: newDocuments,
      documentFiles: newDocumentFiles
    });
  };
  
  // Handle document removal
  const handleDocumentRemove = (index) => {
    const newDocuments = [...newCaregiver.documents];
    const newDocumentFiles = [...newCaregiver.documentFiles];
    
    newDocuments.splice(index, 1);
    newDocumentFiles.splice(index, 1);
    
    setNewCaregiver({
      ...newCaregiver,
      documents: newDocuments,
      documentFiles: newDocumentFiles
    });
  };
  
  // Handle adding new caregiver and assignment
  const handleAddCaregiverAndAssign = () => {
    // Validate caregiver fields
    if (!newCaregiver.name || !newCaregiver.email || !newCaregiver.mobile) {
      alert("Please fill all required caregiver fields (Name, Email, Mobile)");
      return;
    }
    
    // Validate assignment fields
    if (!selectedPatientForNewCaregiver || !assignmentDateForNewCaregiver) {
      alert("Please select a patient and assignment date");
      return;
    }
    
    // Generate new ID for caregiver
    const newId = Math.max(...caregivers.map(c => c.id), 0) + 1;
    
    // Create new caregiver object
    const caregiverToAdd = {
      ...newCaregiver,
      id: newId,
      status: "Active",
      joinDate: newCaregiver.joinDate || new Date().toISOString().split('T')[0],
      documents: newCaregiver.documents.map(doc => ({
        name: doc.name,
        url: doc.url
      }))
    };
    
    // Remove file objects before adding to state
    delete caregiverToAdd.profilePictureFile;
    delete caregiverToAdd.documentFiles;
    
    // Add to caregivers list
    setCaregivers([...caregivers, caregiverToAdd]);
    
    // Find selected patient
    const patient = patients.find(p => p.id === parseInt(selectedPatientForNewCaregiver));
    
    // Create new assignment
    const newAssignment = {
      id: Date.now(),
      patientId: patient.id,
      patientName: patient.name,
      caregiverId: newId,
      caregiverName: caregiverToAdd.name,
      dateAssigned: assignmentDateForNewCaregiver,
      status: "Active",
    };
    
    // Add to assignments
    setAssignments([...assignments, newAssignment]);
    
    // Close modal and reset form
    setShowAddCaregiverModal(false);
    resetNewCaregiverForm();
  };
  
  // Reset new caregiver form
  const resetNewCaregiverForm = () => {
    setNewCaregiver({
      name: "",
      email: "",
      mobile: "",
      address: "",
      certification: "",
      yearsExperience: "",
      skills: "",
      joinDate: "",
      profilePicture: "",
      profilePictureFile: null,
      documents: [],
      documentFiles: []
    });
    setSelectedPatientForNewCaregiver("");
    setAssignmentDateForNewCaregiver("");
  };
  
  // Handle edit caregiver
  const handleEditCaregiver = (caregiver) => {
    setEditingCaregiver({...caregiver});
    setShowEditCaregiverModal(true);
  };
  
  // Handle update caregiver
  const handleUpdateCaregiver = () => {
    if (!editingCaregiver.name || !editingCaregiver.email || !editingCaregiver.mobile) {
      alert("Please fill all required fields (Name, Email, Mobile)");
      return;
    }
    
    setCaregivers(caregivers.map(c => 
      c.id === editingCaregiver.id ? editingCaregiver : c
    ));
    
    setShowEditCaregiverModal(false);
    setEditingCaregiver(null);
  };
  
  // Handle caregiver form changes
  const handleCaregiverChange = (e) => {
    const { name, value } = e.target;
    setEditingCaregiver({
      ...editingCaregiver,
      [name]: value
    });
  };
  
  // Handle caregiver profile picture update
  const handleCaregiverProfilePictureUpdate = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingCaregiver({
          ...editingCaregiver,
          profilePicture: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle caregiver document upload
  const handleCaregiverDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocuments = [...editingCaregiver.documents];
    
    files.forEach(file => {
      newDocuments.push({
        name: file.name,
        url: URL.createObjectURL(file)
      });
    });
    
    setEditingCaregiver({
      ...editingCaregiver,
      documents: newDocuments
    });
  };
  
  // Handle caregiver document removal
  const handleCaregiverDocumentRemove = (index) => {
    const newDocuments = [...editingCaregiver.documents];
    newDocuments.splice(index, 1);
    
    setEditingCaregiver({
      ...editingCaregiver,
      documents: newDocuments
    });
  };
  
  // Get status class
  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-success";
      case "Inactive":
        return "bg-secondary";
      default:
        return "bg-secondary";
    }
  };
  
  // Get caregiver details by ID
  const getCaregiverDetails = (caregiverId) => {
    return caregivers.find(c => c.id === caregiverId);
  };
  
  // Get patient details by ID
  const getPatientDetails = (patientId) => {
    return patients.find(p => p.id === patientId);
  };
  
  return (
    <div className="">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h3 className="dashboard-heading">Assign Caregivers</h3>
        <button
          className="btn text-white"
          style={{ backgroundColor: "#F95918" }}
          onClick={() => setShowAddCaregiverModal(true)}
        >
          + Add Caregiver & Assign
        </button>
      </div>
      
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
                    {assignments.map((assignment) => {
                      const caregiver = getCaregiverDetails(assignment.caregiverId);
                      return (
                        <tr key={assignment.id}>
                          <td>#{assignment.id}</td>
                          <td>{assignment.patientName}</td>
                          <td>{assignment.caregiverName}</td>
                          <td>
                            {caregiver && caregiver.profilePicture && (
                              <img 
                                src={caregiver.profilePicture} 
                                alt={caregiver.name}
                                className="rounded-circle"
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                              />
                            )}
                          </td>
                          <td>{assignment.dateAssigned}</td>
                          <td>
                            <span className={`badge ${getStatusClass(assignment.status)}`}>
                              {assignment.status}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleView(assignment)}
                                title="View"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button
                                className="btn btn-sm"
                                onClick={() => handleEdit(assignment)}
                                style={{
                                  color: "#F95918",
                                }}
                                title="Edit"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className={`btn btn-sm ${assignment.status === "Active"
                                  ? "btn-outline-danger"
                                  : "btn-outline-success"
                                  }`}
                                onClick={() => toggleStatus(assignment.id)}
                                title={assignment.status === "Active" ? "Deactivate" : "Activate"}
                              >
                                {assignment.status === "Active" ? (
                                  <i className="fas fa-user-slash"></i>
                                ) : (
                                  <i className="fas fa-user-check"></i>
                                )}
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(assignment)}
                                title="Delete"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Assignment Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assign Caregiver to Patient</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Select Patient</label>
                  <select
                    className="form-select"
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                  >
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
                  <select
                    className="form-select"
                    value={selectedCaregiver}
                    onChange={(e) => setSelectedCaregiver(e.target.value)}
                  >
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
                  <input
                    type="date"
                    className="form-control"
                    value={assignmentDate}
                    onChange={(e) => setAssignmentDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn text-white"
                  onClick={handleAssign}
                  style={{ backgroundColor: "#F95918" }}
                >
                  Assign Caregiver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Assignment Modal */}
      {showEditModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Assignment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                    setEditingAssignment(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Select Patient</label>
                  <select
                    className="form-select"
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                  >
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
                  <select
                    className="form-select"
                    value={selectedCaregiver}
                    onChange={(e) => setSelectedCaregiver(e.target.value)}
                  >
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
                  <input
                    type="date"
                    className="form-control"
                    value={assignmentDate}
                    onChange={(e) => setAssignmentDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                    setEditingAssignment(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn text-white"
                  onClick={handleUpdate}
                  style={{ backgroundColor: "#F95918" }}
                >
                  Update Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this assignment?</p>
                <div className="card bg-light">
                  <div className="card-body">
                    <p><strong>Patient:</strong> {selectedAssignment?.patientName}</p>
                    <p><strong>Caregiver:</strong> {selectedAssignment?.caregiverName}</p>
                    <p><strong>Date Assigned:</strong> {selectedAssignment?.dateAssigned}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* View Assignment Modal */}
      {showViewModal && viewingAssignment && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assignment Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowViewModal(false)}
                ></button>
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
                              <span className={`badge ${getStatusClass(patient.status)} ms-2`}>
                                {patient.status}
                              </span>
                            </p>
                          </div>
                        </div>
                      ) : null;
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
                              {caregiver.profilePicture && (
                                <img 
                                  src={caregiver.profilePicture} 
                                  alt={caregiver.name}
                                  className="rounded-circle me-3"
                                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                />
                              )}
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
                            <p><strong>Join Date:</strong> {caregiver.joinDate}</p>
                            <p><strong>Status:</strong> 
                              <span className={`badge ${getStatusClass(caregiver.status)} ms-2`}>
                                {caregiver.status}
                              </span>
                            </p>
                            
                            {caregiver.documents && caregiver.documents.length > 0 && (
                              <div className="mt-3">
                                <h6>Documents:</h6>
                                <ul className="list-group">
                                  {caregiver.documents.map((doc, index) => (
                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                        {doc.name}
                                      </a>
                                      <i className="fas fa-file-pdf text-danger"></i>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            <div className="mt-3">
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEditCaregiver(caregiver)}
                              >
                                <i className="fas fa-edit me-1"></i> Edit Caregiver
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <h6 className="mb-3">Assignment Information</h6>
                    <div className="card">
                      <div className="card-body">
                        <p><strong>Assignment ID:</strong> #{viewingAssignment.id}</p>
                        <p><strong>Date Assigned:</strong> {viewingAssignment.dateAssigned}</p>
                        <p><strong>Status:</strong> 
                          <span className={`badge ${getStatusClass(viewingAssignment.status)} ms-2`}>
                            {viewingAssignment.status}
                          </span>
                        </p>
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
      
      {/* Add Caregiver and Assign Modal */}
      {showAddCaregiverModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Caregiver & Assign to Patient</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowAddCaregiverModal(false);
                    resetNewCaregiverForm();
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <h6 className="mb-3">Caregiver Information</h6>
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Full Name*</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      name="name"
                      value={newCaregiver.name}
                      onChange={handleNewCaregiverChange}
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
                      value={newCaregiver.email}
                      onChange={handleNewCaregiverChange}
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
                      value={newCaregiver.mobile}
                      onChange={handleNewCaregiverChange}
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
                      value={newCaregiver.address}
                      onChange={handleNewCaregiverChange}
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
                      value={newCaregiver.certification}
                      onChange={handleNewCaregiverChange}
                      placeholder="Certification"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Years of Experience</label>
                    <input
                      type="number"
                      className="form-control mb-2"
                      name="yearsExperience"
                      value={newCaregiver.yearsExperience}
                      onChange={handleNewCaregiverChange}
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
                      value={newCaregiver.skills}
                      onChange={handleNewCaregiverChange}
                      placeholder="Skills (comma separated)"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Join Date</label>
                    <input
                      type="date"
                      className="form-control mb-2"
                      name="joinDate"
                      value={newCaregiver.joinDate}
                      onChange={handleNewCaregiverChange}
                    />
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Profile Picture</label>
                    <div className="mb-2">
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                      />
                    </div>
                    {newCaregiver.profilePicture && (
                      <div className="mt-2">
                        <p className="mb-1">Preview:</p>
                        <img 
                          src={newCaregiver.profilePicture} 
                          alt="Profile Preview" 
                          className="rounded-circle" 
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/80";
                          }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label">Documents</label>
                    <div className="mb-2">
                      <input
                        type="file"
                        className="form-control"
                        multiple
                        onChange={handleDocumentUpload}
                      />
                      <small className="text-muted">Upload certifications, licenses, etc.</small>
                    </div>
                    
                    {newCaregiver.documents.length > 0 && (
                      <div className="mt-2">
                        <p className="mb-1">Uploaded Documents:</p>
                        <ul className="list-group">
                          {newCaregiver.documents.map((doc, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                              <span>{doc.name}</span>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDocumentRemove(index)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                <hr className="my-4" />
                
                <h6 className="mb-3">Assignment Information</h6>
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Select Patient*</label>
                    <select
                      className="form-select"
                      value={selectedPatientForNewCaregiver}
                      onChange={(e) => setSelectedPatientForNewCaregiver(e.target.value)}
                    >
                      <option value="">-- Choose Patient --</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name} (ID: {patient.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Assignment Date*</label>
                    <input
                      type="date"
                      className="form-control"
                      value={assignmentDateForNewCaregiver}
                      onChange={(e) => setAssignmentDateForNewCaregiver(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddCaregiverModal(false);
                    resetNewCaregiverForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn text-white"
                  onClick={handleAddCaregiverAndAssign}
                  style={{ backgroundColor: "#F95918" }}
                >
                  Add Caregiver & Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Caregiver Modal */}
      {showEditCaregiverModal && editingCaregiver && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Caregiver</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowEditCaregiverModal(false);
                    setEditingCaregiver(null);
                  }}
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
                      value={editingCaregiver.name}
                      onChange={handleCaregiverChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email*</label>
                    <input
                      type="email"
                      className="form-control mb-2"
                      name="email"
                      value={editingCaregiver.email}
                      onChange={handleCaregiverChange}
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
                      value={editingCaregiver.mobile}
                      onChange={handleCaregiverChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      name="address"
                      value={editingCaregiver.address}
                      onChange={handleCaregiverChange}
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
                      value={editingCaregiver.certification}
                      onChange={handleCaregiverChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Years of Experience</label>
                    <input
                      type="number"
                      className="form-control mb-2"
                      name="yearsExperience"
                      value={editingCaregiver.yearsExperience}
                      onChange={handleCaregiverChange}
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
                      value={editingCaregiver.skills}
                      onChange={handleCaregiverChange}
                      placeholder="Skills (comma separated)"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select mb-2"
                      name="status"
                      value={editingCaregiver.status}
                      onChange={handleCaregiverChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Profile Picture</label>
                    <div className="mb-2">
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleCaregiverProfilePictureUpdate}
                      />
                    </div>
                    {editingCaregiver.profilePicture && (
                      <div className="mt-2">
                        <p className="mb-1">Current Profile Picture:</p>
                        <img 
                          src={editingCaregiver.profilePicture} 
                          alt="Profile" 
                          className="rounded-circle" 
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label">Documents</label>
                    <div className="mb-2">
                      <input
                        type="file"
                        className="form-control"
                        multiple
                        onChange={handleCaregiverDocumentUpload}
                      />
                      <small className="text-muted">Upload certifications, licenses, etc.</small>
                    </div>
                    
                    {editingCaregiver.documents && editingCaregiver.documents.length > 0 && (
                      <div className="mt-2">
                        <p className="mb-1">Current Documents:</p>
                        <ul className="list-group">
                          {editingCaregiver.documents.map((doc, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                {doc.name}
                              </a>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleCaregiverDocumentRemove(index)}
                              >
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
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowEditCaregiverModal(false);
                    setEditingCaregiver(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn text-white"
                  onClick={handleUpdateCaregiver}
                  style={{ backgroundColor: "#F95918" }}
                >
                  Update Caregiver
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