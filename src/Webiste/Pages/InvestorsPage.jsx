import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Footer from './Footer';
import WebsiteNavbar from './WebsiteNavbar';
const InvestorsPage = () => {
  return (
    <div className="bg-light mt-5" style={{ minHeight: '100vh' }}>

      <WebsiteNavbar />
      {/* Header Section */}
      <section className="py-5 text-center" style={{ backgroundColor: 'white' }}>
        <Container>
          {/* Logo */}
          <div className="mb-4">
            <div
              className="mx-auto rounded-3 d-flex align-items-center justify-content-center"
              style={{
                height: '80px',
                width: '80px',
                backgroundColor: '#ff6a03',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold'
              }}
            >
              TMB
            </div>
          </div>

          {/* Title */}
          <h1 className="display-5 fw-bold mb-3" style={{ color: '#ff6a03' }}>Invest in TeleMediBridge</h1>

          {/* Tagline */}
          <p className="lead mb-4" style={{ color: '#333' }}>
            Healthcare Beyond Limits — Trusted Care, Anywhere.
          </p>

          {/* Description */}
          <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '700px' }}>
            Multilingual, AI-powered telemedicine connecting patients, providers, caregivers, insurers, and labs across borders.
          </p>

          {/* Buttons */}
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button
              className="px-4 py-3 fw-bold"
              style={{
                background: 'linear-gradient(to right, #ff6a03, #ff8c3a)',
                border: 'none',
                borderRadius: '8px',
                minWidth: '160px'
              }}
            >
              <i class="fa fa-arrow-right me-3"></i>

              Request Deck
            </Button>
            <Button
              variant="outline-primary"
              className="px-4 py-3 fw-bold"
              style={{
                color: '#ff6a03',
                borderColor: '#ff6a03',
                borderRadius: '8px',
                minWidth: '160px'
              }}
            >
              <i className='fa fa-comment me-3' ></i>
              Contact Us
            </Button>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-5">
        <Container>
          {/* Why Invest */}
          <Row className="mb-5">
            <Col className="text-center mb-4">
              <h2 className="fw-bold mb-3">Why Invest</h2>
              <p className="text-muted">Key differentiators that position TeleMediBridge for success</p>
            </Col>
          </Row>

          <Row className="g-4">
            {/* Global-first */}
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                  <div className="mb-3" style={{ color: '#ff6a03', fontSize: '24px' }}>
                    <i className='fa fa-globe'></i>
                  </div>
                  <h5 className="fw-bold mb-3">Global-first</h5>
                  <p className="text-muted small mb-0">
                    Designed for multilingual, cross-border care with support for 24+ languages.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            {/* Care Circles / CareBridge */}
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                  <div className="mb-3" style={{ color: '#ff6a03', fontSize: '24px' }}>
                    <i className="fa-solid fa-people-group"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Care Circles / CareBridge™</h5>
                  <p className="text-muted small mb-0">
                    Family & caregiver coordination with shared health insights and care plans.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            {/* AI-native */}
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                  <div className="mb-3" style={{ color: '#ff6a03', fontSize: '24px' }}>
                    <i className="fa-solid fa-robot"></i>
                  </div>
                  <h5 className="fw-bold mb-3">AI-native</h5>
                  <p className="text-muted small mb-0">
                    Triage, co-pilot notes, predictive nudges with ≥90% accuracy.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            {/* Trust Fabric */}
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                  <div className="mb-3" style={{ color: '#ff6a03', fontSize: '24px' }}>
                    <i className="fa-solid fa-lock"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Trust Fabric</h5>
                  <p className="text-muted small mb-0">
                    Transparent Trust Score; blockchain-ready credentials for verified providers.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            {/* Inclusive UX */}
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                  <div className="mb-3" style={{ color: '#ff6a03', fontSize: '24px' }}>
                    <i class="fa fa-wheelchair"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Inclusive UX</h5>
                  <p className="text-muted small mb-0">
                    24+ languages, RTL, low-bandwidth, accessible design for all users.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            {/* Revenue Model */}
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                  <div className="mb-3" style={{ color: '#ff6a03', fontSize: '24px' }}>
                    <i class="fa-solid fa-sack-dollar"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Diverse Revenue</h5>
                  <p className="text-muted small mb-0">
                    Multiple streams: consultations, subscriptions, partnerships, and data insights.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Roadmap Snapshot */}
          <Row className="my-5 py-4">
            <Col lg={8} className="mx-auto">
              <div className="text-center mb-4">
                <h1 className="fw-bold mb-3" >Roadmap Snapshot</h1>
                <p className="text-muted">Our strategic plan for growth and expansion</p>
              </div>

              <div className="position-relative">
                {/* Timeline line */}
                <div className="position-absolute top-0 start-0 h-100 ms-3" style={{ borderLeft: '2px dashed #ff6a03', height: '100%', left: '15px' }}></div>

                {/* Timeline items */}
                <div className="ps-5">
                  {[
                    { phase: "Phase 1", title: "MVP Launch", desc: "AI triage, booking, video consults, eRx" },
                    { phase: "Phase 2", title: "Ecosystem Expansion", desc: "Care Circles™, insurance, labs, mental health" },
                    { phase: "Phase 3", title: "Advanced Care", desc: "RPM + predictive AI + telepharmacy" },
                    { phase: "Phase 4", title: "Blockchain Integration", desc: "Credential passport, cross-border services" },
                    { phase: "Phase 5", title: "Future Tech", desc: "AR/VR therapy, open API marketplace" }
                  ].map((item, index) => (
                    <div key={index} className="position-relative mb-4">
                      <div
                        className="position-absolute rounded-circle"
                        style={{
                          width: '16px',
                          height: '16px',
                          backgroundColor: '#ff6a03',
                          left: '-36px',
                          top: '6px',
                          border: '3px solid white',
                          boxShadow: '0 0 0 2px #ff6a03'
                        }}
                      ></div>
                      <h5 className="fw-bold mb-1">{item.phase}: {item.title}</h5>
                      <p className="text-muted mb-0">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>

          {/* KPI Targets */}
          <Row className="my-5 py-4">
            <div className="text-center mb-4">
              <h2 className="fw-bold mb-3">KPI Targets</h2>
              <p className="text-muted">Our commitment to excellence and performance</p>
            </div>

            <Col>
              <Row className="g-3 justify-content-center">
                {[
                  { label: "NPS ≥ 70", value: "70" },
                  { label: "Join success ≥ 99.5%", value: "99.5%" },
                  { label: "Booking < 2 min", value: "<2min" },
                  { label: "AI accuracy ≥ 90%", value: "90%" },
                  { label: "Uptime ≥ 99.9%", value: "99.9%" },
                  { label: "Global reach", value: "24+ languages" }
                ].map((kpi, index) => (
                  <Col key={index} md={4} sm={6}>
                    <Card className="border-0 rounded-4 text-center p-3 h-100" style={{ backgroundColor: 'rgba(255, 106, 3, 0.1)' }}>
                      <Card.Body className="p-3">
                        <div className="fw-bold fs-3 mb-1" style={{ color: '#ff6a03' }}>{kpi.value}</div>
                        <div className="text-muted small">{kpi.label}</div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>

          {/* Contact */}
          <Row className="">
            <Col lg={8} className="w-100">
              <Card className="border-0 rounded-4 shadow-sm">
                <Card.Body className="p-5 text-center">
                  <h2 className="fw-bold mb-3">Get in Touch</h2>
                  <p className="text-muted mb-4">
                    For investment opportunities or partnership inquiries, we'd love to hear from you.
                  </p>
                  <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
                    <Button
                      className="px-4 py-2 fw-bold"
                      style={{
                        background: 'linear-gradient(to right, #ff6a03, #ff8c3a)',
                        border: 'none',
                        borderRadius: '8px'
                      }}
                    >
                  <i class="fa-solid fa-envelope me-2"></i>
                      investors@telemedibridge.com
                    </Button>
                    <Button
                      variant="outline-primary"
                      className="px-4 py-2 fw-bold"
                      style={{
                        color: '#ff6a03',
                        borderColor: '#ff6a03',
                        borderRadius: '8px'
                      }}
                    >
                     <i class="fa-solid fa-phone me-2"></i>
                      Schedule a Call
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default InvestorsPage;