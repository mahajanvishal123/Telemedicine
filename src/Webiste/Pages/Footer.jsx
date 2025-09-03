import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div>
            {/* Footer */}
            <footer className="bg-[#212529] text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold mb-4">TeleMediBridge</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Bridging healthcare across borders with AI-native, multilingual
                                telehealth solutions. Connecting patients with verified providers
                                worldwide.
                            </p>
                            <div className="flex space-x-4">
                                <i className="fab fa-facebook text-[#ff6a03] text-xl cursor-pointer hover:text-white transition-colors"></i>
                                <i className="fab fa-twitter text-[#ff6a03] text-xl cursor-pointer hover:text-white transition-colors"></i>
                                <i className="fab fa-linkedin text-[#ff6a03] text-xl cursor-pointer hover:text-white transition-colors"></i>
                                <i className="fab fa-instagram text-[#ff6a03] text-xl cursor-pointer hover:text-white transition-colors"></i>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        to="/"
                                        className="text-gray-300 hover:text-[#ff6a03] transition-colors cursor-pointer text-decoration-none"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/aboutus"
                                        className="text-gray-300 hover:text-[#ff6a03] transition-colors cursor-pointer text-decoration-none"
                                    >
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/forprovider"
                                        className="text-gray-300 hover:text-[#ff6a03] transition-colors cursor-pointer text-decoration-none"
                                    >
                                        For Providers
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/forpatients"
                                        className="text-gray-300 hover:text-[#ff6a03] transition-colors cursor-pointer text-decoration-none"
                                    >
                                        For Patients
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/carebridge"
                                        className="text-gray-300 hover:text-[#ff6a03] transition-colors cursor-pointer text-decoration-none"
                                    >
                                        CareBridge™
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/contactus"
                                        className="text-gray-300 hover:text-[#ff6a03] transition-colors cursor-pointer text-decoration-none"
                                    >
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
                            <div className="space-y-3">
                                {/* Email */}
                                <div className="flex items-center space-x-3">
                                    <i className="fas fa-envelope text-[#ff6a03]"></i>
                                    <span className="text-gray-300">
                                        support@telemedibridge.com
                                    </span>
                                </div>

                                {/* Website */}
                                <div className="flex items-center space-x-3">
                                    <i className="fas fa-globe text-[#ff6a03]"></i>
                                    <a
                                        href="https://www.telemedibridge.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-300 hover:underline"
                                    >
                                        www.telemedibridge.com
                                    </a>
                                </div>

                                {/* Headquarters */}
                                <div className="flex items-center space-x-3">
                                    <i className="fas fa-map-marker-alt text-[#ff6a03]"></i>
                                    <span className="text-gray-300">
                                        Philadelphia, PA, USA
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
                            <p className="text-gray-300 mb-4">
                                Stay updated with the latest in global healthcare technology.
                            </p>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-2 rounded-l-lg bg-gray-700 text-white border-none focus:outline-none focus:ring-2 focus:ring-[#ff6a03] text-sm"
                                />
                                <button className="bg-[#ff6a03] px-4 py-2 rounded-r-lg hover:bg-[#e55a02] transition-colors cursor-pointer whitespace-nowrap">
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="border-t border-gray-600 mt-12 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            {/* Copyright */}
                            <div className="text-[#424649] text-sm">
                                © 2024 TeleMediBridge. All rights reserved.
                            </div>

                            {/* Privacy & Terms */}
                            <div className="flex items-center space-x-6">
                                <Link
                                    to="/privacypolicy"
                                    className="text-sm text-gray-300 hover:text-[#ff6a03] transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                                <Link
                                    to="/termsconditions"
                                    className="text-sm text-gray-300 hover:text-[#ff6a03] transition-colors"
                                >
                                    Terms & Conditions
                                </Link>
                            </div>

                            {/* Compliance */}
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <i className="fas fa-shield-alt text-[#ff6a03]"></i>
                                    <span className="text-sm text-gray-300">
                                        HIPAA Compliant
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <i className="fas fa-certificate text-[#ff6a03]"></i>
                                    <span className="text-sm text-gray-300">
                                        GDPR Compliant
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
