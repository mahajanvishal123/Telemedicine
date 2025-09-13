import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Form,
  Nav,
  Modal,
  Button ,
  InputGroup
} from "react-bootstrap";
import { FaUserMd, FaStar, FaSearch, FaCalendarAlt, FaClock, FaUserNurse } from "react-icons/fa";

const MyCaregiver = () => {
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
  const [assignments] = useState([
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
  
  // State for modals
  const [showCaregiverModal, setShowCaregiverModal] = useState(false);
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);
  
  // Current patient (in a real app, this would come from authentication)
  const currentPatientId = 1; // John Doe
  
  // Get current patient
  const currentPatient = patients.find(p => p.id === currentPatientId);
  
  // Get assignments for current patient
  const patientAssignments = assignments.filter(a => a.patientId === currentPatientId);
  
  // Get caregiver details by ID
  const getCaregiverDetails = (caregiverId) => {
    return caregivers.find(c => c.id === caregiverId);
  };
  
  // Handle view caregiver details
  const handleViewCaregiver = (caregiverId) => {
    const caregiver = getCaregiverDetails(caregiverId);
    if (caregiver) {
      setSelectedCaregiver(caregiver);
      setShowCaregiverModal(true);
    }
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
    <div className="container">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="dashboard-heading">My Caregiver</h3>
          <p className="text-muted">View your assigned caregiver information</p>
        </div>
        <Link to="/dashboard" className="btn btn-outline-secondary">
          Back to Dashboard
        </Link>
      </div>
      
      {/* Patient Info Card */}
      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="me-3">
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                   style={{ width: '60px', height: '60px' }}>
                <span className="text-white fw-bold fs-4">
                  {currentPatient ? currentPatient.name.charAt(0) : 'P'}
                </span>
              </div>
            </div>
            <div>
              <h5 className="mb-1">{currentPatient ? currentPatient.name : 'Patient'}</h5>
              <p className="mb-0 text-muted">
                {currentPatient ? currentPatient.email : 'patient@example.com'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Caregiver Section */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-white">
              <h5 className="mb-0">Assigned Caregiver</h5>
            </div>
            <div className="card-body">
              {patientAssignments.length > 0 ? (
                patientAssignments.map((assignment) => {
                  const caregiver = getCaregiverDetails(assignment.caregiverId);
                  return caregiver ? (
                    <div key={assignment.id} className="row">
                      <div className="col-md-4 mb-4 mb-md-0">
                        <div className="text-center">
                          {caregiver.profilePicture ? (
                            <img 
                              src={caregiver.profilePicture} 
                              alt={caregiver.name}
                              className="rounded-circle mb-3"
                              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" 
                                 style={{ width: '150px', height: '150px' }}>
                              <span className="text-white fw-bold fs-2">
                                {caregiver.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <h5 className="mb-1">{caregiver.name}</h5>
                          <p className="text-muted mb-2">{caregiver.certification}</p>
                          <span className={`badge ${getStatusClass(caregiver.status)}`}>
                            {caregiver.status}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="mb-4">
                          <h6 className="mb-3 border-bottom pb-2">Contact Information</h6>
                          <div className="row">
                            <div className="col-sm-6 mb-3">
                              <div className="d-flex">
                                <i className="fas fa-envelope me-2 mt-1 text-primary"></i>
                                <div>
                                  <small className="text-muted d-block">Email</small>
                                  <span>{caregiver.email}</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                              <div className="d-flex">
                                <i className="fas fa-phone me-2 mt-1 text-primary"></i>
                                <div>
                                  <small className="text-muted d-block">Phone</small>
                                  <span>{caregiver.mobile}</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 mb-3">
                              <div className="d-flex">
                                <i className="fas fa-map-marker-alt me-2 mt-1 text-primary"></i>
                                <div>
                                  <small className="text-muted d-block">Address</small>
                                  <span>{caregiver.address}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h6 className="mb-3 border-bottom pb-2">Professional Information</h6>
                          <div className="row">
                            <div className="col-sm-6 mb-3">
                              <div className="d-flex">
                                <i className="fas fa-certificate me-2 mt-1 text-primary"></i>
                                <div>
                                  <small className="text-muted d-block">Certification</small>
                                  <span>{caregiver.certification}</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                              <div className="d-flex">
                                <i className="fas fa-history me-2 mt-1 text-primary"></i>
                                <div>
                                  <small className="text-muted d-block">Experience</small>
                                  <span>{caregiver.yearsExperience} years</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                              <div className="d-flex">
                                <i className="fas fa-calendar-alt me-2 mt-1 text-primary"></i>
                                <div>
                                  <small className="text-muted d-block">Join Date</small>
                                  <span>{caregiver.joinDate}</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 mb-3">
                              <div className="d-flex">
                                <i className="fas fa-tools me-2 mt-1 text-primary"></i>
                                <div>
                                  <small className="text-muted d-block">Skills</small>
                                  <span>{caregiver.skills}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h6 className="mb-3 border-bottom pb-2">Assignment Details</h6>
                          <div className="row">
                            <div className="col-sm-6 mb-3">
                              <div className="d-flex">
                                <i className="fas fa-calendar-check me-2 mt-1 text-primary"></i>
                                <div>
                                  <small className="text-muted d-block">Assigned Date</small>
                                  <span>{assignment.dateAssigned}</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                              <div className="d-flex">
                                <i className="fas fa-info-circle me-2 mt-1 text-primary"></i>
                                <div>
                                  <small className="text-muted d-block">Status</small>
                                  <span className={`badge ${getStatusClass(assignment.status)}`}>
                                    {assignment.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleViewCaregiver(caregiver.id)}
                          >
                            <i className="fas fa-eye me-1"></i> View Full Profile
                          </button>
                          <button
                            className="btn btn-outline-primary"
                          >
                            <i className="fas fa-phone me-1"></i> Contact
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-user-nurse fa-3x text-muted mb-3"></i>
                  <h5>No Caregiver Assigned</h5>
                  <p className="text-muted">You don't have any caregiver assigned to you yet.</p>
                  <Link to="/dashboard" className="btn btn-primary">
                    Back to Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Caregiver Details Modal */}
      {showCaregiverModal && selectedCaregiver && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Caregiver Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCaregiverModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="d-flex align-items-center mb-4">
                  {selectedCaregiver.profilePicture ? (
                    <img 
                      src={selectedCaregiver.profilePicture} 
                      alt={selectedCaregiver.name}
                      className="rounded-circle me-3"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style={{ width: '100px', height: '100px' }}>
                      <span className="text-white fw-bold fs-2">
                        {selectedCaregiver.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="mb-1">{selectedCaregiver.name}</h4>
                    <p className="mb-0">{selectedCaregiver.certification}</p>
                    <span className={`badge ${getStatusClass(selectedCaregiver.status)} mt-2`}>
                      {selectedCaregiver.status}
                    </span>
                  </div>
                </div>
                
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 className="mb-3 border-bottom pb-2">Contact Information</h6>
                    <div className="card mb-3">
                      <div className="card-body">
                        <div className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-envelope me-2 text-primary"></i>
                            <strong>Email:</strong>
                          </div>
                          <div className="ms-4">{selectedCaregiver.email}</div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-phone me-2 text-primary"></i>
                            <strong>Mobile:</strong>
                          </div>
                          <div className="ms-4">{selectedCaregiver.mobile}</div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                            <strong>Address:</strong>
                          </div>
                          <div className="ms-4">{selectedCaregiver.address}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="mb-3 border-bottom pb-2">Professional Information</h6>
                    <div className="card mb-3">
                      <div className="card-body">
                        <div className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-certificate me-2 text-primary"></i>
                            <strong>Certification:</strong>
                          </div>
                          <div className="ms-4">{selectedCaregiver.certification}</div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-history me-2 text-primary"></i>
                            <strong>Experience:</strong>
                          </div>
                          <div className="ms-4">{selectedCaregiver.yearsExperience} years</div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-calendar-alt me-2 text-primary"></i>
                            <strong>Join Date:</strong>
                          </div>
                          <div className="ms-4">{selectedCaregiver.joinDate}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="row mb-4">
                  <div className="col-12">
                    <h6 className="mb-3 border-bottom pb-2">Skills</h6>
                    <div className="card mb-3">
                      <div className="card-body">
                        <div className="d-flex align-items-start">
                          <i className="fas fa-tools me-2 mt-1 text-primary"></i>
                          <div>
                            {selectedCaregiver.skills}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedCaregiver.documents && selectedCaregiver.documents.length > 0 && (
                  <div className="row">
                    <div className="col-12">
                      <h6 className="mb-3 border-bottom pb-2">Documents</h6>
                      <div className="card">
                        <div className="card-body">
                          <ul className="list-group">
                            {selectedCaregiver.documents.map((doc, index) => (
                              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  <i className="fas fa-file-pdf text-danger me-2"></i>
                                  <span>{doc.name}</span>
                                </div>
                                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                  <i className="fas fa-download"></i> Download
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCaregiverModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                >
                  <i className="fas fa-phone me-1"></i> Contact Caregiver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCaregiver ;
