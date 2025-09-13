import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Form,
  Nav,
  Modal,
  InputGroup
} from "react-bootstrap";
import { FaUserMd, FaStar, FaSearch, FaCalendarAlt, FaClock } from "react-icons/fa";
import "./MyDoctors.css";

const doctors = [
  {
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    lastConsulted: "2 days ago",
    consultations: 5,
    experience: "15+ years",
    status: "Available",
    nextAvailable: "Today 2:30 PM",
    price: "$150",
 
    rating: 4.9,
  },
  {
    name: "Dr. Michael Chen",
    specialty: "Neurologist",
    lastConsulted: "1 week ago",
    consultations: 3,
    experience: "12+ years",
    status: "Busy",
    nextAvailable: "Tomorrow 10:00 AM",
    price: "$180",

    rating: 4.8,
  },
  {
    name: "Dr. Emily Rodriguez",
    specialty: "Dermatologist",
    lastConsulted: "3 weeks ago",
    consultations: 7,
    experience: "8+ years",
    status: "Available",
    nextAvailable: "Today 4:45 PM",
    price: "$120",
   
    rating: 4.7,
  },
];

const specialties = [
  "All",
  "Cardiologist",
  "Neurologist",
  "Dermatologist",
  "Orthopedic",
  "Psychiatrist",
  "Pediatrician",
];

export default function MyDoctors() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
    setSelectedDate("");
    setSelectedTime("");
  };

  const handleShowModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleBookAppointment = () => {
    // Here you would typically send the appointment data to your backend
    alert(`Appointment booked with ${selectedDoctor.name} on ${selectedDate} at ${selectedTime}`);
    handleCloseModal();
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSpecialty = activeTab === "All" || doc.specialty === activeTab;
    const matchesSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(search.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  // Generate time slots for the modal
  const timeSlots = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour % 12 === 0 ? 12 : hour % 12}:${minute === 0 ? '00' : minute} ${hour >= 12 ? 'PM' : 'AM'}`;
      timeSlots.push(timeString);
    }
  }

  return (
    <div fluid className="">
      <div>
        {/* Header */}
        <Row className="align-items-center mb-4">
          <Col xs={12} md={8}>
            <div className="d-flex align-items-center">
              <div className="">
                <h3 className="dashboard-heading">My Doctors</h3>
                <span className="text-muted">Your trusted healthcare team</span>
              </div>
            </div>
          </Col>
        </Row>

        {/* Filter Tabs */}
        <Row className="mb-3">
          <Col xs={12}>
            <Nav variant="tabs" className="mydoctors-tabs">
              {specialties.map((spec) => (
                <Nav.Item key={spec}>
                  <Nav.Link
                    className={`mydoctors-tab-btn ${activeTab === spec ? "active" : ""}`}
                    onClick={() => setActiveTab(spec)}
                  >
                    {spec}
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
              placeholder="Search doctors by name or specialty..."
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

        {/* Doctor Cards */}
        <Row>
          {filteredDoctors.length === 0 ? (
            <Col xs={12}>
              <div className="text-center text-muted py-5">No doctors found.</div>
            </Col>
          ) : (
            filteredDoctors.map((doc, idx) => (
              <Col key={doc.name} xs={12} md={4} className="mb-4 d-flex">
                <Card className="mydoctors-card flex-fill shadow-sm">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex align-items-center mb-2">
                      <div className={`mydoctors-avatar ${doc.status === "Available" ? "online" : "busy"}`}>
                        <FaUserMd size={28} />
                      </div>
                      <div className="ms-auto d-flex align-items-center">
                        <FaStar color="#FFD700" />
                        <span className="ms-1 fw-bold">{doc.rating}</span>
                      </div>
                    </div>
                    <Card.Title className="fw-bold">{doc.name}</Card.Title>
                    <Card.Subtitle className="mb-2" style={{ color: "#FF6A00" }}>{doc.specialty}</Card.Subtitle>
                    <div className="mb-2">
                      <small className="text-muted">
                        <FaUserMd className="me-1" />
                        Last consulted: {doc.lastConsulted}
                      </small>
                    </div>
                    <Row className="mb-2">
                      <Col xs={6}>
                        <div className="mydoctors-info-box">
                          <div className="fw-bold">{doc.consultations}</div>
                          <small className="text-muted">Consultations</small>
                        </div>
                      </Col>
                      <Col xs={6}>
                        <div className="mydoctors-info-box">
                          <div className="fw-bold">{doc.experience}</div>
                          <small className="text-muted">Experience</small>
                        </div>
                      </Col>
                    </Row>
                    <div className="mb-2">
                      <Badge style={{ background: doc.status === "Available" ? "#4caf50" : "#ffc107", color: "#fff" }} className="me-2">
                        {doc.status}
                      </Badge>
                      <span className="text-muted">Next available: <span className="fw-bold">{doc.nextAvailable}</span></span>
                    </div>
                    <div className="mb-2">
                      <span className="fw-bold" style={{ color: "#FF6A00" }}>{doc.price}</span>
                      <small className="text-muted ms-1">/ consultation</small>
                    </div>
                   
                   
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>

     
      </div>
    </div>
  );
}