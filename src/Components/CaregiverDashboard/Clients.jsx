import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../../Baseurl/Baseurl"; // Adjust path if needed

const Clients = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientsData, setPatientsData] = useState([]);

  // Fetch patients assigned to logged-in caregiver
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user._id) {
          throw new Error("No caregiver found. Please login again.");
        }

        const caregiverId = user._id;

        const response = await axios.get(
          `${API_URL}/patient?caregiverId=${caregiverId}`
        );

        let patients = [];

        if (Array.isArray(response.data)) {
          patients = response.data;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          patients = response.data.data;
        } else {
          throw new Error("Unexpected response format from server.");
        }

        // ✅ Map API data to match your existing UI structure
        const transformedPatients = patients.map((patient) => ({
          id: patient._id,
          name: patient.name || "Unknown",
          condition: patient.condition || "Not specified",
          contact: patient.phone || "N/A",
          status: "active", // You can adjust based on logic if needed
          statusClass: "healthcare-status-completed",
          statusIcon: "fas fa-check",
          dob: patient.dob || "N/A",
          gender: patient.gender || "N/A",
          email: patient.email || "N/A",
          address: patient.address || "N/A",
          bloodType: patient.bloodGroup || "N/A",
          allergies: "N/A", // Not in API, so placeholder
          notes: patient.notes || "No additional notes.",
        }));

        setPatientsData(transformedPatients);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError(err.message || "Failed to load patients. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter patients based on search query
  const filteredPatients = patientsData.filter((patient) => {
    const query = searchQuery.toLowerCase();
    return (
      patient.name.toLowerCase().includes(query) ||
      patient.condition.toLowerCase().includes(query) ||
      patient.contact.toLowerCase().includes(query)
    );
  });

  // Patient Card Component (unchanged)
  const PatientCard = ({ patient }) => {
    return (
      <div className="col-12 col-sm-6 col-lg-4 p-3">
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
                <i className="bi bi-telephone me-2" style={{ color: "#f9591a" }}></i>
                <strong>Contact:</strong>
                <small className="text-muted"> {patient.contact}</small>
              </p>
            </div>

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <span className={patient.statusClass}>
                <i className={patient.statusIcon + " me-1"} />
                {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
              </span>
              <button
                className="btn btn-sm text-white healthcare-btn-primary"
                onClick={() => {
                  setSelectedPatient(patient);
                  setShowProfileModal(true);
                }}
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Patient Profile Modal Component (unchanged)
  const PatientProfileModal = ({ patient, onClose }) => {
    if (!patient) return null;

    return (
      <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content med-modal-content">
            <div className="modal-header med-modal-header">
              <div className="d-flex align-items-center">
                <h5 className="modal-title med-modal-title">
                  {patient.name}'s Profile
                </h5>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              />
            </div>
            <div className="modal-body med-modal-body">
              <div className="row">
                <div className="col-md-6">
                  <h5 className="mb-3">
                    <i className="fas fa-user-circle me-2" />
                    Personal Information
                  </h5>
                  <div className="mb-3">
                    <label className="form-label med-form-label">
                      <strong>Full Name:</strong>
                    </label>
                    <p className="form-control-plaintext">{patient.name}</p>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label med-form-label">
                        <strong>Date of Birth:</strong>
                      </label>
                      <p className="form-control-plaintext">{patient.dob || "N/A"}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label med-form-label">
                        <strong>Gender:</strong>
                      </label>
                      <p className="form-control-plaintext">{patient.gender || "N/A"}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label med-form-label">
                      <strong>Primary Condition:</strong>
                    </label>
                    <p className="form-control-plaintext">{patient.condition}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <h5 className="mb-3">
                    <i className="fas fa-address-card me-2" />
                    Contact Information
                  </h5>
                  <div className="mb-3">
                    <label className="form-label med-form-label">
                      <strong>Email Address:</strong>
                    </label>
                    <p className="form-control-plaintext">{patient.email || "N/A"}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label med-form-label">
                      <strong>Phone Number:</strong>
                    </label>
                    <p className="form-control-plaintext">{patient.contact}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label med-form-label">
                      <strong>Address:</strong>
                    </label>
                    <p className="form-control-plaintext">{patient.address || "N/A"}</p>
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
                      <label className="form-label med-form-label">
                        <strong>Blood Type:</strong>
                      </label>
                      <p className="form-control-plaintext">{patient.bloodType || "N/A"}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label med-form-label">
                        <strong>Allergies:</strong>
                      </label>
                      <p className="form-control-plaintext">{patient.allergies || "None"}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label med-form-label">
                      <strong>Additional Notes:</strong>
                    </label>
                    <p className="form-control-plaintext">{patient.notes || "No additional notes."}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label med-form-label">
                      <strong>Status:</strong>
                    </label>
                    <span className={patient.statusClass}>
                      <i className={patient.statusIcon + " me-1"} />
                      {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer med-modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                <i className="fas fa-arrow-left me-1"></i> Back to List
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
      <div className="col-md-9 col-lg-12 med-main-content">
        <div className="d-flex flex-column flex-md-row justify-content-between mb-4">
          <h3 className="dashboard-heading mb-3 mb-md-0">My Patients</h3>
        </div>

        {/* New Patient Modal (unchanged, hidden by default) */}
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
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="button" className="btn" style={{ backgroundColor: "#f9591a", color: "white" }}>
                  Add Patient
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Patient List Card */}
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

            {/* Loading State */}
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading your patients...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="alert alert-danger text-center" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            {/* No Results or Patient List */}
            {!loading && !error && (
              <div className="">
                {filteredPatients.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-search fa-3x mb-3 text-muted"></i>
                    <p className="text-muted">No patients found matching your search.</p>
                  </div>
                ) : (
                  <div className="row g-0">
                    {filteredPatients.map((patient) => (
                      <PatientCard key={patient.id} patient={patient} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Patient Profile Modal */}
        {showProfileModal && (
          <PatientProfileModal
            patient={selectedPatient}
            onClose={() => setShowProfileModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default Clients;