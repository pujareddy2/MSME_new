import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Judge from "./pages/Judge";
import Evaluate from "./pages/Evaluate";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import RegisterTeamLeader from "./pages/RegisterTeamLeader";

import ProblemStatement from "./pages/ProblemStatements";
import ProblemDetails from "./pages/ProblemDetails";

import Application from "./pages/Application";
import Confirmation from "./pages/confirmation";

import JudgeDashboard from "./pages/JudgeDashboard";
import JudgeReport from "./pages/JudgeReport";
import EvaluatorDashboard from "./pages/EvaluatorDashboard";
import EvaluationReport from "./pages/EvaluationReport";
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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register-team-lead" element={<RegisterTeamLeader />} />

          {/* ✅ Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/team-member-dashboard" element={<RoleDashboard role="TEAM_MEMBER" />} />
          <Route path="/mentor-dashboard" element={<RoleDashboard role="MENTOR" />} />
          <Route path="/event-head-dashboard" element={<RoleDashboard role="EVENT_HEAD" />} />
          <Route path="/admin-dashboard" element={<RoleDashboard role="ADMIN" />} />
          <Route path="/spoc-dashboard" element={<RoleDashboard role="COLLEGE_SPOC" />} />

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

          {/* Judge routes */}
          <Route path="/judge-dashboard" element={<JudgeDashboard />} />
          <Route path="/judge/:id" element={<Judge />} />
          <Route path="/feedback/:id" element={<Judge />} />
          <Route path="/judge/report/:id" element={<JudgeReport />} />

          {/* Evaluator routes */}
          <Route path="/evaluator" element={<EvaluatorDashboard />} />
          <Route path="/evaluate/:id" element={<Evaluate />} />
          <Route path="/evaluation-report/:id" element={<EvaluationReport />} />

          {/* Shared role pages */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

          {/* Add Problem Statement */}
          <Route path="/add-problem" element={<AddProblem />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;
