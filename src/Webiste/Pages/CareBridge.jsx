// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';

const CareBridge = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <Header />

            {/* Hero Section */}
            <div className="pt-16 relative min-h-[600px] flex items-center bg-gradient-to-r from-white to-transparent">
                {/* Background Image */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage:
                            "url('https://readdy.ai/api/search-image?query=modern%20medical%20facility%20interior%20with%20soft%20lighting%20and%20advanced%20technology%20equipment%2C%20warm%20welcoming%20atmosphere%20with%20medical%20professionals%20in%20background%2C%20high%20end%20healthcare%20environment&width=1440&height=600&seq=1&orientation=landscape')",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                    }}
                ></div>

                {/* Transparent Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-75 z-0"></div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 z-10">
                    <div className="md:w-1/2">
                        <h1 className="text-5xl font-bold text-white mb-6">
                            CareBridge™ Care Coordination
                        </h1>
                        <p className="text-lg text-gray-100 mb-8">
                            Connect with verified healthcare professionals for personalized care.
                            Whether you need in-person support or virtual consultations, we ensure
                            safe and culturally relevant care for recovery, elder care, and chronic
                            condition management.
                        </p>
                        <div className="space-x-4">
                           <Link to="/login">
                            <button className="bg-[#ff6a03] text-white px-8 py-3 !rounded-button whitespace-nowrap hover:bg-[#e55f03] cursor-pointer">
                                Get Started
                            </button>
                           </Link>
                          
                        </div>
                    </div>
                </div>
            </div>


            {/* Features Section */}
            <div className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#212529] mb-4">
                            Global Second Opinion
                        </h2>
                        <p className="text-[#424649] text-lg max-w-2xl mx-auto">
                            Access world-class specialists globally for verified second opinions. Our secure platform connects you with accredited experts across borders.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: "fa-user-md",
                                title: "Expert Specialists",
                                description: "Connect with verified healthcare professionals worldwide"
                            },
                            {
                                icon: "fa-shield-alt",
                                title: "Secure Platform",
                                description: "Your medical records are protected with enterprise-grade security"
                            },
                            {
                                icon: "fa-globe",
                                title: "Global Network",
                                description: "Access to international medical expertise and resources"
                            }
                        ].map((feature, index) => (
                            <div key={index} className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                                <div className="inline-block p-4 bg-[#ff6a03] rounded-full text-white mb-6">
                                    <i className={`fas ${feature.icon} text-2xl`}></i>
                                </div>
                                <h3 className="text-xl font-semibold text-[#212529] mb-4">{feature.title}</h3>
                                <p className="text-[#424649]">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Blog Section */}
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-[#212529] mb-12 text-center">Latest Insights</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                image: "https://readdy.ai/api/search-image?query=modern%20healthcare%20professional%20discussing%20medical%20results%20with%20patient%20in%20contemporary%20medical%20office%2C%20warm%20lighting%20professional%20environment&width=400&height=250&seq=2&orientation=landscape",
                                category: "Healthcare",
                                title: "The Future of Telemedicine",
                                preview: "Explore how technology is transforming healthcare delivery and patient care."
                            },
                            {
                                image: "https://readdy.ai/api/search-image?query=medical%20research%20scientist%20working%20in%20advanced%20laboratory%20with%20modern%20equipment%2C%20clinical%20research%20environment&width=400&height=250&seq=3&orientation=landscape",
                                category: "Innovation",
                                title: "AI in Medical Diagnosis",
                                preview: "How artificial intelligence is revolutionizing medical diagnostics and treatment."
                            },
                            {
                                image: "https://readdy.ai/api/search-image?query=elderly%20patient%20receiving%20care%20from%20compassionate%20healthcare%20worker%20in%20modern%20nursing%20facility%2C%20warm%20and%20caring%20environment&width=400&height=250&seq=4&orientation=landscape",
                                category: "Elder Care",
                                title: "Quality Elder Care Guide",
                                preview: "Essential tips for ensuring the best care for elderly loved ones."
                            }
                        ].map((blog, index) => (
                            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="relative h-48">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover object-top"
                                    />
                                </div>
                                <div className="p-6">
                                    <span className="text-[#ff6a03] text-sm font-semibold">{blog.category}</span>
                                    <h3 className="text-xl font-semibold text-[#212529] mt-2 mb-3">{blog.title}</h3>
                                    <p className="text-[#424649] mb-4">{blog.preview}</p>
                                    {/* <button className="text-[#ff6a03] hover:text-[#e55f03] font-semibold cursor-pointer">
                                        Read More <i className="fas fa-arrow-right ml-2"></i>
                                    </button> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default CareBridge;
