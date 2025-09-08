import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaShieldAlt, FaDollarSign, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const DoctorsPage = () => {
  return (
    <div style={{ backgroundColor: '#f9fafb' }}>
      {/* Main Content */}
      <section className="py-5">
        <Container>
          {/* Page Title */}
          <h1 className="text-center fw-bold mb-4" style={{ color: '#2f3d4dff' }}>
            For Healthcare Providers
          </h1>

          {/* Intro Text */}
          <p className="text-center text-muted mb-5">
            Join a global network of healthcare professionals delivering care without boundaries. 
            Experience the future of medical practice with our advanced platform.
          </p>

          {/* Feature Cards */}
          <Row className="g-4 mb-5">
            {[
              {
                icon: <FaShieldAlt size={24} className="text-white" />,
                title: "Verified Credentials",
                desc: "Build trust with patients through our blockchain-backed credential verification system.",
                badge: "100% verified"
              },
              {
                icon: <FaDollarSign size={24} className="text-white" />,
                title: "Transparent Revenue",
                desc: "Earn competitive rates with transparent pricing and flexible payment structures.",
                badge: "Fair compensation"
              },
              {
                icon: <FaCalendarAlt size={24} className="text-white" />,
                title: "Flexible Scheduling",
                desc: "Set your own hours and availability to maintain perfect work-life balance.",
                badge: "Your schedule"
              },
              {
                icon: <FaUsers size={24} className="text-white" />,
                title: "Global Patient Base",
                desc: "Connect with patients worldwide and expand your practice beyond geographical limits.",
                badge: "Unlimited reach"
              }
            ].map((item, i) => (
              <Col md={6} key={i}>
                <Card className="border-0 rounded-4 shadow-sm p-4 h-100">
                  <div className="text-center mb-3">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-3"
                      style={{
                        width: 56,
                        height: 56,
                        background: 'linear-gradient(160deg,#2c4b70,#96aeccff)',
                        boxShadow: '0 6px 14px #2b2b2b40'
                      }}
                    >
                      {item.icon}
                    </div>
                  </div>
                  <Card.Title className="text-center h5 fw-bold" style={{ color: '#0f2846' }}>
                    {item.title}
                  </Card.Title>
                  <Card.Text className="text-center text-muted">{item.desc}</Card.Text>
                  <div className="text-center">
                    <span
                      className="badge px-3 py-1"
                      style={{
                        backgroundColor: '#e5e7eb',
                        color: '#0f2846',
                        fontWeight: 500
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Stats Section */}
          <Card className="border-0 rounded-4 shadow-sm mb-5" style={{ backgroundColor: '#f9f3f1ff' }}>
            <Card.Body className="p-4">
              <Row className="justify-content-between g-4">
                {[
                  { stat: "10K+", label: "Active Doctors" },
                  { stat: "50K+", label: "Consultations" },
                  { stat: "4.9/5", label: "Doctor Rating" },
                  { stat: "24/7", label: "Support" }
                ].map((s, i) => (
                  <Col xs={6} md={3} className="text-center" key={i}>
                    <div className="fs-2 fw-bold" style={{ color: '#ff6208ff' }}>{s.stat}</div>
                    <div className="text-muted">{s.label}</div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>

          {/* CTA Section */}
          <div
            className="rounded-4 p-5 text-center shadow-lg"
            style={{
              background: 'linear-gradient(160deg,#2c4b70,#96aeccff)',
              color: 'white'
            }}
          >
            <h2 className="fw-bold mb-3">Ready to expand your practice globally?</h2>
            <p className="mb-4 text-white-80">
              Join our network of verified healthcare providers and start reaching patients across borders while maintaining the highest standards of care.
            </p>
            <Link to="/signup">
            <Button 
              variant="light" 
              className="px-5 py-2 fs-6 fw-bold"
              style={{ color: '#1e3a8a' }}
            >
              Join Our Network →
            </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default DoctorsPage;
