import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const BRAND_ORANGE = "#ff6b00";

const MyCaregiver = () => {
  // ---------- Sample data ----------
  const [patients] = useState([{ id: 1, name: "John Doe", email: "john@example.com" }]);

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
        { name: "BackgroundCheck.pdf", url: "https://example.com/bg1.pdf" },
      ],
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
      documents: [{ name: "License.pdf", url: "https://example.com/license1.pdf" }],
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
      documents: [],
    },
  ]);

  const [assignments] = useState([
    { id: 1001, patientId: 1, caregiverId: 201, dateAssigned: "2023-10-15", status: "Active" },
    { id: 1002, patientId: 1, caregiverId: 202, dateAssigned: "2023-10-20", status: "Active" },
    { id: 1003, patientId: 1, caregiverId: 203, dateAssigned: "2023-11-04", status: "Inactive" },
  ]);

  const currentPatientId = 1;
  const currentPatient = patients.find((p) => p.id === currentPatientId);

  const myAssignments = useMemo(
    () => assignments.filter((a) => a.patientId === currentPatientId),
    [assignments]
  );

  const getCaregiver = (id) => caregivers.find((c) => c.id === id);

  const pillClass = (status) =>
    status === "Active" ? "pill pill-success" : "pill pill-muted";

  // ---------- Detail component state ----------
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailCaregiver, setDetailCaregiver] = useState(null);
  const [detailAssignment, setDetailAssignment] = useState(null);

  const openDetail = (asn) => {
    const cg = getCaregiver(asn.caregiverId);
    setDetailCaregiver(cg || null);
    setDetailAssignment(asn || null);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setDetailCaregiver(null);
    setDetailAssignment(null);
  };

  // ---------- Compact card ----------
  const CompactCard = ({ asn }) => {
    const cg = getCaregiver(asn.caregiverId);
    if (!cg) return null;

    return (
      <div className="mini-card">
        <div className="mini-top">
          <div className="mini-avatar">
            {cg.profilePicture ? (
              <img src={cg.profilePicture} alt={cg.name} />
            ) : (
              <div className="placeholder">{cg.name.charAt(0)}</div>
            )}
          </div>

          <div className="mini-meta">
            <div className="mini-name">{cg.name}</div>
            <div className="mini-role">{cg.certification}</div>
          </div>
        </div>

        <div className="mini-badges">
          <span className={pillClass(cg.status)}>{cg.status}</span>
          <span className="pill">
            <i className="fas fa-calendar-alt me" />
            {cg.joinDate}
          </span>
          <span className="pill">
            <i className="fas fa-history me" />
            {cg.yearsExperience} yrs
          </span>
        </div>

        <div className="mini-info">
          <div className="rowi">
            <span className="ico"><i className="fas fa-envelope" /></span>
            <span className="val">{cg.email}</span>
          </div>
          <div className="rowi">
            <span className="ico"><i className="fas fa-phone" /></span>
            <span className="val">{cg.mobile}</span>
          </div>
          <div className="rowi">
            <span className="ico"><i className="fas fa-calendar-check" /></span>
            <span className="val">Assigned: {asn.dateAssigned}</span>
          </div>
        </div>

        <div className="mini-actions">
          <button className="btn btn-orange btn-sm" onClick={() => openDetail(asn)}>
            <i className="fas fa-eye me" /> View
          </button>
          <button className="btn btn-ghost-orange btn-sm">
            <i className="fas fa-phone me" /> Contact
          </button>
        </div>
      </div>
    );
  };

  // ---------- Detail Modal Component ----------
  const DetailModal = () => {
    if (!detailOpen || !detailCaregiver) return null;
    const cg = detailCaregiver;
    const asn = detailAssignment;

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
            {/* Header row with avatar + meta */}
            <div className="modal-header-row">
              <div className="modal-avatar">
                {cg.profilePicture ? (
                  <img src={cg.profilePicture} alt={cg.name} />
                ) : (
                  <div className="placeholder">{cg.name.charAt(0)}</div>
                )}
              </div>
              <div className="mh-meta">
                <h3 className="mh-name">{cg.name}</h3>
                <div className="mh-role">{cg.certification}</div>
                <div className="mh-pills">
                  <span className={pillClass(cg.status)}>{cg.status}</span>
                  <span className="pill">
                    <i className="fas fa-calendar-alt me" /> Joined: {cg.joinDate}
                  </span>
                  <span className="pill">
                    <i className="fas fa-history me" /> {cg.yearsExperience} years
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-grid">
              {/* Contact */}
              <div className="card block">
                <div className="block-head">
                  <h6>Contact Information</h6>
                </div>
                <div className="block-body">
                  <div className="rowi">
                    <span className="ico"><i className="fas fa-envelope" /></span>
                    <div>
                      <div className="label">Email</div>
                      <div className="val">{cg.email}</div>
                    </div>
                  </div>
                  <div className="rowi">
                    <span className="ico"><i className="fas fa-phone" /></span>
                    <div>
                      <div className="label">Mobile</div>
                      <div className="val">{cg.mobile}</div>
                    </div>
                  </div>
                  <div className="rowi">
                    <span className="ico"><i className="fas fa-map-marker-alt" /></span>
                    <div>
                      <div className="label">Address</div>
                      <div className="val">{cg.address}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional */}
              <div className="card block">
                <div className="block-head">
                  <h6>Professional</h6>
                </div>
                <div className="block-body">
                  <div className="rowi">
                    <span className="ico"><i className="fas fa-certificate" /></span>
                    <div>
                      <div className="label">Certification</div>
                      <div className="val">{cg.certification}</div>
                    </div>
                  </div>
                  <div className="rowi">
                    <span className="ico"><i className="fas fa-tools" /></span>
                    <div>
                      <div className="label">Skills</div>
                      <div className="val">{cg.skills}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignment */}
              <div className="card block">
                <div className="block-head">
                  <h6>Assignment</h6>
                </div>
                <div className="block-body">
                  <div className="rowi">
                    <span className="ico"><i className="fas fa-calendar-check" /></span>
                    <div>
                      <div className="label">Assigned Date</div>
                      <div className="val">{asn?.dateAssigned}</div>
                    </div>
                  </div>
                  <div className="rowi">
                    <span className="ico"><i className="fas fa-info-circle" /></span>
                    <div>
                      <div className="label">Status</div>
                      <div className="val"><span className={pillClass(asn?.status)}>{asn?.status}</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="card block">
                <div className="block-head">
                  <h6>Documents</h6>
                </div>
                <div className="block-body">
                  {cg.documents?.length ? (
                    <ul className="doc-list">
                      {cg.documents.map((d, i) => (
                        <li key={i} className="doc-item">
                          <div className="doc-left">
                            <span className="icon-dot"><i className="fas fa-file-pdf" /></span>
                            <span className="doc-name">{d.name}</span>
                          </div>
                          <a
                            href={d.url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-ghost-orange btn-sm"
                          >
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
            <button className="btn btn-ghost-orange" onClick={closeDetail}>
              Close
            </button>
            <button className="btn btn-orange">
              <i className="fas fa-phone me" /> Contact Caregiver
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container cg-wrap">
      {/* HERO */}
      <div className="hero card">
        <div className="hero-inner">
          <div className="hero-left">
            <div className="ring-avatar">{currentPatient?.name?.charAt(0) || "P"}</div>
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

      {/* Multiple caregivers in small cards */}
      <div className="card section-card">
        <div className="section-head">
          <h5>Assigned Caregivers</h5>
        </div>

        {myAssignments.length ? (
          <div className="grid-cards">
            {myAssignments.map((asn) => (
              <CompactCard key={asn.id} asn={asn} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <i className="fas fa-user-nurse empty-icon" />
            <h5>No Caregiver Assigned</h5>
            <p className="muted">You don't have any caregiver assigned to you yet.</p>
            <Link to="/dashboard" className="btn btn-orange">
              Back to Dashboard
            </Link>
          </div>
        )}
      </div>

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

        .mini-actions{ display:flex; gap:8px; margin-top:4px; }

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
