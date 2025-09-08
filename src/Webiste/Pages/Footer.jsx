import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <footer id="footer" className="py-5" style={{ backgroundColor: '#001f4d', color: '#ffffff' }}>
      <Container>
        {/* Top Section */}
        <Row className="mb-5 text-white row-cols-1 row-cols-md-5 g-4">
          {/* Logo & Info */}
          <Col>
            <div className="d-flex flex-column gap-3 h-100">
              <div>
                <img
                  src="https://i.ibb.co/xKF1WPkH/image.png"
                  alt="TeleMediBridge Logo"
                  style={{ height: '40px', width: '40px' }}
                />
              </div>
              <p className="mb-0">Healthcare Beyond Limits — Trusted Care, Anywhere.</p>
              <p className="mb-0">
                Connecting patients with trusted providers across borders, languages, and cultures.
              </p>
              <div className="small d-flex flex-column gap-2">
                <span> <i className='fa fa-globe me-2'></i> Available in 24+ languages</span>
                <span>  <i className='fa fa-phone me-2'></i> 24/7 Support: 1-800-TELECAR</span>
                <span>  <i class="fa fa-envelope me-2"></i> hello@telemedibridge.com</span>
              </div>
            </div>
          </Col>

          {/* Platform */}
          <Col>
            <div className="d-flex flex-column gap-3 h-100">
              <h6 className="fw-bold">Platform</h6>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                <li><a href="#" className="text-white text-decoration-none">How it Works</a></li>
                <li><a href="#finddoctor" className="text-white text-decoration-none">Find a Doctor</a></li>
                <li><a href="#features" className="text-white text-decoration-none">Specialties</a></li>
                <li><a href="#carebridge" className="text-white text-decoration-none">CareBridge</a></li>
                <li><a href="#pricing" className="text-white text-decoration-none">Pricing</a></li>
              </ul>
            </div>
          </Col>

          {/* For Healthcare */}
          <Col>
            <div className="d-flex flex-column gap-3 h-100">
              <h6 className="fw-bold">For Healthcare</h6>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                <li><a href="#patients" className="text-white text-decoration-none">For Patients</a></li>
                <li><a href="#doctors" className="text-white text-decoration-none">For Providers</a></li>
                <li><a href="#" className="text-white text-decoration-none">Provider Portal</a></li>
              </ul>
            </div>
          </Col>

          {/* Company */}
          <Col>
            <div className="d-flex flex-column gap-3 h-100">
              <h6 className="fw-bold">Company</h6>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                <li><a href="#about" className="text-white text-decoration-none">About Us</a></li>
                <li><a href="/#investors" className="text-white text-decoration-none">Investors</a></li>
                <li><a href="#footer" className="text-white text-decoration-none">Contact</a></li>
              </ul>
            </div>
          </Col>

          {/* Social Links */}
          <Col>
            <div className="d-flex flex-column gap-3 h-100">
              <h6 className="fw-bold">Follow Us</h6>
              <div className="d-flex gap-3">
                <a href="#" className="text-decoration-none">
                  <i className="fab fa-twitter" style={{ color: "#ff6a03", fontSize: "22px" }}></i>
                </a>
                <a href="#" className="text-decoration-none">
                  <i className="fab fa-linkedin" style={{ color: "#ff6a03", fontSize: "22px" }}></i>
                </a>
                <a href="#" className="text-decoration-none">
                  <i className="fab fa-facebook" style={{ color: "#ff6a03", fontSize: "22px" }}></i>
                </a>
                <a href="#" className="text-decoration-none">
                  <i className="fab fa-instagram" style={{ color: "#ff6a03", fontSize: "22px" }}></i>
                </a>
              </div>
            </div>
          </Col>
        </Row>



        {/* Emergency Disclaimer */}
        <div className=" border-light pt-1 mb-4">
          <div
            className="rounded-4 p-3"
            style={{
              backgroundColor: '#1a1a2e',
              border: '1px solid #e03b3b',
            }}
          >
            <strong className="text-danger">⚠ Emergency Disclaimer:</strong>
            <p className="mt-2 mb-0 small">
              TeleMediBridge is not for medical emergencies. If you are experiencing a medical emergency,
              please call your local emergency number (911 in the US) or go to your nearest emergency room immediately.
            </p>
          </div>
        </div>

        {/* Legal Links */}
        <Row className="pt-3 border-top border-light">
          <Col md={6}>
            <p className="text-white small mb-0">© 2024 TeleMediBridge, Inc. All rights reserved.</p>
          </Col>
          <Col md={6} className="text-md-end text-center">
            <div className="d-flex flex-wrap justify-content-md-end justify-content-center gap-3 small">
              <Link to="/privacypolicy" className="text-white text-decoration-none">Privacy Policy</Link>
              <Link to="/termsconditions" className="text-white text-decoration-none">Terms of Service</Link>
              {/* <a href="#" className="text-white text-decoration-none">Cookie Policy</a>
              <a href="#" className="text-white text-decoration-none">Accessibility</a> */}
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
