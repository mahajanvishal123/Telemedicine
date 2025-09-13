import React from "react";

const Visitlog = () => {
  return (
    <>
      <div className="visit-container">
        <div className="visit-header">
          <h1 className="dashboard-heading">Visit Log</h1>
          <p className="visit-subtitle">
            Record patient visit details and measurements
          </p>
        </div>
        <div className="visit-card">
          <div className="visit-card-header" >
            <h4>
              <i className="fas fa-clipboard-list me-2" style={{ color: "var(--primary-accent)" }} />
              Log Visit
            </h4>
          </div>
          <div className="visit-card-body">
            <form>
              {/* Client Selection */}
              <div className="visit-input-group">
                <label
                  htmlFor="visitClient"
                  className="visit-form-label visit-required-field"
                >
                  Select Client
                </label>
                <select
                  className="visit-form-select"
                  id="visitClient"
                  required=""
                >
                  <option value="" selected="" disabled="">
                    Choose a client
                  </option>
                  <option value={1}>Sarah Johnson (Hypertension)</option>
                  <option value={2}>Michael Chen (Type 2 Diabetes)</option>
                  <option value={3}>Emma Rodriguez (Asthma)</option>
                  <option value={4}>David Wilson (Arthritis)</option>
                  <option value={5}>James Miller (High Cholesterol)</option>
                </select>
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
                        placeholder="e.g., 120/80 mmHg"
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
                        placeholder="e.g., 98.6°F"
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
                  rows={5}
                  placeholder="Record observations, symptoms, treatments, or other relevant information about this visit..."
                  defaultValue={""}
                />
              </div>
              <div className="visit-divider" />
              {/* Task Completion */}
              <div className="visit-checkbox-container">
                <input
                  type="checkbox"
                  className="visit-checkbox"
                  id="visitTaskCompleted"
                />
                <label
                  htmlFor="visitTaskCompleted"
                  className="visit-checkbox-label"
                >
                  Task Completed
                </label>
              </div>
              {/* Submit Button */}
              <button type="submit" className="visit-btn-primary">
                <i className="fas fa-paper-plane me-2" />
                Submit Log
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Visitlog;
