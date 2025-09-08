import React from "react";
import { Button, Card, Col, Row, Form } from "react-bootstrap";

const doctors = [
    {
        name: "Dr. Sarah Ahmed",
        specialty: "Cardiology",
        rating: 4.9,
        reviews: 342,
        patients: 94,
        location: "Dubai, UAE",
        exp: "12 yrs exp",
        langs: "English, Arabic +1",
        price: 85,
        desc: "Specialized in preventive cardiology and heart disease management with over 12 years of experience.",
        nextSlot: "Today, 2:30 PM",
        wait: "~5 min",
    },
    {
        name: "Dr. Michael Chen",
        specialty: "General Medicine",
        rating: 4.8,
        reviews: 156,
        patients: 91,
        location: "Singapore",
        exp: "8 yrs exp",
        langs: "English, Mandarin +1",
        price: 65,
        desc: "Family medicine practitioner focused on holistic healthcare and patient education.",
        nextSlot: "Tomorrow, 9:00 AM",
        wait: null,
    },
    {
        name: "Dr. Priya Sharma",
        specialty: "Dermatology",
        rating: 4.7,
        reviews: 89,
        patients: 88,
        location: "Mumbai, India",
        exp: "6 yrs exp",
        langs: "English, Hindi +1",
        price: 45,
        desc: "Dermatologist specializing in skin conditions and cosmetic procedures.",
        nextSlot: "Today, 5:00 PM",
        wait: "~2 min",
    },
];

const FindDoctor = () => {
    return (
        <>
            <div className="container">
                {/* Header */}
                <div className="text-center mb-4">
                    <h2 className="fw-bold" style={{ color: "#0f2846" }}>
                        Find Your Perfect Doctor
                    </h2>
                    <p className="text-muted mb-4">
                        Search through our network of verified healthcare providers and book
                        consultations instantly
                    </p>
                </div>

                {/* Search bar */}
                <div className="d-flex justify-content-center mb-5">
                    <Form className="d-flex w-75" style={{ maxWidth: "700px" }}>
                        <Form.Control
                            type="search"
                            placeholder="Search doctors by name or specialty..."
                            className="me-2"
                            style={{
                                borderRadius: "10px",
                                padding: "12px",
                                fontSize: "0.95rem",
                            }}
                        />
                        <Button
                            variant="light"
                            className="d-flex align-items-center px-3"
                            style={{
                                borderRadius: "10px",
                                border: "1px solid #ddd",
                                background: "#fff",
                            }}
                        >
                            <i className="bi bi-funnel-fill me-1"></i> Filters
                        </Button>
                    </Form>
                </div>

                {/* Doctor Cards */}
                <Row className="g-4 justify-content-center">
                    {doctors.map((doc, idx) => (
                        <Col xs={12} md={6} lg={4} key={idx}>
                            <Card
                                className="h-100 border-0"
                                style={{
                                    borderRadius: "14px",
                                    boxShadow: "0 6px 16px rgba(15,40,70,.08)",
                                }}
                            >
                                <Card.Body>
                                    {/* Header with name + specialty */}
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <div>
                                            <h5 className="fw-bold mb-0" style={{ color: "#0f2846" }}>
                                                {doc.name}
                                            </h5>
                                            <small className="text-muted">{doc.specialty}</small>
                                        </div>
                                        <img
                                            src="https://i.ibb.co/xKF1WPkH/image.png"
                                            alt="logo"
                                            style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }}
                                        />
                                    </div>

                                    {/* Ratings and stats */}
                                    <div className="d-flex align-items-center mb-2">
                                        <i className="bi bi-star-fill text-warning me-1"></i>
                                        <span style={{ color: "#0f2846", fontWeight: 500 }}>
                                            {doc.rating}
                                        </span>
                                        <small className="text-muted ms-1">({doc.reviews})</small>
                                        <span className="ms-3 text-muted">
                                            <i className="bi bi-heart-pulse me-1"></i>
                                            {doc.patients}
                                        </span>
                                    </div>

                                    {/* Location, experience, langs */}
                                    <div className="mb-2 text-muted small">
                                        <i className="bi bi-geo-alt me-1"></i> {doc.location}{" "}
                                        <span className="ms-3">
                                            <i className="bi bi-briefcase me-1"></i> {doc.exp}
                                        </span>
                                    </div>
                                    <div className="mb-2 text-muted small">
                                        <i className="bi bi-translate me-1"></i> {doc.langs}
                                    </div>

                                    {/* Description */}
                                    <p className="small text-muted">{doc.desc}</p>

                                    {/* Slot & wait time */}
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <span
                                            className="badge bg-dark text-white"
                                            style={{ borderRadius: "8px" }}
                                        >
                                            {doc.nextSlot}
                                        </span>
                                        {doc.wait && (
                                            <span
                                                className="badge bg-success"
                                                style={{ borderRadius: "8px" }}
                                            >
                                                {doc.wait}
                                            </span>
                                        )}
                                    </div>

                                    {/* Price & button */}
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span
                                            className="fw-bold"
                                            style={{ color: "#ff6a03", fontSize: "1rem" }}
                                        >
                                            ${doc.price}
                                        </span>
                                        <Button
                                            className="fw-bold px-3 ms-3 w-100"
                                            style={{
                                                background: "linear-gradient(90deg, #ff6a00, #692a00ff)",
                                                border: "none",
                                                borderRadius: "8px",
                                            }}
                                        >
                                            Book Video Call
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </>
    )
}

export default FindDoctor
