import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_URL from "../../../Baseurl/Baseurl"; // adjust path if needed

const BRAND_ORANGE = "#ff6b00";
const DEFAULT_COUNTRY_CODE = "+91";
const BASE_URL = API_URL;
const ASSIGN_ENDPOINT = `${BASE_URL}/caregiver/assignCaregiver`;

/* ---------------- ID & STORAGE HELPERS ---------------- */
const safeParse = (str) => { try { return JSON.parse(str); } catch { return null; } };

const pickId = (obj) => {
  if (!obj || typeof obj !== "object") return null;
  for (const k of ["_id", "id", "userId", "uid", "sub"]) if (obj[k]) return obj[k];
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
  const direct = localStorage.getItem("userId") || sessionStorage.getItem("userId");
  if (direct && direct !== "null" && direct !== "undefined") return direct;

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

const getPatientName = () => {
  const keys = ["user", "profile", "authUser", "currentUser", "loginUser", "patient"];
  for (const store of [localStorage, sessionStorage]) {
    for (const k of keys) {
      const obj = safeParse(store.getItem(k));
      if (obj && typeof obj === "object") {
        const name = obj.name || obj.fullName || obj.username || obj.displayName;
        if (name) return name;
      }
    }
  }
  return null;
};

/* ---------------- PHONE / DEEPLINK HELPERS ---------------- */
const normalizePhone = (raw, defaultCC = DEFAULT_COUNTRY_CODE) => {
  if (!raw) return "";
  const t = String(raw).trim();
  if (t.startsWith("+")) return "+" + t.replace(/[^\d]/g, "");
  const digits = t.replace(/[^\d]/g, "");
  if (!digits) return "";
  if (digits.length === 10 && defaultCC) return defaultCC + digits;
  return digits;
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

/* ---------------- NORMALIZERS (for your payload) ---------------- */

// Parse "10 yrs" -> 10 (number). If it’s not a pure number, keep original string for display.
const parseYears = (val) => {
  if (val == null) return "";
  const m = String(val).match(/(\d+(\.\d+)?)/);
  return m ? Number(m[1]) : String(val);
};

const normalizeCaregiver = (cRaw) => {
  if (!cRaw || typeof cRaw !== "object") return null;
  return {
    id: cRaw._id || cRaw.id || pickId(cRaw),
    name: cRaw.name || "",
    email: cRaw.email || "",
    profilePicture: cRaw.profile || cRaw.avatar || cRaw.photo || "",
    yearsExperience: parseYears(cRaw.experience),      // "10 yrs" -> 10
    experienceLabel: cRaw.experience || "",            // keep original for display if needed
    address: cRaw.address || "",
    skills: cRaw.skills || "",
    mobile: cRaw.mobile || cRaw.phone || "",           // not in your sample; will hide buttons if missing
    status: cRaw.status || "",                         // not in your payload; computed per assignment instead
    documents: cRaw.certificate
      ? [{ name: "Certificate", url: cRaw.certificate }]
      : [],
  };
};

const computeAssignmentStatus = (startISO, endISO) => {
  const now = new Date();
  const start = startISO ? new Date(startISO) : null;
  const end = endISO ? new Date(endISO) : null;

  if (start && now < start) return "Upcoming";
  if (start && end && now >= start && now <= end) return "Active";
  if (end && now > end) return "Completed";
  return "Active";
};

const normalizeAssignment = (item) => {
  if (!item || typeof item !== "object") return null;

  const id = item._id || item.id || pickId(item);
  const patientId = item.patientId?._id || item.patientId || "";
  const cgObj = item.caregiverId && typeof item.caregiverId === "object" ? item.caregiverId : null;
  const caregiver = normalizeCaregiver(cgObj) || (item.caregiverId ? { id: item.caregiverId } : null);

  const start = item.assignStartDate || item.startDate || item.start || "";
  const end = item.assignEndDate || item.endDate || item.end || "";

  const status = computeAssignmentStatus(start, end);

  return {
    id,
    patientId,
    caregiverId: caregiver?.id || "",
    caregiver,
    dateAssigned: item.createdAt || item.dateAssigned || "",
    assignStartDate: start,
    assignEndDate: end,
    status,
  };
};

const normalizeAssignmentsResponse = (resData) => {
  const arr =
    (Array.isArray(resData) && resData) ||
    (Array.isArray(resData?.data) && resData.data) ||
    (Array.isArray(resData?.assignments) && resData.assignments) ||
    (Array.isArray(resData?.results) && resData.results) ||
    (Array.isArray(resData?.items) && resData.items) ||
    [];
  const out = [];
  for (const it of arr) {
    const n = normalizeAssignment(it);
    if (n) out.push(n);
  }
  return out;
};

/* ---------------- COMPONENT ---------------- */
const MyCaregiver = () => {
  const patientName = getPatientName();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");

  // map caregiverId -> caregiver object
  const caregiversById = useMemo(() => {
    const map = new Map();
    for (const a of assignments) {
      if (a.caregiver?.id) map.set(a.caregiver.id, a.caregiver);
    }
    return map;
  }, [assignments]);

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      setLoadErr("");
      try {
        const patientId = getPatientIdFromStorage();
        if (!patientId) throw new Error("Patient ID not found in storage.");

        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

        const res = await axios.get(ASSIGN_ENDPOINT, {
          params: { patientId },     // your backend reference
          headers,
        });

        const normalized = normalizeAssignmentsResponse(res?.data);
        // ensure we only show the current patient's assignments
        const mine = normalized.filter((a) => !a.patientId || String(a.patientId) === String(patientId));
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
    status === "Active" ? "pill pill-success" :
    status === "Upcoming" ? "pill pill-info" :
    status === "Completed" ? "pill pill-muted" :
    "pill pill-muted";

  // Detail
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
    const waText = `Hello ${cg.name || "Caregiver"}, this is ${patientName || "your patient"}.`;
    const waHref = buildWhatsAppLink(cg.mobile, waText);

    const expLabel = cg.experienceLabel || (typeof cg.yearsExperience === "number" ? `${cg.yearsExperience} yrs` : "");

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
            <div className="mini-role">Caregiver</div>
          </div>
        </div>

        <div className="mini-badges">
          <span className={pillClass(asn.status)}>{asn.status}</span>
          {expLabel ? (
            <span className="pill">
              <i className="fas fa-history me" />
              {expLabel}
            </span>
          ) : null}
        </div>

        <div className="mini-info">
          {cg.email ? (
            <div className="rowi">
              <span className="ico"><i className="fas fa-envelope" /></span>
              <span className="val">{cg.email}</span>
            </div>
          ) : null}
          {asn.assignStartDate || asn.assignEndDate ? (
            <div className="rowi">
              <span className="ico"><i className="fas fa-calendar-check" /></span>
              <span className="val">
                {asn.assignStartDate ? new Date(asn.assignStartDate).toLocaleDateString() : "—"}
                {" "}to{" "}
                {asn.assignEndDate ? new Date(asn.assignEndDate).toLocaleDateString() : "—"}
              </span>
            </div>
          ) : null}
        </div>

        <div className="mini-actions">
          <button className="btn btn-orange btn-sm" onClick={() => openDetail(asn)}>
            <i className="fas fa-eye me" /> View
          </button>
          {cg.mobile ? (
            <>
              <a className="btn btn-ghost-orange btn-sm" href={telHref}>
                <i className="fas fa-phone me" /> Call
              </a>
              <a className="btn btn-ghost-orange btn-sm" href={waHref} target="_blank" rel="noreferrer">
                <i className="fab fa-whatsapp me" /> WhatsApp
              </a>
            </>
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
    const waText = `Hello ${cg.name || "Caregiver"}, this is ${patientName || "your patient"}.`;
    const waHref = buildWhatsAppLink(cg.mobile, waText);

    const expLabel = cg.experienceLabel || (typeof cg.yearsExperience === "number" ? `${cg.yearsExperience} years` : "");

    return (
      <div className="modal-backdrop" role="dialog" aria-modal="true">
        <div className="modal-card">
          <div className="modal-head">
            <div className="mh-left">
              <i className="fas fa-user-nurse me"></i>
              <strong>Caregiver Details</strong>
            </div>
            <button className="btn-close-white" onClick={closeDetail} aria-label="Close">&times;</button>
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
                <div className="mh-role">Caregiver</div>
                <div className="mh-pills">
                  <span className={pillClass(asn.status)}>{asn.status}</span>
                  {expLabel ? (
                    <span className="pill">
                      <i className="fas fa-history me" /> {expLabel}
                    </span>
                  ) : null}
                  {asn.assignStartDate || asn.assignEndDate ? (
                    <span className="pill">
                      <i className="fas fa-calendar-alt me" /> {asn.assignStartDate ? new Date(asn.assignStartDate).toLocaleDateString() : "—"}
                      {" "}to{" "}
                      {asn.assignEndDate ? new Date(asn.assignEndDate).toLocaleDateString() : "—"}
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
                  {expLabel ? (
                    <div className="rowi">
                      <span className="ico"><i className="fas fa-history" /></span>
                      <div>
                        <div className="label">Experience</div>
                        <div className="val">{expLabel}</div>
                      </div>
                    </div>
                  ) : null}
                  {cg.skills ? (
                    <div className="rowi">
                      <span className="ico"><i className="fas fa-tools" /></span>
                      <div>
                        <div className="label">Skills</div>
                        <div className="val">{cg.skills}</div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Assignment */}
              <div className="card block">
                <div className="block-head"><h6>Assignment</h6></div>
                <div className="block-body">
                  {asn.assignStartDate || asn.assignEndDate ? (
                    <div className="rowi">
                      <span className="ico"><i className="fas fa-calendar-check" /></span>
                      <div>
                        <div className="label">Period</div>
                        <div className="val">
                          {asn.assignStartDate ? new Date(asn.assignStartDate).toLocaleString() : "—"}{" "}
                          to{" "}
                          {asn.assignEndDate ? new Date(asn.assignEndDate).toLocaleString() : "—"}
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <div className="rowi">
                    <span className="ico"><i className="fas fa-info-circle" /></span>
                    <div>
                      <div className="label">Status</div>
                      <div className="val"><span className={pillClass(asn.status)}>{asn.status}</span></div>
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

  /* ---------------- UI ---------------- */
  return (
    <div className="container cg-wrap">
      {/* HERO */}
      <div className="hero card">
        <div className="hero-inner">
          <div className="hero-left">
            <div className="ring-avatar">{(patientName || "P").charAt(0)}</div>
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

      {/* Loading / Error / Content */}
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
                <CompactCard key={asn.id || `${asn.caregiverId}-${asn.assignStartDate || ""}`} asn={asn} />
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

      {/* Detail Modal */}
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
        .pill-info{ background:rgba(13,110,253,.12); color:#0d6efd; border-color:transparent; }

        .mini-info{ display:flex; flex-direction:column; gap:8px; }
        .rowi{ display:flex; align-items:flex-start; gap:8px; }
        .ico{ min-width:28px; height:28px; border-radius:10px; background:rgba(255,107,0,.12); color:var(--orange); display:flex; align-items:center; justify-content:center; }
        .val{ font-weight:700; word-break: break-word; }

        .mini-actions{ display:flex; gap:8px; margin-top:4px; flex-wrap: wrap; }

        .empty{ text-align:center; padding:40px 20px; }
        .empty-icon{ font-size:44px; color:#cbd5e1; margin-bottom:10px; }

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

        @media (max-width: 992px){
          .grid-cards{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
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
