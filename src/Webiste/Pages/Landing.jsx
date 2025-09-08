import React from 'react'
import HeroSection from './HeroSection'
import AboutPage from './AboutPage'
import FeaturesPage from './FeaturesPage'
import DoctorsPage from './DoctorsPage'
import CareBridgePage from './CareBridgePage'
import InvestorsPage from './InvestorsPage'
import PatientsPage from './PatientsPage'
import PricingPage from './PricingPage'
import Footer from './Footer'
import WebsiteNavbar from './WebsiteNavbar'
import FindDoctor from './FindDoctor'

const Landing = () => {
  return (
    <div>
      <WebsiteNavbar />

      <section id="hero">
        <HeroSection />
      </section>

      <section id="about">
        <AboutPage />
      </section>

      <section id="features">
        <FeaturesPage />
      </section>

      <section id="finddoctor">
        <FindDoctor />
      </section>

      <section id="patients">
        <PatientsPage />
      </section>

      <section id="doctors">
        <DoctorsPage />
      </section>

      <section id="carebridge">
        <CareBridgePage />
      </section>

      <section id="pricing">
        <PricingPage />
      </section>

      <Footer />
    </div>
  )
}

export default Landing
