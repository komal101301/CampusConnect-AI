
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Jobs.css";

const JOBS = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechNova Solutions",
    location: "Chandigarh",
    type: "Full-time",
    salary: "₹3–6 LPA",
    category: "Development",
    skills: ["HTML", "CSS", "JavaScript", "React", "Git"],
    description:
      "Build responsive, accessible and user-friendly web applications.",
    icon: "💻",
    color: "purple",
  },
  {
    id: 2,
    title: "Python Developer",
    company: "CodeCraft Technologies",
    location: "Mohali",
    type: "Full-time",
    salary: "₹3–7 LPA",
    category: "Development",
    skills: ["Python", "SQL", "Git", "Django"],
    description:
      "Develop Python applications, APIs and database-driven solutions.",
    icon: "🐍",
    color: "blue",
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "Insight Analytics",
    location: "Remote",
    type: "Full-time",
    salary: "₹3–6 LPA",
    category: "Data & Analytics",
    skills: ["Excel", "SQL", "Python", "Power BI"],
    description:
      "Analyse datasets and create dashboards that support business decisions.",
    icon: "📊",
    color: "green",
  },
  {
    id: 4,
    title: "Java Developer",
    company: "NextGen Systems",
    location: "Ludhiana",
    type: "Internship",
    salary: "₹10k–20k/month",
    category: "Development",
    skills: ["Java", "SQL", "Git"],
    description:
      "Work with a development team to build and test software applications.",
    icon: "☕",
    color: "orange",
  },
];

const SKILL_ALIASES = {
  "js": "javascript",
  "reactjs": "react",
  "react.js": "react",
  "html5": "html",
  "css3": "css",
  "py": "python",
  "powerbi": "power bi",
  "power-bi": "power bi",
  "ms excel": "excel",
  "structured query language": "sql",
  "git and github": "git",
  "django framework": "django",
};

