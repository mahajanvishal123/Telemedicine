// src/Components/PatientDashboard/MyDoctors.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Row, Col, Card, Badge, Form, Nav, Modal, Button } from "react-bootstrap";
import { FaUserMd, FaStar, FaSearch, FaCalendarAlt } from "react-icons/fa";
import API_URL from "../../../Baseurl/Baseurl"; // <- apne project ke hisaab se path

const BRAND_ORANGE = "#FF6A00";
const APPT_ENDPOINT = `${API_URL}/appointment`;

/* ---------------- storage helpers ---------------- */
const safeParse = (s) => { try { return JSON.parse(s); } catch { return null; } };
const pickId = (obj) => {
  if (!obj || typeof obj !== "object") return null;
  for (const k of ["_id","id","userId","uid","sub"]) if (obj[k]) return obj[k];
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (v && typeof v === "object") {
      const nid = pickId(v);
      if (nid) return nid;
    }
  }
  return null;
};
const getPatientIdFromStorage = () => {
  const direct = localStorage.getItem("userId") || sessionStorage.getItem("userId");
  if (direct && direct !== "null" && direct !== "undefined") return direct;
  const keys = ["user","patient","profile","currentUser","authUser","loginUser"];
  for (const store of [localStorage, sessionStorage]) {
    for (const k of keys) {
      const obj = safeParse(store.getItem(k));
      const id = pickId(obj);
      if (id) return id;
    }
  }
  return null;
};

/* ---------------- utils ---------------- */
const fmtDate = (v) => (v ? new Date(v).toLocaleDateString() : "—");
const fmtTime = (v) => (v ? v : "—");

const extractDoctorId = (doc) =>
  typeof doc === "string" ? doc : doc?._id || doc?.id || pickId(doc) || "";

