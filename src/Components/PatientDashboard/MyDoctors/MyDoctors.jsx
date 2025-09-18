// src/Components/PatientDashboard/MyDoctors.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Row, Col, Card, Badge, Form, Nav, Modal, Button, Spinner } from "react-bootstrap";
import { FaUserMd, FaStar, FaSearch, FaCalendarAlt } from "react-icons/fa";
import API_URL from "../../../Baseurl/Baseurl";

const BRAND_ORANGE = "#f9591a"; // Match MyAppointments

/* ---------------- storage helpers ---------------- */
const safeParse = (s) => {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
};

const getPatientIdFromStorage = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  const user = safeParse(userStr);
  return user?._id || user?.id || null;
};

/* ---------------- utils ---------------- */
const fmtDate = (v) => (v ? new Date(v).toLocaleDateString() : "—");
const fmtTime = (v) => (v ? v : "—");

/* ---------------- component ---------------- */
export default function MyDoctors() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");
  const [appointments, setAppointments] = useState([]);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setLoadErr("");

      try {
        const patientId = getPatientIdFromStorage();
        if (!patientId) throw new Error("Patient ID not found in localStorage");

        // ✅ Fetch appointments (same as MyAppointments)
        const response = await axios.get(`${API_URL}/appointment`, {
          params: { patientId },
        });

        const data = response.data;
        if (!data.appointments || !Array.isArray(data.appointments)) {
          throw new Error("Invalid appointments data");
        }

        // ✅ Transform appointments (same structure as MyAppointments)
        const transformed = data.appointments.map((appt) => ({
          id: appt._id,
          date: new Date(appt.appointmentDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          time: appt.appointmentTime,
          status: appt.status.charAt(0).toUpperCase() + appt.status.slice(1), // "pending" → "Pending"
          reason: appt.reason || "",
          doctor: {
            id: appt.doctorId?._id || "unknown",
            name: appt.doctorId?.name || "Unknown Doctor",
            specialty: appt.doctorId?.specialty || "General",
            experience: appt.doctorId?.experience || "—",
            fee: appt.doctorId?.fee || "—",
            profile: appt.doctorId?.profile || "",
            openingTime: appt.doctorId?.openingTime || "",
            closingTime: appt.doctorId?.closingTime || "",
          },
          appointmentDate: appt.appointmentDate,
        }));

        setAppointments(transformed);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setLoadErr(err.message || "Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // ✅ Group by doctor
  const doctorsMap = useMemo(() => {
    const map = new Map();

    appointments.forEach((appt) => {
      const docId = appt.doctor.id;
      if (!docId || docId === "unknown") return;

      if (!map.has(docId)) {
        map.set(docId, {
          doctor: appt.doctor,
          appts: [],
          lastConsult: null,
        });
      }

      const slot = map.get(docId);
      slot.appts.push(appt);
      const consultDate = appt.appointmentDate ? new Date(appt.appointmentDate) : null;
      if (consultDate && (!slot.lastConsult || consultDate > slot.lastConsult)) {
        slot.lastConsult = consultDate;
      }
    });

    return map;
  }, [appointments]);

  const allDoctors = useMemo(() => Array.from(doctorsMap.values()), [doctorsMap]);

  // ✅ Tabs: All + Unique Specialties
  const specialties = useMemo(() => {
    const set = new Set(["All"]);
    allDoctors.forEach(({ doctor }) => {
      if (doctor.specialty) set.add(doctor.specialty);
    });
    return Array.from(set);
  }, [allDoctors]);

  // ✅ Filter
  const filteredDoctors = useMemo(() => {
    return allDoctors.filter(({ doctor }) => {
      const matchesSpec = activeTab === "All" || doctor.specialty === activeTab;
      const s = search.trim().toLowerCase();
      const matchesSearch =
        !s ||
        doctor.name.toLowerCase().includes(s) ||
        doctor.specialty.toLowerCase().includes(s);

      return matchesSpec && matchesSearch;
    });
  }, [allDoctors, activeTab, search]);

  const openModal = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDoctorId(null);
  };

  const selectedDoctor = selectedDoctorId ? doctorsMap.get(selectedDoctorId) : null;

  return (
    <div className="my-doctors-container">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h3 className="fw-bold mb-1">My Doctors</h3>
          <p className="text-muted mb-0">Doctors you’ve booked appointments with</p>
        </Col>
      </Row>

      {/* Tabs */}
      <div className="mb-4">
        <Nav variant="tabs" className="border-bottom">
          {specialties.map((spec) => (
            <Nav.Item key={spec}>
              <Nav.Link
                active={activeTab === spec}
                onClick={() => setActiveTab(spec)}
                className="px-3 py-2"
                style={{
                  fontWeight: activeTab === spec ? "600" : "normal",
                  color: activeTab === spec ? BRAND_ORANGE : undefined,
                  borderBottom: activeTab === spec ? `2px solid ${BRAND_ORANGE}` : "none",
                }}
              >
                {spec}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </div>

      {/* Search */}
      <div className="mb-4" style={{ maxWidth: "450px" }}>
        <div className="position-relative">
          <Form.Control
            type="search"
            placeholder="Search by name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-4"
            style={{ borderRadius: "8px" }}
          />
     
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading your doctors...</p>
        </div>
      ) : loadErr ? (
        <div className="alert alert-danger text-center">{loadErr}</div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredDoctors.length === 0 ? (
            <Col>
              <div className="text-center py-5">
                <p className="text-muted">No doctors found matching your criteria.</p>
              </div>
            </Col>
          ) : (
            filteredDoctors.map(({ doctor, appts, lastConsult }) => {
              const total = appts.length;
              const confirmed = appts.filter((a) => a.status === "Completed").length;
              const pending = appts.filter((a) => a.status === "Pending").length;
              const cancelled = appts.filter((a) => a.status === "Cancelled").length;

              return (
                <Col key={doctor.id}>
                  <Card className="h-100 shadow-sm border-0 rounded-3">
                    <Card.Body className="d-flex flex-column">
                      {/* Doctor Header */}
                      <div className="d-flex align-items-start mb-3">
                        <div
                          className="flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{
                            width: "50px",
                            height: "50px",
                            backgroundColor: BRAND_ORANGE,
                            color: "white",
                          }}
                        >
                          {doctor.profile ? (
                            <img
                              src={doctor.profile}
                              alt={doctor.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <FaUserMd size={24} />
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <Card.Title className="fs-5 mb-0">{doctor.name}</Card.Title>
                          <Card.Subtitle className="text-muted">{doctor.specialty}</Card.Subtitle>
                        </div>
                        <div className="text-warning">
                        <Card.Subtitle className="text-muted">{doctor.specialty}</Card.Subtitle>
                        </div>
                      </div>

                      {/* Last Consulted */}
                      <div className="mb-3">
                        <small className="text-muted d-flex align-items-center">
                          <FaCalendarAlt size={12} className="me-1" />
                          Last consulted: {lastConsult ? lastConsult.toLocaleDateString() : "—"}
                        </small>
                      </div>

                      {/* Stats Row */}
                      <Row className="g-2 mb-3">
                        <Col xs={6}>
                          <div className="bg-light p-2 rounded text-center">
                            <div className="fw-bold">{doctor.experience}</div>
                            <small className="text-muted">Experience</small>
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="bg-light p-2 rounded text-center">
                            <div className="fw-bold">{total}</div>
                            <small className="text-muted">Appointments</small>
                          </div>
                        </Col>
                      </Row>

                      {/* Status Badges */}
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        <Badge bg="success" className="px-2 py-1">
                          Confirmed {confirmed}
                        </Badge>
                        <Badge bg="warning" text="dark" className="px-2 py-1">
                          Pending {pending}
                        </Badge>
                        <Badge bg="secondary" className="px-2 py-1">
                          Cancelled {cancelled}
                        </Badge>
                      </div>

                      {/* Fee */}
                      <div className="mb-3">
                        <span className="fw-bold" style={{ color: BRAND_ORANGE }}>
                          {typeof doctor.fee === "number" ? `₹${doctor.fee}` : doctor.fee}
                        </span>
                        <small className="text-muted ms-1">per consultation</small>
                      </div>

                      {/* Action Button */}
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="mt-auto w-100"
                        onClick={() => openModal(doctor.id)}
                      >
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })
          )}
        </Row>
      )}

      {/* Details Modal */}
      <Modal show={showModal} onHide={closeModal} centered size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Doctor Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!selectedDoctor ? (
            <p className="text-muted text-center py-4">No data available</p>
          ) : (
            <>
              {/* Doctor Header in Modal */}
              <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                <div
                  className="flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: BRAND_ORANGE,
                    color: "white",
                  }}
                >
                  {selectedDoctor.doctor.profile ? (
                    <img
                      src={selectedDoctor.doctor.profile}
                      alt={selectedDoctor.doctor.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <FaUserMd size={28} />
                  )}
                </div>
                <div>
                  <h5 className="mb-0">{selectedDoctor.doctor.name}</h5>
                  <p className="text-muted mb-0">{selectedDoctor.doctor.specialty}</p>
                </div>
              </div>

              {/* Stats in Modal */}
              <Row className="mb-4">
                <Col md={4} className="text-center">
                  <div className="p-3 bg-light rounded">
                    <div className="fw-bold h5 mb-0">{selectedDoctor.doctor.experience}</div>
                    <small className="text-muted">Experience</small>
                  </div>
                </Col>
                <Col md={4} className="text-center">
                  <div className="p-3 bg-light rounded">
                    <div className="fw-bold h5 mb-0">{selectedDoctor.appts.length}</div>
                    <small className="text-muted">Total Appointments</small>
                  </div>
                </Col>
                <Col md={4} className="text-center">
                  <div className="p-3 bg-light rounded">
                    <div className="fw-bold h5 mb-0">
                      {typeof selectedDoctor.doctor.fee === "number"
                        ? `₹${selectedDoctor.doctor.fee}`
                        : selectedDoctor.doctor.fee}
                    </div>
                    <small className="text-muted">Fee per Consultation</small>
                  </div>
                </Col>
              </Row>

              {/* Appointments Table */}
              <h6 className="mb-3">Your Appointment History</h6>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDoctor.appts
                      .slice()
                      .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
                      .map((ap) => (
                        <tr key={ap.id}>
                          <td>{fmtDate(ap.appointmentDate)}</td>
                          <td>{fmtTime(ap.time)}</td>
                          <td>
                            <Badge
                              bg={
                                ap.status === "Completed"
                                  ? "success"
                                  : ap.status === "Pending"
                                  ? "warning"
                                  : "secondary"
                              }
                              text={ap.status === "Pending" ? "dark" : "white"}
                              className="px-2 py-1"
                            >
                              {ap.status}
                            </Badge>
                          </td>
                          <td>{ap.reason || "—"}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}