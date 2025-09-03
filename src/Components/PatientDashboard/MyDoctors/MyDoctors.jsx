import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Form, Nav } from "react-bootstrap";
import { FaUserMd, FaStar, FaSearch } from "react-icons/fa";
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
    languages: "English, Spanish",
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
    languages: "English, Mandarin",
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
    languages: "English, Spanish",
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

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSpecialty = activeTab === "All" || doc.specialty === activeTab;
    const matchesSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(search.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  return (
    <Container fluid className="mydoctors-bg py-4">
      <Container>
        {/* Header */}
        <Row className="align-items-center mb-4">
          <Col xs={12} md={8}>
            <div className="d-flex align-items-center">
              <div className="mydoctors-icon">
                <FaUserMd size={32} color="#fff" />
              </div>
              <div className="ms-3">
                <h3 className="dashboard-heading">My Doctors</h3>
                <span className="text-muted">Your trusted healthcare team</span>
              </div>
            </div>
          </Col>
          <Col xs={12} md={4} className="text-md-end mt-3 mt-md-0">
            <span className="text-muted">Total Doctors</span>
            <Badge style={{ background: "#FF6A00" }} className="ms-2 fs-5">{filteredDoctors.length}</Badge>
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
        <Row className="mb-4">
          <Col xs={12} md={8}>
            <Form className="d-flex mydoctors-search">
              <Form.Control
                type="search"
                placeholder="Search doctors by name or specialty..."
                className="me-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button variant="outline-secondary" style={{ borderColor: "#FF6A00", color: "#FF6A00" }}>
                <FaSearch />
              </Button>
            </Form>
          </Col>
        </Row>

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
                    <Button
                      style={{ background: "#FF6A00", border: "none" }}
                      className="w-100 mb-2 mt-auto"
                    >
                      Book Again
                    </Button>
                    <div className="text-muted" style={{ fontSize: "0.9em" }}>
                      <FaUserMd className="me-1" />
                      Language: {doc.languages}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </Container>
  );
}