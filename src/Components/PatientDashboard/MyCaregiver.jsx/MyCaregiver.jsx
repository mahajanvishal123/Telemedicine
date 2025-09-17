import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_URL from "../../../Baseurl/Baseurl"; // <- adjust path if needed

const BRAND_ORANGE = "#ff6b00";
const DEFAULT_COUNTRY_CODE = "+91"; // country code for tel/WhatsApp links
const BASE_URL = API_URL;
const ASSIGN_ENDPOINT = `${BASE_URL}/caregiver/assignCaregiver`;

/* ======================== ID & STORAGE HELPERS ======================== */
const safeParse = (str) => { try { return JSON.parse(str); } catch { return null; } };

const pickId = (obj) => {
  if (!obj || typeof obj !== "object") return null;
  for (const k of ["id", "_id", "userId", "uid", "sub"]) if (obj[k]) return obj[k];
  for (const k of Object.keys(obj)) {
    const nested = obj[k];
    if (nested && typeof nested === "object") {
      const nid = pickId(nested);
      if (nid) return nid;
    }
  }
  return null;
};

const getPatientIdFromStorage = () => {
  // direct keys
  const direct = localStorage.getItem("userId") || sessionStorage.getItem("userId");
  if (direct && direct !== "null" && direct !== "undefined") return direct;

  // JSON objects
  const keys = ["user", "profile", "authUser", "currentUser", "loginUser", "patient"];
  for (const store of [localStorage, sessionStorage]) {
    for (const k of keys) {
      const obj = safeParse(store.getItem(k));
      const id = pickId(obj);
      if (id) return id;
    }
  }
  return null;
};

const getPatientNameEmail = () => {
  const keys = ["user", "profile", "authUser", "currentUser", "loginUser", "patient"];
  for (const store of [localStorage, sessionStorage]) {
    for (const k of keys) {
      const obj = safeParse(store.getItem(k));
      if (obj && typeof obj === "object") {
        const name = obj.name || obj.fullName || obj.username || obj.displayName;
        const email = obj.email || obj.mail;
        if (name || email) return { name, email };
      }
    }
  }
  return { name: null, email: null };
};

/* ======================== PHONE/DEEPLINK HELPERS ======================== */
const normalizePhone = (raw, defaultCC = DEFAULT_COUNTRY_CODE) => {
  if (!raw) return "";
  const trimmed = String(raw).trim();
  if (trimmed.startsWith("+")) return "+" + trimmed.replace(/[^\d]/g, "");
  const digits = trimmed.replace(/[^\d]/g, "");
  if (!digits) return "";
  if (digits.length === 10 && defaultCC) return defaultCC + digits;
  return digits; // already has cc digits
};

