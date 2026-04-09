import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Evaluate from "./pages/Evaluate";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterTeamLeader from "./pages/RegisterTeamLeader";

import ProblemStatement from "./pages/ProblemStatements";
import ProblemDetails from "./pages/ProblemDetails";

import Application from "./pages/Application";
import Confirmation from "./pages/confirmation";

import EvaluatorDashboard from "./pages/EvaluatorDashboard";
import AddProblem from "./pages/AddProblem";

// ✅ NEW IMPORTS
import Dashboard from "./pages/Dashboard";
import CreateTeam from "./pages/CreateTeam";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import RoleDashboard from "./pages/RoleDashboard";

import AboutSection from "./sections/AboutSection";
import GuidelinesSection from "./sections/GuidelinesSection";
import FAQSection from "./sections/FAQSection";
import ContactSection from "./sections/ContactSection";

function App() {
  return (
    <Router>
      <Header />

      <main>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />
          <Route path="/register-team-lead" element={<RegisterTeamLeader />} />

          {/* ✅ Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/team-member-dashboard" element={<RoleDashboard role="TEAM_MEMBER" />} />
          <Route path="/mentor-dashboard" element={<RoleDashboard role="MENTOR" />} />
          <Route path="/event-head-dashboard" element={<RoleDashboard role="EVENT_HEAD" />} />
          <Route path="/admin-dashboard" element={<RoleDashboard role="ADMIN" />} />
          <Route path="/spoc-dashboard" element={<RoleDashboard role="COLLEGE_SPOC" />} />
          <Route path="/judge-dashboard" element={<RoleDashboard role="JUDGE" />} />

          {/* Information Pages */}
          <Route path="/about" element={<AboutSection />} />
          <Route path="/guidelines" element={<GuidelinesSection />} />
          <Route path="/faqs" element={<FAQSection />} />
          <Route path="/contact" element={<ContactSection />} />

          {/* Problem Statements */}
          <Route path="/problems" element={<ProblemStatement />} />
          <Route path="/problems/:id" element={<ProblemDetails />} />

          {/* Application Flow */}
          <Route path="/apply/:id" element={<Application />} />
          <Route path="/confirmation" element={<Confirmation />} />

          {/* ✅ Team Creation */}
          <Route path="/create-team" element={<CreateTeam />} />

          {/* ✅ My Applications */}
          <Route path="/my-applications" element={<MyApplications />} />

          {/* Evaluator */}
          <Route path="/evaluator" element={<EvaluatorDashboard />} />

          {/* Shared role pages */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

          {/* Add Problem Statement */}
          <Route path="/add-problem" element={<AddProblem />} />
          <Route path="/evaluate" element={<Evaluate />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;
