import HeroSection from "../sections/HeroSection";
import AboutSection from "../sections/AboutSection";
import ThemesSection from "../sections/ThemesSection";
import { FaTableColumns, FaMagnifyingGlass, FaListCheck, FaBell } from "react-icons/fa6";
import "../App.css";

function Home() {
  return (
    <>
      <HeroSection />

      <section className="home-stats">
        <div className="home-section-header">
          <h2>Platform Snapshot</h2>
          <p>Core numbers that make the platform's innovation ecosystem feel national-scale.</p>
        </div>
        <div className="home-card-grid stats-grid">
          <div className="home-card stat-card"><strong>26 Lakh+</strong><span>Platform ecosystem reach</span></div>
          <div className="home-card stat-card"><strong>100+</strong><span>Problem statements</span></div>
          <div className="home-card stat-card"><strong>7</strong><span>Role-based user journeys</span></div>
        </div>
      </section>

      <AboutSection />

      <section className="home-features">
        <div className="home-section-header">
          <h2>Features</h2>
          <p>Built for team leaders, judges, mentors, and SPOCs.</p>
        </div>
        <div className="home-card-grid feature-grid">
          <div className="home-card feature-card">
            <div className="feature-icon-wrap"><FaTableColumns /></div>
            <h3>Unified Dashboards</h3>
            <p>Role-aware dashboards keep each participant on the right workflow.</p>
          </div>
          <div className="home-card feature-card">
            <div className="feature-icon-wrap"><FaMagnifyingGlass /></div>
            <h3>Live Problem Browsing</h3>
            <p>Search, filter, and apply from one structured problem statement experience.</p>
          </div>
          <div className="home-card feature-card">
            <div className="feature-icon-wrap"><FaListCheck /></div>
            <h3>Submission Tracking</h3>
            <p>See application status, uploaded files, and recent activity in one place.</p>
          </div>
          <div className="home-card feature-card">
            <div className="feature-icon-wrap"><FaBell /></div>
            <h3>Notifications</h3>
            <p>Round updates, mentor notes, and results can surface centrally.</p>
          </div>
        </div>
      </section>

      <section className="home-events">
        <div className="home-section-header">
          <h2>Featured Events</h2>
          <p>Showcasing innovation-style event cards for a professional portal feel.</p>
        </div>
        <div className="home-card-grid event-grid">
          <div className="event-card">
            <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=60" alt="Innovation Sprint" />
            <div>
              <h3>Innovation Sprint</h3>
              <p>National-scale ideation and prototype showcase.</p>
            </div>
          </div>
          <div className="event-card">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=60" alt="Mentor Connect" />
            <div>
              <h3>Mentor Connect</h3>
              <p>Structured guidance sessions for high-potential teams.</p>
            </div>
          </div>
          <div className="event-card">
            <img src="https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=800&q=60" alt="Final Showcase" />
            <div>
              <h3>Final Showcase</h3>
              <p>Judge review, ranking, and final recognition workflow.</p>
            </div>
          </div>
        </div>
      </section>

      <ThemesSection />
    </>
  );
}

export default Home;