const buildWhatsAppLink = (phone, text) => {
  const normalized = normalizePhone(phone);
  if (!normalized) return "#";
  const numForWa = normalized.replace(/^\+/, "");
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${numForWa}${q}`;
};

const buildTelLink = (phone) => {
  const normalized = normalizePhone(phone);
  return normalized ? `tel:${normalized}` : "#";
};

/* ======================== NORMALIZERS ======================== */
// Normalize one caregiver object from arbitrary API fields
const normalizeCaregiver = (cRaw) => {
  if (!cRaw || typeof cRaw !== "object") return null;
  const id = pickId(cRaw) || cRaw.caregiverId || cRaw.cgId;
  const profilePicture = cRaw.profilePicture || cRaw.profile || cRaw.avatar || cRaw.photo || "";
  const mobile = cRaw.mobile || cRaw.phone || cRaw.phoneNumber || cRaw.contact || "";
  return {
    id,
    name: cRaw.name || cRaw.fullName || "",
    email: cRaw.email || cRaw.mail || "",
    joinDate: cRaw.joinDate || cRaw.joinedAt || "",
    status: cRaw.status || "",
    certification: cRaw.certification || cRaw.qualification || "",
    yearsExperience: cRaw.yearsExperience ?? cRaw.experience ?? "",
    mobile,
    address: cRaw.address || "",
    skills: cRaw.skills || "",
    profilePicture,
    documents: Array.isArray(cRaw.documents) ? cRaw.documents : [],
  };
};

// Normalize assignment item (tries multiple shapes)
const normalizeAssignment = (item) => {
  if (!item || typeof item !== "object") return null;

  // Common fields
  const id = pickId(item) || item.assignmentId || item.id || item._id;
  const patientId =
    item.patientId || pickId(item.patient) || item.patient?._id || item.patient?.id || "";
  const caregiverId =
    item.caregiverId || pickId(item.caregiver) || item.caregiver?._id || item.caregiver?.id || "";
  const dateAssigned = item.dateAssigned || item.assignedAt || item.createdAt || "";
  const status = item.status || item.assignmentStatus || "";

  // Caregiver object (if included)
  const cg =
    normalizeCaregiver(item.caregiver) ||
    normalizeCaregiver(item.cg) ||
    (caregiverId ? { id: caregiverId } : null);

  return { id, patientId, caregiverId, dateAssigned, status, caregiver: cg };
};

// Normalize whole response into assignment array
const normalizeAssignmentsResponse = (resData) => {
  // could be array, or {data: []}, or {assignments: []}, etc.
  const rootArr =
    (Array.isArray(resData) && resData) ||
    (Array.isArray(resData?.data) && resData.data) ||
    (Array.isArray(resData?.assignments) && resData.assignments) ||
    (Array.isArray(resData?.results) && resData.results) ||
    (Array.isArray(resData?.items) && resData.items) ||
    [];

  const out = [];
  for (const it of rootArr) {
    const norm = normalizeAssignment(it);
    if (norm) out.push(norm);
  }
  return out;
};

/* ======================== COMPONENT ======================== */
const MyCaregiver = () => {
  const [{ name: storedName }] = useState(getPatientNameEmail());
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");

  // Build a caregiver map from assignments (when caregiver object is included)
  const caregiversById = useMemo(() => {
    const map = new Map();
    for (const a of assignments) {
      if (a.caregiver?.id) map.set(a.caregiver.id, a.caregiver);
      else if (a.caregiverId && !map.has(a.caregiverId)) map.set(a.caregiverId, { id: a.caregiverId });
    }
    return map;
  }, [assignments]);

  // Fetch assignments by patientId (from storage)
  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      setLoadErr("");
      try {
        const patientId = getPatientIdFromStorage();
        if (!patientId) throw new Error("Patient ID not found in storage.");

        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

        // Pass patientId under multiple common param names for compatibility
        const res = await axios.get(ASSIGN_ENDPOINT, {
          params: { patientId, id: patientId, userId: patientId },
          headers,
        });

        const normalized = normalizeAssignmentsResponse(res?.data);
        // If backend returned assignments for many users, filter down to mine
        const mine = normalized.filter((a) => !a.patientId || a.patientId === patientId);
        setAssignments(mine);
      } catch (e) {
        setLoadErr(e?.response?.data?.message || e?.message || "Failed to load assigned caregivers.");
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const getCaregiver = (id) => caregiversById.get(id);

  const pillClass = (status) =>
    status === "Active" ? "pill pill-success" : "pill pill-muted";

  // Detail state
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailCaregiver, setDetailCaregiver] = useState(null);
  const [detailAssignment, setDetailAssignment] = useState(null);

  const openDetail = (asn) => {
    const cg = getCaregiver(asn.caregiverId) || asn.caregiver || null;
    setDetailCaregiver(cg);
    setDetailAssignment(asn);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setDetailCaregiver(null);
    setDetailAssignment(null);
  };

  /* --------- Compact Card --------- */
  const CompactCard = ({ asn }) => {
    const cg = getCaregiver(asn.caregiverId) || asn.caregiver;
    if (!cg) return null;

    const telHref = buildTelLink(cg.mobile);
    const waText = `Hello ${cg.name || "Caregiver"}, this is ${storedName || "your patient"}.`;
    const waHref = buildWhatsAppLink(cg.mobile, waText);

    return (
      <div className="mini-card">
        <div className="mini-top">
          <div className="mini-avatar">
            {cg.profilePicture ? (
              <img src={cg.profilePicture} alt={cg.name || "Caregiver"} />
            ) : (
              <div className="placeholder">{(cg.name || "C").charAt(0)}</div>
            )}
          </div>

          <div className="mini-meta">
            <div className="mini-name">{cg.name || "—"}</div>
            <div className="mini-role">{cg.certification || "—"}</div>
          </div>
        </div>

        <div className="mini-badges">
          <span className={pillClass(cg.status)}>{cg.status || "—"}</span>
          {cg.joinDate ? (
            <span className="pill">
              <i className="fas fa-calendar-alt me" />
              {cg.joinDate}
            </span>
          ) : null}
          {cg.yearsExperience != null && cg.yearsExperience !== "" ? (
            <span className="pill">
              <i className="fas fa-history me" />
              {cg.yearsExperience} yrs
            </span>
          ) : null}
        </div>

        <div className="mini-info">
          {(cg.email || cg.mobile) && (
            <div className="rowi">
              <span className="ico"><i className="fas fa-envelope" /></span>
              <span className="val">{cg.email || "—"}</span>
            </div>
          )}
          {cg.mobile && (
            <div className="rowi">
              <span className="ico"><i className="fas fa-phone" /></span>
              <span className="val">{normalizePhone(cg.mobile)}</span>
            </div>
          )}
          {asn.dateAssigned && (
            <div className="rowi">
              <span className="ico"><i className="fas fa-calendar-check" /></span>
              <span className="val">Assigned: {asn.dateAssigned}</span>
            </div>
          )}
        </div>

        <div className="mini-actions">
          <button className="btn btn-orange btn-sm" onClick={() => openDetail(asn)}>
            <i className="fas fa-eye me" /> View
          </button>

          {/* Call */}
          {cg.mobile ? (
            <a className="btn btn-ghost-orange btn-sm" href={telHref}>
              <i className="fas fa-phone me" /> Call
            </a>
          ) : null}

          {/* WhatsApp */}
          {cg.mobile ? (
            <a className="btn btn-ghost-orange btn-sm" href={waHref} target="_blank" rel="noreferrer">
              <i className="fab fa-whatsapp me" /> WhatsApp
            </a>
          ) : null}
        </div>
      </div>
    );
  };

  /* --------- Detail Modal --------- */
  const DetailModal = () => {
    if (!detailOpen || !detailCaregiver) return null;
    const cg = detailCaregiver;
    const asn = detailAssignment;

    const telHref = buildTelLink(cg.mobile);
    const waText = `Hello ${cg.name || "Caregiver"}, this is ${storedName || "your patient"}.`;
    const waHref = buildWhatsAppLink(cg.mobile, waText);

    return (
      <div className="modal-backdrop" role="dialog" aria-modal="true">
        <div className="modal-card">
          <div className="modal-head">
            <div className="mh-left">
              <i className="fas fa-user-nurse me"></i>
              <strong>Caregiver Details</strong>
            </div>
            <button className="btn-close-white" onClick={closeDetail} aria-label="Close">
              &times;
            </button>
          </div>

          <div className="modal-body">
            <div className="modal-header-row">
              <div className="modal-avatar">
                {cg.profilePicture ? (
                  <img src={cg.profilePicture} alt={cg.name || "Caregiver"} />
                ) : (
                  <div className="placeholder">{(cg.name || "C").charAt(0)}</div>
                )}
              </div>
              <div className="mh-meta">
                <h3 className="mh-name">{cg.name || "—"}</h3>
                <div className="mh-role">{cg.certification || "—"}</div>
                <div className="mh-pills">
                  <span className={pillClass(cg.status)}>{cg.status || "—"}</span>
                  {cg.joinDate ? (
                    <span className="pill">
                      <i className="fas fa-calendar-alt me" /> Joined: {cg.joinDate}
                    </span>
                  ) : null}
                  {cg.yearsExperience != null && cg.yearsExperience !== "" ? (
                    <span className="pill">
                      <i className="fas fa-history me" /> {cg.yearsExperience} years
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="modal-grid">
              {/* Contact */}
              <div className="card block">
                <div className="block-head"><h6>Contact Information</h6></div>
                <div className="block-body">
                  <div className="rowi">
                    <span className="ico"><i className="fas fa-envelope" /></span>
                    <div>
                      <div className="label">Email</div>
                      <div className="val">{cg.email || "—"}</div>
                    </div>
                  </div>
                  <div className="rowi">
                    <span className="ico"><i className="fas fa-phone" /></span>
                    <div>
                      <div className="label">Mobile</div>
                      <div className="val">{cg.mobile ? normalizePhone(cg.mobile) : "—"}</div>
                    </div>
                  </div>
                  {cg.address ? (
                    <div className="rowi">
                      <span className="ico"><i className="fas fa-map-marker-alt" /></span>
                      <div>
                        <div className="label">Address</div>
                        <div className="val">{cg.address}</div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Professional */}
              <div className="card block">
                <div className="block-head"><h6>Professional</h6></div>
                <div className="block-body">
                  <div className="rowi">
                    <span className="ico"><i className="fas fa-certificate" /></span>
                    <div>
                      <div className="label">Certification</div>
                      <div className="val">{cg.certification || "—"}</div>
                    </div>
                  </div>
                  <div className="rowi">
                    <span className="ico"><i className="fas fa-tools" /></span>
                    <div>
                      <div className="label">Skills</div>
                      <div className="val">{cg.skills || "—"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignment */}
              <div className="card block">
                <div className="block-head"><h6>Assignment</h6></div>
                <div className="block-body">
                  <div className="rowi">
                    <span className="ico"><i className="fas fa-calendar-check" /></span>
                    <div>
                      <div className="label">Assigned Date</div>
                      <div className="val">{asn?.dateAssigned || "—"}</div>
                    </div>
                  </div>
                  <div className="rowi">
                    <span className="ico"><i className="fas fa-info-circle" /></span>
                    <div>
                      <div className="label">Status</div>
                      <div className="val"><span className={pillClass(asn?.status)}>{asn?.status || "—"}</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="card block">
                <div className="block-head"><h6>Documents</h6></div>
                <div className="block-body">
                  {cg.documents?.length ? (
                    <ul className="doc-list">
                      {cg.documents.map((d, i) => (
                        <li key={i} className="doc-item">
                          <div className="doc-left">
                            <span className="icon-dot"><i className="fas fa-file-pdf" /></span>
                            <span className="doc-name">{d.name}</span>
                          </div>
                          <a href={d.url} target="_blank" rel="noreferrer" className="btn btn-ghost-orange btn-sm">
                            <i className="fas fa-download me" /> Download
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="muted">No documents uploaded.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-ghost-orange" onClick={closeDetail}>Close</button>
            {cg.mobile ? <a className="btn btn-ghost-orange" href={telHref}><i className="fas fa-phone me" /> Call</a> : null}
            {cg.mobile ? <a className="btn btn-orange" href={waHref} target="_blank" rel="noreferrer"><i className="fab fa-whatsapp me" /> WhatsApp</a> : null}
          </div>
        </div>
      </div>
    );
  };

  /* ------------------- UI ------------------- */
  return (
    <div className="container cg-wrap">
      {/* HERO */}
      <div className="hero card">
        <div className="hero-inner">
          <div className="hero-left">
            <div className="ring-avatar">{(storedName || "P").charAt(0)}</div>
            <div>
              <h2 className="hero-title">My Caregiver</h2>
              <div className="hero-sub">View your assigned caregiver information</div>
            </div>
          </div>
          <Link to="/dashboard" className="btn btn-ghost-orange">
            <i className="fas fa-arrow-left me"></i> Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Loading / Error */}
      {loading ? (
        <div className="card section-card">
          <div className="section-head"><h5>Assigned Caregivers</h5></div>
          <div className="empty"><div className="muted">Loading...</div></div>
        </div>
      ) : loadErr ? (
        <div className="card section-card">
          <div className="section-head"><h5>Assigned Caregivers</h5></div>
          <div className="empty"><div className="muted" style={{color:"#dc3545"}}>{loadErr}</div></div>
        </div>
      ) : (
        <div className="card section-card">
          <div className="section-head"><h5>Assigned Caregivers</h5></div>
          {assignments.length ? (
            <div className="grid-cards">
              {assignments.map((asn) => (
                <CompactCard key={asn.id || `${asn.caregiverId}-${asn.dateAssigned}`} asn={asn} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <i className="fas fa-user-nurse empty-icon" />
              <h5>No Caregiver Assigned</h5>
              <p className="muted">You don't have any caregiver assigned to you yet.</p>
              <Link to="/dashboard" className="btn btn-orange">Back to Dashboard</Link>
            </div>
          )}
        </div>
      )}

      {/* Detail Component (Modal) */}
      <DetailModal />

      {/* ---------- INLINE STYLES ---------- */}
      <style>{`
        :root { 
          --orange:${BRAND_ORANGE}; 
          --muted:#6b7280; 
          --line:#eef0f2; 
          --shadow:0 6px 18px rgba(16,24,40,.08); 
        }

        * { box-sizing: border-box; }
        .cg-wrap{ padding:8px 0 20px; max-width: 1200px; margin: 0 auto; }

        .btn{ border:1px solid transparent; border-radius:12px; padding:.6rem 1rem; font-weight:600; display:inline-flex; align-items:center; gap:.5rem; text-decoration: none; transition: all .2s; }
        .btn-sm{ padding:.45rem .75rem; border-radius:10px; }
        .btn-orange{ background:var(--orange); color:#fff; border-color:var(--orange); box-shadow:0 6px 16px rgba(255,107,0,.22); }
        .btn-ghost-orange{ background:#fff; color:var(--orange); border-color:var(--orange); }
        .btn-orange:hover{ filter:brightness(.97); }
        .btn-ghost-orange:hover{ background:rgba(255,107,0,.08); }
        .me{ margin-right:.5rem; }
        .muted{ color:var(--muted); }

        .card{ background:#fff; border:1px solid #edf0f4; border-radius:16px; box-shadow:var(--shadow); margin-bottom:16px; overflow:hidden; }
        .section-card{ padding:0; }
        .section-head{ padding:16px 20px; border-bottom:1px solid var(--line); }
        .section-head h5{ margin:0; font-weight:800; }

        .hero{ background:linear-gradient(180deg, rgba(255,107,0,.09), #fff 60%); }
        .hero-inner{ display:flex; align-items:center; justify-content:space-between; padding:18px 20px; gap:16px; flex-wrap: wrap; }
        .hero-left{ display:flex; align-items:center; gap:14px; }
        .ring-avatar{ width:54px; height:54px; border-radius:50%; border:3px solid var(--orange); color:var(--orange); display:flex; align-items:center; justify-content:center; font-weight:800; background:#fff; box-shadow:0 4px 14px rgba(255,107,0,.18); }
        .hero-title{ margin:0; font-weight:800; }
        .hero-sub{ font-size:.9rem; color:var(--muted); }

        /* GRID of mini cards */
        .grid-cards{
          padding:16px;
          display:grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap:16px;
        }

        .mini-card{
          border:1px solid var(--line);
          border-radius:16px;
          padding:14px;
          box-shadow: var(--shadow);
          display:flex; 
          flex-direction:column;
          gap:12px;
          background:#fff;
        }

        .mini-top{ display:flex; align-items:center; gap:12px; }
        .mini-avatar{
          width:64px; height:64px; border-radius:50%; overflow:hidden; background:var(--orange);
          box-shadow:0 8px 18px rgba(255,107,0,.22); flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
        }
        .mini-avatar img, .mini-avatar .placeholder{
          width:100%; height:100%; object-fit:cover; color:#fff; font-weight:800; font-size:24px; display:flex; align-items:center; justify-content:center;
        }
        .mini-meta{ min-width:0; }
        .mini-name{ font-weight:800; line-height:1.2; }
        .mini-role{ color:var(--muted); font-weight:600; font-size:.9rem; }

        .mini-badges{ display:flex; flex-wrap:wrap; gap:8px; }
        .pill{ display:inline-flex; align-items:center; gap:.4rem; padding:.35rem .6rem; border-radius:999px; font-weight:700; font-size:.78rem; border:1px solid var(--line); background:#fff; }
        .pill-success{ background:rgba(25,135,84,.12); color:#198754; border-color:transparent; }
        .pill-muted{ background:#f1f3f5; color:#6c757d; border-color:transparent; }

        .mini-info{ display:flex; flex-direction:column; gap:8px; }
        .rowi{ display:flex; align-items:flex-start; gap:8px; }
        .ico{ min-width:28px; height:28px; border-radius:10px; background:rgba(255,107,0,.12); color:var(--orange); display:flex; align-items:center; justify-content:center; }
        .val{ font-weight:700; word-break: break-word; }

        .mini-actions{ display:flex; gap:8px; margin-top:4px; flex-wrap: wrap; }

        .empty{ text-align:center; padding:40px 20px; }
        .empty-icon{ font-size:44px; color:#cbd5e1; margin-bottom:10px; }

        /* ===== Detail Modal ===== */
        .modal-backdrop{
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          padding: 16px;
        }
        .modal-card{
          width: 100%;
          max-width: 980px;
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 24px 56px rgba(0,0,0,.22);
          display: flex;
          flex-direction: column;
        }
        .modal-head{
          background: linear-gradient(90deg, var(--orange), #ff8a3a);
          color: #fff;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .btn-close-white{
          background: transparent;
          border: none;
          color: #fff;
          font-size: 22px;
          cursor: pointer;
          line-height: 1;
        }
        .modal-body{ padding: 16px; }
        .modal-footer{
          padding: 12px 16px;
          border-top: 1px solid var(--line);
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          flex-wrap: wrap;
        }

        .modal-header-row{
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .modal-avatar{
          width: 100px; height: 100px; border-radius: 50%; overflow: hidden; background: var(--orange);
          box-shadow: 0 10px 20px rgba(255,107,0,.25);
          display:flex; align-items:center; justify-content:center;
          flex-shrink: 0;
        }
        .modal-avatar img, .modal-avatar .placeholder{
          width:100%; height:100%; object-fit:cover; color:#fff; font-weight:800; font-size:40px; display:flex; align-items:center; justify-content:center;
        }
        .mh-name{ margin: 0; font-weight: 800; }
        .mh-role{ color: var(--muted); font-weight: 600; }
        .mh-pills{ display:flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }

        .modal-grid{
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 12px;
        }
        .block .block-head{ padding: 12px 12px 0; }
        .block .block-head h6{ margin: 0; text-transform: uppercase; letter-spacing: .06em; font-weight: 800; }
        .block .block-body{ padding: 10px 12px 14px; display: flex; flex-direction: column; gap: 10px; }
        .label{ color: var(--muted); font-size: .85rem; }
        .doc-list{ list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px; }
        .doc-item{ display:flex; justify-content:space-between; align-items:center; gap:10px; padding:10px; border:1px solid var(--line); border-radius:12px; flex-wrap: wrap; }
        .doc-left{ display:flex; align-items:center; gap:10px; }
        .doc-name{ font-weight:700; }
        .icon-dot{ min-width:36px; height:36px; border-radius:12px; background:rgba(255,107,0,.12); color:var(--orange); display:flex; align-items:center; justify-content:center; }

        /* Responsive */
        @media (max-width: 992px){
          .grid-cards{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 768px){
          .modal-grid{ grid-template-columns: 1fr; }
        }
        @media (max-width: 600px){
          .grid-cards{ grid-template-columns: 1fr; }
          .hero-inner{ flex-direction: column; align-items: flex-start; }
          .btn{ width: 100%; justify-content:center; }
          .modal-footer{ justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default MyCaregiver;
