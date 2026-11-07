
import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  let student = null;

  try {
    student = JSON.parse(localStorage.getItem("student") || "null");
  } catch {
    student = null;
  }

  const features = [
    {
      number: "01",
      icon: "👤",
      title: "My Profile",
      description: "View your student information and keep your personal details up to date.",
      link: "/profile",
      button: "View Profile",
    },
    {
      number: "02",
      icon: "📄",
      title: "Resume Analyzer",
      description: "Analyze your resume, discover improvement areas, and get AI-powered suggestions.",
      link: "/resume-analyzer",
      button: "Analyze Resume",
    },
    {
      number: "03",
      icon: "💼",
      title: "Job Opportunities",
      description: "Explore job openings and discover opportunities for your career journey.",
      link: "/jobs",
      button: "Explore Jobs",
    },
    {
      number: "04",
      icon: "📊",
      title: "Application Tracking",
      description: "Keep track of your applications and monitor your placement progress.",
      link: "/applications",
      button: "Track Applications",
    },
  ];

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <Link to="/" className="dashboard-logo">
          Campus<span>Connect</span> AI
        </Link>

        <Link to="/" className="dashboard-home">
          ← Home
        </Link>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">STUDENT WORKSPACE</span>

            <h1>
              Welcome back, {student?.fullName || "Student"} 👋
            </h1>

            <p>
              Manage your placement journey and prepare for your career
              with CampusConnect AI.
            </p>
          </div>

          <div className="dashboard-welcome-tag">
            <span>✦</span> YOUR CAREER STARTS HERE
          </div>
        </section>

        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-eyebrow">YOUR WORKSPACE</span>
              <h2>Explore your dashboard</h2>
              <p>Everything you need to prepare for your career, in one place.</p>
            </div>

            <span className="dashboard-count">04 FEATURES</span>
          </div>

          <div className="dashboard-cards">
            {features.map((feature) => (
              <article className="dashboard-card" key={feature.number}>
                <div className="dashboard-card-top">
                  <div className="dashboard-icon">{feature.icon}</div>
                  <span className="dashboard-number">{feature.number}</span>
                </div>

                <h3>{feature.title}</h3>
                <p>{feature.description}</p>

                <Link to={feature.link} className="dashboard-card-link">
                  {feature.button} <span>→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-bottom">
          <div>
            <span>READY FOR YOUR NEXT STEP?</span>
            <h2>Build your career with confidence.</h2>
            <p>Improve your resume and explore opportunities that match your goals.</p>
          </div>

          <Link to="/jobs" className="dashboard-bottom-button">
            Explore Opportunities →
          </Link>
        </section>
      </main>

      <footer className="dashboard-footer">
        <strong>Campus<span>Connect</span> AI</strong>
        <p>Smart Placement. Smarter Careers.</p>
      </footer>
    </div>
  );
}

export default Dashboard;
