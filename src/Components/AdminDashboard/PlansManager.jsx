import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Swal from 'sweetalert2';

// --- Minimal seed data (no API) ---
const DEFAULT_PLANS = [
  {
    id: "pay",
    title: "Pay Per Visit",
    subtitle: "Perfect for occasional care needs",
    price: 29,
    period: "per consultation",
    popular: false,
    features: [
      "Direct access to verified doctors",
      "Transparent pricing upfront",
      "E-prescriptions and lab orders",
    ],
  },
  {
    id: "care",
    title: "Care Membership",
    subtitle: "For ongoing health management",
    price: 99,
    period: "per month",
    popular: true,
    features: [
      "Everything in Pay Per Visit",
      "Unlimited consultations",
      "Priority booking",
    ],
  },
  {
    id: "family",
    title: "Family Plan",
    subtitle: "Complete care for your whole family",
    price: 179,
    period: "per month",
    popular: false,
    features: [
      "Everything in Care Membership",
      "Up to 6 family members",
      "Pediatric and elderly care",
    ],
  },
];

// --- Clean portal modal ---
function PortalModal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onEsc);
    };
  }, [open, onClose]);

  if (!open) return null;
  return ReactDOM.createPortal(
    <div
      onMouseDown={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="card shadow-sm"
        style={{ 
          width: "min(800px, 95vw)", 
          maxHeight: "90vh", 
          overflow: "hidden",
          borderRadius: "8px",
          border: "1px solid #e9ecef",
        }}
      >
        <div className="card-header d-flex justify-content-between align-items-center py-3 bg-white border-bottom">
          <h5 className="mb-0 fw-semibold">{title}</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>
        <div className="card-body p-4" style={{ overflow: "auto", maxHeight: "65vh" }}>
          {children}
        </div>
        {footer && <div className="card-footer d-flex justify-content-end gap-2 bg-light py-3">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

// --- Well-designed table page ---
export default function PlansManagerSimpleTable() {
  const [plans, setPlans] = useState(DEFAULT_PLANS);
  const [editing, setEditing] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  
  // State for new plan
  const [newPlan, setNewPlan] = useState({
    id: "",
    title: "",
    subtitle: "",
    price: 0,
    period: "",
    popular: false,
    features: []
  });

  // small style to keep subtitle width tidy
  useEffect(() => {
    const id = "simple-plans-table-style";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.innerHTML = `
      .w-subtitle { max-width: 520px; }
      @media (max-width: 1200px){ .w-subtitle { max-width: 360px; } }
      
      /* Professional table styles */
      .modern-table {
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      }
      
      .modern-table thead th {
        background-color: #f8f9fa;
        border: none;
        font-weight: 600;
        color: #495057;
        padding: 16px;
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .modern-table tbody tr {
        border-bottom: 1px solid #f1f3f5;
        transition: background-color 0.15s ease-in-out;
      }
      
      .modern-table tbody tr:last-child {
        border-bottom: none;
      }
      
      .modern-table tbody tr:hover {
        background-color: #f8f9fa;
      }
      
      .modern-table tbody td {
        padding: 16px;
        vertical-align: middle;
      }
      
      .popular-badge {
        background-color: #FF3500;
        color: white;
        font-size: 0.75rem;
        padding: 4px 10px;
        border-radius: 12px;
        font-weight: 500;
        display: inline-block;
      }
      
      .feature-item {
        background-color: #f8f9fa;
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 8px;
        border-left: 3px solid #FF3500;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .btn-action {
        padding: 6px 12px;
        font-size: 0.875rem;
        border-radius: 6px;
        font-weight: 500;
        transition: all 0.2s;
      }
      
      .btn-action:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .form-control:focus {
        border-color: #FF3500;
        box-shadow: 0 0 0 0.2rem rgba(255, 53, 0, 0.25);
      }
      
      .empty-state {
        padding: 40px 20px;
        text-align: center;
      }
      
      .empty-state i {
        font-size: 3rem;
        color: #dee2e6;
        margin-bottom: 1rem;
      }
      
      .page-title {
        font-size: 1.75rem;
        font-weight: 600;
        color: #212529;
        margin-bottom: 0.5rem;
      }
      
      .page-subtitle {
        color: #6c757d;
        font-size: 1rem;
      }
      
      .form-switch .form-check-input {
        width: 3rem;
        height: 1.5rem;
      }
      
      .action-buttons {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const openEdit = (plan) => {
    setEditing(JSON.parse(JSON.stringify(plan))); // clone
    setNewFeature("");
    setShowEditModal(true);
  };
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditing(null);
    setNewFeature("");
  };

  const openAddModal = () => {
    setNewPlan({
      id: "",
      title: "",
      subtitle: "",
      price: 0,
      period: "",
      popular: false,
      features: []
    });
    setNewFeature("");
    setShowAddModal(true);
  };
  const closeAddModal = () => {
    setShowAddModal(false);
    setNewPlan({
      id: "",
      title: "",
      subtitle: "",
      price: 0,
      period: "",
      popular: false,
      features: []
    });
    setNewFeature("");
  };

  // Simple toggle for popular status - no restrictions
  const togglePopularInTable = (id) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, popular: !p.popular } : p))
    );
  };

  const saveEdit = () => {
    // Show loading SweetAlert
    Swal.fire({
      title: 'Updating Plan',
      text: 'Please wait while we update the plan...',
      icon: 'info',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    // Simulate API call delay
    setTimeout(() => {
      setPlans((prev) =>
        prev.map((p) => (p.id === editing.id ? editing : p))
      );
      closeEditModal();
      
      // Show success SweetAlert
      Swal.fire({
        title: 'Success!',
        text: 'Plan has been updated successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }, 1000);
  };

  const addNewPlan = () => {
    // Validate required fields
    if (!newPlan.title.trim() || !newPlan.subtitle.trim() || !newPlan.period.trim()) {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill in all required fields',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Show loading SweetAlert
    Swal.fire({
      title: 'Adding Plan',
      text: 'Please wait while we add the new plan...',
      icon: 'info',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate a simple ID if not provided
      const planId = newPlan.id || `plan-${Date.now()}`;
      
      // Add the new plan without affecting others
      setPlans([...plans, { ...newPlan, id: planId }]);
      closeAddModal();
      
      // Show success SweetAlert
      Swal.fire({
        title: 'Success!',
        text: 'New plan has been added successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }, 1000);
  };

  const deletePlan = (planId, planTitle) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${planTitle}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF3500',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading SweetAlert
        Swal.fire({
          title: 'Deleting Plan',
          text: 'Please wait while we delete the plan...',
          icon: 'info',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        // Simulate API call delay
        setTimeout(() => {
          setPlans((prev) => prev.filter((p) => p.id !== planId));
          
          // Show success SweetAlert
          Swal.fire({
            title: 'Deleted!',
            text: 'Plan has been deleted successfully',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        }, 1000);
      }
    });
  };

  const addFeatureToEdit = () => {
    const v = newFeature.trim();
    if (!v) return;
    setEditing((e) => ({ ...e, features: [...(e.features || []), v] }));
    setNewFeature("");
  };

  const removeFeatureFromEdit = (i) =>
    setEditing((e) => ({ ...e, features: e.features.filter((_, idx) => idx !== i) }));

  const addFeatureToNew = () => {
    const v = newFeature.trim();
    if (!v) return;
    setNewPlan((p) => ({ ...p, features: [...(p.features || []), v] }));
    setNewFeature("");
  };

  const removeFeatureFromNew = (i) =>
    setNewPlan((p) => ({ ...p, features: p.features.filter((_, idx) => idx !== i) }));

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="page-title">Plans Management</h1>
          <p className="page-subtitle">Manage your subscription plans and features</p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={openAddModal}
          >
            <i className="fas fa-plus"></i>
            Add Plan
          </button>
          <button 
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={() => setPlans(DEFAULT_PLANS)}
          >
            <i className="fas fa-redo"></i>
            Reset Plans
          </button>
        </div>
      </div>

      <div className="modern-table bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th style={{ width: 140 }}>Popular</th>
                <th style={{ width: 240 }}>Plan</th>
                <th>Subtitle</th>
                <th style={{ width: 120, textAlign: "right" }}>Price ($)</th>
                <th style={{ width: 160 }}>Period</th>
                <th style={{ width: 160, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {plans.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="form-check form-switch d-flex align-items-center">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={p.popular}
                        onChange={() => togglePopularInTable(p.id)}
                        id={`popular-${p.id}`}
                      />
                      <label className="form-check-label ms-2" htmlFor={`popular-${p.id}`}>
                        {p.popular ? <span className="popular-badge">Popular</span> : <span className="text-muted">Not Popular</span>}
                      </label>
                    </div>
                  </td>

                  <td className="fw-semibold">{p.title}</td>

                  <td className="text-muted w-subtitle">{p.subtitle}</td>

                  <td style={{ textAlign: "right", fontWeight: 600 }}>${p.price}</td>

                  <td>{p.period}</td>

                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-primary btn-action"
                        onClick={() => openEdit(p)}
                        title="Update Plan"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn btn-danger btn-action"
                        onClick={() => deletePlan(p.id, p.title)}
                        title="Delete Plan"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {plans.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-state">
                    <i className="fas fa-inbox"></i>
                    <h5 className="text-muted">No plans found</h5>
                    <p className="text-muted">Add plans to get started</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Plan Modal */}
      <PortalModal
        open={showEditModal && !!editing}
        onClose={closeEditModal}
        title="Update Plan"
        footer={
          <>
            <button className="btn btn-outline-secondary" onClick={closeEditModal}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={saveEdit}>
              Save Changes
            </button>
          </>
        }
      >
        {editing && (
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Title</label>
              <input
                className="form-control"
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                placeholder="Enter plan title"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Subtitle</label>
              <input
                className="form-control"
                value={editing.subtitle}
                onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })}
                placeholder="Enter plan subtitle"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Price ($)</label>
              <input
                type="number"
                className="form-control"
                value={editing.price}
                onChange={(e) => setEditing({ ...editing, price: Number(e.target.value || 0) })}
                placeholder="0"
              />
            </div>
            <div className="col-md-8">
              <label className="form-label fw-semibold">Period</label>
              <input
                className="form-control"
                value={editing.period}
                onChange={(e) => setEditing({ ...editing, period: e.target.value })}
                placeholder="per consultation / per month"
              />
            </div>

            <div className="col-12">
              <div className="form-check form-switch">
                <input
                  id="popularToggle"
                  type="checkbox"
                  className="form-check-input"
                  checked={!!editing.popular}
                  onChange={(e) => setEditing({ ...editing, popular: e.target.checked })}
                />
                <label htmlFor="popularToggle" className="form-check-label fw-semibold ms-2">
                  Mark as Popular
                </label>
              </div>
            </div>

            {/* Features editor */}
            <div className="col-12">
              <label className="form-label fw-semibold">Features</label>

              {(!editing.features || editing.features.length === 0) && (
                <div className="text-center py-4 mb-3 bg-light rounded">
                  <i className="fas fa-list fa-lg text-muted mb-2"></i>
                  <p className="text-muted mb-0">No features yet</p>
                </div>
              )}

              <div className="mb-3">
                {(editing.features || []).map((feat, i) => (
                  <div key={i} className="feature-item">
                    <span>{feat}</span>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeFeatureFromEdit(i)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>

              <div className="input-group">
                <input
                  className="form-control"
                  placeholder="Add a feature"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addFeatureToEdit()}
                />
                <button 
                  className="btn btn-outline-primary"
                  onClick={addFeatureToEdit}
                >
                  <i className="fas fa-plus me-1"></i>
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </PortalModal>

      {/* Add Plan Modal */}
      <PortalModal
        open={showAddModal}
        onClose={closeAddModal}
        title="Add New Plan"
        footer={
          <>
            <button className="btn btn-outline-secondary" onClick={closeAddModal}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={addNewPlan}>
              Add Plan
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Plan ID <span className="text-danger">*</span></label>
            <input
              className="form-control"
              value={newPlan.id}
              onChange={(e) => setNewPlan({ ...newPlan, id: e.target.value })}
              placeholder="Enter unique plan ID"
            />
            <small className="text-muted">Leave empty to auto-generate</small>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Title <span className="text-danger">*</span></label>
            <input
              className="form-control"
              value={newPlan.title}
              onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
              placeholder="Enter plan title"
            />
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold">Subtitle <span className="text-danger">*</span></label>
            <input
              className="form-control"
              value={newPlan.subtitle}
              onChange={(e) => setNewPlan({ ...newPlan, subtitle: e.target.value })}
              placeholder="Enter plan subtitle"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">Price ($) <span className="text-danger">*</span></label>
            <input
              type="number"
              className="form-control"
              value={newPlan.price}
              onChange={(e) => setNewPlan({ ...newPlan, price: Number(e.target.value || 0) })}
              placeholder="0"
            />
          </div>
          <div className="col-md-8">
            <label className="form-label fw-semibold">Period <span className="text-danger">*</span></label>
            <input
              className="form-control"
              value={newPlan.period}
              onChange={(e) => setNewPlan({ ...newPlan, period: e.target.value })}
              placeholder="per consultation / per month"
            />
          </div>

          <div className="col-12">
            <div className="form-check form-switch">
              <input
                id="newPopularToggle"
                type="checkbox"
                className="form-check-input"
                checked={!!newPlan.popular}
                onChange={(e) => setNewPlan({ ...newPlan, popular: e.target.checked })}
              />
              <label htmlFor="newPopularToggle" className="form-check-label fw-semibold ms-2">
                Mark as Popular
              </label>
            </div>
          </div>

          {/* Features editor */}
          <div className="col-12">
            <label className="form-label fw-semibold">Features</label>

            {(!newPlan.features || newPlan.features.length === 0) && (
              <div className="text-center py-4 mb-3 bg-light rounded">
                <i className="fas fa-list fa-lg text-muted mb-2"></i>
                <p className="text-muted mb-0">No features yet</p>
              </div>
            )}

            <div className="mb-3">
              {(newPlan.features || []).map((feat, i) => (
                <div key={i} className="feature-item">
                  <span>{feat}</span>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeFeatureFromNew(i)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>

            <div className="input-group">
              <input
                className="form-control"
                placeholder="Add a feature"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addFeatureToNew()}
              />
              <button 
                className="btn btn-outline-primary"
                onClick={addFeatureToNew}
              >
                <i className="fas fa-plus me-1"></i>
                Add
              </button>
            </div>
          </div>
        </div>
      </PortalModal>
    </div>
  );
}