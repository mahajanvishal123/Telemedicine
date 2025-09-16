import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Form } from "react-bootstrap";
import { FaUserMd, FaStar, FaCheckCircle, FaCalendarAlt, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import "./BookAppointment.css";
import Base_Url from "../../../Baseurl/Baseurl";
import axios from "axios";


const specialties = [
  { name: "Cardiology", desc: "Heart and cardiovascular care", count: 10 },
  { name: "Neurology", desc: "Brain and nervous system", count: 8 },
  { name: "Dermatology", desc: "Skin and hair care", count: 6 },
  { name: "Orthopedic", desc: "Bone and joint care", count: 10 },
  { name: "Pediatrics", desc: "Children healthcare", count: 8 },
  { name: "Gynecology", desc: "Women health specialist", count: 7 },
  { name: "Psychiatry", desc: "Mental health care", count: 5 },
  { name: "Ophthalmology", desc: "Eye care specialist", count: 4 },
  { name: "Dentistry", desc: "Dental and oral care", count: 6 },
  { name: "General Medicine", desc: "General health consultation", count: 9 },
];

const doctors = [
  // Cardiology
  {
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    university: "Harvard Medical School",
    rating: 4.9,
    experience: "15+ years",
    patients: "2.5k+ patients",
    price: "$150",
    languages: "English, Spanish",
    status: "Available Today",
    nextAvailable: "Today 2:30 PM",
    video: true,
  },
  {
    name: "Dr. Michael Chen",
    specialty: "Cardiology",
    university: "Johns Hopkins University",
    rating: 4.8,
    experience: "12+ years",
    patients: "1.8k+ patients",
    price: "$180",
    languages: "English, Mandarin",
    status: "Available Today",
    nextAvailable: "Tomorrow 10:00 AM",
    video: true,
  },
  // Neurology
  {
    name: "Dr. Emily Rodriguez",
    specialty: "Neurology",
    university: "Mayo Clinic College",
    rating: 4.9,
    experience: "18+ years",
    patients: "3.2k+ patients",
    price: "$200",
    languages: "English, Spanish",
    status: "Available Today",
    nextAvailable: "Today 3:00 PM",
    video: true,
  },
  {
    name: "Dr. James Wilson",
    specialty: "Neurology",
    university: "Stanford Medical School",
    rating: 4.7,
    experience: "14+ years",
    patients: "2.1k+ patients",
    price: "$190",
    languages: "English",
    status: "Available Tomorrow",
    nextAvailable: "Tomorrow 9:30 AM",
    video: true,
  },
  // Dermatology
  {
    name: "Dr. Lisa Thompson",
    specialty: "Dermatology",
    university: "UCLA Medical School",
    rating: 4.8,
    experience: "11+ years",
    patients: "1.9k+ patients",
    price: "$140",
    languages: "English, French",
    status: "Available Today",
    nextAvailable: "Today 4:15 PM",
    video: true,
  },
  {
    name: "Dr. David Kim",
    specialty: "Dermatology",
    university: "NYU School of Medicine",
    rating: 4.6,
    experience: "9+ years",
    patients: "1.5k+ patients",
    price: "$130",
    languages: "English, Korean",
    status: "Available Today",
    nextAvailable: "Today 1:45 PM",
    video: true,
  },
  // Orthopedic
  {
    name: "Dr. Robert Martinez",
    specialty: "Orthopedic",
    university: "University of Pennsylvania",
    rating: 4.9,
    experience: "20+ years",
    patients: "4.1k+ patients",
    price: "$220",
    languages: "English, Spanish",
    status: "Available Today",
    nextAvailable: "Today 11:00 AM",
    video: true,
  },
  {
    name: "Dr. Jennifer Lee",
    specialty: "Orthopedic",
    university: "Duke University Medical",
    rating: 4.7,
    experience: "13+ years",
    patients: "2.3k+ patients",
    price: "$195",
    languages: "English",
    status: "Available Tomorrow",
    nextAvailable: "Tomorrow 2:00 PM",
    video: true,
  },
  // Pediatrics
  {
    name: "Dr. Amanda Foster",
    specialty: "Pediatrics",
    university: "Boston Children's Hospital",
    rating: 4.9,
    experience: "16+ years",
    patients: "3.8k+ patients",
    price: "$120",
    languages: "English, Italian",
    status: "Available Today",
    nextAvailable: "Today 10:30 AM",
    video: true,
  },
  {
    name: "Dr. Christopher Brown",
    specialty: "Pediatrics",
    university: "Children's Hospital Philadelphia",
    rating: 4.8,
    experience: "12+ years",
    patients: "2.7k+ patients",
    price: "$110",
    languages: "English, Spanish",
    status: "Available Today",
    nextAvailable: "Today 3:30 PM",
    video: true,
  },
  // Gynecology
  {
    name: "Dr. Maria Garcia",
    specialty: "Gynecology",
    university: "Baylor College of Medicine",
    rating: 4.8,
    experience: "14+ years",
    patients: "2.8k+ patients",
    price: "$160",
    languages: "English, Spanish, Portuguese",
    status: "Available Today",
    nextAvailable: "Today 2:00 PM",
    video: true,
  },
  {
    name: "Dr. Rachel Green",
    specialty: "Gynecology",
    university: "Emory University School",
    rating: 4.7,
    experience: "10+ years",
    patients: "1.6k+ patients",
    price: "$145",
    languages: "English",
    status: "Available Tomorrow",
    nextAvailable: "Tomorrow 11:30 AM",
    video: true,
  },
  // Psychiatry
  {
    name: "Dr. Daniel Adams",
    specialty: "Psychiatry",
    university: "Yale School of Medicine",
    rating: 4.9,
    experience: "17+ years",
    patients: "2.4k+ patients",
    price: "$180",
    languages: "English, German",
    status: "Available Today",
    nextAvailable: "Today 5:00 PM",
    video: true,
  },
  {
    name: "Dr. Sophie Turner",
    specialty: "Psychiatry",
    university: "Columbia University Medical",
    rating: 4.6,
    experience: "8+ years",
    patients: "1.2k+ patients",
    price: "$165",
    languages: "English, French",
    status: "Available Today",
    nextAvailable: "Today 6:30 PM",
    video: true,
  },
  // Ophthalmology
  {
    name: "Dr. Kevin Wong",
    specialty: "Ophthalmology",
    university: "University of Michigan",
    rating: 4.8,
    experience: "15+ years",
    patients: "2.9k+ patients",
    price: "$170",
    languages: "English, Cantonese",
    status: "Available Today",
    nextAvailable: "Today 1:00 PM",
    video: true,
  },
  {
    name: "Dr. Patricia Davis",
    specialty: "Ophthalmology",
    university: "Northwestern University",
    rating: 4.7,
    experience: "11+ years",
    patients: "1.8k+ patients",
    price: "$155",
    languages: "English",
    status: "Available Tomorrow",
    nextAvailable: "Tomorrow 10:45 AM",
    video: true,
  },
  // Dentistry
  {
    name: "Dr. Mark Johnson",
    specialty: "Dentistry",
    university: "University of Southern California",
    rating: 4.8,
    experience: "13+ years",
    patients: "3.5k+ patients",
    price: "$125",
    languages: "English, Spanish",
    status: "Available Today",
    nextAvailable: "Today 9:15 AM",
    video: true,
  },
  {
    name: "Dr. Anna Petrov",
    specialty: "Dentistry",
    university: "Tufts University School",
    rating: 4.9,
    experience: "19+ years",
    patients: "4.2k+ patients",
    price: "$135",
    languages: "English, Russian",
    status: "Available Today",
    nextAvailable: "Today 4:00 PM",
    video: true,
  },
  // General Medicine
  {
    name: "Dr. Thomas Clark",
    specialty: "General Medicine",
    university: "University of Washington",
    rating: 4.7,
    experience: "16+ years",
    patients: "3.1k+ patients",
    price: "$100",
    languages: "English",
    status: "Available Today",
    nextAvailable: "Today 12:00 PM",
    video: true,
  },
  {
    name: "Dr. Helen Martinez",
    specialty: "General Medicine",
    university: "University of California SF",
    rating: 4.8,
    experience: "12+ years",
    patients: "2.5k+ patients",
    price: "$95",
    languages: "English, Spanish",
    status: "Available Today",
    nextAvailable: "Today 2:45 PM",
    video: true,
  },
];

const dates = [
  { date: "Tue, Sep 2", label: "Today" },
  { date: "Wed, Sep 3", label: "Wednesday" },
  { date: "Thu, Sep 4", label: "Thursday" },
  { date: "Fri, Sep 5", label: "Friday" },
  { date: "Sat, Sep 6", label: "Saturday" },
  { date: "Sun, Sep 7", label: "Sunday" },
  { date: "Mon, Sep 8", label: "Monday" },
  { date: "Tue, Sep 9", label: "Tuesday" },
  { date: "Wed, Sep 10", label: "Wednesday" },
  { date: "Thu, Sep 11", label: "Thursday" },
  { date: "Fri, Sep 12", label: "Friday" },
  { date: "Sat, Sep 13", label: "Saturday" },
  { date: "Sun, Sep 14", label: "Sunday" },
  { date: "Mon, Sep 15", label: "Monday" },
];

const timeSlots = {
  Morning: ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"],
  Afternoon: ["2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"],
  Evening: ["6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM"],
};

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
  const [selectedDate, setSelectedDate] = useState(dates[0].date);
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");

  const filteredDoctors = doctors.filter(
    (doc) => !selectedSpecialty || doc.specialty === selectedSpecialty
  );

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }
  function handleNext() {
    if (step < steps.length - 1) setStep(step + 1);
  }

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
            />
            <Row>
              {specialties.map((spec) => (
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
                          <span className="fw-bold" style={{ color: "#FF6A00" }}>{spec.count} doctors available</span>
                        </div>
                      </div>
                      <div className="fw-bold">{spec.name}</div>
                      <div className="text-muted" style={{ fontSize: "0.95em" }}>{spec.desc}</div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}

        {/* Step 2: Choose Doctor */}
        {step === 1 && (
          <>
            <h4 className="mb-3 mt-4 fw-bold">Available Doctors</h4>
            <div className="mb-2 text-muted">{selectedSpecialty} Specialists Ready To Help You</div>
            <div className="d-flex gap-2 mb-3">
              <span className="fw-bold">Sort by:</span>
              <Button size="sm" style={{ background: "#FF6A00", border: "none" }}>Rating</Button>
              <Button size="sm" variant="outline-secondary" style={{ color: "#FF6A00", borderColor: "#FF6A00" }}>Fee</Button>
              <Button size="sm" variant="outline-secondary" style={{ color: "#FF6A00", borderColor: "#FF6A00" }}>Experience</Button>
            </div>
            {filteredDoctors.map((doc) => (
              <Card
                key={doc.name}
                className={`book-doctor-card mb-3 ${selectedDoctor && selectedDoctor.name === doc.name ? "selected" : ""}`}
                onClick={() => setSelectedDoctor(doc)}
              >
                <Card.Body>
                  <Row>
                    <Col xs={2} className="d-flex align-items-center justify-content-center">
                      <div className="book-doctor-avatar">
                        <FaUserMd size={28} color="#fff" />
                        <span className="book-doctor-status" />
                      </div>
                    </Col>
                    <Col xs={7}>
                      <div className="fw-bold">{doc.name}</div>
                      <div className="text-muted">{doc.university}</div>
                      <div className="d-flex align-items-center gap-2 mt-1 mb-1">
                        <FaStar color="#FFD700" />
                        <span className="fw-bold">{doc.rating}</span>
                        <span className="text-muted">· {doc.experience}</span>
                        <span className="text-muted">· {doc.patients}</span>
                      </div>
                      <div>
                        <Badge style={{ background: "#4caf50" }}>Available Today</Badge>
                        <span className="ms-2 text-muted">Video consultation available</span>
                      </div>
                    </Col>
                    <Col xs={3} className="text-end">
                      <div className="fw-bold" style={{ color: "#FF6A00" }}>{doc.price}</div>
                      <div className="text-muted" style={{ fontSize: "0.9em" }}>consultation fee</div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </>
        )}

        {/* Step 3: Select Date & Time */}
        {step === 2 && (
          <>
            <h4 className="mb-3 mt-4 fw-bold">Select Date & Time</h4>
            <Card className="mb-4">
              <Card.Body className="d-flex align-items-center">
                <div className="book-doctor-avatar">
                  <FaUserMd size={28} color="#fff" />
                </div>
                <div className="ms-3">
                  <div className="fw-bold">{selectedDoctor.name}</div>
                  <div className="text-muted">{selectedDoctor.university}</div>
                  <div>
                    <FaStar color="#FFD700" /> <span className="fw-bold">{selectedDoctor.rating}</span>
                    <span className="text-muted ms-2">{selectedDoctor.experience}</span>
                  </div>
                </div>
                <div className="ms-auto text-end">
                  <div className="fw-bold" style={{ color: "#FF6A00" }}>{selectedDoctor.price}</div>
                  <div className="text-muted" style={{ fontSize: "0.9em" }}>consultation fee</div>
                </div>
              </Card.Body>
            </Card>
            <div className="fw-bold mb-2">Select Date</div>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {dates.map((d) => (
                <Button
                  key={d.date}
                  variant={selectedDate === d.date ? "primary" : "outline-secondary"}
                  style={{
                    background: selectedDate === d.date ? "#FF6A00" : "#fff",
                    color: selectedDate === d.date ? "#fff" : "#333",
                    borderColor: "#FF6A00",
                    minWidth: 110,
                  }}
                  onClick={() => setSelectedDate(d.date)}
                >
                  <div className="fw-bold">{d.date.split(",")[1]}</div>
                  <div style={{ fontSize: "0.85em" }}>{d.label}</div>
                </Button>
              ))}
            </div>
            <div className="fw-bold mb-2">Available Time Slots</div>
            {Object.entries(timeSlots).map(([period, slots]) => (
              <div key={period} className="mb-2">
                <div className="mb-1" style={{ color: "#FF6A00", fontWeight: 500 }}>{period}</div>
                <div className="d-flex flex-wrap gap-2">
                  {slots.map((slot) => (
                    <Button
                      key={slot}
                      variant={selectedTime === slot ? "primary" : "outline-secondary"}
                      style={{
                        background: selectedTime === slot ? "#FF6A00" : "#fff",
                        color: selectedTime === slot ? "#fff" : "#333",
                        borderColor: "#FF6A00",
                        minWidth: 90,
                      }}
                      onClick={() => setSelectedTime(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
            <Card className="mt-4">
              <Card.Body>
                <div className="fw-bold mb-2" style={{ color: "#4caf50" }}>Appointment Summary</div>
                <Row>
                  <Col>Date</Col>
                  <Col>Time</Col>
                  <Col>Duration</Col>
                </Row>
                <Row>
                  <Col>{selectedDate}</Col>
                  <Col>{selectedTime}</Col>
                  <Col>30 minutes</Col>
                </Row>
              </Card.Body>
            </Card>
          </>
        )}

        {/* Step 4: Confirm & Pay */}
        {step === 3 && (
          <>
            <h4 className="mb-3 mt-4 fw-bold">Confirm & Pay</h4>
            <div className="mb-2 text-muted">Review your appointment details and complete payment</div>
            <Card className="mb-4">
              <Card.Body>
                <div className="fw-bold mb-2" style={{ color: "#FF6A00" }}>Appointment Details</div>
                <Row>
                  <Col xs={2}>
                    <div className="book-doctor-avatar">
                      <FaUserMd size={28} color="#fff" />
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="fw-bold">{selectedDoctor.name}</div>
                    <div className="text-muted">{selectedDoctor.university}</div>
                    <div className="d-flex align-items-center gap-2 mt-1 mb-1">
                      <FaStar color="#FFD700" />
                      <span className="fw-bold">{selectedDoctor.rating}</span>
                      <span className="text-muted">· {selectedDoctor.experience}</span>
                    </div>
                  </Col>
                  <Col xs={4} className="text-end">
                    <div className="fw-bold" style={{ color: "#FF6A00" }}>{selectedDoctor.price}</div>
                    <div className="text-muted" style={{ fontSize: "0.9em" }}>consultation fee</div>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <div>Date</div>
                    <div className="fw-bold">{selectedDate}</div>
                  </Col>
                  <Col>
                    <div>Time</div>
                    <div className="fw-bold">{selectedTime}</div>
                  </Col>
                  <Col>
                    <div>Type</div>
                    <div className="fw-bold" style={{ color: "#4caf50" }}>Video Call</div>
                    <div className="text-success" style={{ fontSize: "0.85em" }}>Online consultation</div>
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
                  <Col className="text-end">{selectedDoctor.price}</Col>
                </Row>
                <Row>
                  <Col>Service Fee</Col>
                  <Col className="text-end">$25</Col>
                </Row>
                <hr />
                <Row>
                  <Col className="fw-bold">Total Amount</Col>
                  <Col className="fw-bold text-end" style={{ color: "#FF6A00" }}>${parseInt(selectedDoctor.price.replace("$", "")) + 25}</Col>
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
              (step === 2 && !selectedTime)
            }
          >
            {step === steps.length - 1 ? "Finish" : "Next"} <FaChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Stepper Header
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




