import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaCalendarAlt, FaLanguage, FaFileMedical, FaClock } from 'react-icons/fa';
const PatientsPage = () => {
  return (
    <div className="" style={{ background: "f9eeeb" }}>
      {/* Hero Section */}
      <section className="container mt-5 py-5">
        <Container>
          <div className="text-center mb-5 px-3">
            <h1 className="display-5 fw-bold text-dark">For Patients</h1>

            <div className="d-flex justify-content-center align-items-center">
              <span className="lead text-muted mt-3 w-100 w-md-75 w-lg-50">
                Experience healthcare designed around you. Simple, secure, and accessible
                care that breaks down barriers and brings quality medical services to your
                fingertips.
              </span>
            </div>
          </div>

          {/* Feature Cards */}
          <Row className="g-4 mb-5">
            {[
              {
                Icon: FaCalendarAlt,
                title: "Easy Booking",
                desc: "Schedule appointments with verified doctors in minutes, not hours.",
                cta: "Book in under 2 minutes",
              },
              {
                Icon: FaLanguage,
                title: "Multilingual Interface",
                desc: "Access care in your preferred language with support for 24+ languages.",
                cta: "24+ languages supported",
              },
              {
                Icon: FaFileMedical,
                title: "Digital Prescriptions",
                desc: "Receive secure e-prescriptions that can be sent directly to your pharmacy.",
                cta: "Instant e-prescriptions",
              },
              {
                Icon: FaClock,
                title: "24/7 Access",
                desc: "Get medical care when you need it, not just during business hours.",
                cta: "Round-the-clock care",
              },
            ].map(({ Icon, title, desc, cta }, i) => (
              <Col md={6} key={i}>
                <Card className="feature-card h-100 border-0">
                  <Card.Body className="text-center p-4">
                    <div className="mb-3">
                      <div className="icon-badge d-inline-flex align-items-center justify-content-center">
                        <Icon size={22} className="text-white" />
                      </div>
                    </div>

                    <Card.Title className="h4 fw-bold" style={{ color: "#0f2846" }}>
                      {title}
                    </Card.Title>
                    <Card.Text className="text-muted">{desc}</Card.Text>

                    <button size="sm" className=" pill-cta px-3">
                      {cta}
                    </button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          {/* CTA Section */}
          <div className="text-center p-5 rounded-4 shadow-lg" style={{ backgroundColor: '#ff6a03' }}>
            <h2 className="fw-bold mb-3 text-white">Ready to experience better healthcare?</h2>
            <p className="mb-4 text-white">
              Join thousands of patients who trust TeleMediBridge for their healthcare needs. Start your journey to accessible, quality care today.
            </p>
            <Button variant="dark" className="px-5 py-2 fs-6">
              Find a Doctor →
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default PatientsPage;