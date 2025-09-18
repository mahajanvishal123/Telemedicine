// src/Components/PatientDashboard/MyDoctors.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Row, Col, Card, Form, Nav, Modal, Button, Badge, Spinner } from "react-bootstrap";
import { FaUserMd, FaStar, FaSearch, FaCalendarAlt, FaEnvelope, FaClock, FaCheckCircle } from "react-icons/fa";
import API_URL from "../../../Baseurl/Baseurl";

/** ---------- Config ---------- **/
const BRAND_ORANGE = "#FF6A00";
const BASE = (API_URL || "").endsWith("/") ? API_URL.slice(0, -1) : (API_URL || "");

/** ---------- Helpers ---------- **/
const safeParse = (s) => { try { return JSON.parse(s); } catch { return null; } };

const resolvePatientId = () => {
  // 1) URL ?patientid=...
  if (typeof window !== "undefined") {
    const sp = new URLSearchParams(window.location.search);
    const q = sp.get("patientid") || sp.get("patientId");
    if (q) return String(q);
  }
  // 2) localStorage
  const direct =
    localStorage.getItem("patientId") ||
    localStorage.getItem("patientid") ||
    localStorage.getItem("userId") ||
    localStorage.getItem("id");
  if (direct) return String(direct);

  // 3) nested objects (optional)
  for (const k of ["user","authUser","currentUser","userData","profile","patient","patient_info"]) {
    const obj = safeParse(localStorage.getItem(k));
    const id = obj?.patientId || obj?._id || obj?.id;
    if (id) return String(id);
  }
  return null;
};

const coerceISO = (...cands) => {
  for (const v of cands) {
    if (!v) continue;
    const d = new Date(v);
    if (!isNaN(+d)) return d.toISOString();
  }
  return null;
};

const normExp = (v) => {
  if (v === null || v === undefined) return "";
  const s = String(v).trim();
  return /^\d+(\.\d+)?$/.test(s) ? `${s} yrs` : s;
};

const toMoney = (v) => {
  if (v === null || v === undefined || v === "") return "—";
  const n = Number(v);
  return isNaN(n) ? String(v) : `₹${n}`;
};

/** Merge appointments -> unique doctor cards with latest visit date */
const buildDoctorList = (appointments = []) => {
  const map = new Map(); // key = doctor._id
  for (const appt of appointments) {
    const doc = typeof appt?.doctorId === "object" ? appt.doctorId : null;
    if (!doc || !doc._id) continue;

    const lastConsult = coerceISO(
      appt?.appointmentDate,
      appt?.slotId?.date,
      appt?.createdAt,
      appt?.updatedAt
    );

    const existing = map.get(doc._id);
    const existingTs = existing?.lastConsult ? +new Date(existing.lastConsult) : -Infinity;
    const newTs = lastConsult ? +new Date(lastConsult) : -Infinity;

    const merged = {
      id: doc._id,
      name: doc.name || "Doctor",
      email: doc.email || "",
      specialty: doc.specialty || "",
      experience: normExp(doc.experience),
      fee: doc.fee ?? appt?.fee ?? "",
      openingTime: doc.openingTime || "",
      closingTime: doc.closingTime || "",
      availableDay: doc.availableDay || "",
      gender: doc.gender || "",
      isVerify: String(doc.isVerify || "0") === "1",
      profile: doc.profile || doc.profileImage || "",
      lastConsult: existing && existingTs > newTs ? existing.lastConsult : lastConsult
    };

    // keep latest consult
    if (!existing || newTs >= existingTs) map.set(doc._id, merged);
  }
  return Array.from(map.values());
};

