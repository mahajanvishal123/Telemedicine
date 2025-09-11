import React, { useState } from 'react';

const PrivacyPolicy = () => {
    const [activeSection, setActiveSection] = useState('overview');

    const policySections = {
        overview: {
            title: 'Privacy Overview',
            content: `TeleMediBridge® is committed to protecting your privacy. We comply with HIPAA, GDPR, and international data standards. We only collect necessary health and personal data with explicit user consent. Data is encrypted in transit and at rest. Users may request data access, corrections, or deletion at any time.`
        },
        dataCollection: {
            title: 'Data Collection',
            content: `We collect only the minimum necessary information to provide our healthcare services. This may include personal identification details, medical history, current health status, and treatment information. All data collection requires your explicit consent.`
        },
        dataUsage: {
            title: 'Data Usage',
            content: `Your health data is used exclusively to provide and improve our medical services, facilitate doctor consultations, and ensure proper treatment. We never sell your data to third parties.`
        },
        dataRights: {
            title: 'Your Rights',
            content: `You have the right to access, correct, or delete your personal data at any time. You can also request a copy of your data or withdraw consent for data processing. Contact our privacy team to exercise these rights.`
        },
        security: {
            title: 'Security Measures',
            content: `We implement industry-standard security measures including end-to-end encryption, secure data storage, regular security audits, and strict access controls to protect your sensitive health information.`
        }
    };

    return (
        <div className="privacy-policy">
            <header className="policy-header">
                <div className="container">
                    <h1>Privacy Policy</h1>
                    <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>
                </div>
            </header>

            <div className="container main-content">
                <div className="sidebar">
                    <h2 className='mb-3'>Sections</h2>
                    <ul>
                        {Object.keys(policySections).map(section => (
                            <li key={section}>
                                <button
                                    className={activeSection === section ? 'active' : ''}
                                    onClick={() => setActiveSection(section)}
                                >
                                    {policySections[section].title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="policy-content">
                    <h2>{policySections[activeSection].title}</h2>
                    <p>{policySections[activeSection].content}</p>

                    {activeSection === 'overview' && (
                        <div className="compliance-badges grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                            <div className="badge bg-[#2a2d32] p-6 rounded-lg shadow-md text-center">
                                <h3 className="text-xl font-semibold text-[#ff6a03] mb-3">HIPAA Compliant</h3>
                                <p className="text-dark leading-relaxed text-wrap">
                                    We meet all Health Insurance Portability and Accountability Act requirements
                                </p>
                            </div>

                            <div className="badge bg-[#2a2d32] p-6 rounded-lg shadow-md text-center">
                                <h3 className="text-xl font-semibold text-[#ff6a03] mb-3">GDPR Compliant</h3>
                                <p className="text-dark leading-relaxed text-wrap">
                                    We adhere to General Data Protection Regulation standards
                                </p>
                            </div>

                            <div className="badge bg-[#2a2d32] p-6 rounded-lg shadow-md text-center">
                                <h3 className="text-xl font-semibold text-[#ff6a03] mb-3">Data Encrypted</h3>
                                <p className="text-dark leading-relaxed text-wrap">
                                    All data is encrypted both in transit and at rest
                                </p>
                            </div>
                        </div>


                    )}

                    <div className="contact-info">
                        <h3>Contact Our Privacy Team</h3>
                        <p>For questions about our privacy practices or to exercise your data rights, please contact us:</p>
                        <ul>
                            <li>Email: privacy@telemedibridge.com</li>
                            <li>Phone: +1 (800) 123-TELE</li>
                            <li>Address: 123 Healthcare Ave, Medical Center, CA 94305</li>
                        </ul>
                    </div>
                </div>
            </div>

            <footer className="policy-footer">
                <div className="container">
                    <p>© {new Date().getFullYear()} TeleMediBridge®. All rights reserved.</p>
                    <p>For complete details, please review our full policy on our website.</p>
                </div>
            </footer>

            <style jsx>{`
        .privacy-policy {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f8f9fa;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .policy-header {
          background: linear-gradient(135deg, #f97316 0%, #a1480dff 100%);
          color: white;
          padding: 2rem 0;
          text-align: center;
        }
        
        .policy-header h1 {
          margin: 0;
          font-size: 2.5rem;
        }
        
        .last-updated {
          opacity: 0.9;
          font-size: 0.9rem;
        }
        
        .main-content {
          display: flex;
          padding: 2rem 0;
          gap: 2rem;
        }
        
        .sidebar {
          flex: 0 0 250px;
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          align-self: flex-start;
        }
        
        .sidebar h2 {
          margin-top: 0;
          color: #f97316;
          font-size: 1.2rem;
        }
        
        .sidebar ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .sidebar li {
          margin-bottom: 0.5rem;
        }
        
        .sidebar button {
          width: 100%;
          text-align: left;
          padding: 0.75rem;
          background: none;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .sidebar button:hover {
          background-color: #fdefe3ff;
        }
        
        .sidebar button.active {
          background-color: #fbcfbbff;
          font-weight: bold;
        }
        
        .policy-content {
          flex: 1;
          background: white;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .policy-content h2 {
          color: #f97316;
          margin-top: 0;
        }
        
        .compliance-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin: 2rem 0;
        }
        
        .badge {
          flex: 1;
          min-width: 200px;
          background: #f5f1e8ff;
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #af814cff;
        }
        
        .badge h3 {
          margin-top: 0;
          color: #e77325ff;
        }
        
        .contact-info {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e0e0e0;
        }
        
        .contact-info h3 {
          color: #f97316;
        }
        
        .policy-footer {
          background: #fdefe3ff;
          padding: 1.5rem 0;
          text-align: center;
          color: #7a6354ff;
        }
        
        @media (max-width: 768px) {
          .main-content {
            flex-direction: column;
          }
          
          .sidebar {
            flex: 0 0 auto;
            width: 100%;
          }
          
          .compliance-badges {
            flex-direction: column;
          }
        }
      `}</style>
        </div>
    );
};

export default PrivacyPolicy;