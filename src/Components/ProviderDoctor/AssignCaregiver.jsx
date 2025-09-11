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
  
  // Sample caregivers data
  const [caregivers] = useState([
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
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  
  // Handle form submission
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
  
  return (
    <div className="">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h3 className="dashboard-heading">Assign Caregivers</h3>
        <button
          className="btn text-white"
          style={{ backgroundColor: "#F95918" }}
          onClick={() => setShowModal(true)}
        >
          + New Assignment
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
                      <th>Date Assigned</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((assignment) => (
                      <tr key={assignment.id}>
                        <td>#{assignment.id}</td>
                        <td>{assignment.patientName}</td>
                        <td>{assignment.caregiverName}</td>
                        <td>{assignment.dateAssigned}</td>
                        <td>
                          <span className={`badge ${getStatusClass(assignment.status)}`}>
                            {assignment.status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
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
                    ))}
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
    </div>
  );
};
export default AssignCaregiver;