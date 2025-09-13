import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaHome, FaUsers, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const CareBridgePage = () => {
  return (
    <div className="" style={{ backgroundColor: '#f9eeeb', color: '#001f4d' }}>
      {/* Header Section */}
      <Container className="py-5">
        <div className="text-center mb-5">
          {/* Coming Soon Button */}
          <Button
            variant="light"
            className="px-4 py-2 rounded-pill mb-4"
            style={{
              background: 'linear-gradient(160deg,#2c4b70,#96aeccff)',
              color: 'white',
              border: 'none',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
            }}
          >
            Coming Soon
          </Button>

          <h1 className=" fw-bold" >CareBridge™</h1>
          <p className="lead text-muted mt-3">
            Where virtual care meets human connection. Experience healthcare that follows you home, supports your family, and bridges every gap in your wellness journey.
          </p>
        </div>

        {/* Service Cards */}
        <Row className="g-4 mb-5 justify-content-center">
          {/* Home Health Visits */}
          <Col md={4}>
            <div
              className="p-4 border rounded-4 shadow-sm bg-white"
              style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(255, 106, 3, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              }}
            >
              <div className="text-center mb-3">
                <div
                  className="rounded-3 p-3 d-inline-block"
                  style={{
                    background: 'linear-gradient(160deg,#2c4b70,#96aeccff)',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FaHome size={24} className="text-white" />
                </div>
              </div>
              <h4 className="text-center h5 fw-bold">Home Health Visits</h4>
              <p className="text-muted text-center mb-3">
                Nurses, therapists, and care coordinators come to you for personalized in-home care.
              </p>
              <ul className="list-unstyled text-start ms-3">
                <li className="mb-1"><span className="text-dark">• Post-surgery support</span></li>
                <li className="mb-1"><span className="text-dark">• Chronic disease management</span></li>
                <li><span className="text-dark">• Elder care assistance</span></li>
              </ul>
            </div>
          </Col>

          {/* Family Care Coordination */}
          <Col md={4}>
            <div
              className="p-4 border rounded-4 shadow-sm bg-white"
              style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(255, 106, 3, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              }}
            >
              <div className="text-center mb-3">
                <div
                  className="rounded-3 p-3 d-inline-block"
                  style={{
                    background: 'linear-gradient(160deg,#2c4b70,#96aeccff)',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FaUsers size={24} className="text-white" />
                </div>
              </div>
              <h4 className="text-center h5 fw-bold">Family Care Coordination</h4>
              <p className="text-muted text-center mb-3">
                Connect multiple family members with coordinated care plans and shared health insights.
              </p>
              <ul className="list-unstyled text-start ms-3">
                <li className="mb-1"><span className="text-dark">• Multi-generational health</span></li>
                <li className="mb-1"><span className="text-dark">• Caregiver support</span></li>
                <li><span className="text-dark">• Shared medical records</span></li>
              </ul>
            </div>
          </Col>

          {/* Wellness Partnerships */}
          <Col md={4}>
            <div
              className="p-4 border rounded-4 shadow-sm bg-white"
              style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(255, 106, 3, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              }}
            >
              <div className="text-center mb-3">
                <div
                  className="rounded-3 p-3 d-inline-block"
                  style={{
                    background: 'linear-gradient(160deg,#2c4b70,#96aeccff)',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FaHeart size={24} className="text-white" />
                </div>
              </div>
              <h4 className="text-center h5 fw-bold">Wellness Partnerships</h4>
              <p className="text-muted text-center mb-3">
                Bridge the gap between virtual consultations and ongoing wellness support.
              </p>
              <ul className="list-unstyled text-start ms-3">
                <li className="mb-1"><span className="text-dark">• Lifestyle coaching</span></li>
                <li className="mb-1"><span className="text-dark">• Mental health support</span></li>
                <li><span className="text-dark">• Preventive care</span></li>
              </ul>
            </div>
          </Col>
        </Row>

        {/* CTA Section */}
        <div
          className="p-5 text-center rounded-4 shadow-sm"
          style={{
            background: 'linear-gradient(to right, rgba(255, 106, 3, 0.1), rgba(255, 140, 58, 0.1))',
            border: '1px solid rgba(255, 106, 3, 0.2)',
          }}
        >
          <h2 className="fw-bold mb-3" style={{ color: '#ff6a03' }}>
            Ready to bridge the gap in healthcare?
          </h2>
          <p className="mb-4" style={{ color: '#ff6a03' }}>
            Join our early access program and be among the first to experience the future of connected, compassionate care.
          </p>

          <Link to="/signup">
          <Button
            className="px-5 py-2 fs-6 fw-bold"
            style={{
              background: 'linear-gradient(to bottom, #ff8c3a, #ff6a03)',
              borderColor: '#ff6a03',
              borderRadius: '10px',
              border: 'none',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(to bottom, #ff8c3a, #ff6a03)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(to bottom, #ff6a03, #ff8c3a)';
            }}
          >
            Join Early Access →
          </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default CareBridgePage;