import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';
const Home = () => {
    const [activeFeature, setActiveFeature] = useState(0);

    const features = [
        { title: 'Multilingual UI', desc: '24+ languages, RTL support' },
        { title: 'AI-Powered Matching', desc: 'Smart doctor-patient connections' },
        { title: 'Blockchain Verified', desc: 'Trusted provider credentials' },
        { title: 'HIPAA/GDPR Compliant', desc: 'Secure data protection' }
    ];

    const services = [
        { icon: 'fas fa-video', title: 'Virtual Consultations', desc: 'Connect with doctors via video/voice calls anytime, anywhere' },
        { icon: 'fas fa-robot', title: 'AI Symptom Checker', desc: 'Intelligent triage system for accurate health assessments' },
        { icon: 'fas fa-globe', title: 'Global Second Opinions', desc: 'Access specialist expertise from around the world' },
        { icon: 'fas fa-prescription-bottle', title: 'E-Prescriptions', desc: 'Digital prescriptions with pharmacy integration' },
        { icon: 'fas fa-users', title: 'CareBridge™ Coordination', desc: 'Family and caregiver collaboration platform' },
        { icon: 'fas fa-brain', title: 'Mental Health Support', desc: 'Comprehensive psychological and wellness services' }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <Header />
            </nav>

            {/* Hero Section */}
            <section id="home" className="relative bg-gradient-to-br from-orange-50 to-white overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
                    style={{ backgroundImage: `url('https://readdy.ai/api/search-image?query=modern%20healthcare%20technology%20background%20with%20medical%20professionals%20using%20digital%20devices%20in%20a%20bright%20clean%20hospital%20environment%20with%20soft%20lighting%20and%20professional%20atmosphere&width=1440&height=800&seq=hero001&orientation=landscape')` }}>
                </div>
                <div className="relative max-w-7xl mx-auto px-6 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                    Healthcare <span className="text-orange-500">Beyond Limits</span>
                                </h1>
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    Welcome to TeleMediBridge® – connecting patients to trusted doctors, therapists, and caregivers globally with AI-powered matching, multilingual support, and secure telemedicine tools.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/login">
                                    <button className="bg-orange-500 text-white px-8 py-4 !rounded-button hover:bg-orange-600 transition-colors text-lg font-semibold whitespace-nowrap cursor-pointer">
                                        Start Your Journey
                                    </button>
                                </Link>
                                {/* <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 !rounded-button hover:border-orange-500 hover:text-orange-500 transition-colors text-lg font-semibold whitespace-nowrap cursor-pointer">
                  Learn More
                </button> */}
                            </div>
                            <div className="flex items-center space-x-8 pt-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">50K+</div>
                                    <div className="text-sm text-gray-600">Active Patients</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">2K+</div>
                                    <div className="text-sm text-gray-600">Verified Doctors</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">24+</div>
                                    <div className="text-sm text-gray-600">Languages</div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative z-10">
                                <img
                                    src="https://readdy.ai/api/search-image?query=professional%20healthcare%20team%20of%20diverse%20doctors%20and%20nurses%20using%20modern%20digital%20tablets%20and%20medical%20technology%20in%20a%20bright%20modern%20medical%20facility%20with%20clean%20white%20background&width=600&height=500&seq=hero002&orientation=portrait"
                                    alt="Healthcare professionals"
                                    className="w-full h-auto rounded-2xl shadow-2xl object-cover object-top"
                                />
                            </div>
                            <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="relative">
                            <img
                                src="https://readdy.ai/api/search-image?query=diverse%20team%20of%20healthcare%20technology%20professionals%20working%20together%20in%20modern%20office%20environment%20with%20medical%20charts%20and%20digital%20devices%20showcasing%20AI%20and%20blockchain%20technology%20with%20clean%20professional%20background&width=600&height=500&seq=about001&orientation=portrait"
                                alt="About TeleMediBridge"
                                className="w-full h-auto rounded-2xl shadow-xl object-cover object-top"
                            />
                        </div>
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-4xl font-bold text-gray-900 mb-6">About TeleMediBridge</h2>
                                 {/* <div className="w-20 h-1 bg-orange-500 mx-auto"></div> */}
                                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                    TeleMediBridge is an AI-native, multilingual telehealth ecosystem. Our platform unites
                                    patients, verified providers, and caregivers across borders with secure virtual consultations,
                                    second opinions, and care coordination.
                                </p>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    We are HIPAA/GDPR compliant and designed to scale globally, making healthcare accessible
                                    to everyone, everywhere.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="text-center p-6 bg-gray-50 rounded-2xl">
                                    <i className="fas fa-shield-alt text-3xl text-orange-500 mb-4"></i>
                                    <h4 className="font-bold text-gray-900 mb-2">HIPAA/GDPR</h4>
                                    <p className="text-sm text-gray-600">Compliant</p>
                                </div>
                                <div className="text-center p-6 bg-gray-50 rounded-2xl">
                                    <i className="fas fa-globe text-3xl text-orange-500 mb-4"></i>
                                    <h4 className="font-bold text-gray-900 mb-2">Global</h4>
                                    <p className="text-sm text-gray-600">Scale Ready</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Our Mission
                        </h2>
                        <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
                        {/* Left Side - Text */}
                        <div>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Our mission is simple: to provide trusted, inclusive, and accessible
                                healthcare solutions worldwide. We leverage
                                <span className="text-orange-500 font-semibold"> AI, blockchain verification, </span>
                                and human-centered design to make quality healthcare a
                                <span className="text-orange-500 font-semibold"> right—not a privilege</span>.
                            </p>
                        </div>

                        {/* Right Side - Illustration */}
                        <div className="flex justify-center">
                            <img
                                src="https://i.ibb.co/ymVk2jQ8/image.png"
                                alt="Healthcare Illustration"
                                className="max-w-md w-full"
                            />
                        </div>
                    </div>
                </div>
            </section>



            {/* Services Section */}
            <section id="services" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Comprehensive healthcare solutions powered by cutting-edge technology and human expertise
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow cursor-pointer group">
                                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors">
                                    <i className={`${service.icon} text-2xl text-orange-500 group-hover:text-white transition-colors`}></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Platform Features</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Built with accessibility, security, and global reach in mind
                        </p>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`p-6 rounded-2xl cursor-pointer transition-all ${activeFeature === index
                                        ? 'bg-orange-500 text-white shadow-lg'
                                        : 'bg-white text-gray-700 hover:bg-orange-50'
                                        }`}
                                    onClick={() => setActiveFeature(index)}
                                >
                                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                    <p className={activeFeature === index ? 'text-orange-100' : 'text-gray-600'}>
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="relative">
                            <img
                                src="https://readdy.ai/api/search-image?query=modern%20medical%20technology%20interface%20showing%20multilingual%20healthcare%20app%20on%20tablet%20with%20diverse%20patients%20and%20doctors%20connecting%20globally%20through%20telemedicine%20platform%20with%20clean%20white%20background&width=600&height=500&seq=features001&orientation=portrait"
                                alt="Platform features"
                                className="w-full h-auto rounded-2xl shadow-xl object-cover object-top"
                            />
                        </div>
                    </div>
                </div>
            </section>



            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Ready to Transform Your Healthcare Experience?
                    </h2>
                    <p className="text-xl text-orange-100 mb-8 leading-relaxed">
                        Join thousands of patients and healthcare providers who trust TeleMediBridge
                        for accessible, secure, and comprehensive healthcare solutions.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to='/login'>
                            <button className="bg-white text-orange-500 px-8 py-4 !rounded-button hover:bg-gray-50 transition-colors text-lg font-semibold whitespace-nowrap cursor-pointer">
                                Get Started Today
                            </button>
                        </Link>
                        {/* <button className="border-2 border-white text-white px-8 py-4 !rounded-button hover:bg-white hover:text-orange-500 transition-colors text-lg font-semibold whitespace-nowrap cursor-pointer">
              Schedule Demo
            </button> */}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />

            <style>{`
        .!rounded-button {
          border-radius: 12px !important;
        }
        
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type="number"] {
          -moz-appearance: textfield;
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>
        </div>
    );
};

export default Home;