function normalizeSkill(skill) {
  const cleaned = String(skill || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  return SKILL_ALIASES[cleaned] || cleaned;
}

function normalizeSkills(skills) {
  if (!Array.isArray(skills)) return [];

  return [
    ...new Set(
      skills
        .map(normalizeSkill)
        .filter(Boolean)
    ),
  ];
}

function readLocalStorage(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function getResumeSkills() {
  const analysis = readLocalStorage("resumeAnalysis", {});

  if (Array.isArray(analysis)) {
    return normalizeSkills(analysis);
  }

  const candidates = [
    analysis?.skills,
    analysis?.extractedSkills,
    analysis?.matchedSkills,
    analysis?.resumeSkills,
    analysis?.analysis?.skills,
    analysis?.data?.skills,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return normalizeSkills(candidate);
    }
  }

  return [];
}

function getJobMatch(job, resumeSkills) {
  const jobSkills = normalizeSkills(job.skills);
  const matched = jobSkills.filter((skill) =>
    resumeSkills.includes(skill)
  );
  const missing = jobSkills.filter(
    (skill) => !resumeSkills.includes(skill)
  );

  const percentage = jobSkills.length
    ? Math.round((matched.length / jobSkills.length) * 100)
    : 0;

  return { matched, missing, percentage };
}

export default function Jobs() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [skillFilter, setSkillFilter] = useState("All Skills");
  const [minimumMatch, setMinimumMatch] = useState("0");
  const [sortBy, setSortBy] = useState("recommended");
  const [resumeSkills, setResumeSkills] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loadingApply, setLoadingApply] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    setResumeSkills(getResumeSkills());

    const student = readLocalStorage("student", {});
    const studentId = student?.id || student?._id;

    if (!studentId) return;

    let active = true;

    fetch(
      `http://localhost:5000/api/applications?studentId=${encodeURIComponent(studentId)}`
    )
      .then((response) => {
        if (!response.ok) throw new Error("Could not load applications");
        return response.json();
      })
      .then((data) => {
        if (!active) return;

        const applications = Array.isArray(data)
          ? data
          : data.applications || [];

        setAppliedJobs(applications);
      })
      .catch(() => {
        // The page remains usable if the application list cannot load.
      });

    return () => {
      active = false;
    };
  }, []);

  const locations = useMemo(
    () => ["All Locations", ...new Set(JOBS.map((job) => job.location))],
    []
  );

  const skillsList = useMemo(
    () => [
      "All Skills",
      ...new Set(JOBS.flatMap((job) => job.skills.map(normalizeSkill))),
    ],
    []
  );

  const filteredJobs = useMemo(() => {
    const results = JOBS.map((job) => ({
      ...job,
      match: getJobMatch(job, resumeSkills),
    })).filter((job) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.skills.some((skill) => skill.toLowerCase().includes(query));

      const matchesLocation =
        location === "All Locations" || job.location === location;

      const matchesSkill =
        skillFilter === "All Skills" ||
        normalizeSkills(job.skills).includes(normalizeSkill(skillFilter));

      const matchesMinimum =
        job.match.percentage >= Number(minimumMatch);

      return (
        matchesSearch &&
        matchesLocation &&
        matchesSkill &&
        matchesMinimum
      );
    });

    if (sortBy === "match") {
      results.sort((a, b) => b.match.percentage - a.match.percentage);
    } else if (sortBy === "title") {
      results.sort((a, b) => a.title.localeCompare(b.title));
    }

    return results;
  }, [
    search,
    location,
    skillFilter,
    minimumMatch,
    sortBy,
    resumeSkills,
  ]);

  function isApplied(jobTitle) {
    return appliedJobs.some(
      (application) =>
        (application.jobTitle || "").toLowerCase() ===
        jobTitle.toLowerCase()
    );
  }

  async function handleApply(job) {
    if (isApplied(job.title)) return;

    const student = readLocalStorage("student", {});
    const studentId = student?.id || student?._id;

    if (!studentId) {
      setMessageType("error");
      setMessage("Please log in as a student before applying.");
      return;
    }

    setLoadingApply(job.title);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/applications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId,
            jobTitle: job.title,
            company: job.company,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to submit your application.");
      }

      const newApplication = data.application || {
        jobTitle: job.title,
        company: job.company,
      };

      setAppliedJobs((previous) => [...previous, newApplication]);
      setMessageType("success");
      setMessage(`Application submitted for ${job.title}!`);
    } catch (error) {
      setMessageType("error");
      setMessage(
        error.message ||
          "Could not submit your application. Please try again."
      );
    } finally {
      setLoadingApply("");
    }
  }

  function openRoadmap(job) {
    const skills =
      job.match.missing.length > 0
        ? job.match.missing
        : normalizeSkills(job.skills);

    localStorage.setItem(
      "selectedRoadmap",
      JSON.stringify({
        skills,
        jobTitle: job.title,
      })
    );

    navigate("/roadmap");
  }

  return (
  <main className="jobs-page">

    <div className="jobs-back-wrapper">
      <button
        type="button"
        className="jobs-back-button"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>
    </div>
      <section className="jobs-hero">
        <div className="jobs-hero-content">
          <span className="jobs-eyebrow">
            <span className="hero-live-dot" />
            YOUR NEXT OPPORTUNITY STARTS HERE
          </span>

          <h1>
            Find a job that
            <br />
            <span>fits your future.</span>
          </h1>

          <p>
            Discover opportunities, compare your skills, and build a
            personalised learning roadmap to reach your career goals.
          </p>

          <div className="jobs-hero-stats">
            <div>
              <strong>{JOBS.length}+</strong>
              <span>Opportunities</span>
            </div>
            <div>
              <strong>{resumeSkills.length}</strong>
              <span>Resume skills</span>
            </div>
            <div>
              <strong>{filteredJobs.length}</strong>
              <span>Matching results</span>
            </div>
          </div>
        </div>

        <div className="jobs-hero-art" aria-hidden="true">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-main-icon">🚀</div>
          <div className="floating-card floating-card-top">
            <span>✨</span>
            <div>
              <strong>Career growth</strong>
              <small>Your next chapter</small>
            </div>
          </div>
          <div className="floating-card floating-card-bottom">
            <span>🎯</span>
            <div>
              <strong>Skill match</strong>
              <small>Find your fit</small>
            </div>
          </div>
        </div>
      </section>

      <section className="jobs-content">
        <div className="jobs-section-heading">
          <div>
            <span className="section-kicker">EXPLORE CAREERS</span>
            <h2>Discover your next role</h2>
            <p>Use filters to find opportunities that match your skills.</p>
          </div>

          <span className="results-pill">
            {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} found
          </span>
        </div>

        {resumeSkills.length === 0 && (
          <div className="resume-notice">
            <span className="notice-icon">💡</span>
            <div>
              <strong>Get personalised skill matching</strong>
              <p>
                Upload and analyse your resume to see which job skills you
                already have and what you can learn next.
              </p>
            </div>
          </div>
        )}

        {message && (
          <div
            className={`jobs-message ${messageType}`}
            role="status"
          >
            <span>{messageType === "success" ? "✓" : "!"}</span>
            {message}
            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        <section className="jobs-filter-panel">
          <div className="jobs-search-wrap">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search job title, company or skill..."
              aria-label="Search jobs"
            />
          </div>

          <div className="jobs-filter-grid">
            <label className="jobs-field">
              <span>📍 Location</span>
              <select
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              >
                {locations.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="jobs-field">
              <span>🧩 Skill</span>
              <select
                value={skillFilter}
                onChange={(event) => setSkillFilter(event.target.value)}
              >
                {skillsList.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="jobs-field">
              <span>📈 Minimum match</span>
              <select
                value={minimumMatch}
                onChange={(event) => setMinimumMatch(event.target.value)}
              >
                <option value="0">Any match</option>
                <option value="25">25% or more</option>
                <option value="50">50% or more</option>
                <option value="75">75% or more</option>
              </select>
            </label>

            <label className="jobs-field">
              <span>↕ Sort by</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="recommended">Recommended</option>
                <option value="match">Highest skill match</option>
                <option value="title">Job title A–Z</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            className="jobs-reset-button"
            onClick={() => {
              setSearch("");
              setLocation("All Locations");
              setSkillFilter("All Skills");
              setMinimumMatch("0");
              setSortBy("recommended");
            }}
          >
            ↺ Reset filters
          </button>
        </section>

        <div className="jobs-list-heading">
          <h3>Recommended opportunities</h3>
          <span>Find a role. Learn new skills. Grow your career.</span>
        </div>

        {filteredJobs.length > 0 ? (
          <div className="jobs-grid">
            {filteredJobs.map((job) => {
              const applied = isApplied(job.title);
              const { matched, missing, percentage } = job.match;

              return (
                <article className="job-card" key={job.id}>
                  <div className="job-card-top">
                    <div className={`job-company-icon ${job.color}`}>
                      {job.icon}
                    </div>
                    <span className="job-type-pill">{job.type}</span>
                  </div>

                  <div className="job-heading">
                    <h3>{job.title}</h3>
                    <p className="job-company">{job.company}</p>
                  </div>

                  <div className="job-meta">
                    <span>📍 {job.location}</span>
                    <span>💰 {job.salary}</span>
                  </div>

                  <p className="job-description">{job.description}</p>

                  <div className="job-skills-heading">
                    <strong>Required skills</strong>
                    <span>{job.skills.length} skills</span>
                  </div>

                  <div className="job-skills-list">
                    {job.skills.map((skill) => {
                      const hasSkill = matched.includes(normalizeSkill(skill));

                      return (
                        <span
                          key={skill}
                          className={`job-skill-chip ${hasSkill ? "skill-owned" : "skill-missing"}`}
                        >
                          {hasSkill ? "✓ " : "+ "}
                          {skill}
                        </span>
                      );
                    })}
                  </div>

                  <div className="job-match-panel">
                    <div className="match-topline">
                      <div>
                        <span className="match-label">YOUR SKILL MATCH</span>
                        <strong className="match-percentage">
                          {percentage}%
                        </strong>
                      </div>
                      <span className={`match-status ${percentage >= 75 ? "match-high" : percentage >= 40 ? "match-medium" : "match-low"}`}>
                        {percentage >= 75
                          ? "Strong match"
                          : percentage >= 40
                            ? "Good start"
                            : "Room to grow"}
                      </span>
                    </div>

                    <div
                      className="match-progress-track"
                      role="progressbar"
                      aria-label={`Skill match for ${job.title}`}
                      aria-valuenow={percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="match-progress-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="match-details">
                      <span>✓ {matched.length} matched</span>
                      <span>＋ {missing.length} to learn</span>
                    </div>
                  </div>

                  <div className="job-card-actions">
                    <button
                      type="button"
                      className="job-roadmap-button"
                      onClick={() => openRoadmap(job)}
                    >
                      📚 Learning Roadmap
                      <span aria-hidden="true">↗</span>
                    </button>

                    <button
                      type="button"
                      className={`job-apply-button ${applied ? "is-applied" : ""}`}
                      disabled={applied || loadingApply === job.title}
                      onClick={() => handleApply(job)}
                    >
                      {loadingApply === job.title
                        ? "Applying..."
                        : applied
                          ? "Applied ✓"
                          : "Apply Now →"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="jobs-empty-state">
            <div className="empty-state-icon">🔎</div>
            <h3>No matching jobs found</h3>
            <p>
              Try changing your search or resetting the filters to see more
              opportunities.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setLocation("All Locations");
                setSkillFilter("All Skills");
                setMinimumMatch("0");
                setSortBy("recommended");
              }}
            >
              Clear all filters
            </button>
          </div>
        )}

        <section className="jobs-bottom-banner">
          <div className="bottom-banner-icon">🌱</div>
          <div>
            <h3>Missing a few skills? That's an opportunity.</h3>
            <p>
              Open a learning roadmap to find free resources and track your
              progress toward your dream role.
            </p>
          </div>
          <span className="banner-sparkle" aria-hidden="true">✦</span>
        </section>
      </section>
    </main>
  );
}
