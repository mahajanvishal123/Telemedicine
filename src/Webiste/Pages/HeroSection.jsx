
import React from "react";
import { Container, Row, Col, Button, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section
        className="hero-section text-white text-center d-flex align-items-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,85,0,0.85), rgba(0,0,0,0.55)), url('https://i.ibb.co/wNSW9QWZ/Chat-GPT-Image-Sep-6-2025-03-22-23-PM.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          width: "100%",
          marginTop: "67px",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Container>
          <h1 className="display-4 fw-bold">
            Healthcare Beyond Limits <br />
            <span className="text-warning" >— Trusted Care, Anywhere</span>
          </h1>
          <p className="lead fs-4 mt-3 mb-4">
            Multilingual, AI-powered global telehealth connecting patients, <br />
            providers, caregivers, insurers, and labs across borders.
          </p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <a href="#finddoctor">
              <button style={{
                background: "linear-gradient(90deg, #ff6a00, #140d01ff)", color: "#fff"
              }} size="lg" className="btn btn fw-bold px-4 border-0">
                Find a Doctor →
              </button>
            </a>
            <a href="#features">
              <button style={{
                color: "#ff6a00", background: "#fff"
              }} size="lg" className="btn btn fw-bold px-4">
                How it Works
              </button>
            </a>
          </div>

          {/* Bottom Features */}
          <Row className="mt-5">
            <Col xs={6} md={3}>
              <p className="fw-semibold mb-0"><i className="fas fa-shield-alt me-2"></i> HIPAA-ready</p>
            </Col>
            <Col xs={6} md={3}>
              <p className="fw-semibold mb-0"><i className="fas fa-lock me-2"></i> Secure by design</p>
            </Col>
            <Col xs={6} md={3}>
              <p className="fw-semibold mb-0"><i className="fas fa-globe me-2"></i> 24+ languages</p>
            </Col>
            <Col xs={6} md={3}>
              <p className="fw-semibold mb-0 text-nowrap"><i className="fas fa-clock me-2"></i> 99.9% uptime target</p>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HeroSection;