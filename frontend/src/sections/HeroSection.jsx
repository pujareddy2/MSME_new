import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>Telangana MSME</h1>
          <p className="hero-sub">
            Fueling the backbone of our economy, where small scale meets limitless ambition
          </p>

          <div className="hero-quote">
            aims to foster inclusive growth, technological advancement, and job creation across approximately 26 lakh MSMEs in the state
          </div>

           <Link to="/problems" className="hero-btn">
  Explore Problem Statements
</Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;