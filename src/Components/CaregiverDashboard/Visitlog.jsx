import React, { useState, useEffect } from "react";
import axios from "axios";

import API_URL from "../../Baseurl/Baseurl"; // Adjust path if needed
import "./Caregiver.css";

const Visitlog = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [formData, setFormData] = useState({
    bloodPressure: "",
    temperature: "",
    notes: "",
    taskCompleted: false,
  });

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

        let patientsData = [];

        if (Array.isArray(response.data)) {
          patientsData = response.data;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          patientsData = response.data.data;
        } else {
          throw new Error("Unexpected response format from server.");
        }

        setPatients(patientsData);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError(err.message || "Unable to load patients. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handlePatientChange = (e) => {
    setSelectedPatient(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!selectedPatient) {
        throw new Error("Please select a patient.");
      }
      if (!formData.bloodPressure.trim()) {
        throw new Error("Blood Pressure is required.");
      }
      if (!formData.temperature.trim()) {
        throw new Error("Temperature is required.");
      }

      // Get caregiver ID
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user._id) {
        throw new Error("Caregiver not found. Please login again.");
      }

      const caregiverId = user._id;

      // Prepare payload
      const payload = {
        patientId: selectedPatient,
        caregiverId: caregiverId,
        bloodPressure: formData.bloodPressure,
        temperature: formData.temperature,
        notes: formData.notes,
        taskCompleted: formData.taskCompleted,
      };

      // API call
      const response = await axios.post(`${API_URL}/visitlog`, payload);

      if (response.data.status === true) {
        // ✅ Show Sweet Success Alert
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Visit log submitted successfully!',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });

        // Reset form
        setFormData({
          bloodPressure: "",
          temperature: "",
          notes: "",
          taskCompleted: false,
        });
        setSelectedPatient("");
      } else {
        throw new Error(response.data.message || "Failed to submit visit log.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      // ❌ Show Sweet Error Alert
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Error: " + (err.response?.data?.message || err.message),
        confirmButtonText: 'Try Again',
        customClass: {
          confirmButton: 'btn btn-danger'
        }
      });
    }
  };

  return (
    <>
      <div className="visit-container">
        <div className="visit-header">
          <h1 className="dashboard-heading">Add Visit Log</h1>
          <p className="visit-subtitle">
            Record patient visit details and measurements
          </p>
        </div>
        <div className="visit-card">
          <div className="visit-card-header">
            <h4>
              <i
                className="fas fa-clipboard-list me-2"
                style={{ color: "var(--primary-accent)" }}
              />
              Log Visit
            </h4>
          </div>
          <div className="visit-card-body">
            <form onSubmit={handleSubmit}>
              {/* Client Selection */}
              <div className="visit-input-group">
                <label
                  htmlFor="visitClient"
                  className="visit-form-label visit-required-field"
                >
                  Select Patient
                </label>
                {loading ? (
                  <select className="visit-form-select" disabled>
                    <option>Loading patients...</option>
                  </select>
                ) : error ? (
                  <div className="alert alert-danger p-2">{error}</div>
                ) : (
                  <select
                    className="visit-form-select"
                    id="visitClient"
                    value={selectedPatient}
                    onChange={handlePatientChange}
                    required
                  >
                    <option value="">-- Choose a patient --</option>
                    {patients.map((patient) => (
                      <option key={patient._id} value={patient._id}>
                        {patient.name} {patient.condition ? `(${patient.condition})` : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="visit-divider" />

              {/* Vital Signs */}
              <h4 className="mb-4">
                <i
                  className="fas fa-heartbeat me-2"
                  style={{ color: "var(--primary-accent)" }}
                />
                Vital Signs
              </h4>
              <div className="row">
                <div className="col-md-6">
                  <div className="visit-input-group">
                    <label htmlFor="visitBp" className="visit-form-label">
                      Blood Pressure
                    </label>
                    <div className="position-relative">
                      <i className="visit-input-icon fas fa-tint" />
                      <input
                        type="text"
                        className="visit-form-control visit-input-with-icon"
                        id="visitBp"
                        name="bloodPressure"
                        value={formData.bloodPressure}
                        onChange={handleInputChange}
                        placeholder="e.g., 120/80 mmHg"
                        required
                      />
                    </div>
                    <div className="visit-form-note mt-3">
                      Enter as systolic/diastolic (e.g., 120/80)
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="visit-input-group">
                    <label htmlFor="visitTemp" className="visit-form-label">
                      Temperature
                    </label>
                    <div className="position-relative">
                      <i className="visit-input-icon fas fa-thermometer-half" />
                      <input
                        type="text"
                        className="visit-form-control visit-input-with-icon"
                        id="visitTemp"
                        name="temperature"
                        value={formData.temperature}
                        onChange={handleInputChange}
                        placeholder="e.g., 98.6°F"
                        required
                      />
                    </div>
                    <div className="visit-form-note mt-3">
                      Enter in Fahrenheit or Celsius
                    </div>
                  </div>
                </div>
              </div>

              <div className="visit-divider" />

              {/* Notes */}
              <div className="visit-input-group">
                <label htmlFor="visitNotes" className="visit-form-label">
                  Visit Notes
                </label>
                <textarea
                  className="visit-form-control"
                  id="visitNotes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Record observations, symptoms, treatments, or other relevant information about this visit..."
                  required
                />
              </div>

              <div className="visit-divider" />

              {/* Task Completion */}
              <div className="visit-checkbox-container">
                <input
                  type="checkbox"
                  className="visit-checkbox"
                  id="visitTaskCompleted"
                  name="taskCompleted"
                  checked={formData.taskCompleted}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="visitTaskCompleted"
                  className="visit-checkbox-label"
                >
                  Task Completed
                </label>
              </div>

              {/* Submit Button */}
              <button type="submit" className="visit-btn-primary mt-4">
                <i className="fas fa-paper-plane me-2" />
                Submit Log
              </button>

              {/* ❗ Removed old status divs — handled by SweetAlert now */}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Visitlog;