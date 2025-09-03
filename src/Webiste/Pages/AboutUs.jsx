// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';
const AboutUs = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-16 min-h-screen bg-gradient-to-r from-white via-white to-gray-50 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=modern%20diverse%20medical%20professionals%20using%20advanced%20telehealth%20technology%20in%20a%20bright%20clean%20medical%20facility%20with%20futuristic%20digital%20interfaces%20and%20global%20connectivity%20elements%20showcasing%20international%20healthcare%20collaboration&width=1440&height=800&seq=hero-bg-001&orientation=landscape')`
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-[#212529] leading-tight">
                Bridging Healthcare 
                <span className="text-[#ff6a03]"> Across Borders</span>
              </h1>
              
              <p className="text-xl text-[#424649] leading-relaxed">
                Experience the future of healthcare with our AI-native, multilingual telehealth ecosystem. 
                Connect with verified providers worldwide for secure virtual consultations, second opinions, 
                and comprehensive care coordination.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
               <Link to="/forproviders">
                <button className="bg-[#ff6a03] text-white px-8 py-4 !rounded-button hover:bg-[#e55a02] transition-colors cursor-pointer whitespace-nowrap text-lg font-semibold">
                  Find a Provider
                </button>
               </Link>
               <Link to="/login">
                <button className="border-2 border-[#ff6a03] text-[#ff6a03] px-8 py-4 !rounded-button hover:bg-[#ff6a03] hover:text-white transition-colors cursor-pointer whitespace-nowrap text-lg font-semibold">
                 Start Your Journey
                </button>
               </Link>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://readdy.ai/api/search-image?query=professional%20diverse%20medical%20team%20using%20telehealth%20technology%20with%20digital%20tablets%20and%20video%20calls%20connecting%20with%20patients%20globally%20in%20a%20modern%20bright%20medical%20environment%20with%20clean%20white%20background&width=600&height=500&seq=hero-img-001&orientation=landscape"
                alt="Telehealth professionals"
                className="w-full h-auto rounded-2xl shadow-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#212529] mb-4">
              Revolutionizing Global Healthcare
            </h2>
            <p className="text-xl text-[#424649] max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with human expertise to deliver 
              exceptional healthcare experiences across borders.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="w-16 h-16 bg-[#ff6a03] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <i className="fas fa-robot text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-[#212529] mb-4">AI-Powered Solutions</h3>
              <p className="text-[#424649] leading-relaxed">
                Advanced artificial intelligence enhances diagnosis accuracy, streamlines workflows, 
                and provides intelligent health insights for better patient outcomes.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="w-16 h-16 bg-[#ff6a03] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <i className="fas fa-globe text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-[#212529] mb-4">Global Provider Network</h3>
              <p className="text-[#424649] leading-relaxed">
                Access thousands of verified healthcare professionals worldwide, ensuring you receive 
                expert care regardless of your location or time zone.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="w-16 h-16 bg-[#ff6a03] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <i className="fas fa-shield-alt text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-[#212529] mb-4">Secure & Compliant Platform</h3>
              <p className="text-[#424649] leading-relaxed">
                Enterprise-grade security with full HIPAA and GDPR compliance ensures your health 
                data remains private and protected at all times.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#212529] mb-8 leading-tight">
            Democratizing Access to Quality Healthcare Worldwide
          </h2>
          
          <p className="text-xl text-[#424649] max-w-4xl mx-auto mb-12 leading-relaxed">
            Our mission is to break down geographical barriers and make exceptional healthcare 
            accessible to everyone, everywhere. Through innovative technology and compassionate care, 
            we're building a world where distance never compromises health outcomes.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#ff6a03] mb-2">150+</div>
              <div className="text-[#424649] font-semibold">Countries Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#ff6a03] mb-2">50+</div>
              <div className="text-[#424649] font-semibold">Languages Supported</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#ff6a03] mb-2">10K+</div>
              <div className="text-[#424649] font-semibold">Healthcare Providers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#ff6a03] mb-2">1M+</div>
              <div className="text-[#424649] font-semibold">Patient Consultations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-[#212529] mb-6">
                Security & Compliance You Can Trust
              </h2>
              
              <p className="text-lg text-[#424649] leading-relaxed">
                Your health data security is our top priority. We maintain the highest standards 
                of data protection with comprehensive HIPAA and GDPR compliance, ensuring your 
                personal health information remains confidential and secure.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-check-circle text-[#ff6a03] text-xl"></i>
                  <span className="text-[#424649]">End-to-end encryption for all communications</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-check-circle text-[#ff6a03] text-xl"></i>
                  <span className="text-[#424649]">Multi-factor authentication and access controls</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-check-circle text-[#ff6a03] text-xl"></i>
                  <span className="text-[#424649]">Regular security audits and penetration testing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-check-circle text-[#ff6a03] text-xl"></i>
                  <span className="text-[#424649]">24/7 security monitoring and incident response</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-2xl text-center">
                <i className="fas fa-certificate text-[#ff6a03] text-4xl mb-4"></i>
                <h3 className="font-bold text-[#212529] mb-2">HIPAA Compliant</h3>
                <p className="text-sm text-[#424649]">Full compliance with US healthcare privacy regulations</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-2xl text-center">
                <i className="fas fa-shield-alt text-[#ff6a03] text-4xl mb-4"></i>
                <h3 className="font-bold text-[#212529] mb-2">GDPR Compliant</h3>
                <p className="text-sm text-[#424649]">European data protection standards certified</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-2xl text-center">
                <i className="fas fa-lock text-[#ff6a03] text-4xl mb-4"></i>
                <h3 className="font-bold text-[#212529] mb-2">ISO 27001</h3>
                <p className="text-sm text-[#424649]">International security management certified</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-2xl text-center">
                <i className="fas fa-user-shield text-[#ff6a03] text-4xl mb-4"></i>
                <h3 className="font-bold text-[#212529] mb-2">SOC 2 Type II</h3>
                <p className="text-sm text-[#424649]">Audited security and availability controls</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Reach Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#212529] mb-4">
              Global Healthcare Network
            </h2>
            <p className="text-xl text-[#424649] max-w-3xl mx-auto">
              Our platform spans across continents, connecting patients with healthcare providers 
              in real-time, breaking down barriers to quality medical care.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg">
            <div className="relative h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl overflow-hidden">
              <img 
                src="https://readdy.ai/api/search-image?query=modern%20world%20map%20visualization%20showing%20global%20healthcare%20network%20connections%20with%20bright%20orange%20connection%20lines%20linking%20continents%20representing%20international%20telehealth%20services%20on%20clean%20white%20background&width=800&height=400&seq=world-map-001&orientation=landscape"
                alt="Global healthcare network"
                className="w-full h-full object-cover"
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center bg-white bg-opacity-90 p-6 rounded-xl">
                  <h3 className="text-2xl font-bold text-[#212529] mb-2">
                    Serving Patients Worldwide
                  </h3>
                  <p className="text-[#424649]">
                    24/7 healthcare access across all time zones
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="text-4xl font-bold text-[#ff6a03] mb-2">150+</div>
              <div className="text-[#424649] font-semibold">Countries Served</div>
              <div className="text-sm text-[#424649] mt-2">Expanding globally every month</div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="text-4xl font-bold text-[#ff6a03] mb-2">50+</div>
              <div className="text-[#424649] font-semibold">Languages Supported</div>
              <div className="text-sm text-[#424649] mt-2">Real-time translation available</div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="text-4xl font-bold text-[#ff6a03] mb-2">10,000+</div>
              <div className="text-[#424649] font-semibold">Healthcare Providers</div>
              <div className="text-sm text-[#424649] mt-2">Verified and certified professionals</div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="text-4xl font-bold text-[#ff6a03] mb-2">1M+</div>
              <div className="text-[#424649] font-semibold">Patient Consultations</div>
              <div className="text-sm text-[#424649] mt-2">Successful healthcare connections</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#212529] mb-4">
              Our Leadership Team
            </h2>
            <p className="text-xl text-[#424649] max-w-3xl mx-auto">
              Meet the visionary leaders driving innovation in global healthcare technology 
              and making quality medical care accessible worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center group cursor-pointer">
              <div className="relative mb-6 overflow-hidden rounded-2xl">
                <img 
                  src="https://readdy.ai/api/search-image?query=professional%20confident%20female%20CEO%20in%20modern%20business%20attire%20standing%20in%20bright%20medical%20technology%20office%20environment%20with%20clean%20white%20background%20and%20soft%20lighting&width=300&height=300&seq=team-ceo-001&orientation=squarish"
                  alt="CEO"
                  className="w-full h-80 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold text-[#212529] mb-2">Dr. Sarah Chen</h3>
              <p className="text-[#ff6a03] font-semibold mb-3">Chief Executive Officer</p>
              <p className="text-[#424649] text-sm leading-relaxed">
                Former WHO advisor with 15+ years in global health technology. 
                Expert in healthcare policy and digital transformation.
              </p>
            </div>
            
            <div className="text-center group cursor-pointer">
              <div className="relative mb-6 overflow-hidden rounded-2xl">
                <img 
                  src="https://readdy.ai/api/search-image?query=professional%20male%20CTO%20in%20business%20casual%20attire%20in%20modern%20technology%20office%20with%20medical%20devices%20and%20digital%20screens%20in%20clean%20white%20background%20environment&width=300&height=300&seq=team-cto-001&orientation=squarish"
                  alt="CTO"
                  className="w-full h-80 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold text-[#212529] mb-2">Michael Rodriguez</h3>
              <p className="text-[#ff6a03] font-semibold mb-3">Chief Technology Officer</p>
              <p className="text-[#424649] text-sm leading-relaxed">
                AI and machine learning pioneer with expertise in healthcare systems. 
                Previously led engineering teams at major tech companies.
              </p>
            </div>
            
            <div className="text-center group cursor-pointer">
              <div className="relative mb-6 overflow-hidden rounded-2xl">
                <img 
                  src="https://readdy.ai/api/search-image?query=professional%20female%20CMO%20in%20elegant%20business%20attire%20in%20bright%20modern%20medical%20office%20with%20healthcare%20technology%20displays%20and%20clean%20white%20background&width=300&height=300&seq=team-cmo-001&orientation=squarish"
                  alt="CMO"
                  className="w-full h-80 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold text-[#212529] mb-2">Dr. Priya Patel</h3>
              <p className="text-[#ff6a03] font-semibold mb-3">Chief Medical Officer</p>
              <p className="text-[#424649] text-sm leading-relaxed">
                Board-certified physician specializing in telemedicine and remote care. 
                Champion of patient-centered healthcare innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default AboutUs;
