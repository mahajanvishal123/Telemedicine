import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Form, Modal, Spinner } from "react-bootstrap";
import { FaUserMd, FaStar, FaCheckCircle, FaCalendarAlt, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import "./BookAppointment.css";
import Base_Url from "../../../Baseurl/Baseurl";
import axios from "axios";

const steps = [
  { label: "Select Specialty", icon: <FaUserMd /> },
  { label: "Choose Doctor", icon: <FaUserMd /> },
  { label: "Select Date & Time", icon: <FaCalendarAlt /> },
  { label: "Confirm & Pay", icon: <FaCheckCircle /> },
];

export default function BookAppointment() {
  const [step, setStep] = useState(0);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slots, setSlots] = useState({});
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);

  // ✅ FETCH SPECIALTIES — STEP 1
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await axios.get(`${Base_Url}/doctor/specialist`);
        const apiData = response.data;

        const transformed = apiData.map(item => {
          let name = item.specialty
            .replace("logist", "logy")
            .replace("Neurologists", "Neurology")
            .replace("Gastroenterologist", "Gastroenterology")
            .replace("Nephrologist", "Nephrology")
            .replace("Rheumatologist", "Rheumatology")
            .replace("Pulmonologist", "Pulmonology")
            .replace("Oncologist", "Oncology");

          return {
            name,
            count: item.doctorCount,
          };
        });

        setSpecialties(transformed);
      } catch (err) {
        console.error("Failed to fetch specialties:", err);
        setError("Failed to load specialties.");
      } finally {
        setLoadingSpecialties(false);
      }
    };

    fetchSpecialties();
  }, []);

  // ✅ FETCH DOCTORS — STEP 2
  useEffect(() => {
    if (!selectedSpecialty || step !== 1) return;

    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      setError(null);

      try {
        let apiSpecialty = selectedSpecialty
          .replace("logy", "logist")
          .replace("Neurology", "Neurologist")
          .replace("Gastroenterology", "Gastroenterologist")
          .replace("Nephrology", "Nephrologist")
          .replace("Rheumatology", "Rheumatologist")
          .replace("Pulmonology", "Pulmonologist")
          .replace("Oncology", "Oncologist");

        const response = await axios.get(`${Base_Url}/doctor/specialist/doctordata/${apiSpecialty}`);

        const { doctors: apiDoctors } = response.data;

        const transformedDoctors = apiDoctors.map(doc => ({
          _id: doc._id,
          name: doc.name,
          profile: doc.profile,
          experience: doc.experience,
          openingTime: doc.openingTime,
          closingTime: doc.closingTime,
          gender: doc.gender,
          licenseNo: doc.licenseNo,
          specialty: doc.specialty,
          fee: doc.fee,
        }));

        setDoctors(transformedDoctors);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setError("Failed to load doctors. Please try again.");
        setDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [selectedSpecialty, step]);

  // ✅ FETCH SLOTS — STEP 3
  useEffect(() => {
    if (step !== 2 || !selectedDoctor?._id) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setError(null);

      try {
        const response = await axios.get(`${Base_Url}/slot`, {
          params: { doctorId: selectedDoctor._id }
        });

        const availableSlots = response.data.filter(slot => !slot.isBooked);

        const grouped = availableSlots.reduce((acc, slot) => {
          const dateStr = new Date(slot.date).toDateString();
          if (!acc[dateStr]) acc[dateStr] = [];
          acc[dateStr].push(slot);
          return acc;
        }, {});

        setSlots(grouped);
      } catch (err) {
        console.error("Failed to fetch slots:", err);
        setError("Failed to load available slots.");
        setSlots({});
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [step, selectedDoctor]);

  const filteredSpecialties = specialties.filter(spec =>
    spec.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  function handleNext() {
    if (step === steps.length - 1) {
      if (!selectedDoctor || !selectedSlot) {
        alert("Please select a doctor and time slot before proceeding.");
        return;
      }
      setShowPaymentModal(true);
      return;
    }
    if (step < steps.length - 1) setStep(step + 1);
  }

  // ✅ REAL PAYMENT INTEGRATION — NO MOCK, NO TIMEOUT, NO FAKE DATA
  const handlePayment = async () => {
    if (!selectedDoctor || !selectedSlot) {
      alert("Missing appointment data. Please restart booking.");
      return;
    }

    setPaymentProcessing(true);

    try {
      const patientId = localStorage.getItem("patientId");
      if (!patientId) {
        throw new Error("Patient ID not found. Please log in.");
      }

      // 🚀 STEP 1: POST to /payment
      const paymentResponse = await axios.post(`${Base_Url}/payment`, {
        paymentAmount: selectedDoctor.fee ? parseInt(selectedDoctor.fee) + 25 : 25,
        patientId: patientId,
        doctorId: selectedDoctor._id,
      });

      // 🚀 STEP 2: GET /payment?patientId=... to fetch populated data
      const fetchResponse = await axios.get(`${Base_Url}/payment`, {
        params: { patientId: patientId }
      });

      const paymentRecords = fetchResponse.data;

      if (!paymentRecords.success || !Array.isArray(paymentRecords.data) || paymentRecords.data.length === 0) {
        throw new Error("No payment records found.");
      }

      // Get the latest payment (assuming backend appends newest at end)
      const latestRecord = paymentRecords.data[paymentRecords.data.length - 1];

      // ✅ Set real data including PAYMENT ID (which is _id from backend)
      setAppointmentData({
        paymentId: latestRecord._id || "N/A", // ✅ Payment ID from backend
        appointmentId: latestRecord.appointmentId?._id || "N/A",
        patientId: latestRecord.patientId?._id || patientId,
        patientName: latestRecord.patientId?.name || "N/A",
        doctorId: latestRecord.doctorId?._id || selectedDoctor._id,
        doctorName: latestRecord.doctorId?.name || selectedDoctor.name,
        paymentAmount: latestRecord.paymentAmount || "N/A",
        date: selectedSlot.date,
        time: selectedSlot.startTime,
      });

      setPaymentSuccess(true);

    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment failed. Please try again. " + (err.response?.data?.message || err.message));
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <div className="">
      <div>
        <Header step={step} />
        {/* Stepper Row */}
        <Row className=" mb-4">
          <Col xs={12}>
            <div className="book-stepper-row d-flex gap-3 flex-wrap mb-3 mt-2">
              {steps.map((s, idx) => (
                <div key={s.label} className="d-flex align-items-center">
                  <div
                    className={`book-step-circle ${step === idx ? "active" : step > idx ? "done" : ""}`}
                  >
                    {step > idx ? <FaCheckCircle color="#fff" /> : s.icon}
                  </div>
                  <div className="ms-2 fw-bold" style={{ color: step === idx ? "#FF6A00" : "#bbb" }}>
                    {s.label}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="mx-2" style={{ fontSize: "1.5em", color: "#bbb" }}>›</div>
                  )}
                </div>
              ))}
            </div>
          </Col>
        </Row>

        {/* Step 1: Select Specialty */}
        {step === 0 && (
          <>
            <h4 className="mb-3 mt-4 fw-bold">Select Medical Specialty</h4>
            <Form.Control
              type="search"
              placeholder="Search specialties..."
              className="mb-4 book-search"
              style={{ maxWidth: 400 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {loadingSpecialties ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div className="mt-2">Loading specialties...</div>
              </div>
            ) : error ? (
              <div className="alert alert-danger text-center">{error}</div>
            ) : (
              <Row>
                {filteredSpecialties.length > 0 ? (
                  filteredSpecialties.map((spec) => (
                    <Col xs={12} md={4} lg={3} className="mb-3" key={spec.name}>
                      <Card
                        className={`book-specialty-card ${selectedSpecialty === spec.name ? "selected" : ""}`}
                        onClick={() => setSelectedSpecialty(spec.name)}
                      >
                        <Card.Body>
                          <div className="d-flex align-items-center mb-2">
                            <div className="book-specialty-icon">
                              <FaUserMd color="#fff" />
                            </div>
                            <div className="ms-auto text-end">
                              <span className="fw-bold" style={{ color: "#FF6A00" }}>
                                {spec.count} doctors available
                              </span>
                            </div>
                          </div>
                          <div className="fw-bold">{spec.name}</div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <div className="text-center w-100 py-4 text-muted">
                    No specialties found matching "{searchTerm}"
                  </div>
                )}
              </Row>
            )}
          </>
        )}

        {/* Step 2: Choose Doctor */}
        {step === 1 && (
          <>
            <h4 className="mb-3 mt-4 fw-bold">Available Doctors</h4>
            {selectedSpecialty && (
              <div className="mb-2 text-muted">{selectedSpecialty} Specialists</div>
            )}

            {loadingDoctors ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div className="mt-2">Loading doctors...</div>
              </div>
            ) : error ? (
              <div className="alert alert-warning text-center">{error}</div>
            ) : doctors.length > 0 ? (
              doctors.map((doc) => (
                <Card
                  key={doc._id}
                  className={`book-doctor-card mb-3 ${selectedDoctor && selectedDoctor._id === doc._id ? "selected" : ""}`}
                  onClick={() => setSelectedDoctor(doc)}
                >
                  <Card.Body>
                    <Row>
                      <Col xs={2} className="d-flex align-items-center justify-content-center">
                        <div className="book-doctor-avatar" style={{ position: 'relative', width: '50px', height: '50px' }}>
                          {doc.profile && doc.profile.trim() !== "" ? (
                            <img
                              src={doc.profile}
                              alt={doc.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid #FF6A00'
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          {!doc.profile || doc.profile.trim() === "" ? (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                background: '#FF6A00',
                              }}
                            >
                              <FaUserMd size={28} color="#fff" />
                            </div>
                          ) : (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                background: '#FF6A00',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                              }}
                            >
                              <FaUserMd size={28} color="#fff" />
                            </div>
                          )}
                          <span className="book-doctor-status" />
                        </div>
                      </Col>

                      <Col xs={7}>
                        <div className="fw-bold">{doc.name}</div>
                        {doc.experience && (
                          <div className="text-muted">
                            <strong>Experience:</strong> {doc.experience}+ years
                          </div>
                        )}
                        {(doc.openingTime || doc.closingTime) && (
                          <div className="text-muted">
                            <strong>Available:</strong> {doc.openingTime || "—"} to {doc.closingTime || "—"}
                          </div>
                        )}
                        {doc.gender && (
                          <div className="text-muted small">
                            <strong>Gender:</strong> {doc.gender}
                            {doc.licenseNo && <> • <strong>License:</strong> {doc.licenseNo}</>}
                          </div>
                        )}
                      </Col>

                      <Col xs={3} className="text-end d-flex flex-column justify-content-center">
                        {doc.fee ? (
                          <>
                            <div className="text-muted small">Consultation Fee</div>
                            <div className="fw-bold" style={{ color: "#FF6A00" }}>${doc.fee}</div>
                          </>
                        ) : (
                          <>
                            <div className="text-muted small">Consultation</div>
                            <div className="fw-bold text-muted">Fee not specified</div>
                          </>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <div className="alert alert-info text-center">No doctors available for this specialty.</div>
            )}
          </>
        )}

        {/* Step 3: Select Date & Time */}
        {step === 2 && selectedDoctor && (
          <>
            <h4 className="mb-3 mt-4 fw-bold">Select Date & Time</h4>
            <Card className="mb-4">
              <Card.Body className="d-flex align-items-center">
                <div className="book-doctor-avatar" style={{ position: 'relative', width: '50px', height: '50px' }}>
                  {selectedDoctor.profile && selectedDoctor.profile.trim() !== "" ? (
                    <img
                      src={selectedDoctor.profile}
                      alt={selectedDoctor.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #FF6A00'
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        background: '#FF6A00',
                      }}
                    >
                      <FaUserMd size={28} color="#fff" />
                    </div>
                  )}
                </div>
                <div className="ms-3">
                  <div className="fw-bold">{selectedDoctor.name}</div>
                  {selectedDoctor.experience && (
                    <div className="text-muted">{selectedDoctor.experience}+ years</div>
                  )}
                </div>
              </Card.Body>
            </Card>

            {loadingSlots ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div className="mt-2">Loading available slots...</div>
              </div>
            ) : error ? (
              <div className="alert alert-warning text-center">{error}</div>
            ) : Object.keys(slots).length > 0 ? (
              Object.entries(slots).map(([dateStr, daySlots]) => {
                const dateObj = new Date(daySlots[0].date);
                const options = { weekday: 'long', day: 'numeric', month: 'short' };
                const formattedDate = dateObj.toLocaleDateString('en-US', options);
                const isToday = dateObj.toDateString() === new Date().toDateString();

                return (
                  <div key={dateStr} className="mb-4">
                    <div className="fw-bold mb-2" style={{ color: "#FF6A00" }}>
                      {formattedDate} {isToday && "(Today)"}
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {daySlots.map((slot) => (
                        <Button
                          key={slot._id}
                          variant={selectedSlot?._id === slot._id ? "primary" : "outline-secondary"}
                          style={{
                            background: selectedSlot?._id === slot._id ? "#FF6A00" : "#fff",
                            color: selectedSlot?._id === slot._id ? "#fff" : "#333",
                            borderColor: "#FF6A00",
                            minWidth: 90,
                          }}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          {slot.startTime}
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="alert alert-info text-center">No available slots for this doctor.</div>
            )}

            {selectedSlot && (
              <Card className="mt-4">
                <Card.Body>
                  <div className="fw-bold mb-2" style={{ color: "#4caf50" }}>Appointment Summary</div>
                  <Row>
                    <Col>Date</Col>
                    <Col>Time</Col>
                    <Col>Duration</Col>
                  </Row>
                  <Row>
                    <Col>
                      {new Date(selectedSlot.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Col>
                    <Col>{selectedSlot.startTime}</Col>
                    <Col>
                      {(() => {
                        const start = new Date(`1970-01-01T${selectedSlot.startTime.replace(' ', '').toLowerCase()}`);
                        const end = new Date(`1970-01-01T${selectedSlot.endTime.replace(' ', '').toLowerCase()}`);
                        const diff = (end - start) / (1000 * 60);
                        return `${diff} minutes`;
                      })()}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}
          </>
        )}

        {/* Step 4: Confirm & Pay */}
        {step === 3 && selectedDoctor && selectedSlot && (
          <>
            <h4 className="mb-3 mt-4 fw-bold">Confirm & Pay</h4>
            <div className="mb-2 text-muted">Review your appointment details</div>
            <Card className="mb-4">
              <Card.Body>
                <div className="fw-bold mb-2" style={{ color: "#FF6A00" }}>Appointment Details</div>
                <Row>
                  <Col xs={2}>
                    <div className="book-doctor-avatar" style={{ position: 'relative', width: '50px', height: '50px' }}>
                      {selectedDoctor.profile && selectedDoctor.profile.trim() !== "" ? (
                        <img
                          src={selectedDoctor.profile}
                          alt={selectedDoctor.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid #FF6A00'
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            background: '#FF6A00',
                          }}
                        >
                          <FaUserMd size={28} color="#fff" />
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="fw-bold">{selectedDoctor.name}</div>
                    {selectedDoctor.experience && (
                      <div className="text-muted">{selectedDoctor.experience}+ years experience</div>
                    )}
                    {selectedDoctor.gender && (
                      <div className="text-muted">Gender: {selectedDoctor.gender}</div>
                    )}
                  </Col>
                  <Col xs={4} className="text-end">
                    {selectedDoctor.fee ? (
                      <>
                        <div className="text-muted small">Consultation Fee</div>
                        <div className="fw-bold" style={{ color: "#FF6A00" }}>${selectedDoctor.fee}</div>
                      </>
                    ) : (
                      <div className="text-muted">Fee not specified</div>
                    )}
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col>
                    <div>Date</div>
                    <div className="fw-bold">
                      {new Date(selectedSlot.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </Col>
                  <Col>
                    <div>Time</div>
                    <div className="fw-bold">{selectedSlot.startTime}</div>
                  </Col>
                  <Col>
                    <div>Type</div>
                    <div className="fw-bold" style={{ color: "#4caf50" }}>Video Call</div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Body>
                <div className="fw-bold mb-2" style={{ color: "#FF6A00" }}>Additional Notes (Optional)</div>
                <Form.Control
                  as="textarea"
                  rows={3}
                  maxLength={500}
                  placeholder="Describe your symptoms or reason for visit..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
                <div className="text-muted mt-1" style={{ fontSize: "0.85em" }}>{notes.length}/500 characters</div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <div className="fw-bold mb-2" style={{ color: "#FF6A00" }}>Payment Summary</div>
                <Row>
                  <Col>Consultation Fee</Col>
                  <Col className="text-end">
                    {selectedDoctor.fee ? `$${selectedDoctor.fee}` : "Not specified"}
                  </Col>
                </Row>
                <Row>
                  <Col>Service Fee</Col>
                  <Col className="text-end">$25</Col>
                </Row>
                <hr />
                <Row>
                  <Col className="fw-bold">Total Amount</Col>
                  <Col className="fw-bold text-end" style={{ color: "#FF6A00" }}>
                    {selectedDoctor.fee ? `$${parseInt(selectedDoctor.fee) + 25}` : "$25"}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="d-flex justify-content-between mt-4">
          <Button
            variant="outline-secondary"
            onClick={handleBack}
            disabled={step === 0}
          >
            <FaChevronLeft /> Back
          </Button>
          <Button
            style={{ background: "#FF6A00", border: "none" }}
            onClick={handleNext}
            disabled={
              (step === 0 && !selectedSpecialty) ||
              (step === 1 && !selectedDoctor) ||
              (step === 2 && !selectedSlot)
            }
          >
            {step === steps.length - 1 ? "Finish" : "Next"} <FaChevronRight />
          </Button>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      <Modal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Complete Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!paymentSuccess ? (
            selectedDoctor && selectedSlot ? (
              <>
                <div className="text-center mb-4">
                  <h4>Pay ${selectedDoctor?.fee ? parseInt(selectedDoctor.fee) + 25 : 25}</h4>
                  <p className="text-muted">Secure payment via Stripe</p>
                </div>

                <Card className="mb-4">
                  <Card.Body>
                    <Row>
                      <Col>Doctor</Col>
                      <Col className="fw-bold">{selectedDoctor?.name || "N/A"}</Col>
                    </Row>
                    <Row>
                      <Col>Date</Col>
                      <Col>
                        {selectedSlot?.date
                          ? new Date(selectedSlot.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : "N/A"}
                      </Col>
                    </Row>
                    <Row>
                      <Col>Time</Col>
                      <Col className="fw-bold">{selectedSlot?.startTime || "N/A"}</Col>
                    </Row>
                    <Row className="mt-3">
                      <Col>Consultation Fee</Col>
                      <Col className="text-end">${selectedDoctor?.fee || 0}</Col>
                    </Row>
                    <Row>
                      <Col>Service Fee</Col>
                      <Col className="text-end">$25</Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col className="fw-bold">Total</Col>
                      <Col className="fw-bold text-end" style={{ color: "#FF6A00" }}>
                        ${selectedDoctor?.fee ? parseInt(selectedDoctor.fee) + 25 : 25}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <div className="text-center">
                  <Button
                    variant="success"
                    size="lg"
                    disabled={paymentProcessing}
                    onClick={handlePayment}
                  >
                    {paymentProcessing ? (
                      <>
                        <Spinner size="sm" /> Processing...
                      </>
                    ) : (
                      "Pay Now"
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-5">
                <div className="text-danger">⚠️ Doctor or time slot not selected. Please go back and complete your selection.</div>
                <Button variant="secondary" className="mt-3" onClick={() => setShowPaymentModal(false)}>
                  Close
                </Button>
              </div>
            )
          ) : (
            <div className="text-center py-4">
              <div className="text-success mb-3">
                <FaCheckCircle size={60} />
              </div>
              <h4>Payment Successful!</h4>
              <p className="text-muted">Your appointment is confirmed.</p>

              <Card className="mt-4">
                <Card.Body>
                  <div className="fw-bold mb-3">Payment & Appointment Details</div>
                  <Row>
                    <Col>Payment ID</Col>
                    <Col className="fw-bold text-primary">{appointmentData?.paymentId || "N/A"}</Col>
                  </Row>
                  <Row>
                    <Col>Appointment ID</Col>
                    <Col className="fw-bold text-primary">{appointmentData?.appointmentId || "N/A"}</Col>
                  </Row>
                  <Row>
                    <Col>Patient ID</Col>
                    <Col>{appointmentData?.patientId || "N/A"}</Col>
                  </Row>
                  <Row>
                    <Col>Patient Name</Col>
                    <Col>{appointmentData?.patientName || "N/A"}</Col>
                  </Row>
                  <Row>
                    <Col>Doctor ID</Col>
                    <Col>{appointmentData?.doctorId || "N/A"}</Col>
                  </Row>
                  <Row>
                    <Col>Doctor Name</Col>
                    <Col>{appointmentData?.doctorName || "N/A"}</Col>
                  </Row>
                  <Row>
                    <Col>Amount Paid</Col>
                    <Col className="fw-bold" style={{ color: "#FF6A00" }}>
                      ${appointmentData?.paymentAmount || "N/A"}
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col>Date</Col>
                    <Col>
                      {selectedSlot?.date
                        ? new Date(selectedSlot.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : "N/A"}
                    </Col>
                  </Row>
                  <Row>
                    <Col>Time</Col>
                    <Col className="fw-bold">{selectedSlot?.startTime || "N/A"}</Col>
                  </Row>
                </Card.Body>
              </Card>

              <Button
                variant="primary"
                className="mt-4"
                onClick={() => {
                  setShowPaymentModal(false);
                  setStep(0);
                  setSelectedSpecialty(null);
                  setSelectedDoctor(null);
                  setSelectedSlot(null);
                  setNotes("");
                  setPaymentSuccess(false);
                  setAppointmentData(null);
                }}
              >
                Done
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

function Header({ step }) {
  return (
    <div className="mb-3">
      <div className="">
        <h3 className="dashboard-heading">Book Appointment</h3>
        <div className="text-muted">Schedule your medical consultation</div>
      </div>
    </div>
  );
}