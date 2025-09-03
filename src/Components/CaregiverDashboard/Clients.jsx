import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Clients = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Patient data array - you can move this to a separate file or fetch from API
  const patientsData = [
    {
      id: 1,
      name: "John Doe",
      condition: "Diabetes",
      contact: "+91 98765 43210",
      status: "active",
      statusClass: "healthcare-status-completed",
      statusIcon: "fas fa-check"
    },
    {
      id: 2,
      name: "Jane Smith",
      condition: "Hypertension",
      contact: "+91 98765 43210",
      status: "active",
      statusClass: "healthcare-status-completed",
      statusIcon: "fas fa-check"
    },
    {
      id: 3,
      name: "Mike Johnson",
      condition: "Diabetes",
      contact: "+91 98765 43210",
      status: "pending",
      statusClass: "healthcare-status-pending",
      statusIcon: "fas fa-clock"
    },
    {
      id: 4,
      name: "Sarah Wilson",
      condition: "Hypertension",
      contact: "+91 98765 43210",
      status: "pending",
      statusClass: "healthcare-status-pending",
      statusIcon: "fas fa-clock"
    },
    {
      id: 5,
      name: "Robert Brown",
      condition: "Asthma",
      contact: "+91 98765 43210",
      status: "pending",
      statusClass: "healthcare-status-pending",
      statusIcon: "fas fa-clock"
    }
  ];

  // Filter patients based on search query
  const filteredPatients = patientsData.filter(patient => {
    const query = searchQuery.toLowerCase();
    return (
      patient.name.toLowerCase().includes(query) ||
      patient.condition.toLowerCase().includes(query) ||
      patient.contact.toLowerCase().includes(query)
    );
  });

  // Patient Card Component
  const PatientCard = ({ patient }) => {
    return (
      <div className="col-md-6 col-lg-4 p-3">
        <div className="card healthcare-task-card h-100">
          <div className="card-body">
            <div className="healthcare-patient-header mb-3">
              <div className="d-flex justify-content-between align-items-start">
                <h5 className="card-title mb-1 fw-bold">{patient.name}</h5>
              </div>
            </div>
            <div className="mb-3">
              <p className="card-text mb-3">
                <i
                  className="fas fa-stethoscope me-2"
                  style={{ color: "#f9591a" }}
                />
                <strong>Primary Condition:</strong> {patient.condition}
              </p>
              <p className="card-text mb-2">
                <i
                  className="fas fa-map-marker-alt me-2"
                  style={{ color: "#f9591a" }}
                />
                <strong>Contact:</strong>
                <small className="text-muted"> {patient.contact}</small>
              </p>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className={patient.statusClass}>
                <i className={patient.statusIcon + " me-1"} />
                {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
              </span>
              <button 
                className="btn btn-sm healthcare-btn-primary" 
                onClick={() => navigate(`/caregiver/clients/profile`)}
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Main Content */}
      <main className="col-md-9 col-lg-12 med-main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold">My Clients</h3>
          <button
            className="btn med-btn-primary healthcare-btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#newPatientModal"
          >
            <i className="fas fa-plus me-1"></i> New Patient
          </button>
        </div>

        {/* New Patient Modal */}
        <div
          className="modal fade"
          id="newPatientModal"
          tabIndex={-1}
          aria-labelledby="newPatientModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content med-modal-content">
              <div className="modal-header med-modal-header">
                <h5
                  className="modal-title med-modal-title"
                  id="newPatientModalLabel"
                >
                  <i className="fas fa-user-plus me-2" />
                  Add New Patient
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body med-modal-body">
                <form>
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <h5 className="mb-3">
                        <i className="fas fa-user-circle me-2" />
                        Personal Information
                      </h5>
                      <div className="mb-3">
                        <label
                          htmlFor="patientName"
                          className="form-label med-form-label med-required-field"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="form-control med-form-control"
                          id="patientName"
                          placeholder="First and Last Name"
                        />
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label
                            htmlFor="patientDob"
                            className="form-label med-form-label med-required-field"
                          >
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            className="form-control med-form-control"
                            id="patientDob"
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label
                            htmlFor="patientGender"
                            className="form-label med-form-label med-required-field"
                          >
                            Gender
                          </label>
                          <select
                            className="form-select med-form-select"
                            id="patientGender"
                          >
                            <option selected disabled>
                              Select Gender
                            </option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="unknown">Prefer not to say</option>
                          </select>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="patientCondition"
                          className="form-label med-form-label med-required-field"
                        >
                          Primary Condition
                        </label>
                        <input
                          type="text"
                          className="form-control med-form-control"
                          id="patientCondition"
                          placeholder="e.g., Hypertension, Diabetes"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h5 className="mb-3">
                        <i className="fas fa-address-card me-2" />
                        Contact Information
                      </h5>
                      <div className="mb-3">
                        <label
                          htmlFor="patientEmail"
                          className="form-label med-form-label"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="form-control med-form-control"
                          id="patientEmail"
                          placeholder="patient@example.com"
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="patientPhone"
                          className="form-label med-form-label med-required-field"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="form-control med-form-control"
                          id="patientPhone"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="patientAddress"
                          className="form-label med-form-label"
                        >
                          Address
                        </label>
                        <textarea
                          className="form-control med-form-control"
                          id="patientAddress"
                          rows={2}
                          placeholder="Street, City, State, ZIP"
                          defaultValue={""}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <h5 className="mb-3">
                        <i className="fas fa-stethoscope me-2" />
                        Medical Information
                      </h5>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label
                            htmlFor="patientBloodType"
                            className="form-label med-form-label"
                          >
                            Blood Type
                          </label>
                          <select
                            className="form-select med-form-select"
                            id="patientBloodType"
                          >
                            <option selected disabled>
                              Select Blood Type
                            </option>
                            <option value="a+">A+</option>
                            <option value="a-">A-</option>
                            <option value="b+">B+</option>
                            <option value="b-">B-</option>
                            <option value="ab+">AB+</option>
                            <option value="ab-">AB-</option>
                            <option value="o+">O+</option>
                            <option value="o-">O-</option>
                            <option value="unknown">Unknown</option>
                          </select>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label
                            htmlFor="patientAllergies"
                            className="form-label med-form-label"
                          >
                            Allergies
                          </label>
                          <input
                            type="text"
                            className="form-control med-form-control"
                            id="patientAllergies"
                            placeholder="List any known allergies"
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="patientNotes"
                          className="form-label med-form-label"
                        >
                          Additional Notes
                        </label>
                        <textarea
                          className="form-control med-form-control"
                          id="patientNotes"
                          rows={3}
                          placeholder="Any additional information about the patient"
                          defaultValue={""}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer med-modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-dark"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="button" className="btn med-btn-primary">
                  Add Patient
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="med-card">
          <div className="med-card-header d-flex justify-content-between align-items-center">
            <h6>Assigned Patients</h6>
            <span className="badge bg-secondary">{filteredPatients.length} patients</span>
          </div>
          <div className="med-card-body">
            <div className="med-search-container">
              <i className="fas fa-search med-search-icon" />
              <input
                type="text"
                className="form-control med-search-input"
                placeholder="Search Patients"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: "50px",
                  fontSize: "16px",
                }}
              />
            </div>
            <div className="card-body p-0">
              {filteredPatients.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-search fa-3x mb-3 text-muted"></i>
                  <p className="text-muted">No patients found matching your search.</p>
                </div>
              ) : (
                <div className="row g-0">
                  {filteredPatients.map(patient => (
                    <PatientCard key={patient.id} patient={patient} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Clients;