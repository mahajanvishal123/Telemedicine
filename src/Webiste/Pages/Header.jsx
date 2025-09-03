import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Link to="/" className="text-2xl font-bold text-[#212529]">
                                <img src="https://i.ibb.co/xKF1WPkH/image.png" height={30} width={60} alt="" />
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <Link to="/" className="text-[#424649] hover:text-[#ff6a03] transition-colors cursor-pointer text-decoration-none">Home</Link>
                        <Link to="/aboutus" className="text-[#424649] hover:text-[#ff6a03] transition-colors cursor-pointer text-decoration-none">About</Link>
                        {/* <a href="#services" className="text-[#424649] hover:text-[#ff6a03] transition-colors cursor-pointer">Services</a> */}
                        <Link to="/forprovider" className="text-[#424649] hover:text-[#ff6a03] transition-colors cursor-pointer text-decoration-none">For Providers</Link>
                        <Link to="/forpatients" className="text-[#424649] hover:text-[#ff6a03] transition-colors cursor-pointer text-decoration-none">For Patients</Link>
                        <Link to="/carebridge" className="text-[#424649] hover:text-[#ff6a03] transition-colors cursor-pointer text-decoration-none">CareBridge™</Link>

                        {/* <Link to="/contactus" className="text-[#424649] hover:text-[#ff6a03] transition-colors cursor-pointer">Contact Us</Link> */}
                    </nav>

                    {/* Book Appointment Button */}
                    <div className="hidden md:flex items-center">
                        <Link to="/contactus">
                            <button className="btn btn-secondary me-3 text-white px-6 py-2 rounded-md hover:bg-[#e55a02] transition-colors cursor-pointer whitespace-nowrap">
                                Contact Us
                            </button>
                        </Link>
                        <Link to="/login">
                            <button className="bg-[#ff6a03] text-white px-6 py-2 rounded-md hover:bg-[#e55a02] transition-colors cursor-pointer whitespace-nowrap">
                                Login
                            </button>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="text-[#424649] hover:text-[#ff6a03] focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                            <Link to="/" className="block px-3 py-2 text-[#424649] hover:text-[#ff6a03] transition-colors cursor-pointer text-decoration-none">Home</Link>
                            <Link to="/aboutus" className="block px-3 py-2 text-[#424649] hover:text-[#ff6a03] transition-colors cursor-pointer text-decoration-none">About</Link>
                            {/* <a href="#services" className="block px-3 py-2 text-[#424649] hover:text-[#ff6a03] transition-colors cursor-pointer">Services</a> */}
                            <Link to="/forprovider" className="block px-3 py-2 text-[#424649] hover:text-[#ff6a03] transition-colors cursor-pointer text-decoration-none">For Providers</Link>
                            <Link to="/forpatients" className="block px-3 py-2 text-[#424649] hover:text-[#ff6a03] transition-colors cursor-pointer text-decoration-none">For Patients</Link>
                            <Link to="/carebridge" className="block px-3 py-2 text-[#424649] hover:text-[#ff6a03] transition-colors cursor-pointer text-decoration-none">CareBridge™</Link>

                            {/* <Link to="/contactus" className="block px-3 py-2 text-[#424649] hover:text-[#ff6a03] transition-colors cursor-pointer">Contact Us</Link> */}
                            <div className="pt-2">

                                <Link to="/contactus">
                                    <button className="w-full btn btn-secondary mb-2 text-white px-6 py-2 rounded-md hover:bg-[#e55a02] transition-colors cursor-pointer">
                                        Contact Us
                                    </button>
                                </Link>

                                <Link to="/login">
                                    <button className="w-full bg-[#ff6a03] text-white px-6 py-2 rounded-md hover:bg-[#e55a02] transition-colors cursor-pointer">
                                        Login
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;