import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import ResumeAnalyzer from "./ResumeAnalyzer";
import Jobs from "./Jobs";
import ApplicationTracking from "./ApplicationTracking";
import SkillRoadmap from "./SkillRoadmap";
import "./SkillRoadmap.css";
import ImprovedResume from "./ImprovedResume";

import "./App.css";


function Home() {
  const [student, setStudent] = useState(() => {
    const savedStudent = localStorage.getItem("student");

    return savedStudent ? JSON.parse(savedStudent) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("student");
    setStudent(null);
  };

  return (
    <div className="app">

      {/* ================= NAVIGATION BAR ================= */}

      <nav className="navbar">

        <div className="logo">
          Campus<span>Connect</span> AI
        </div>

        <div className="nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/jobs">
            Jobs
          </Link>

          <a href="#companies">
            Companies
          </a>

          <Link to="/resume-analyzer">
            Resume Analyzer
          </Link>

          <a href="#about">
            About
          </a>

        </div>


        <div className="nav-buttons">

          {student ? (
            <>
              <span className="welcome-user">
                Welcome, {student.fullName} 👋
              </span>

              <button
                className="login-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="login-btn"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="register-btn"
              >
                Register
              </Link>
            </>
          )}

        </div>

      </nav>


      {/* ================= HERO SECTION ================= */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-content">

          <p className="welcome">
            WELCOME TO CAMPUSCONNECT AI
          </p>

          <h1>
            Build Your Career.
            <br />
            <span>Find Your Opportunity.</span>
          </h1>

          <p className="hero-text">
            Connect with companies, discover placement opportunities,
            and improve your resume with our AI-powered tools.
          </p>


          <div className="hero-buttons">

            <Link to="/jobs">
              <button className="primary-btn">
                Explore Jobs
              </button>
            </Link>


            <Link to="/resume-analyzer">
              <button className="secondary-btn">
                Analyze My Resume
              </button>
            </Link>

          </div>

        </div>


        {/* AI Resume Card */}

        <div className="hero-card">

          <div className="card-icon">
            🤖
          </div>

          <h3>
            AI Resume Analyzer
          </h3>

          <p>
            Analyze your resume, find mistakes and get
            personalized suggestions to improve your chances
            of getting shortlisted.
          </p>


          <div className="score">

            <strong>
              85%
            </strong>

            <span>
              Resume Score
            </span>

          </div>

        </div>

      </section>


      {/* ================= FEATURES SECTION ================= */}

      <section className="features">

        <h2>
          Everything You Need for Your Placement
        </h2>

        <p className="section-text">
          One platform to manage your placement journey from
          resume preparation to job selection.
        </p>


        <div className="feature-container">


          {/* Feature 1 */}

          <div className="feature-card">

            <div className="feature-icon">
              🎓
            </div>

            <h3>
              Student Placement
            </h3>

            <p>
              Create your profile and explore opportunities
              according to your skills and eligibility.
            </p>

          </div>


          {/* Feature 2 */}

          <div className="feature-card">

            <div className="feature-icon">
              💼
            </div>

            <h3>
              Job Opportunities
            </h3>

            <p>
              Find suitable job openings posted by
              companies and apply easily.
            </p>

          </div>


          {/* Feature 3 */}

          <div className="feature-card">

            <div className="feature-icon">
              🤖
            </div>

            <h3>
              AI Resume Analyzer
            </h3>

            <p>
              Get an AI-powered analysis of your resume
              and identify areas that need improvement.
            </p>

          </div>


          {/* Feature 4 */}

          <div className="feature-card">

            <div className="feature-icon">
              📊
            </div>

            <h3>
              Placement Tracking
            </h3>

            <p>
              Track your applications, interviews and
              selection status in one place.
            </p>

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section className="how-section">

        <h2>
          How CampusConnect AI Works
        </h2>


        <div className="steps">


          {/* Step 1 */}

          <div className="step">

            <div className="step-number">
              1
            </div>

            <h3>
              Create Profile
            </h3>

            <p>
              Register and create your student profile.
            </p>

          </div>


          {/* Step 2 */}

          <div className="step">

            <div className="step-number">
              2
            </div>

            <h3>
              Upload Resume
            </h3>

            <p>
              Upload your resume for AI analysis.
            </p>

          </div>


          {/* Step 3 */}

          <div className="step">

            <div className="step-number">
              3
            </div>

            <h3>
              Improve Resume
            </h3>

            <p>
              Follow AI suggestions and improve your resume.
            </p>

          </div>


          {/* Step 4 */}

          <div className="step">

            <div className="step-number">
              4
            </div>

            <h3>
              Apply for Jobs
            </h3>

            <p>
              Find suitable jobs and submit applications.
            </p>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer>

        <div className="footer-logo">
          Campus<span>Connect</span> AI
        </div>

        <p>
          Smart Placement. Smarter Careers.
        </p>

        <p className="copyright">
          © 2026 CampusConnect AI. All rights reserved.
        </p>

      </footer>

    </div>
  );
}
function RoadmapPage() {
  const savedRoadmap = JSON.parse(
    localStorage.getItem("selectedRoadmap") || "{}"
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px 20px",
        background: "#f4f7ff",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <Link
          to="/jobs"
          style={{
            display: "inline-block",
            marginBottom: "24px",
            padding: "12px 20px",
            color: "#ffffff",
            background: "#4f46e5",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "700",
          }}
        >
          ← Back to Jobs
        </Link>

        <SkillRoadmap
          skills={savedRoadmap.skills || []}
          jobTitle={savedRoadmap.jobTitle || "Your Target Job"}
        />
      </div>
    </div>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

function App() {
  console.log("MY APP JSX IS LOADING");

  return (
    <BrowserRouter>

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* REGISTER */}

        <Route
          path="/register"
          element={<Register />}
        />


        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* PROFILE */}

        <Route
          path="/profile"
          element={<Profile />}
        />


        {/* RESUME ANALYZER */}

        <Route
          path="/resume-analyzer"
          element={<ResumeAnalyzer />}
        />


        {/* JOBS */}

        <Route
          path="/jobs"
          element={<Jobs />}
        />


        {/* APPLICATION TRACKING */}

        <Route
          path="/applications"
          element={<ApplicationTracking />}
        />

        {/* SKILL ROADMAP */}
        <Route
          path="/roadmap"
          element={<RoadmapPage />}
        />

        {/* IMPROVED RESUME */}
        <Route
          path="/improved-resume"
          element={<ImprovedResume />}
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;