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
  InputGroup
} from "react-bootstrap";
import { FaUserMd, FaStar, FaSearch, FaCalendarAlt, FaClock, FaUserNurse } from "react-icons/fa";
import "./MyDoctors.css"; // Using the same CSS as MyDoctors

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
  
  // State for UI
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [currentPatient, setCurrentPatient] = useState(null);
  
  // Initialize with first patient (for demo purposes)
  useEffect(() => {
    if (patients.length > 0) {
      setCurrentPatient(patients[0]);
    }
  }, [patients]);
  
  // Get assigned caregivers for current patient
  const getAssignedCaregivers = () => {
    if (!currentPatient) return [];
    
    const patientAssignments = assignments.filter(
      assignment => assignment.patientId === currentPatient.id && assignment.status === "Active"
    );
    
    return patientAssignments.map(assignment => {
      const caregiver = caregivers.find(c => c.id === assignment.caregiverId);
      return {
        ...caregiver,
        dateAssigned: assignment.dateAssigned,
        assignmentId: assignment.id
      };
    }).filter(Boolean); // Remove any undefined entries
  };
  
  const assignedCaregivers = getAssignedCaregivers();
  
  // Filter caregivers based on active tab and search
  const filteredCaregivers = assignedCaregivers.filter((caregiver) => {
    const matchesRole = activeTab === "All" || caregiver.certification === activeTab;
    const matchesSearch =
      caregiver.name.toLowerCase().includes(search.toLowerCase()) ||
      caregiver.certification.toLowerCase().includes(search.toLowerCase()) ||
      caregiver.skills.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });
  
  // Certifications for filter tabs
  const certifications = ["All", "CNA", "RN", "LPN"];
  
  // Modal handlers
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCaregiver(null);
    setSelectedDate("");
    setSelectedTime("");
  };
  
  const handleShowModal = (caregiver) => {
    setSelectedCaregiver(caregiver);
    setShowModal(true);
  };
  
  const handleScheduleVisit = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time");
      return;
    }
    
    alert(`Visit scheduled with ${selectedCaregiver.name} on ${selectedDate} at ${selectedTime}`);
    handleCloseModal();
  };
  
  // Generate time slots for the modal
  const timeSlots = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour % 12 === 0 ? 12 : hour % 12}:${minute === 0 ? '00' : minute} ${hour >= 12 ? 'PM' : 'AM'}`;
      timeSlots.push(timeString);
    }
  }
  
  // Get status class
  const getStatusClass = (status) => {
    return status === "Active" ? "available" : "busy";
  };
  
  return (
    <div fluid className="">
      <div>
        {/* Header */}
        <Row className="align-items-center mb-4">
          <Col xs={12} md={8}>
            <div className="d-flex align-items-center">
              <div className="">
                <h3 className="dashboard-heading">My Caregivers</h3>
                <span className="text-muted">Caregivers assigned to you by your healthcare provider</span>
              </div>
            </div>
          </Col>
        </Row>
        
        {/* Current Patient Info */}
        {currentPatient && (
          <Card className="mb-4 border-primary">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <div className="mydoctors-avatar online">
                  <FaUserMd size={28} />
                </div>
              </div>
              <div>
                <h5 className="mb-1">{currentPatient.name}</h5>
                <p className="mb-0 text-muted">Patient ID: {currentPatient.id}</p>
              </div>
              <div className="ms-auto text-end">
                <Badge bg="success">Active</Badge>
              </div>
            </Card.Body>
          </Card>
        )}
        
        {/* Filter Tabs */}
        <Row className="mb-3">
          <Col xs={12}>
            <Nav variant="tabs" className="mydoctors-tabs">
              {certifications.map((cert) => (
                <Nav.Item key={cert}>
                  <Nav.Link
                    className={`mydoctors-tab-btn ${activeTab === cert ? "active" : ""}`}
                    onClick={() => setActiveTab(cert)}
                  >
                    {cert}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Col>
        </Row>
        
        {/* Search Bar */}
        <div className="mb-4">
          <div className="position-relative" style={{ maxWidth: "500px" }}>
            <Form.Control
              type="search"
              placeholder="Search caregivers by name, certification or skills..."
              className="pe-5"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div
              className="position-absolute top-50 end-0 translate-middle-y p-2"
              style={{ cursor: "pointer" }}
              onClick={() => {/* Add search functionality if needed */ }}
            >
              <FaSearch size={16} color="#6c757d" />
            </div>
          </div>
        </div>
        
        {/* Caregiver Cards */}
        <Row>
          {filteredCaregivers.length === 0 ? (
            <Col xs={12}>
              <div className="text-center text-muted py-5">
                No caregivers assigned to you yet. Please contact your healthcare provider.
              </div>
            </Col>
          ) : (
            filteredCaregivers.map((caregiver, idx) => (
              <Col key={caregiver.id} xs={12} md={4} className="mb-4 d-flex">
                <Card className="mydoctors-card flex-fill shadow-sm">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex align-items-center mb-2">
                      <div className={`mydoctors-avatar ${getStatusClass(caregiver.status)}`}>
                        <FaUserNurse size={28} />
                      </div>
                      <div className="ms-auto d-flex align-items-center">
                        <FaStar color="#FFD700" />
                        <span className="ms-1 fw-bold">{4.7 + (idx * 0.1)}</span>
                      </div>
                    </div>
                    <Card.Title className="fw-bold">{caregiver.name}</Card.Title>
                    <Card.Subtitle className="mb-2" style={{ color: "#FF6A00" }}>{caregiver.certification}</Card.Subtitle>
                    
                    <div className="mb-2">
                      <small className="text-muted">
                        <FaUserMd className="me-1" />
                        Assigned: {caregiver.dateAssigned}
                      </small>
                    </div>
                    
                    <Row className="mb-2">
                      <Col xs={6}>
                        <div className="mydoctors-info-box">
                          <div className="fw-bold">{caregiver.yearsExperience}</div>
                          <small className="text-muted">Experience</small>
                        </div>
                      </Col>
                      <Col xs={6}>
                        <div className="mydoctors-info-box">
                          <div className="fw-bold">{caregiver.certification}</div>
                          <small className="text-muted">Certification</small>
                        </div>
                      </Col>
                    </Row>
                    
                    <div className="mb-2">
                      <div className="d-flex align-items-center">
                        <div className={`status-indicator ${getStatusClass(caregiver.status)}`}></div>
                        <span className="ms-2 fw-bold">{caregiver.status}</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <small className="text-muted">Skills:</small>
                      <div className="mt-1">
                        {caregiver.skills.split(', ').slice(0, 3).map((skill, i) => (
                          <Badge key={i} bg="light" text="dark" className="me-1 mb-1">
                            {skill}
                          </Badge>
                        ))}
                        {caregiver.skills.split(', ').length > 3 && (
                          <Badge bg="light" text="dark" className="mb-1">
                            +{caregiver.skills.split(', ').length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      style={{ background: "#FF6A00", border: "none" }}
                      className="w-100 mt-auto"
                      onClick={() => handleShowModal(caregiver)}
                    >
                      Schedule Visit
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
        
        {/* Schedule Visit Modal */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Schedule Visit</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedCaregiver && (
              <>
                <div className="d-flex align-items-center mb-3">
                  <div className="mydoctors-avatar me-3">
                    <FaUserNurse size={24} />
                  </div>
                  <div>
                    <h5 className="mb-0">{selectedCaregiver.name}</h5>
                    <p className="mb-0 text-muted">{selectedCaregiver.certification}</p>
                  </div>
                </div>
                
                <div className="mb-3 p-2 bg-light rounded">
                  <small className="text-muted">Assigned to you on: {selectedCaregiver.dateAssigned}</small>
                </div>
                
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaCalendarAlt className="me-2" />
                      Select Date
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaClock className="me-2" />
                      Select Time
                    </Form.Label>
                    <Form.Select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    >
                      <option value="">Select a time</option>
                      {timeSlots.map((time, index) => (
                        <option key={index} value={time}>{time}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div>
                      <span className="text-muted">Visit Type:</span>
                      <span className="fw-bold ms-2" style={{ color: "#FF6A00" }}>Home Visit</span>
                    </div>
                  </div>
                </Form>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              style={{ background: "#FF6A00", border: "none" }}
              onClick={handleScheduleVisit}
              disabled={!selectedDate || !selectedTime}
            >
              Schedule Visit
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default MyCaregiver;