import React, { useState } from 'react';

const TermsConditions = () => {
  const [activeSection, setActiveSection] = useState('agreement');

  const termsSections = {
    agreement: {
      title: 'User Agreement',
      content: `By using TeleMediBridge®, you agree to our Terms of Service and Privacy Policy. These terms govern your use of our platform and services.`
    },
    usage: {
      title: 'Appropriate Use',
      content: `You agree to use TeleMediBridge® only for lawful medical purposes and to provide accurate information during registration. You also agree to respect the privacy and confidentiality of other users.`
    },
    limitations: {
      title: 'Service Limitations',
      content: `TeleMediBridge® is not a replacement for emergency care. In case of emergencies, users should dial local emergency services immediately. Our platform is designed for non-emergency medical consultations and services.`
    },
    modifications: {
      title: 'Terms Modifications',
      content: `We reserve the right to update our Terms to comply with evolving healthcare regulations. Users will be notified of any significant changes to these terms.`
    },
    account: {
      title: 'Account Responsibility',
      content: `You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.`
    }
  };

  return (
    <div className="terms-of-service">
      <header className="terms-header">
        <div className="container">
          <h1>Terms of Service</h1>
          <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
      </header>

      <div className="container main-content">
        <div className="sidebar">
          <h2>Sections</h2>
          <ul>
            {Object.keys(termsSections).map(section => (
              <li key={section}>
                <button 
                  className={activeSection === section ? 'active' : ''}
                  onClick={() => setActiveSection(section)}
                >
                  {termsSections[section].title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="terms-content">
          <h2>{termsSections[activeSection].title}</h2>
          <p>{termsSections[activeSection].content}</p>
          
          {activeSection === 'usage' && (
            <div className="usage-guidelines">
              <h3>Usage Guidelines</h3>
              <ul>
                <li>Use the platform for lawful medical purposes only</li>
                <li>Provide accurate information during registration</li>
                <li>Respect the privacy and confidentiality of other users</li>
                <li>Do not share your account credentials with others</li>
                <li>Do not use the service for unauthorized medical practices</li>
              </ul>
            </div>
          )}
          
          {activeSection === 'limitations' && (
            <div className="emergency-notice">
              <div className="warning-banner">
                <h3>⚠️ Important Emergency Notice</h3>
                <p>TeleMediBridge® is not a replacement for emergency care. In case of health emergencies, please:</p>
                <ol>
                  <li>Call your local emergency number immediately</li>
                  <li>Go to the nearest emergency room</li>
                  <li>Do not rely on telemedicine for emergency situations</li>
                </ol>
              </div>
            </div>
          )}
          
          <div className="acceptance-section">
            <h3>Acceptance of Terms</h3>
            <p>By accessing or using TeleMediBridge®, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
          </div>
        </div>
      </div>

      <footer className="terms-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} TeleMediBridge®. All rights reserved.</p>
          <p>For questions about these terms, please contact us at legal@telemedibridge.com</p>
        </div>
      </footer>

     <style jsx>{`
  .terms-of-service {
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
  
  .terms-header {
    background: linear-gradient(135deg, #ff6a03 0%, #e55a02 100%);
    color: white;
    padding: 2rem 0;
    text-align: center;
  }
  
  .terms-header h1 {
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
    color: #ff6a03;
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
    background-color: #fff3e6;
  }
  
  .sidebar button.active {
    background-color: #ffd9b3;
    font-weight: bold;
  }
  
  .terms-content {
    flex: 1;
    background: white;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  
  .terms-content h2 {
    color: #ff6a03;
    margin-top: 0;
  }
  
  .usage-guidelines {
    margin: 1.5rem 0;
    padding: 1rem;
    background: #fff4e6;
    border-radius: 8px;
  }
  
  .usage-guidelines h3 {
    color: #e55a02;
    margin-top: 0;
  }
  
  .usage-guidelines ul {
    padding-left: 1.5rem;
  }
  
  .usage-guidelines li {
    margin-bottom: 0.5rem;
  }
  
  .emergency-notice {
    margin: 2rem 0;
  }
  
  .warning-banner {
    background: #fff0ed;
    border-left: 4px solid #d32f2f;
    padding: 1.5rem;
    border-radius: 8px;
  }
  
  .warning-banner h3 {
    color: #c62828;
    margin-top: 0;
  }
  
  .warning-banner ol {
    padding-left: 1.5rem;
  }
  
  .warning-banner li {
    margin-bottom: 0.5rem;
  }
  
  .acceptance-section {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e0e0e0;
  }
  
  .acceptance-section h3 {
    color: #ff6a03;
  }
  
  .terms-footer {
    background: #fff3e6;
    padding: 1.5rem 0;
    text-align: center;
    color: #6c757d;
  }
  
  @media (max-width: 768px) {
    .main-content {
      flex-direction: column;
    }
    
    .sidebar {
      flex: 0 0 auto;
      width: 100%;
    }
  }
`}</style>

    </div>
  );
};

export default TermsConditions;