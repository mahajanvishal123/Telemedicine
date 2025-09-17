import React, { useState } from "react";
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
  ]);

  const [assignments] = useState([
    { id: 1001, patientId: 1, caregiverId: 201, dateAssigned: "2023-10-15", status: "Active" },
    { id: 1002, patientId: 1, caregiverId: 202, dateAssigned: "2023-10-20", status: "Active" },
  ]);

  const currentPatientId = 1;
  const currentPatient = patients.find((p) => p.id === currentPatientId);
  const firstAssignment = assignments.find((a) => a.patientId === currentPatientId) || null;
  const getCaregiverDetails = (id) => caregivers.find((c) => c.id === id);

  const pillClass = (status) => (status === "Active" ? "pill pill-success" : "pill pill-muted");

  const renderCaregiverBlock = (as) => {
    const cg = as ? getCaregiverDetails(as.caregiverId) : null;
    if (!cg) return null;

    return (
      <div className="caregiver-block soft-card">
        {/* Header */}
        <div className="cb-header">
          <div className="cb-avatar">
            {cg.profilePicture ? <img src={cg.profilePicture} alt={cg.name} /> : <div className="placeholder">{cg.name.charAt(0)}</div>}
          </div>
          <div className="cb-meta">
            <h4 className="cb-name">{cg.name}</h4>
            <div className="cb-role">{cg.certification}</div>
            <div className="cb-pills">
              <span className={pillClass(cg.status)}>{cg.status}</span>
              <span className="pill"><i className="fas fa-calendar-alt me"></i>Joined: {cg.joinDate}</span>
              <span className="pill"><i className="fas fa-history me"></i>{cg.yearsExperience} yrs exp.</span>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="cb-section">
          <h6 className="sec-title">Contact</h6>
          <div className="info-grid">
            <div className="chip">
              <span className="icon-dot"><i className="fas fa-envelope" /></span>
              <div className="chip-body">
                <div className="chip-label">Email</div>
                <div className="chip-val">{cg.email}</div>
              </div>
            </div>
            <div className="chip">
              <span className="icon-dot"><i className="fas fa-phone" /></span>
              <div className="chip-body">
                <div className="chip-label">Phone</div>
                <div className="chip-val">{cg.mobile}</div>
              </div>
            </div>
            <div className="chip chip-wide">
              <span className="icon-dot"><i className="fas fa-map-marker-alt" /></span>
              <div className="chip-body">
                <div className="chip-label">Address</div>
                <div className="chip-val">{cg.address}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional / Assignment */}
        <div className="cb-section">
          <h6 className="sec-title">Professional</h6>
          <div className="info-grid">
            <div className="chip">
              <span className="icon-dot"><i className="fas fa-certificate" /></span>
              <div className="chip-body">
                <div className="chip-label">Certification</div>
                <div className="chip-val">{cg.certification}</div>
              </div>
            </div>
            <div className="chip">
              <span className="icon-dot"><i className="fas fa-tools" /></span>
              <div className="chip-body">
                <div className="chip-label">Skills</div>
                <div className="chip-val">{cg.skills}</div>
              </div>
            </div>
            <div className="chip">
              <span className="icon-dot"><i className="fas fa-calendar-check" /></span>
              <div className="chip-body">
                <div className="chip-label">Assigned</div>
                <div className="chip-val">{as.dateAssigned}</div>
              </div>
            </div>
            <div className="chip">
              <span className="icon-dot"><i className="fas fa-info-circle" /></span>
              <div className="chip-body">
                <div className="chip-label">Status</div>
                <div className="chip-val"><span className={pillClass(as.status)}>{as.status}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        {cg.documents?.length ? (
          <div className="cb-section">
            <h6 className="sec-title">Documents</h6>
            <ul className="doc-list">
              {cg.documents.map((d, i) => (
                <li key={i} className="doc-item">
                  <div className="doc-left">
                    <span className="icon-dot"><i className="fas fa-file-pdf" /></span>
                    <span className="doc-name">{d.name}</span>
                  </div>
                  <a href={d.url} target="_blank" rel="noreferrer" className="btn btn-ghost-orange btn-sm">
                    <i className="fas fa-download me"></i> Download
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
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

      {/* SINGLE assigned caregiver */}
      <div className="card section-card">
        <div className="section-head">
          <h5>Assigned Caregiver</h5>
        </div>

        {firstAssignment ? (
          <div className="content-pad">{renderCaregiverBlock(firstAssignment)}</div>
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

      {/* ---------- INLINE STYLES ---------- */}
      <style>{`
        :root { 
          --orange:${BRAND_ORANGE}; 
          --muted:#6b7280; 
          --line:#eef0f2; 
          --shadow:0 6px 18px rgba(16,24,40,.08); 
        }
        
        * {
          box-sizing: border-box;
        }
        
        .cg-wrap{ 
          padding:8px 0 20px; 
          max-width: 1200px;
          margin: 0 auto;
          overflow-x: hidden;
        }
        
        .content-pad{ 
          padding:18px 20px; 
        }

        .btn{ 
          border:1px solid transparent; 
          border-radius:12px; 
          padding:.6rem 1rem; 
          font-weight:600; 
          display:inline-flex; 
          align-items:center; 
          gap:.5rem;
          text-decoration: none;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        
        .btn-sm{ 
          padding:.45rem .75rem; 
          border-radius:10px; 
        }
        
        .btn-orange{ 
          background:var(--orange); 
          color:#fff; 
          border-color:var(--orange); 
          box-shadow:0 6px 16px rgba(255,107,0,.22); 
        }
        
        .btn-orange:hover{ 
          filter:brightness(.97); 
        }
        
        .btn-ghost-orange{ 
          background:#fff; 
          color:var(--orange); 
          border-color:var(--orange); 
        }
        
        .btn-ghost-orange:hover{ 
          background:rgba(255,107,0,.08); 
        }
        
        .me{ 
          margin-right:.5rem; 
        }
        
        .muted{ 
          color:var(--muted); 
        }

        .card{ 
          background:#fff; 
          border:1px solid #edf0f4; 
          border-radius:16px; 
          box-shadow:var(--shadow); 
          margin-bottom: 16px;
          overflow: hidden;
        }
        
        .section-card{ 
          padding:0; 
        }
        
        .section-head{ 
          padding:16px 20px; 
          border-bottom:1px solid var(--line); 
        }
        
        .section-head h5{ 
          margin:0; 
          font-weight:800; 
        }

        .hero{ 
          background:linear-gradient(180deg, rgba(255,107,0,.09), #fff 60%); 
        }
        
        .hero-inner{ 
          display:flex; 
          align-items:center; 
          justify-content:space-between; 
          padding:18px 20px; 
          gap:16px; 
          flex-wrap: wrap;
        }
        
        .hero-left{ 
          display:flex; 
          align-items:center; 
          gap:14px; 
        }
        
        .ring-avatar{ 
          width:54px; 
          height:54px; 
          border-radius:50%; 
          border:3px solid var(--orange); 
          color:var(--orange); 
          display:flex; 
          align-items:center; 
          justify-content:center; 
          font-weight:800; 
          background:#fff; 
          box-shadow:0 4px 14px rgba(255,107,0,.18); 
          flex-shrink: 0;
        }
        
        .hero-title{ 
          margin:0; 
          font-weight:800; 
          letter-spacing:.2px; 
        }
        
        .hero-sub{ 
          font-size:.9rem; 
          color:var(--muted); 
        }

        .caregiver-block{ 
          padding:18px; 
          border:1px solid var(--line); 
          border-radius:16px; 
        }
        
        .soft-card{ 
          box-shadow:var(--shadow); 
          background:#fff; 
        }
        
        .cb-header{ 
          display:flex; 
          gap:16px; 
          align-items:center; 
          border-bottom:1px dashed var(--line); 
          padding-bottom:14px; 
          margin-bottom:14px; 
          flex-wrap: wrap;
        }
        
        .cb-avatar{ 
          width:96px; 
          height:96px; 
          border-radius:50%; 
          overflow:hidden; 
          background:var(--orange); 
          box-shadow:0 8px 18px rgba(255,107,0,.22); 
          display:flex; 
          align-items:center; 
          justify-content:center; 
          flex-shrink:0; 
        }
        
        .cb-avatar img, .cb-avatar .placeholder{ 
          width:100%; 
          height:100%; 
          object-fit:cover; 
          color:#fff; 
          font-weight:800; 
          font-size:40px; 
          display:flex; 
          align-items:center; 
          justify-content:center; 
        }
        
        .cb-meta{ 
          display:flex; 
          flex-direction:column; 
          gap:4px; 
          flex: 1;
          min-width: 0;
        }
        
        .cb-name{ 
          margin:0; 
          font-weight:800; 
          word-break: break-word;
        }
        
        .cb-role{ 
          color:var(--muted); 
          font-weight:600; 
        }
        
        .cb-pills{ 
          display:flex; 
          flex-wrap:wrap; 
          gap:8px; 
          margin-top:6px; 
        }

        .pill{ 
          display:inline-flex; 
          align-items:center; 
          gap:.4rem; 
          padding:.4rem .7rem; 
          border-radius:999px; 
          font-weight:700; 
          font-size:.8rem; 
          border:1px solid var(--line); 
          background:#fff; 
        }
        
        .pill-success{ 
          background:rgba(25,135,84,.12); 
          color:#198754; 
          border-color:transparent; 
        }
        
        .pill-muted{ 
          background:#f1f3f5; 
          color:#6c757d; 
          border-color:transparent; 
        }

        .cb-section{ 
          margin-top:12px; 
        }
        
        .sec-title{ 
          margin:0 0 10px; 
          font-size:.95rem; 
          text-transform:uppercase; 
          letter-spacing:.06em; 
          color:#111827; 
          font-weight:800; 
        }
        
        .info-grid{ 
          display:grid; 
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
          gap:12px; 
        }
        
        .chip{ 
          display:flex; 
          gap:10px; 
          padding:10px; 
          border:1px solid var(--line); 
          border-radius:12px; 
          align-items:flex-start; 
          background:#fff; 
        }
        
        .chip-wide{ 
          grid-column:1 / -1; 
        }
        
        .icon-dot{ 
          min-width:36px; 
          height:36px; 
          border-radius:12px; 
          background:rgba(255,107,0,.12); 
          color:var(--orange); 
          display:flex; 
          align-items:center; 
          justify-content:center; 
          flex-shrink: 0;
        }
        
        .chip-body{ 
          min-width: 0; 
        }
        
        .chip-label{ 
          color:var(--muted); 
          font-size:.85rem; 
        }
        
        .chip-val{ 
          font-weight:700; 
          word-break: break-word;
        }

        .doc-list{ 
          list-style:none; 
          padding:0; 
          margin:0; 
          display:flex; 
          flex-direction:column; 
          gap:10px; 
        }
        
        .doc-item{ 
          display:flex; 
          justify-content:space-between; 
          align-items:center; 
          gap:10px; 
          padding:10px; 
          border:1px solid var(--line); 
          border-radius:12px; 
          flex-wrap: wrap;
        }
        
        .doc-left{ 
          display:flex; 
          align-items:center; 
          gap:10px; 
          flex: 1;
          min-width: 0;
        }
        
        .doc-name{ 
          font-weight:700; 
          word-break: break-word;
        }

        .empty{ 
          text-align:center; 
          padding:40px 20px; 
        }
        
        .empty-icon{ 
          font-size:44px; 
          color:#cbd5e1; 
          margin-bottom:10px; 
        }

        /* Modal */
        .modal-backdrop{ 
          position:fixed; 
          inset:0; 
          background:rgba(0,0,0,.5); 
          display:flex; 
          align-items:center; 
          justify-content:center; 
          z-index:1050; 
          padding: 16px;
        }
        
        .modal-card{ 
          width:100%; 
          max-width:960px; 
          background:#fff; 
          border-radius:16px; 
          overflow:hidden; 
          box-shadow:0 24px 56px rgba(0,0,0,.2); 
        }
        
        .modal-head{ 
          background:linear-gradient(90deg, var(--orange), #ff8a3a); 
          color:#fff; 
          padding:14px 16px; 
          display:flex; 
          align-items:center; 
          justify-content:space-between; 
        }
        
        .btn-close-white{ 
          background:transparent; 
          border:none; 
          color:#fff; 
          font-size:20px; 
          cursor:pointer; 
        }
        
        .modal-body{ 
          padding:16px; 
        }
        
        .modal-header-row{ 
          display:flex; 
          align-items:center; 
          gap:14px; 
          margin-bottom:10px; 
          flex-wrap: wrap;
        }
        
        .modal-avatar{ 
          width:100px; 
          height:100px; 
          border-radius:50%; 
          overflow:hidden; 
          background:var(--orange); 
          box-shadow:0 10px 20px rgba(255,107,0,.25); 
          display:flex; 
          align-items:center; 
          justify-content:center; 
          flex-shrink: 0;
        }
        
        .modal-avatar img, .modal-avatar .placeholder{ 
          width:100%; 
          height:100%; 
          object-fit:cover; 
          color:#fff; 
          font-weight:800; 
          font-size:40px; 
          display:flex; 
          align-items:center; 
          justify-content:center; 
        }
        
        .modal-grid{ 
          display:grid; 
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
          gap:12px; 
        }
        
        .modal-footer{ 
          padding:12px 16px; 
          border-top:1px solid var(--line); 
          display:flex; 
          justify-content:flex-end; 
          gap:10px; 
          flex-wrap: wrap;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .hero-inner {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .cb-header {
            flex-direction: column;
            text-align: center;
          }
          
          .cb-avatar {
            margin: 0 auto;
          }
          
          .cb-meta {
            align-items: center;
          }
          
          .cb-pills {
            justify-content: center;
          }
          
          .doc-item {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .doc-item .btn-ghost-orange {
            margin-top: 10px;
            width: 100%;
            justify-content: center;
          }
          
          .info-grid, .modal-grid {
            grid-template-columns: 1fr;
          }
          
          .modal-header-row {
            flex-direction: column;
            text-align: center;
          }
          
          .modal-avatar {
            margin: 0 auto;
          }
          
          .modal-footer {
            justify-content: center;
          }
          
          .modal-footer .btn {
            width: 100%;
          }
          
          .empty .btn {
            width: 100%;
          }
          
          .content-pad, .section-head, .hero-inner {
            padding-left: 16px;
            padding-right: 16px;
          }
          
          .caregiver-block {
            padding: 16px;
          }
          
          .cb-avatar, .ring-avatar {
            width: 80px;
            height: 80px;
          }
          
          .cb-avatar img, .cb-avatar .placeholder {
            font-size: 32px;
          }
          
          .icon-dot {
            min-width: 30px;
            height: 30px;
          }
          
          .btn {
            padding: 0.5rem 0.8rem;
          }
          
          .btn-sm {
            padding: 0.4rem 0.6rem;
          }
          
          .pill {
            font-size: 0.75rem;
            padding: 0.3rem 0.6rem;
          }
          
          .chip {
            padding: 8px;
          }
          
          .doc-item {
            padding: 8px;
          }
        }
        
        @media (max-width: 480px) {
          .cb-avatar, .ring-avatar {
            width: 60px;
            height: 60px;
          }
          
          .cb-avatar img, .cb-avatar .placeholder {
            font-size: 24px;
          }
          
          .hero-title {
            font-size: 1.5rem;
          }
          
          .hero-sub {
            font-size: 0.85rem;
          }
          
          .empty {
            padding: 30px 16px;
          }
          
          .empty-icon {
            font-size: 36px;
          }
        }
      `}</style>
    </div>
  );
};

export default MyCaregiver;