/* ---------------- Doctor fetcher (by ID always) ---------------- */
async function fetchDoctorById(id, headers) {
  const tryGet = async (url) => {
    try {
      const r = await axios.get(url, { headers });
      return r?.data;
    } catch {
      return null;
    }
  };
  // Adjust to your API – ye 3 common patterns hain:
  const candidates = [
    `${API_URL}/doctor/${id}`,
    `${API_URL}/doctors/${id}`,
    `${API_URL}/auth/doctor/${id}`,
  ];
  for (const url of candidates) {
    const data = await tryGet(url);
    if (data) {
      const raw = data?.doctor || data?.data || data;
      if (raw && typeof raw === "object") {
        return {
          id: raw._id || raw.id || id,
          name: raw.name || "",
          email: raw.email || "",
          specialty: raw.specialty || "",
          experience: raw.experience || "",
          fee: raw.fee || "",
          profile: raw.profile || "",
          openingTime: raw.openingTime || "",
          closingTime: raw.closingTime || "",
        };
      }
    }
  }
  return { id, name: "", email: "", specialty: "", experience: "", fee: "", profile: "" };
}

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
    (async () => {
      setLoading(true);
      setLoadErr("");
      try {
        const patientId = getPatientIdFromStorage();
        if (!patientId) throw new Error("Patient ID not found in storage.");

        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

        // (A) Appointments fetch – first try patientId param; fallback all
        let res;
        try {
          res = await axios.get(APPT_ENDPOINT, { params: { patientId }, headers });
        } catch {
          res = await axios.get(APPT_ENDPOINT, { headers });
        }

        const list =
          (Array.isArray(res?.data?.appointments) && res.data.appointments) ||
          (Array.isArray(res?.data?.data) && res.data.data) ||
          (Array.isArray(res?.data) && res.data) ||
          [];

        // (B) Filter client side by patientId (just in case)
        const myAppts = list.filter((a) => {
          const pat = a?.patientId;
          const pid = (pat && (pat._id || pat.id || pickId(pat))) || "";
          return !pid || String(pid) === String(patientId);
        });

        // (C) Collect **unique doctor IDs** from appointments
        const uniqueDoctorIds = Array.from(
          new Set(
            myAppts
              .map((a) => extractDoctorId(a?.doctorId))
              .filter(Boolean)
          )
        );

        // (D) Fetch **every** doctor profile BY ID (as requested)
        const docProfiles = await Promise.all(
          uniqueDoctorIds.map((id) => fetchDoctorById(id, headers))
        );
        const doctorMap = new Map(docProfiles.map((d) => [d.id, d]));

        // (E) Enrich appointments with fetched doctor profile (even if appointment already had partial)
        const enriched = myAppts.map((a) => {
          const id = extractDoctorId(a?.doctorId);
          const fetched = id ? doctorMap.get(id) : null;

          // fallback: if fetched missing fields, try appointment doctor object
          const apDoc = typeof a?.doctorId === "object" ? a.doctorId : {};
          const finalDoctor = {
            id: id || fetched?.id || apDoc?._id || apDoc?.id || "",
            name: fetched?.name || apDoc?.name || "",
            email: fetched?.email || apDoc?.email || "",
            specialty: fetched?.specialty || apDoc?.specialty || "",
            experience: fetched?.experience || apDoc?.experience || "",
            fee: fetched?.fee || apDoc?.fee || "",
            profile: fetched?.profile || apDoc?.profile || "",
            openingTime: fetched?.openingTime || apDoc?.openingTime || "",
            closingTime: fetched?.closingTime || apDoc?.closingTime || "",
          };

          const pat = a?.patientId || {};
          return {
            id: a?._id || a?.id,
            status: a?.status || "",
            appointmentDate: a?.appointmentDate || "",
            appointmentTime: a?.appointmentTime || "",
            reason: a?.reason || "",
            patient: {
              id: (pat && (pat._id || pat.id || pickId(pat))) || "",
              name: pat?.name || "",
              email: pat?.email || "",
            },
            doctor: finalDoctor,
          };
        });

        setAppointments(enriched);
      } catch (err) {
        setLoadErr(err?.response?.data?.message || err?.message || "Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // doctor grouping (unique doctor ek hi baar)
  const doctorsMap = useMemo(() => {
    const m = new Map();
    for (const ap of appointments) {
      const key = ap.doctor.id || "unknown";
      if (!m.has(key)) {
        m.set(key, {
          doctor: ap.doctor,
          appts: [ap],
          lastConsult: ap.appointmentDate ? new Date(ap.appointmentDate) : null,
        });
      } else {
        const slot = m.get(key);
        slot.appts.push(ap);
        const d = ap.appointmentDate ? new Date(ap.appointmentDate) : null;
        if (d && (!slot.lastConsult || d > slot.lastConsult)) slot.lastConsult = d;
      }
    }
    if (m.has("unknown")) m.delete("unknown");
    return m;
  }, [appointments]);

  const allDoctors = useMemo(() => Array.from(doctorsMap.values()), [doctorsMap]);

  // tabs ke liye specialties
  const specialties = useMemo(() => {
    const set = new Set(["All"]);
    allDoctors.forEach(({ doctor }) => doctor.specialty && set.add(doctor.specialty));
    return Array.from(set);
  }, [allDoctors]);

  const filteredDoctors = useMemo(() => {
    return allDoctors.filter(({ doctor }) => {
      const matchesSpec = activeTab === "All" || doctor.specialty === activeTab;
      const s = search.trim().toLowerCase();
      const matchesSearch =
        !s ||
        doctor.name.toLowerCase().includes(s) ||
        (doctor.specialty || "").toLowerCase().includes(s) ||
        (doctor.email || "").toLowerCase().includes(s);
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
  const selected = selectedDoctorId ? doctorsMap.get(selectedDoctorId) : null;

  return (
    <div className="">
      {/* Header */}
      <Row className="align-items-center mb-4">
        <Col xs={12} md={8}>
          <div className="d-flex align-items-center">
            <div>
              <h3 className="dashboard-heading">My Doctors</h3>
              <span className="text-muted">Doctors you’ve booked with</span>
            </div>
          </div>
        </Col>
      </Row>

      {/* Tabs (specialty) */}
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

      {/* Search */}
      <div className="mb-4">
        <div className="position-relative" style={{ maxWidth: "500px" }}>
          <Form.Control
            type="search"
            placeholder="Search doctors by name, specialty or email..."
            className="pe-5"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="position-absolute top-50 end-0 translate-middle-y p-2">
            <FaSearch size={16} color="#6c757d" />
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-muted py-5">Loading...</div>
      ) : loadErr ? (
        <div className="text-danger py-5">{loadErr}</div>
      ) : (
        <Row>
          {filteredDoctors.length === 0 ? (
            <Col xs={12}>
              <div className="text-center text-muted py-5">No doctors found.</div>
            </Col>
          ) : (
            filteredDoctors.map(({ doctor, appts, lastConsult }) => {
              const total = appts.length;
              const confirmed = appts.filter(a => a.status === "confirmed").length;
              const pending = appts.filter(a => a.status === "pending").length;
              const cancelled = appts.filter(a => a.status === "cancelled").length;

              return (
                <Col key={doctor.id} xs={12} md={4} className="mb-4 d-flex">
                  <Card className="mydoctors-card flex-fill shadow-sm">
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex align-items-center mb-2">
                        <div
                          className="mydoctors-avatar online"
                          style={{ background: BRAND_ORANGE, color: "#fff" }}
                        >
                          {doctor.profile ? (
                            <img
                              src={doctor.profile}
                              alt={doctor.name}
                              style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }}
                            />
                          ) : (
                            <FaUserMd size={28} />
                          )}
                        </div>
                        <div className="ms-auto d-flex align-items-center">
                          <FaStar color="#FFD700" />
                          <span className="ms-1 fw-bold">—</span>
                        </div>
                      </div>

                      <Card.Title className="fw-bold">{doctor.name || "—"}</Card.Title>
                      <Card.Subtitle className="mb-2" style={{ color: BRAND_ORANGE }}>
                        {doctor.specialty || "—"}
                      </Card.Subtitle>

                      <div className="mb-2">
                        <small className="text-muted">
                          <FaCalendarAlt className="me-1" />
                          Last consulted: {lastConsult ? lastConsult.toLocaleDateString() : "—"}
                        </small>
                      </div>

                      <Row className="mb-2">
                        <Col xs={6}>
                          <div className="mydoctors-info-box">
                            <div className="fw-bold">{doctor.experience || "—"}</div>
                            <small className="text-muted">Experience</small>
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="mydoctors-info-box">
                            <div className="fw-bold">{total}</div>
                            <small className="text-muted">Appointments</small>
                          </div>
                        </Col>
                      </Row>

                      <div className="mb-2">
                        <Badge bg="success" className="me-2">Confirmed {confirmed}</Badge>
                        <Badge bg="warning" text="dark" className="me-2">Pending {pending}</Badge>
                        <Badge bg="secondary">Cancelled {cancelled}</Badge>
                      </div>

                      <div className="mb-2">
                        <span className="fw-bold" style={{ color: BRAND_ORANGE }}>
                          {doctor.fee ? `₹${doctor.fee}` : "—"}
                        </span>
                        <small className="text-muted ms-1">/ consultation</small>
                      </div>

                      <div className="mt-auto d-flex gap-2">
                        <Button
                          variant="outline-secondary"
                          onClick={() => doctor.email && (window.location.href = `mailto:${doctor.email}`)}
                        >
                          Email
                        </Button>
                        <Button
                          style={{ background: BRAND_ORANGE, borderColor: BRAND_ORANGE }}
                          onClick={() => setSelectedDoctorId(doctor.id) || setShowModal(true)}
                        >
                          View
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })
          )}
        </Row>
      )}

      {/* Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Doctor Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!selectedDoctorId ? (
            <div className="text-muted">No data</div>
          ) : (
            (() => {
              const selected = doctorsMap.get(selectedDoctorId);
              if (!selected) return <div className="text-muted">No data</div>;
              const { doctor, appts } = selected;
              return (
                <>
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="me-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        background: BRAND_ORANGE,
                        color: "#fff",
                      }}
                    >
                      {doctor.profile ? (
                        <img
                          src={doctor.profile}
                          alt={doctor.name}
                          style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }}
                        />
                      ) : (
                        <FaUserMd size={28} />
                      )}
                    </div>
                    <div>
                      <h5 className="mb-0">{doctor.name}</h5>
                      <small className="text-muted">{doctor.specialty}</small>
                    </div>
                  </div>

                  <Row className="mb-3">
                    <Col md={4}>
                      <div className="mydoctors-info-box">
                        <div className="fw-bold">{doctor.experience || "—"}</div>
                        <small className="text-muted">Experience</small>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="mydoctors-info-box">
                        <div className="fw-bold">{appts.length}</div>
                        <small className="text-muted">Total Appointments</small>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="mydoctors-info-box">
                        <div className="fw-bold">{doctor.fee ? `₹${doctor.fee}` : "—"}</div>
                        <small className="text-muted">Fee</small>
                      </div>
                    </Col>
                  </Row>

                  <h6 className="mb-2">Your Appointments with {doctor.name}</h6>
                  <div className="table-responsive">
                    <table className="table table-sm align-middle">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Status</th>
                          <th>Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appts
                          .slice()
                          .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
                          .map((ap) => (
                            <tr key={ap.id}>
                              <td>{fmtDate(ap.appointmentDate)}</td>
                              <td>{fmtTime(ap.appointmentTime)}</td>
                              <td>
                                <Badge
                                  bg={
                                    ap.status === "confirmed"
                                      ? "success"
                                      : ap.status === "pending"
                                      ? "warning"
                                      : "secondary"
                                  }
                                  text={ap.status === "pending" ? "dark" : undefined}
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
              );
            })()
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
