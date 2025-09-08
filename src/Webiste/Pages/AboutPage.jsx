// src/pages/AboutPage.js
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const AboutPage = () => {
  return (
    <div className="about-page py-5" style={{ backgroundColor: "#f9eeeb" }}>
      <Container>
        {/* Main Heading */}
        <h1
          className="text-center mb-2 fw-bold"
          style={{ color: "blck", fontSize: "2.5rem" }}
        >
          About Tele Medi Bridge
        </h1>
        <p
          className="text-center text-muted mb-5"
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          Healthcare Beyond Limits — Trusted Care, Anywhere
        </p>

        {/* Mission & Vision */}
        <Row className="gy-4 mb-5">
          <Col xs={12} md={6}>
            <Card
              className="border p-4 h-100"
              style={{
                backgroundColor: "#f9eeeb",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <div className="d-flex align-items-center mb-3">
                <i className="fa fa-heart" style={{ color: "#ff5500d9", fontSize: "24px" }}></i>
                <h5 className="mb-0 ms-3 fw-semibold" style={{ color: "#0a2c58" }}>
                  Our Mission
                </h5>
              </div>
              <p className="text-muted" style={{ lineHeight: 1.6 }}>
                To democratize access to quality healthcare by connecting patients
                with trusted providers across borders, languages, and cultures. We
                believe healthcare should be accessible, affordable, and available
                to everyone, everywhere.
              </p>
            </Card>
          </Col>

          <Col xs={12} md={6}>
            <Card
              className="border p-4 h-100"
              style={{
                backgroundColor: "#f9eeeb",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <div className="d-flex align-items-center mb-3">
                <i className="fa fa-globe" style={{ color: "#ff5500d9", fontSize: "24px" }}></i>

                <h5 className="mb-0 ms-3 fw-semibold" style={{ color: "#0a2c58" }}>
                  Our Vision
                </h5>
              </div>
              <p className="text-muted" style={{ lineHeight: 1.6 }}>
                A world where geographic boundaries, language barriers, and economic
                constraints no longer limit access to exceptional healthcare. We
                envision a connected global health ecosystem powered by AI and human
                compassion.
              </p>
            </Card>
          </Col>
        </Row>

        {/* Commitment */}
        <Row>
          <Col xs={12}>
            <Card
              className="border-1 p-4 mb-4"
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #f18f8f5b",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                maxWidth: "100%",
                margin: "0 auto",
              }}
            >
              <div className="d-flex align-items-center mb-3">
                <i className="fa fa-shield" style={{ color: "#ff5500d9", fontSize: "24px" }}></i>

                <h5 className="mb-0 ms-3 fw-semibold" style={{ color: "#0a2c58" }}>
                  Our Commitment
                </h5>
              </div>
              <p className="text-muted text-center" style={{ lineHeight: 1.6 }}>
                We are committed to the highest standards of privacy, security, and
                clinical excellence. Our platform is built with HIPAA and GDPR
                compliance at its core, ensuring your health data remains protected
                while delivering world-class care experiences.
              </p>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutPage;