/** ---------- Component ---------- **/
export default function MyDoctors() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [picked, setPicked] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const patientId = resolvePatientId();
        if (!patientId) throw new Error("Patient ID not found. Please set localStorage.setItem('patientId', '<id>') at login.");

        const token = localStorage.getItem("authToken") || localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

        const url = `${BASE}/appointment?patientid=${encodeURIComponent(patientId)}`;
        const { data } = await axios.get(url, { headers });

        const appts = Array.isArray(data?.appointments) ? data.appointments : [];
        const list = buildDoctorList(appts);
        if (!cancelled) setDoctors(list);
      } catch (e) {
        if (!cancelled) setErr(e?.response?.data?.message || e?.message || "Failed to fetch doctors");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const tabs = useMemo(() => {
    const set = new Set(["All"]);
    doctors.forEach(d => d.specialty && set.add(d.specialty));
    return Array.from(set);
  }, [doctors]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return doctors.filter(d => {
      const specOk = activeTab === "All" || d.specialty === activeTab;
      if (!q) return specOk;
      return specOk && (
        (d.name || "").toLowerCase().includes(q) ||
        (d.specialty || "").toLowerCase().includes(q) ||
        (d.email || "").toLowerCase().includes(q)
      );
    });
  }, [doctors, activeTab, search]);

  return (
    <div className="mydoctors">
      <style>{`
        :root{ --orange:${BRAND_ORANGE}; --border:#eceff3; --muted:#6b7280; --shadow:0 10px 26px rgba(16,24,40,.10); --shadow-lg:0 18px 46px rgba(16,24,40,.16)}
        .muted{color:var(--muted)}
        .tabs{border-bottom:0;padding:.25rem .5rem;white-space:nowrap}
        .tabs .nav-link{padding:.45rem .9rem;border:1px solid var(--border);border-bottom:2px solid transparent;border-radius:12px 12px 0 0;background:#fff;color:#111827}
        .tabs .nav-link.active{font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,.08)}
        .sbox{max-width:520px}
        .card-shell{background:#fff;border:1px solid var(--border);border-top:0;border-radius:0 16px 16px 16px;padding:18px}
        .pro{position:relative;border:0;border-radius:18px;overflow:hidden;box-shadow:var(--shadow)}
        .pro__bar{height:64px;background:linear-gradient(135deg,var(--orange),#ff9a3c 60%,#ffd89b)}
        .pro__avatar{position:absolute;top:36px;left:16px;width:64px;height:64px;border-radius:999px;background:var(--orange);color:#fff;border:3px solid #fff;display:flex;align-items:center;justify-content:center;overflow:hidden}
        .pro__avatar img{width:100%;height:100%;object-fit:cover}
        .pro__body{padding:56px 16px 14px 16px}
        .name-row{display:flex;align-items:center;gap:.5rem;padding-left:72px}
        .chip{background:rgba(255,106,0,.12);color:#b45309;border:1px solid rgba(255,106,0,.35);border-radius:999px;padding:.15rem .55rem;font-size:.8rem;font-weight:600}
        .info{background:#fafafa;border:1px solid #f0f2f5;border-radius:12px;padding:.55rem .7rem}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin:.6rem 0 .8rem 0}
        .acts{display:flex;gap:.6rem}
        .btnx{border-radius:12px;border:1px solid var(--border);padding:.5rem .8rem;font-weight:600}
        .btnx--primary{background:var(--orange);border-color:var(--orange);color:#fff}
      `}</style>

      <Row className="align-items-center mb-3">
        <Col>
          <h3 className="mb-0">My Doctors</h3>
          <small className="muted">Fetched from your appointments (unique doctors)</small>
        </Col>
      </Row>

      {/* Loading */}
      {loading && (
        <div className="py-5 text-center">
          <Spinner animation="border" style={{ color: BRAND_ORANGE }} />
          <div className="mt-2 muted">Loading doctors…</div>
        </div>
      )}

      {/* Error */}
      {!loading && err && (
        <div className="p-3 mb-3" style={{ background:"#fff0f0", border:"1px solid #ffcdd2", borderRadius:8, color:"#c62828" }}>
          {err}
        </div>
      )}

      {/* Content */}
      {!loading && !err && (
        <>
          {/* Tabs */}
          <Nav variant="tabs" className="tabs flex-nowrap overflow-auto mb-3 align-items-end">
            {tabs.map((t) => (
              <Nav.Item key={t} className="me-2">
                <Nav.Link className={activeTab === t ? "active" : ""} onClick={() => setActiveTab(t)}>{t}</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          {/* Search */}
          <div className="mb-3">
            <div className="position-relative sbox">
              <Form.Control
                type="search"
                placeholder="Search by name, specialty or email…"
                className="pe-5"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="position-absolute top-50 end-0 translate-middle-y p-2" aria-hidden="true">
                <FaSearch size={16} color="#6b7280" />
              </div>
            </div>
          </div>

          <div className="card-shell">
            <Row>
              {filtered.length === 0 ? (
                <Col xs={12}><div className="py-5 text-center muted">No doctors found.</div></Col>
              ) : (
                filtered.map((d) => (
                  <Col xs={12} md={6} lg={4} className="mb-4 d-flex" key={d.id}>
                    <Card className="pro flex-fill">
                      <div className="pro__bar" />
                      <div className="pro__avatar">
                        {d.profile ? <img src={d.profile} alt={d.name} /> : <FaUserMd size={26} />}
                      </div>
                      <div className="pro__body">
                        <div className="name-row">
                          <h5 className="mb-0">{d.name}</h5>
                          {d.isVerify && <Badge bg="success" className="ms-1"><FaCheckCircle className="me-1" />Verified</Badge>}
                          {d.specialty && <span className="chip ms-auto">{d.specialty}</span>}
                        </div>

                        <div className="muted" style={{ paddingLeft:72, fontSize:".9rem" }}>
                          <FaCalendarAlt className="me-1" />
                          Last consult: {d.lastConsult ? new Date(d.lastConsult).toLocaleDateString() : "—"}
                        </div>

                        <div className="grid" style={{ marginTop:".7rem" }}>
                          <div className="info">
                            <div className="fw-bold">{d.experience || "—"}</div>
                            <small className="muted">Experience</small>
                          </div>
                          <div className="info">
                            <div className="fw-bold">{toMoney(d.fee)}</div>
                            <small className="muted">Fee</small>
                          </div>
                          <div className="info" style={{ gridColumn:"1 / span 2" }}>
                            <div className="d-flex align-items-center gap-2">
                              <FaClock className="muted" />
                              <div className="fw-bold">{(d.openingTime || "—")} – {(d.closingTime || "—")}</div>
                            </div>
                            <small className="muted">
                              {(d.availableDay && d.availableDay.trim()) ? d.availableDay : "Availability"}
                            </small>
                          </div>
                          <div className="info">
                            <div className="fw-bold">{d.gender || "—"}</div>
                            <small className="muted">Gender</small>
                          </div>
                          <div className="info">
                            <div className="fw-bold">{d.email || "—"}</div>
                            <small className="muted">Email</small>
                          </div>
                        </div>

                        <div className="acts">
                          <Button
                            variant="light"
                            className="btnx flex-fill"
                            onClick={() => d.email && (window.location.href = `mailto:${d.email}`)}
                          >
                            <FaEnvelope className="me-2" /> Email
                          </Button>
                          <Button className="btnx btnx--primary flex-fill" onClick={() => { setPicked(d); setShow(true); }}>
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </div>

          {/* Modal */}
          <Modal show={show} onHide={() => setShow(false)} centered size="lg">
            <Modal.Header closeButton><Modal.Title>Doctor Details</Modal.Title></Modal.Header>
            <Modal.Body>
              {!picked ? "—" : (
                <>
                  <div className="d-flex align-items-center mb-3">
                    <div style={{ width:64, height:64, borderRadius:"50%", overflow:"hidden", background:BRAND_ORANGE, color:"#fff",
                                   display:"flex", alignItems:"center", justifyContent:"center", border:"3px solid #fff" }} className="me-3">
                      {picked.profile ? <img src={picked.profile} alt={picked.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <FaUserMd size={28} />}
                    </div>
                    <div>
                      <h5 className="mb-0">{picked.name}</h5>
                      <div className="muted">{picked.specialty || "—"}</div>
                    </div>
                    {picked.isVerify && <Badge bg="success" className="ms-auto"><FaCheckCircle className="me-1" />Verified</Badge>}
                  </div>

                  <Row className="g-2 mb-2">
                    <Col md={4}><div className="info"><div className="fw-bold">{picked.experience || "—"}</div><small className="muted">Experience</small></div></Col>
                    <Col md={4}><div className="info"><div className="fw-bold">{toMoney(picked.fee)}</div><small className="muted">Fee</small></div></Col>
                    <Col md={4}><div className="info"><div className="fw-bold">{picked.email || "—"}</div><small className="muted">Email</small></div></Col>
                  </Row>

                  <Row className="g-2">
                    <Col md={6}><div className="info"><div className="fw-bold">{picked.openingTime || "—"}</div><small className="muted">Opens</small></div></Col>
                    <Col md={6}><div className="info"><div className="fw-bold">{picked.closingTime || "—"}</div><small className="muted">Closes</small></div></Col>
                  </Row>
                </>
              )}
            </Modal.Body>
            <Modal.Footer><Button variant="secondary" onClick={() => setShow(false)}>Close</Button></Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
}
