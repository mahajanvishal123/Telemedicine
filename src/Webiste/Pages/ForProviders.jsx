// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
const ForProviders = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <Header />

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center bg-no-repeat min-h-[600px] flex items-center"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20healthcare%20professionals%20using%20digital%20technology%20in%20a%20bright%20medical%20office%20environment%20with%20clean%20white%20and%20orange%20accents%2C%20professional%20doctors%20and%20nurses%20collaborating%20with%20tablets%20and%20computers%2C%20contemporary%20medical%20workspace%20with%20natural%20lighting%20and%20minimalist%20design&width=1440&height=600&seq=hero001&orientation=landscape')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent"></div>
        <Container className="relative p-5 mt-3">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Empower Your Healthcare Practice
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Connect with patients globally through our AI-powered platform. Build trust with verified profiles, streamline visits with intelligent copilots, and expand your practice across borders.
            </p>
            <Link to="/signup">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold cursor-pointer whitespace-nowrap !rounded-button">
                Join as Provider
              </button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Key Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Tools for Modern Healthcare
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to deliver exceptional care and grow your practice globally
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer !rounded-button">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-user-check text-2xl text-orange-500"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Verified Profiles</h3>
              <p className="text-gray-600 leading-relaxed">
                Build patient trust with comprehensive verification. Showcase your credentials, specializations, and patient reviews in a professional profile that stands out.
              </p>
            </div>

            <div className="bg-white p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer !rounded-button">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-robot text-2xl text-orange-500"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Copilot</h3>
              <p className="text-gray-600 leading-relaxed">
                Streamline your workflow with intelligent visit summaries, automated documentation, and AI-powered insights that help you focus on patient care.
              </p>
            </div>

            <div className="bg-white p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer !rounded-button">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-prescription-bottle-alt text-2xl text-orange-500"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">E-prescribing</h3>
              <p className="text-gray-600 leading-relaxed">
                Prescribe medications digitally with integrated pharmacy networks. Ensure patient safety with drug interaction checks and dosage recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Healthcare Professionals Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of providers delivering quality care across borders
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-orange-500 mb-2">15,000+</div>
              <div className="text-gray-600 font-medium">Registered Providers</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-orange-500 mb-2">50+</div>
              <div className="text-gray-600 font-medium">Countries Served</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-orange-500 mb-2">98%</div>
              <div className="text-gray-600 font-medium">Patient Satisfaction</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-orange-500 mb-2">2M+</div>
              <div className="text-gray-600 font-medium">Consultations Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Expand Your Practice Beyond Borders
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                TeleMediBridge opens doors to global opportunities while maintaining the highest standards of care and trust.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-check-circle text-orange-500 text-xl mt-1"></i>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Patient Access</h3>
                    <p className="text-gray-600">Reach patients worldwide and grow your practice beyond geographical limitations.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-check-circle text-orange-500 text-xl mt-1"></i>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Communication</h3>
                    <p className="text-gray-600">HIPAA-compliant platform ensuring patient privacy and data security.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-check-circle text-orange-500 text-xl mt-1"></i>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible Scheduling</h3>
                    <p className="text-gray-600">Manage appointments across time zones with intelligent scheduling tools.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-check-circle text-orange-500 text-xl mt-1"></i>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue Growth</h3>
                    <p className="text-gray-600">Increase your income with competitive rates and transparent pricing.</p>
                  </div>
                </div>
              </div>

              {/* <button className="mt-8 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-lg font-semibold cursor-pointer whitespace-nowrap !rounded-button">
                Learn More
              </button> */}
            </div>

            <div className="relative">
              <img
                src="https://readdy.ai/api/search-image?query=Professional%20healthcare%20provider%20consulting%20with%20international%20patients%20via%20video%20call%20on%20modern%20tablet%20device%2C%20diverse%20medical%20professionals%20in%20contemporary%20clinic%20setting%20with%20clean%20white%20background%20and%20orange%20technology%20accents&width=600&height=500&seq=benefits001&orientation=landscape"
                alt="Healthcare provider consultation"
                className="w-full h-full object-cover object-top !rounded-button shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600">
              Join our platform and start connecting with patients globally
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection lines */}
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gray-200 z-0"></div>

            <div className="text-center relative z-10">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <div className="mb-4">
                <i className="fas fa-user-plus text-3xl text-orange-500"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up and complete your professional profile with credentials, specializations, and experience details.
              </p>
            </div>

            <div className="text-center relative z-10">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <div className="mb-4">
                <i className="fas fa-certificate text-3xl text-orange-500"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Get Verified</h3>
              <p className="text-gray-600">
                Complete our verification process to build trust and credibility with potential patients worldwide.
              </p>
            </div>

            <div className="text-center relative z-10">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <div className="mb-4">
                <i className="fas fa-stethoscope text-3xl text-orange-500"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Start Practicing</h3>
              <p className="text-gray-600">
                Begin accepting patients, conducting consultations, and growing your practice with our advanced tools.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/login">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold cursor-pointer whitespace-nowrap !rounded-button">
                Start Your Journey
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ForProviders;
