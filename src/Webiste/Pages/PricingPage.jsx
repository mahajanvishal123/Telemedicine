import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';

const PricingPage = () => {
  return (
    <div className="bg-light">


      {/* Hero Section */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold text-dark">Healthcare that fits your budget</h1>
            <p className="lead text-muted mt-3">
              Choose the plan that works for you. No hidden fees, no surprises—just transparent, affordable healthcare when you need it.
            </p>
          </div>

          {/* Pricing Cards */}
          <Row className="g-4 justify-content-center">
            {/* Pay Per Visit */}
            <Col md={4}>
              <div className="border border-gray-200 rounded-4 p-4 shadow-sm h-100">
                <h3 className="fw-bold text-dark text-center">Pay Per Visit</h3>
                <p className="text-muted text-center">Perfect for occasional care needs</p>
                <div className="mb-4 text-center">
                  <span className="h2 fw-bold text-dark">From $29</span>
                  <span className="text-muted ms-1">per consultation</span>
                </div>

                <ul className="mt-4 list-unstyled">
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Direct access to verified doctors
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Transparent pricing upfront
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    E-prescriptions and lab orders
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Visit summaries and care plans
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Multi-language support
                  </li>
                  <li className="d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    24/7 customer support
                  </li>
                </ul>
                <Button
                  variant="light"
                  className="w-100 py-2 border-0"
                  style={{
                    backgroundColor: 'rgba(255, 136, 0, 0.27)',
                    color: '#d35400',
                    fontWeight: '600',
                    borderRadius: '8px',
                  }}
                >
                  Find a Doctor →
                </Button>
              </div>
            </Col>

            {/* Care Membership (Most Popular) */}
            <Col md={4} className="position-relative">
              <div
                className="border-2 rounded-4 p-4 shadow-sm h-100"
                style={{ borderColor: '#ff6600ff', boxShadow: '0 6px 12px rgba(0,0,0,0.05)' }}
              >
                <div className="position-absolute top-0 start-50 translate-middle-x">
                  <span
                    className="badge px-3 py-1 text-white rounded-pill"
                    style={{ fontSize: '0.8rem', fontWeight: '600', background: "#d35400" }}
                  >
                    Most Popular
                  </span>
                </div>
                <h3 className="fw-bold text-dark text-center mt-2">Care Membership</h3>
                <p className="text-muted text-center">For ongoing health management</p>
                <div className="mb-4 text-center">
                  <span className="h2 fw-bold text-dark">$99</span>
                  <span className="text-muted ms-1">per month</span>
                </div>

                <ul className="mt-4 list-unstyled">
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Everything in Pay Per Visit
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Unlimited consultations
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Priority booking
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Care Circles for family
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Health monitoring & reminders
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Wellness coaching sessions
                  </li>
                  <li className="d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Annual health assessments
                  </li>
                </ul>
                <Button
                  variant="danger"
                  className="w-100 py-2"
                  style={{
                    backgroundColor: '#d35400',
                    borderColor: '#d35400',
                    fontWeight: '600',
                    borderRadius: '8px',
                  }}
                >
                  Start Membership →
                </Button>
              </div>
            </Col>

            {/* Family Plan */}
            <Col md={4}>
              <div className="border border-gray-200 rounded-4 p-4 shadow-sm h-100">
                <h3 className="fw-bold text-dark text-center">Family Plan</h3>
                <p className="text-muted text-center">Complete care for your whole family</p>
                <div className="mb-4 text-center">
                  <span className="h2 fw-bold text-dark">$179</span>
                  <span className="text-muted ms-1">per month</span>
                </div>

                <ul className="mt-4 list-unstyled">
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Everything in Care Membership
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Up to 6 family members
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Pediatric and elderly care
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Family health coordination
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    CareBridge home visits
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Shared health records
                  </li>
                  <li className="d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                      <path d="M5 13L9 17L19 7" stroke="#001f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Family wellness programs
                  </li>
                </ul>
                <Button
                  variant="danger"
                  className="w-100 py-2"
                  style={{
                    backgroundColor: '#d35400',
                    borderColor: '#d35400',
                    fontWeight: '600',
                    borderRadius: '8px',
                  }}
                >
                  Protect Your Family →
                </Button>
              </div>
            </Col>
          </Row>

          {/* Enterprise CTA */}
          {/* <div className="text-center mt-5">
            <p className="text-muted mb-3">Need a custom solution for your organization?</p>
            <Button
              variant="light"
              className="px-5 py-2 border-0"
              style={{
                backgroundColor: '#f8f9fa',
                color: '#001f4d',
                fontWeight: '600',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              }}
            >
              Contact Enterprise Sales
            </Button>
          </div> */}
        </Container>
      </section>
    </div>
  );
};

export default PricingPage;