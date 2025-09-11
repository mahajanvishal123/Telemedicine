// src/pages/FeaturesPage.js
import React from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
// import DoctorImg from '../assets/doctor_img.jpg'

const FeaturesPage = () => {
    return (
        <div className="">
            <div className='p-3 p-md-4 p-lg-5'>
                {/* Section 1: Healthcare Made Simple */}
                <section className="mb-4 mb-md-5 text-center">
                    <h1 className="fw-bold mb-3 mb-md-4 mb-lg-5" style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)" }}>Healthcare made simple</h1>
                    <p
                        className="text-muted mb-4 mb-md-5"
                        style={{ 
                            fontSize: "clamp(1rem, 2.5vw, 1.25rem)", 
                            maxWidth: "800px", 
                            margin: "0 auto",
                            lineHeight: "1.6"
                        }}
                    >
                        From symptom to solution in five simple steps. Experience healthcare that
                        works around your life.
                    </p>

                    <Row className="g-3 g-md-4 justify-content-center">
                        {[
                            {
                                icon: "bi bi-search", // search icon
                                title: "Tell us your need",
                                desc: "Describe your symptoms or health concern. Our AI helps you find the right specialist.",
                                num: 1,
                                gradient: "linear-gradient(135deg, #ff6a00, #ff9a00)",
                            },
                            {
                                icon: "bi bi-people", // matches icon
                                title: "See verified matches",
                                desc: "Browse licensed healthcare providers with transparent ratings, languages, and availability.",
                                num: 2,
                                gradient: "linear-gradient(135deg, #afacacff, #4b4a4aff)",
                            },
                            {
                                icon: "bi bi-calendar-event", // calendar icon
                                title: "Book a visit",
                                desc: "Schedule virtual, in-person, or home visits with upfront pricing and instant confirmation.",
                                num: 3,
                                gradient: "linear-gradient(135deg, #47240bff, #ff3d00)",
                            },
                            {
                                icon: "bi bi-clipboard-check", // plan icon
                                title: "Get a plan",
                                desc: "Receive personalized care plans, prescriptions, lab orders, and follow-up recommendations.",
                                num: 4,
                                gradient: "linear-gradient(135deg, #ff6a00, #ff9a00)",
                            },
                            {
                                icon: "bi bi-activity", // stay on track icon
                                title: "Stay on track",
                                desc: "Manage ongoing care with Care Circles, reminders, and proactive health insights.",
                                num: 5,
                                gradient: "linear-gradient(135deg, #ff6a00, #4b4a4aff)",
                            },
                        ].map((item, index) => (
                            <Col key={index} xs={12} sm={6} md={4} lg={2} className="mb-3 mb-md-0">
                                <Card
                                    className="border-0 p-3 p-md-4 text-center h-100"
                                    style={{
                                        borderRadius: "16px",
                                        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                        minHeight: "280px",
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-5px)";
                                        e.currentTarget.style.boxShadow =
                                            "0 12px 25px rgba(0,0,0,0.15)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow =
                                            "0 8px 20px rgba(0,0,0,0.08)";
                                    }}
                                >
                                    {/* Number badge */}
                                    <div
                                        className="position-absolute top-0 end-0 text-dark translate-middle mt-3 mt-md-4"
                                        style={{
                                            backgroundColor: "#f0ececff",
                                            color: "white",
                                            width: "28px",
                                            height: "28px",
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: "bold",
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        {item.num}
                                    </div>

                                    {/* Icon with gradient background */}
                                    <div
                                        className="d-flex justify-content-center align-items-center mb-3 mt-3 mt-md-4 mx-auto"
                                        style={{
                                            width: "clamp(50px, 10vw, 64px)",
                                            height: "clamp(50px, 10vw, 64px)",
                                            borderRadius: "16px",
                                            background: item.gradient,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <i
                                            className={item.icon}
                                            style={{ fontSize: "clamp(20px, 5vw, 28px)", color: "#fff" }}
                                        ></i>
                                    </div>

                                    {/* Title */}
                                    <Card.Title
                                        className="fw-bold mb-2 mb-md-3"
                                        style={{ color: "#0f172a", fontSize: "clamp(1rem, 2.5vw, 1.15rem)" }}
                                    >
                                        {item.title}
                                    </Card.Title>

                                    {/* Description */}
                                    <Card.Text
                                        className="text-muted"
                                        style={{ fontSize: "clamp(0.85rem, 2vw, 0.95rem)", lineHeight: "1.5" }}
                                    >
                                        {item.desc}
                                    </Card.Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section>


                {/* Section 2: Find care for any specialty */}
                <section className="container mb-4 mb-md-5">
                    <h1 className="fw-bold text-center mb-3" style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)" }}>Find care for any specialty</h1>
                    <p className="text-muted text-center mb-4" style={{ 
                        maxWidth: '800px', 
                        margin: '0 auto', 
                        fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
                        lineHeight: "1.6"
                    }}>
                        Connect with verified specialists across all medical fields. From routine check-ups to specialized care.
                    </p>

                    <div className="d-flex justify-content-center mb-4">
                        <img
                            src="https://i.ibb.co/vvcQRH2J/Whats-App-Image-2025-09-06-at-16-57-00-2f99a81a.jpg"
                            fluid
                            rounded
                            alt="Medical Specialties"
                            className="img-fluid"
                            style={{ maxHeight: 'clamp(150px, 30vw, 200px)', width: 'auto' }}
                        />
                    </div>

                    <Row className="g-2 g-md-3">
                        {[
                            { name: "Primary Care", desc: "Family medicine and internal medicine", popular: true },
                            { name: "Pediatrics", desc: "Children's health and development", popular: true },
                            { name: "Mental Health", desc: "Psychiatry, therapy, and counseling", popular: true },
                            { name: "Dermatology", desc: "Skin, hair, and nail conditions", popular: false },
                            { name: "Cardiology", desc: "Heart and cardiovascular health", popular: false },
                            { name: "Endocrinology", desc: "Diabetes and hormone disorders", popular: false },
                            { name: "Gastroenterology", desc: "Digestive system health", popular: false },
                            { name: "Neurology", desc: "Brain and nervous system", popular: false },
                            { name: "Orthopedics", desc: "Bones, joints, and muscles", popular: true },
                            { name: "Urology", desc: "Urinary and reproductive systems", popular: false },
                            { name: "OB/GYN", desc: "Women's reproductive health", popular: true },
                            { name: "Urgent Care", desc: "Non-emergency medical care", popular: true }
                        ].map((specialty, index) => (
                            <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-2 mb-md-0">
                                <Card
                                    className="border-1 shadow-sm px-2 px-md-3 py-3 py-md-4 h-100"
                                    style={{
                                        backgroundColor: specialty.popular ? '#fff8f2' : '#ffffff',
                                        border: specialty.popular ? '1px solid #f3b88dff' : '1px solid #e0e0e0',
                                        borderRadius: '12px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseOver={e => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(255, 106, 3, 0.15)';
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '';
                                    }}
                                >
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        {specialty.popular && (
                                            <span className="badge rounded-pill px-2 py-1" style={{
                                                fontSize: '0.6rem',
                                                background: "linear-gradient(90deg, #ff6a00, #8a3200ff)",
                                                color: 'white'
                                            }}>
                                                Popular
                                            </span>
                                        )}
                                    </div>
                                    <Card.Title className="fw-bold mb-2" style={{ color: '#333', fontSize: "clamp(1rem, 2.5vw, 1.1rem)" }}>{specialty.name}</Card.Title>
                                    <Card.Text className="small" style={{ color: '#666', fontSize: "clamp(0.8rem, 2vw, 0.9rem)" }}>{specialty.desc}</Card.Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* <div className="text-center mt-4">
                        <button className="btn px-3 px-md-4 py-2 border-0" style={{
                            background: "linear-gradient(90deg, #ff6a00, #662f02ff)",
                            fontWeight: '500',
                            color: 'white',
                            fontSize: "clamp(0.9rem, 2.5vw, 1rem)"
                        }}>
                            View All Specialties →
                        </button>
                    </div> */}
                </section>

                {/* Section 3: Healthcare that adapts to you */}
                <section className="container py-3 py-md-4 py-lg-5">
                    <Row className="gy-4 gy-md-5 align-items-center">

                        <h1 className="fw-bold mb-2 text-center" style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)" }}>Healthcare that adapts to you </h1>
                        <p className="text-center mb-4 mb-md-5" style={{ 
                            fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
                            maxWidth: "800px",
                            margin: "0 auto",
                            lineHeight: "1.6"
                        }}>
                            Experience healthcare designed around your needs, language, and lifestyle. No matter
                            where you are or what you speak.
                        </p>

                        {/* Left: Text & Features */}
                        <Col xs={12} md={6} className="order-2 order-md-1">
                            <div className="d-flex flex-column gap-2 gap-sm-3">
                                {[
                                    {
                                        icon: "bi-translate",
                                        title: "Multilingual Support",
                                        desc: "Available in 24+ languages with real-time captions and cultural adaptations.",
                                        grad: "linear-gradient(110deg,#ff5a1f 30%, #fae4dcff 100%)",
                                    },
                                    {
                                        icon: "bi-shield-check",
                                        title: "Transparent Pricing",
                                        desc: "See upfront costs, insurance coverage, and payment options before booking.",
                                        grad: "linear-gradient(110deg,#e7eef6 30%, #292929ff 100%)",
                                        iconColor: "#1f3347",
                                    },
                                    {
                                        icon: "bi-people-fill",
                                        title: "Care Circles",
                                        desc: "Invite family members to help manage appointments, medications, and health records.",
                                        grad: "linear-gradient(180deg,#3b2c25 0%, #6b564d 100%)",
                                    },
                                    {
                                        icon: "bi-shield-lock",
                                        title: "Private by Default",
                                        desc: "HIPAA-compliant platform with end-to-end encryption and granular privacy controls.",
                                        grad: "linear-gradient(180deg,#ff7a28 0%, #ff5a1f 100%)",
                                    },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="feature-item d-flex align-items-start gap-3 p-2 p-sm-3"
                                        style={{ 
                                            borderRadius: "12px",
                                            backgroundColor: "rgba(255,255,255,0.8)",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                                        }}
                                    >
                                        <div
                                            className="icon-tile d-flex align-items-center justify-content-center flex-shrink-0"
                                            style={{
                                                width: "clamp(42px, 8vw, 48px)",
                                                height: "clamp(42px, 8vw, 48px)",
                                                borderRadius: "12px",
                                                background: item.grad,
                                                boxShadow: "0 6px 14px rgba(15,40,70,.08)",
                                            }}
                                        >
                                            <i
                                                className={`bi ${item.icon}`}
                                                style={{
                                                    fontSize: "clamp(16px, 3vw, 20px)",
                                                    color: item.iconColor || "#fff",
                                                    filter: "drop-shadow(0 2px 2px rgba(0,0,0,.15))",
                                                }}
                                            />
                                        </div>

                                        <div className="flex-grow-1">
                                            <h5
                                                className="fw-semibold mb-1"
                                                style={{ color: "#0f2846", fontSize: "clamp(1rem, 2.5vw, 1.05rem)" }}
                                            >
                                                {item.title}
                                            </h5>
                                            <p
                                                className="mb-0"
                                                style={{ color: "#6b7280", fontSize: "clamp(0.9rem, 2vw, 0.98rem)", lineHeight: 1.5 }}
                                            >
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="d-grid d-md-inline mt-5 mt-md-4 text-center">
                               <Link to="/signup">
                                <Button
                                    className="fw-bold px-4 mt-4 py-2 border-0 w-100 w-md-auto"
                                    style={{
                                        background: "linear-gradient(90deg, #ff6a00, #612701ff)",
                                        color: "#fff",
                                        borderRadius: 10,
                                        fontSize: "clamp(1rem, 2.5vw, 1.05rem)",
                                    }}
                                >
                                    Start Your Journey →
                                </Button>
                               </Link>
                            </div>
                        </Col>

                        {/* Right: Image */}
                        <Col xs={12} md={6} className="order-1 order-md-2 mb-4 mb-md-0">
                            <Image
                                src="https://i.ibb.co/1HL485z/Whats-App-Image-2025-09-08-at-11-34-53-d287b3f6.jpg"
                                fluid
                                rounded
                                alt="Doctor Consultation"
                                loading="lazy"
                                className="img-fluid"
                                style={{
                                    borderRadius: "16px",
                                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                                    objectFit: "cover",
                                    width: "100%",
                                    height: "auto"
                                }}
                            />
                        </Col>
                    </Row>
                </section>

                {/* Section 4: Practice without limits */}
                <section className="container px-3 px-md-4 px-lg-5 py-3 py-md-4 py-lg-5 mb-4 mb-md-5">
                    <Row className="gy-4 gy-md-5 align-items-start">

                        <h1 className="fw-bold text-center" style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)" }}>
                            Practice without limits
                        </h1>

                        <p className="text-center text-muted mb-4 mb-md-5" style={{ 
                            fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
                            maxWidth: "800px",
                            margin: "0 auto",
                            lineHeight: "1.6"
                        }}>
                            Focus on what you do best—caring for patients. We handle the technology, credentialing,
                            and administrative work.
                        </p>

                        {/* Left: Stat card */}
                        <Col xs={12} md={6} className="order-2 order-md-1">
                            <div
                                className="p-3 p-sm-4 rounded-3 mx-auto"
                                style={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #ffe0cc",
                                    maxWidth: 560,
                                }}
                            >
                                <div className="d-flex align-items-center mb-3">
                                    <div
                                        className="d-flex align-items-center justify-content-center rounded-circle me-2 flex-shrink-0"
                                        style={{ width: 40, height: 40, backgroundColor: "#ffefe5" }}
                                    >
                                        <i
                                            className="bi bi-heart-fill"
                                            style={{ fontSize: 18, color: "#ff6a03" }}
                                        />
                                    </div>
                                    <h4
                                        className="fw-bold mb-0"
                                        style={{ color: "#333", fontSize: "clamp(1.05rem, 3vw, 1.35rem)" }}
                                    >
                                        Join 10,000+ providers
                                    </h4>
                                </div>

                                <p className="mb-4" style={{ color: "#666", fontSize: "clamp(0.9rem, 2vw, 1rem)" }}>
                                    Building the future of healthcare together
                                </p>

                                <div className="d-flex flex-wrap justify-content-between gap-3">
                                    <div className="text-center flex-fill">
                                        <div
                                            className="fw-bold"
                                            style={{ color: "#ff6a03", fontSize: "clamp(1rem, 3vw, 1.3rem)" }}
                                        >
                                            98%
                                        </div>
                                        <div className="small" style={{ color: "#666", fontSize: "clamp(0.8rem, 2vw, 0.9rem)" }}>
                                            Satisfaction
                                        </div>
                                    </div>
                                    <div className="text-center flex-fill">
                                        <div
                                            className="fw-bold"
                                            style={{ color: "#ff6a03", fontSize: "clamp(1rem, 3vw, 1.3rem)" }}
                                        >
                                            24h
                                        </div>
                                        <div className="small" style={{ color: "#666", fontSize: "clamp(0.8rem, 2vw, 0.9rem)" }}>
                                            Fast Payouts
                                        </div>
                                    </div>
                                    <div className="text-center flex-fill">
                                        <div
                                            className="fw-bold"
                                            style={{ color: "#ff6a03", fontSize: "clamp(1rem, 3vw, 1.3rem)" }}
                                        >
                                            50+
                                        </div>
                                        <div className="small" style={{ color: "#666", fontSize: "clamp(0.8rem, 2vw, 0.9rem)" }}>
                                            Countries
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-grid d-md-inline mt-3 mt-md-4 text-center text-md-start">
                               <Link to="/signup">
                                <Button
                                    className="fw-bold px-4 mt-4 py-2 border-0 w-100 w-md-auto"
                                    style={{
                                        background: "linear-gradient(90deg, #ff6a00, #612701ff)",
                                        color: "#fff",
                                        borderRadius: 10,
                                        fontSize: "clamp(1rem, 2.5vw, 1.05rem)",
                                    }}
                                >
                                  Join as Provider →
                                </Button>
                               </Link>
                            </div>
                        </Col>

                        {/* Right: Copy + features */}
                        <Col xs={12} md={6} className="order-1 order-md-2">

                            <div className="d-flex flex-column gap-2 gap-sm-3">
                                {[
                                    {
                                        icon: "bi-clock-fill",
                                        title: "Simple Onboarding",
                                        desc: "Get verified and start seeing patients in hours, not weeks.",
                                        grad: "linear-gradient(180deg,#ff7a28 0%, #ff5a1f 100%)",
                                        glow: "0 8px 24px rgba(255,106,3,0.25)",
                                    },
                                    {
                                        icon: "bi-robot",
                                        title: "Built-in AI Notes",
                                        desc: "Auto-generated visit summaries and care plans to save time and improve quality.",
                                        grad: "linear-gradient(180deg,#e7eef6 0%, #525252ff 100%)",
                                        glow: "0 8px 24px rgba(34,49,63,0.15)",
                                        iconColor: "#1f3347",
                                    },
                                    {
                                        icon: "bi-people-fill",
                                        title: "Grow Your Panel",
                                        desc: "Connect with high-intent patients actively seeking your expertise.",
                                        grad: "linear-gradient(180deg,#3b2c25 0%, #6b564d 100%)",
                                        glow: "0 8px 24px rgba(54,42,36,0.25)",
                                    },
                                    {
                                        icon: "bi-award",
                                        title: "Reputation Control",
                                        desc: "Build your Trust Score with verified reviews and quality metrics you control.",
                                        grad: "linear-gradient(180deg,#ff7a28 0%, #ff5a1f 100%)",
                                        glow: "0 8px 24px rgba(255,106,3,0.25)",
                                    },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="d-flex align-items-start gap-3 p-2 p-sm-3"
                                        style={{ 
                                            borderRadius: "12px",
                                            backgroundColor: "rgba(255,255,255,0.8)",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                                        }}
                                    >
                                        <div
                                            className="d-flex align-items-center justify-content-center flex-shrink-0"
                                            style={{
                                                width: "clamp(42px, 8vw, 52px)",
                                                height: "clamp(42px, 8vw, 52px)",
                                                borderRadius: 14,
                                                background: item.grad,
                                                boxShadow: item.glow,
                                            }}
                                        >
                                            <i
                                                className={`bi ${item.icon}`}
                                                style={{
                                                    fontSize: "clamp(16px, 3vw, 22px)",
                                                    color: item.iconColor || "#fff",
                                                    filter: "drop-shadow(0 2px 2px rgba(0,0,0,.15))",
                                                }}
                                            />
                                        </div>

                                        <div className="flex-grow-1">
                                            <h5
                                                className="fw-semibold mb-1"
                                                style={{ color: "#0f2846", fontSize: "clamp(1rem, 2.5vw, 1.05rem)" }}
                                            >
                                                {item.title}
                                            </h5>
                                            <p
                                                className="mb-0"
                                                style={{ color: "#6b7280", fontSize: "clamp(0.9rem, 2vw, 0.98rem)", lineHeight: 1.5 }}
                                            >
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </section>

                {/* Section 5: Find Trusted Healthcare Providers */}
                <section className="container">
                    <h1 className="text-center fw-bold mb-3" style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)" }}>Find Trusted Healthcare Providers</h1>
                    <p className="text-center mb-4" style={{ 
                        maxWidth: '800px', 
                        margin: '0 auto', 
                        color: '#666', 
                        fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
                        lineHeight: "1.6"
                    }}>
                        Our providers are vetted with comprehensive trust scores based on verification, reviews, and performance.
                    </p>

                    <div className="d-flex flex-column flex-md-row justify-content-center mb-4 gap-2">
                        <div className="position-relative" style={{ maxWidth: '400px', width: '100%' }}>
                            <input
                                type="text"
                                placeholder="Search by specialty, name, or language..."
                                className="form-control"
                                style={{
                                    padding: '0.75rem 1rem 0.75rem 3rem',
                                    borderRadius: '8px',
                                    border: '1px solid #ffd1b3',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.boxShadow = '0 0 0 3px rgba(255, 106, 3, 0.2)';
                                    e.target.style.borderColor = '#ff6a03';
                                }}
                                onBlur={(e) => {
                                    e.target.style.boxShadow = 'none';
                                    e.target.style.borderColor = '#ffd1b3';
                                }}
                            />
                            <i className="bi bi-search position-absolute" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#ff6a03' }}></i>
                        </div>
                        <Button className="px-4 py-2 d-flex align-items-center justify-content-center mt-2 mt-md-0" style={{
                            backgroundColor: '#ff6a03',
                            borderColor: '#ff6a03',
                            borderRadius: '8px',
                            fontWeight: '500',
                            minWidth: '120px'
                        }}>
                            <i className="bi bi-funnel me-2"></i>
                            Filters
                        </Button>
                    </div>

                    {/* Platform Trust Overview */}

                    <Row className="mb-4 mb-md-5">
                        <Col xs={12}>
                            <Card className="border-0 p-3 p-md-4" style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                boxShadow: '0 8px 20px rgba(255, 106, 3, 0.1)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 12px 25px rgba(255, 106, 3, 0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 106, 3, 0.1)';
                                }}>
                                <div className="mb-3 p-0 border-0">
                                    <h4 className="fw-bold mb-0" style={{ fontSize: "clamp(1.1rem, 3vw, 1.3rem)" }}>Platform Trust Overview</h4>
                                </div>
                                <Row className="g-3 g-md-4 justify-content-center align-items-center">
                                    <Col xs={6} md={3}>
                                        <div className="text-center">
                                            <div className="fw-bold" style={{ color: '#ff6a03', fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>85</div>
                                            <div className="small" style={{ color: '#666', fontSize: "clamp(0.8rem, 2vw, 0.9rem)" }}>Avg Trust Score</div>
                                        </div>
                                    </Col>
                                    <Col xs={6} md={3}>
                                        <div className="text-center">
                                            <div className="fw-bold" style={{ color: '#666', fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>1</div>
                                            <div className="small" style={{ color: '#666', fontSize: "clamp(0.8rem, 2vw, 0.9rem)" }}>Exceptional</div>
                                        </div>
                                    </Col>
                                    <Col xs={6} md={3}>
                                        <div className="text-center">
                                            <div className="fw-bold" style={{ color: '#ff6a03', fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>1</div>
                                            <div className="small" style={{ color: '#666', fontSize: "clamp(0.8rem, 2vw, 0.9rem)" }}>Excellent</div>
                                        </div>
                                    </Col>
                                    <Col xs={6} md={3}>
                                        <div className="text-center">
                                            <div className="fw-bold" style={{ color: '#666', fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>3</div>
                                            <div className="small" style={{ color: '#666', fontSize: "clamp(0.8rem, 2vw, 0.9rem)" }}>Total Providers</div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>

                    {/* Trust Score Example */}
                    <Row className="mb-4 mb-md-5 justify-content-center">
                        <Col xs={12} md={10} lg={8}>
                            <Card
                                className="border-0 p-3 p-md-4"
                                style={{
                                    backgroundColor: "#fff",
                                    borderRadius: "16px",
                                    boxShadow: "0 10px 28px rgba(15,40,70,.08)",
                                    transition: "transform .25s ease, box-shadow .25s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-4px)";
                                    e.currentTarget.style.boxShadow = "0 16px 34px rgba(15,40,70,.12)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 10px 28px rgba(15,40,70,.08)";
                                }}
                            >
                                <div className="mb-3 p-0 border-0">
                                    <h2 className="fw-bold text-center mb-0" style={{ color: "#0f2846", fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>
                                        Trust Score Example
                                    </h2>
                                </div>

                                <Card.Body>
                                    {/* Header */}
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="mb-0" style={{ color: "#0f2846", fontSize: "clamp(1rem, 2.5vw, 1.2rem)" }}>
                                            Provider Trust Score
                                        </h5>
                                        <span
                                            className="badge px-2 py-1 rounded-pill"
                                            style={{ background: "#ffe8d9", color: "#ff6a03", fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}
                                        >
                                            Excellent
                                        </span>
                                    </div>

                                    <div className="d-flex align-items-center mb-4">
                                        <div className="me-3">
                                            <div
                                                className="text-white d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: "clamp(46px, 10vw, 56px)",
                                                    height: "clamp(46px, 10vw, 56px)",
                                                    borderRadius: "50%",
                                                    fontSize: "clamp(1rem, 3vw, 1.15rem)",
                                                    fontWeight: 700,
                                                    background:
                                                        "linear-gradient(180deg,#ff7a28 0%, #ff5a1f 100%)",
                                                    boxShadow: "0 8px 18px rgba(255,106,3,.35)",
                                                }}
                                            >
                                                86
                                            </div>
                                        </div>
                                        <div>
                                            <h6 className="mb-0 fw-semibold" style={{ color: "#0f2846", fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)" }}>
                                                Excellent Provider
                                            </h6>
                                            <p className="small mb-0" style={{ color: "#6b7280", fontSize: "clamp(0.8rem, 2vw, 0.9rem)" }}>
                                                Based on verification, reviews, and performance
                                            </p>
                                        </div>
                                    </div>

                                    {/* Trust Score Breakdown */}
                                    <div className="mb-4">
                                        <h6 className="mb-3 fw-semibold" style={{ color: "#0f2846", fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)" }}>
                                            Trust Score Breakdown
                                        </h6>

                                        {[
                                            {
                                                label: "Verification",
                                                value: 30,
                                                max: 30,
                                                desc: "License and credential verification",
                                                icon: "bi-shield-check",
                                            },
                                            {
                                                label: "Patient Reviews",
                                                value: 22,
                                                max: 25,
                                                desc: "Patient satisfaction and ratings",
                                                icon: "bi-star-fill",
                                            },
                                            {
                                                label: "Response Speed",
                                                value: 12,
                                                max: 15,
                                                desc: "Average response time to patients",
                                                icon: "bi-lightning-fill",
                                            },
                                            {
                                                label: "Calendar Updates",
                                                value: 12,
                                                max: 15,
                                                desc: "Availability calendar maintenance",
                                                icon: "bi-calendar-check",
                                            },
                                            {
                                                label: "Completion Rate",
                                                value: 8,
                                                max: 10,
                                                desc: "Appointment completion percentage",
                                                icon: "bi-check-circle-fill",
                                            },
                                            {
                                                label: "Profile Quality",
                                                value: 2,
                                                max: 5,
                                                desc: "Complete professional profile",
                                                icon: "bi-person-badge",
                                            },
                                        ].map((item, idx) => {
                                            const pct = (item.value / item.max) * 100;
                                            const capWidth = 26; // px
                                            return (
                                                <div key={idx} className="mb-3">
                                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                                        <span style={{ color: "#0f2846", fontSize: "clamp(0.8rem, 2vw, 0.9rem)" }}>
                                                            <i
                                                                className={`${item.icon} me-2`}
                                                                style={{ color: "#8aa0b8" }}
                                                            />
                                                            {item.label}
                                                        </span>
                                                        <span className="small" style={{ color: "#6b7280", fontSize: "clamp(0.8rem, 2vw, 0.9rem)" }}>
                                                            {item.value}/{item.max}
                                                        </span>
                                                    </div>

                                                    {/* track + fill + dark-blue cap (like the screenshot) */}
                                                    <div
                                                        className="position-relative w-100"
                                                        style={{
                                                            height: 8,
                                                            background: "#f3f4f6",
                                                            borderRadius: 4,
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                height: "100%",
                                                                width: `${pct}%`,
                                                                background:
                                                                    "linear-gradient(90deg,#ff6a03 0%, #ff8c3f 100%)",
                                                            }}
                                                        />
                                                        <div
                                                            style={{
                                                                position: "absolute",
                                                                top: 0,
                                                                left: `calc(${pct}% - ${capWidth / 2}px)`,
                                                                width: capWidth,
                                                                height: "100%",
                                                                width: "100%",
                                                                borderRadius: 4,
                                                                background: "#132d4b",
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="small mt-1" style={{ color: "#6b7280", fontSize: "clamp(0.8rem, 2vw, 0.9rem)" }}>
                                                        {item.desc}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="small" style={{ color: "#6b7280", fontSize: "clamp(0.8rem, 2vw, 0.9rem)" }}>
                                            Total Score
                                        </span>
                                        <span className="fw-bold" style={{ color: "#ff6a03", fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)" }}>
                                            86/100
                                        </span>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>


                    {/* Provider Cards */}
                    <Row className="g-3 g-md-4 justify-content-center">
                        {[
                            {
                                name: "Dr. Sarah Chen",
                                specialty: "Internal Medicine",
                                rating: 4.9,
                                reviews: 127,
                                trustScore: 86,
                                status: "Excellent",
                                languages: ["English", "Mandarin", "Spanish"],
                                nextAvailable: "Today, 2:30 PM",
                                logo: "https://i.ibb.co/xKF1WPkH/image.png"
                            },
                            {
                                name: "Dr. Michael Rodriguez",
                                specialty: "Pediatrics",
                                rating: 4.8,
                                reviews: 89,
                                trustScore: 92,
                                status: "Exceptional",
                                languages: ["English", "Spanish"],
                                nextAvailable: "Tomorrow, 9:00 AM",
                                logo: "https://i.ibb.co/xKF1WPkH/image.png"
                            },
                            {
                                name: "Dr. Aisha Patel",
                                specialty: "Mental Health",
                                rating: 4.7,
                                reviews: 156,
                                trustScore: 78,
                                status: "Very Good",
                                languages: ["English", "Hindi", "Gujarati"],
                                nextAvailable: "Today, 4:00 PM",
                                logo: "https://i.ibb.co/xKF1WPkH/image.png"
                            }
                        ].map((provider, index) => (
                            <Col key={index} xs={12} sm={6} lg={4} className="mb-3 mb-md-0">
                                <Card className="border-1 p-3 p-md-4 h-100" style={{
                                    backgroundColor: 'white',
                                    border: "1px solid rgba(231, 231, 231, 1)",
                                    borderRadius: '16px',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-8px)';
                                        e.currentTarget.style.boxShadow = '0 15px 30px rgba(185, 185, 185, 0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(185, 185, 185, 0.15)';
                                    }}>
                                    <div className="d-flex align-items-start mb-3">
                                        <img
                                            src={provider.logo}
                                            alt="Logo"
                                            className="rounded-circle me-3"
                                            style={{ width: '40px', height: '40px' }}
                                        />
                                        <div>
                                            <Card.Title className="fw-bold mb-0" style={{ color: '#333', fontSize: "clamp(1rem, 2.5vw, 1.1rem)" }}>{provider.name}</Card.Title>
                                            <Card.Subtitle className="small" style={{ color: '#666', fontSize: "clamp(0.8rem, 2vw, 0.9rem)" }}>{provider.specialty}</Card.Subtitle>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center mb-3">
                                        <i className="bi bi-star-fill me-1" style={{ color: '#ffc107' }}></i>
                                        <span style={{ color: '#333', fontSize: "clamp(0.9rem, 2vw, 1rem)" }}>{provider.rating} ({provider.reviews} reviews)</span>
                                    </div>

                                    <div className="d-flex align-items-center mb-3">
                                        <span className="me-1" style={{ color: '#ff6a03' }}>•</span>
                                        <span className="fw-bold" style={{ color: '#ff6a03', fontSize: "clamp(0.9rem, 2vw, 1rem)" }}>{provider.trustScore}</span>
                                        <span className="ms-1" style={{ color: '#666', fontSize: "clamp(0.9rem, 2vw, 1rem)" }}>Trust Score</span>
                                        <span className={`badge ms-2 px-2 py-1 rounded-pill ${provider.status === 'Excellent' ? '' : provider.status === 'Exceptional' ? 'bg-dark' : 'bg-primary'}`}
                                            style={{
                                                backgroundColor: provider.status === 'Excellent' ? '#ffefe5' : '',
                                                color: provider.status === 'Excellent' ? '#ff6a03' : 'white',
                                                fontSize: "clamp(0.7rem, 2vw, 0.8rem)"
                                            }}>
                                            {provider.status}
                                        </span>
                                    </div>

                                    <div className="small mb-3" style={{ color: '#666', fontSize: "clamp(0.8rem, 2vw, 0.9rem)" }}>
                                        <strong>Languages:</strong> {provider.languages.join(', ')}
                                    </div>

                                    <div className="small" style={{ color: '#666', fontSize: "clamp(0.8rem, 2vw, 0.9rem)" }}>
                                        <strong>Next Available:</strong> <span style={{ color: '#ff6a03' }}>{provider.nextAvailable}</span>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <Row className="mt-4 mt-md-5">
                        {[
                            { icon: "bi-search", title: "Transparent Ratings", desc: "See exactly how each provider earns their trust score with detailed breakdowns." },
                            { icon: "bi-shield-check", title: "Verified Credentials", desc: "All providers undergo thorough verification of licenses and certifications." },
                            { icon: "bi-award", title: "Quality Assurance", desc: "Continuous monitoring ensures providers maintain high standards of care." }
                        ].map((item, index) => (
                            <Col key={index} xs={12} md={4} className="mb-3 mb-md-0">
                                <Card className="border-1 p-3 p-md-4 text-center h-100" style={{
                                    backgroundColor: 'white',
                                    borderRadius: '16px',
                                    border: "1px solid rgba(231, 231, 231, 1)",
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}>
                                    <div className="d-flex justify-content-center mb-3">
                                        <div className="d-flex align-items-center justify-content-center rounded-circle"
                                            style={{
                                                width: 'clamp(50px, 10vw, 60px)',
                                                height: 'clamp(50px, 10vw, 60px)',
                                                backgroundColor: '#ffefe5'
                                            }}>
                                            <i className={item.icon} style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', color: '#ff6a03' }}></i>
                                        </div>
                                    </div>
                                    <Card.Title className="text-dark mb-2" style={{ fontSize: "clamp(1rem, 2.5vw, 1.1rem)" }}>{item.title}</Card.Title>
                                    <Card.Text className="small" style={{ color: '#666', fontSize: "clamp(0.8rem, 2vw, 0.9rem)" }}>{item.desc}</Card.Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* <div className="text-center mt-4 mb-5">
                        <Button className="px-4 border-0 py-2 fw-bold" style={{
                            background: "linear-gradient(90deg, #ff6a00, #834104ff)",
                            borderColor: '#ff6a03',
                            borderRadius: '8px',
                            fontSize: "clamp(1rem, 2.5vw, 1.1rem)"
                        }}>
                            Browse All Providers
                        </Button>
                    </div> */}
                </section>
            </div>
        </div>
    );
};

export default FeaturesPage;