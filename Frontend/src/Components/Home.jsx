import React from "react"
import "../css/Home.css"
import { Link } from "react-router-dom"

import heroVideo from "../assets/images/hero-video.mp4"
import tourde from "../assets/images/tourde.png"
import gallery01 from "../assets/images/gallery-01.jpg"
import gallery02 from "../assets/images/gallery-02.jpg"
import gallery03 from "../assets/images/gallery-03.jpg"
import gallery04 from "../assets/images/gallery-04.jpg"
import experienceImg from "../assets/images/experience.png"
import guideImg from "../assets/images/guide.png"
import ava1 from "../assets/images/ava-1.jpg"
import side01 from "../assets/images/tour-img03.jpg"
import side02 from "../assets/images/tour-img04.jpg"
import side03 from "../assets/images/gallery-06.jpg"
import side08 from "../assets/images/gallery-08.jpg"

export default function Home() {
  return (
    <div className="home">
      {/* LOGO */}
      <div className="logo">
        <img src={tourde} alt="TourDe Logo" />
      </div>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-overlay"></div>

        <video
          className="hero-bg"
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
        ></video>

        <div className="hero-content">
          <h1>
            Discover the <span>World</span> with <span>TourDe</span>
          </h1>
          <p>
            Experience breathtaking adventures, discover hidden gems, and create
            stories that will last a lifetime - all with expert planning and care.
          </p>
          <Link to="/trips" className="hero-btn">Start Exploring</Link>
        </div>

        {/* RIGHT IMAGE STRIP */}
        <div className="hero-side-images">
          <img src={side01} alt="Tour" />
          <img src={side03} alt="Adventure" />
          <img src={side08} alt="Destination" />
        </div>
      </section>

      {/* ABOUT / EXPERIENCE SECTION */}
      <section className="about">
        <div className="about-left">
          <img src={experienceImg} alt="Experience" />
        </div>
        <div className="about-right">
          <h2>Why Travel With <span>TourDe</span></h2>
          <p>
            With over a decade of experience in curating travel experiences, TourDe brings you adventures 
            that go beyond sightseeing — we bring moments that stay with you forever.
          </p>
          <div className="stats">
            <div><h3>10+</h3><p>Years Experience</p></div>
            <div><h3>500+</h3><p>Happy Travelers</p></div>
            <div><h3>50+</h3><p>Destinations</p></div>
          </div>
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section className="destinations">
        <h2>Popular Destinations</h2>
        <div className="gallery">
          <img src={gallery01} alt="Destination 1" />
          <img src={gallery02} alt="Destination 2" />
          <img src={gallery03} alt="Destination 3" />
          <img src={gallery04} alt="Destination 4" />
        </div>
      </section>

      {/* OUR GUIDES SECTION */}
      <section className="guides">
        <div className="guide-text">
          <h2>Meet Our Expert Guides</h2>
          <p>
            Our passionate local guides make every trip meaningful and memorable.
            From mountain treks to city explorations — their insights turn travel
            into a story worth sharing.
          </p>

          <div className="guide-team">
            <div className="guide-card">
              <img src={ava1} alt="Guide" />
              <h4>Aryan</h4>
              <p>Adventure Expert</p>
            </div>
            <div className="guide-card">
              <img src={ava1} alt="Guide" />
              <h4>Chayan</h4>
              <p>Culture Specialist</p>
            </div>
            <div className="guide-card">
              <img src={ava1} alt="Guide" />
              <h4>Abhinav</h4>
              <p>Nature Guide</p>
            </div>
            <div className="guide-card">
              <img src={ava1} alt="Guide" />
              <h4>Aryan Prince</h4>
              <p>Travel Planner</p>
            </div>
          </div>
        </div>

        <img src={guideImg} alt="Guide Illustration" className="guide-img" />
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <img src={tourde} alt="World" className="footer-icon" />
        <p> © {new Date().getFullYear()} TourDe Travels. All Rights Reserved.</p>
      </footer>
    </div>
  )
}
