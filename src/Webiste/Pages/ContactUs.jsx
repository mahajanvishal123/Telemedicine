// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = () => {
    e.preventDefault();
  };

  const handleChange = () => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
      
      <Header/>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-[#212529] mb-4">Get in Touch</h1>
              <p className="text-lg text-[#424649]">We're here to help and answer any questions you might have.</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <i className="fas fa-envelope text-[#ff6a03] text-xl mt-1"></i>
                <div>
                  <h3 className="text-lg font-medium text-[#212529]">Email</h3>
                  <a href="mailto:support@telemedibridge.com" className="text-[#424649] hover:text-[#ff6a03] transition-colors">
                    support@telemedibridge.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <i className="fas fa-globe text-[#ff6a03] text-xl mt-1"></i>
                <div>
                  <h3 className="text-lg font-medium text-[#212529]">Website</h3>
                  <a href="https://www.telemedibridge.com" target="_blank" rel="noopener noreferrer" className="text-[#424649] hover:text-[#ff6a03] transition-colors">
                    www.telemedibridge.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <i className="fas fa-map-marker-alt text-[#ff6a03] text-xl mt-1"></i>
                <div>
                  <h3 className="text-lg font-medium text-[#212529]">Location</h3>
                  <p className="text-[#424649]">Philadelphia, PA, USA</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#212529] mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#424649] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff6a03] focus:ring-2 focus:ring-[#ff6a03] focus:ring-opacity-20 outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#424649] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff6a03] focus:ring-2 focus:ring-[#ff6a03] focus:ring-opacity-20 outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-[#424649] mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff6a03] focus:ring-2 focus:ring-[#ff6a03] focus:ring-opacity-20 outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#424649] mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff6a03] focus:ring-2 focus:ring-[#ff6a03] focus:ring-opacity-20 outline-none transition-colors resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#ff6a03] text-white py-3 px-6 rounded-lg hover:bg-[#e55f03] transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>

     <Footer/>
    </div>
  );
};

export default ContactUs;
