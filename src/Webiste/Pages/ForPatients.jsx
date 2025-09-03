// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';

const ForPatients = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  const specialties = ['Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'Neurology', 'Psychiatry'];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
   <Header/>

      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-r from-white via-gray-50 to-blue-50 py-20 lg:py-32 overflow-hidden"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=modern%20healthcare%20facility%20with%20professional%20medical%20staff%20in%20white%20coats%2C%20clean%20bright%20hospital%20environment%20with%20natural%20lighting%2C%20soft%20blue%20and%20white%20color%20scheme%2C%20professional%20medical%20atmosphere%2C%20high%20quality%20photography%2C%20peaceful%20and%20trustworthy%20setting&width=1440&height=600&seq=hero-medical-bg&orientation=landscape')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="absolute inset-0 bg-white bg-opacity-80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-[#212529] leading-tight mb-6">
                Book Healthcare 
                <span className="text-[#ff6a03]"> Appointments</span>
                <br />
                in Minutes
              </h1>
              <p className="text-xl text-[#424649] mb-8 leading-relaxed">
                Access licensed doctors and specialists, invite family to Care Circles, and manage prescriptions or follow-up care seamlessly. Designed for ease, trust, and dignity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link className="text-decoration-none" to="/login">
                <button className="bg-[#ff6a03] hover:bg-[#e55a02] text-white px-8 py-4 text-lg font-semibold transition-colors cursor-pointer whitespace-nowrap !rounded-button">
                  <i className="fas fa-calendar-plus mr-2"></i>
                  Book Now
                </button>
                </Link>
                {/* <button className="border-2 border-[#ff6a03] text-[#ff6a03] hover:bg-[#ff6a03] hover:text-white px-8 py-4 text-lg font-semibold transition-colors cursor-pointer whitespace-nowrap !rounded-button">
                  <i className="fas fa-play mr-2"></i>
                  Watch Demo
                </button> */}
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <img 
                  src="https://readdy.ai/api/search-image?query=diverse%20group%20of%20happy%20patients%20and%20healthcare%20professionals%20in%20modern%20medical%20setting%2C%20smiling%20doctor%20with%20stethoscope%2C%20professional%20medical%20photography%2C%20clean%20white%20background%2C%20warm%20and%20welcoming%20atmosphere%2C%20high%20quality%20portrait%20style&width=600&height=500&seq=hero-patients&orientation=portrait"
                  alt="Healthcare professionals and patients"
                  className="w-full h-auto object-cover object-top rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#212529] mb-4">
              Everything You Need for Better Healthcare
            </h2>
            <p className="text-xl text-[#424649] max-w-3xl mx-auto">
              Our comprehensive platform puts you in control of your health journey with trusted professionals and innovative tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-[#ff6a03] bg-opacity-10 rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-user-md text-2xl text-[#ff6a03]"></i>
              </div>
              <h3 className="text-xl font-bold text-[#212529] mb-4">Licensed Doctors & Specialists</h3>
              <p className="text-[#424649] leading-relaxed">
                Connect with board-certified physicians and specialists across all medical fields. Get expert care from trusted professionals with verified credentials and years of experience.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-[#ff6a03] bg-opacity-10 rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-users text-2xl text-[#ff6a03]"></i>
              </div>
              <h3 className="text-xl font-bold text-[#212529] mb-4">Care Circles</h3>
              <p className="text-[#424649] leading-relaxed">
                Invite family members to your Care Circle for coordinated healthcare management. Share appointments, medications, and health updates with loved ones securely and easily.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-[#ff6a03] bg-opacity-10 rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-prescription-bottle-alt text-2xl text-[#ff6a03]"></i>
              </div>
              <h3 className="text-xl font-bold text-[#212529] mb-4">Prescription Management</h3>
              <p className="text-[#424649] leading-relaxed">
                Manage all your prescriptions in one place. Get refill reminders, track medication history, and coordinate with your pharmacy for seamless prescription fulfillment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#212529] mb-4">
              Find the Right Doctor for You
            </h2>
            <p className="text-xl text-[#424649]">
              Search by specialty, location, or availability to book your appointment today.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search doctors, specialties, or conditions..."
                    className="w-full px-6 py-4 text-lg border-2 border-gray-200 focus:border-[#ff6a03] focus:outline-none transition-colors text-sm"
                    style={{ borderRadius: '12px' }}
                  />
                  <i className="fas fa-search absolute right-6 top-1/2 transform -translate-y-1/2 text-[#424649] text-lg"></i>
                </div>
                <button className="bg-[#ff6a03] hover:bg-[#e55a02] text-white px-8 py-4 text-lg font-semibold transition-colors cursor-pointer whitespace-nowrap !rounded-button">
                  <i className="fas fa-search mr-2"></i>
                  Search
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#212529] mb-4">Popular Specialties</h3>
                <div className="flex flex-wrap gap-3">
                  {specialties.map((specialty) => (
                    <button
                      key={specialty}
                      onClick={() => setSelectedSpecialty(specialty)}
                      className={`px-6 py-3 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                        selectedSpecialty === specialty
                          ? 'bg-[#ff6a03] text-white'
                          : 'bg-white text-[#424649] border-2 border-gray-200 hover:border-[#ff6a03] hover:text-[#ff6a03]'
                      }`}
                    >
                      {specialty}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#212529] mb-4">
              Trusted by Thousands of Patients
            </h2>
            <p className="text-xl text-[#424649]">
              Your health and privacy are our top priorities. We maintain the highest standards of security and care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#ff6a03] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-3xl text-[#ff6a03]"></i>
              </div>
              <h3 className="text-2xl font-bold text-[#212529] mb-2">HIPAA Compliant</h3>
              <p className="text-[#424649]">Your medical information is protected with bank-level security and encryption.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#ff6a03] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-star text-3xl text-[#ff6a03]"></i>
              </div>
              <h3 className="text-2xl font-bold text-[#212529] mb-2">4.9/5 Rating</h3>
              <p className="text-[#424649]">Over 50,000 patients trust us with their healthcare needs and appointments.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#ff6a03] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clock text-3xl text-[#ff6a03]"></i>
              </div>
              <h3 className="text-2xl font-bold text-[#212529] mb-2">24/7 Support</h3>
              <p className="text-[#424649]">Our dedicated support team is available around the clock to assist you.</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-[#212529] mb-6 text-center">Trusted Healthcare Partners</h3>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="flex items-center text-[#424649]">
                <i className="fab fa-microsoft text-2xl mr-2"></i>
                <span className="font-semibold">Microsoft Health</span>
              </div>
              <div className="flex items-center text-[#424649]">
                <i className="fas fa-hospital text-2xl mr-2"></i>
                <span className="font-semibold">Mayo Clinic</span>
              </div>
              <div className="flex items-center text-[#424649]">
                <i className="fas fa-heartbeat text-2xl mr-2"></i>
                <span className="font-semibold">Kaiser Permanente</span>
              </div>
              <div className="flex items-center text-[#424649]">
                <i className="fas fa-plus text-2xl mr-2"></i>
                <span className="font-semibold">Cleveland Clinic</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-20 bg-[#212529]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of patients who have discovered a better way to manage their healthcare. Invite your family to your Care Circle and experience healthcare designed for ease, trust, and dignity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <Link to="/login">
            <button className="bg-[#ff6a03] hover:bg-[#e55a02] text-white px-8 py-4 text-lg font-semibold transition-colors cursor-pointer whitespace-nowrap !rounded-button">
              <i className="fas fa-rocket mr-2"></i>
              Get Started Today
            </button>
           </Link>
            {/* <button className="border-2 border-white text-white hover:bg-secondary hover:text-[#fff] px-8 py-4 text-lg font-semibold transition-colors cursor-pointer whitespace-nowrap !rounded-button">
              <i className="fas fa-users mr-2"></i>
              Invite Family
            </button> */}
          </div>
        </div>
      </section>

      {/* Footer */}
     <Footer/>

      <style jsx>{`
        .!rounded-button {
          border-radius: 12px;
        }
        
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default ForPatients;
