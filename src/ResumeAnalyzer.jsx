
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResumeAnalyzer.css";

const INITIAL_TOKENS = 10;
const UNLOCK_COST = 2;
const API_URL = "http://localhost:5000/api/analyze-resume";

export default function ResumeAnalyzer() {
  const navigate = useNavigate();

  const [tokens, setTokens] = useState(() => {
    const saved = localStorage.getItem("resumeDemoTokens");
    return saved === null ? INITIAL_TOKENS : Math.max(0, Number(saved) || 0);
  });

  const [file, setFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [unlockedSections, setUnlockedSections] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("resumeUnlockedSections") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("resumeDemoTokens", String(tokens));
  }, [tokens]);

  useEffect(() => {
    localStorage.setItem(
      "resumeUnlockedSections",
      JSON.stringify(unlockedSections)
    );
  }, [unlockedSections]);

  useEffect(() => {
    return () => {
      if (resumeUrl) URL.revokeObjectURL(resumeUrl);
    };
  }, [resumeUrl]);

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0];

    if (!selected) return;

    if (
      selected.type !== "application/pdf" &&
      !selected.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please upload a PDF resume.");
      event.target.value = "";
      return;
    }

    if (resumeUrl) URL.revokeObjectURL(resumeUrl);

    setFile(selected);
    setResumeUrl(URL.createObjectURL(selected));
    setAnalysis(null);
    setError("");
    setUnlockedSections([]);

    localStorage.removeItem("resumeAnalysis");
    localStorage.setItem("resumeUnlockedSections", "[]");
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload your resume first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Resume analysis failed (${response.status}).`);
      }

      const result = await response.json();

      setAnalysis(result);
      localStorage.setItem("resumeAnalysis", JSON.stringify(result));
    } catch (err) {
      console.error("Resume analysis error:", err);
      setError(
        err.message ||
          "Unable to analyze resume. Check that your backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const unlockSection = (section) => {
    if (unlockedSections.includes(section)) return;

    if (tokens < UNLOCK_COST) {
      alert("Not enough tokens! You need 2 tokens.");
      return;
    }

    const nextTokens = tokens - UNLOCK_COST;
    const nextSections = [...unlockedSections, section];

    setTokens(nextTokens);
    setUnlockedSections(nextSections);

    localStorage.setItem("resumeDemoTokens", String(nextTokens));
    localStorage.setItem(
      "resumeUnlockedSections",
      JSON.stringify(nextSections)
    );
  };

  const unlockImprovedResume = () => {
    if (!unlockedSections.includes("resume")) {
      if (tokens < UNLOCK_COST) {
        alert("Not enough tokens! You need 2 tokens.");
        return;
      }

      const nextTokens = tokens - UNLOCK_COST;
      const nextSections = [...unlockedSections, "resume"];

      setTokens(nextTokens);
      setUnlockedSections(nextSections);

      localStorage.setItem("resumeDemoTokens", String(nextTokens));
      localStorage.setItem(
        "resumeUnlockedSections",
        JSON.stringify(nextSections)
      );
    }

    navigate("/improved-resume");
  };

  const resetTokens = () => {
    if (window.confirm("Reset demo tokens to 10?")) {
      setTokens(INITIAL_TOKENS);
    }
  };

  const issues =
    analysis?.issues ??
    analysis?.resume_issues ??
    [];

  const tips =
    analysis?.tips ??
    analysis?.improvements ??
    analysis?.suggestions ??
    [];

  const skills =
    analysis?.skills ??
    analysis?.extracted_skills ??
    [];

  const keywords =
    analysis?.suggestedKeywords ??
    analysis?.suggested_keywords ??
    analysis?.keywords ??
    [];

  const score = analysis?.score ?? analysis?.resume_score ?? null;

  const toText = (item) => {
    if (typeof item === "string") return item;

    if (item && typeof item === "object") {
      return item.message ?? item.name ?? JSON.stringify(item);
    }

    return String(item ?? "");
  };

  const renderFeedback = (items, emptyMessage) => {
    if (!Array.isArray(items) || items.length === 0) {
      return <p>{emptyMessage}</p>;
    }

    return items.map((item, index) => (
      <div className="feedback-card" key={index}>
        <p>{toText(item)}</p>
      </div>
    ));
  };

  return (
    <div className="resume-page">
      <header className="resume-header">
        <div className="resume-logo">
          CampusConnect <span>AI</span>
        </div>

        <a className="resume-back" href="/dashboard">
          ← Back to Dashboard
        </a>
      </header>

      <main className="resume-container">
        <section className="resume-heading">
          <div className="upload-icon">▤</div>
          <h1>AI Resume Coach</h1>
          <p>
            Upload your resume, get personalized feedback, and
            unlock your improved resume.
          </p>
        </section>

        <section className="upload-box">
          <h2>Upload Your Resume</h2>
          <p>Select your resume in PDF format.</p>

          
        <input
          id="resume-upload"
          className="resume-file-input"
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
        />

         <label htmlFor="resume-upload" className="choose-file-button">
            📁 Choose PDF File
         </label>


          {file && <p className="file-name">Selected: {file.name}</p>}

          <button
            className="analyze-button"
            type="button"
            onClick={handleAnalyze}
            disabled={!file || loading}
          >
            {loading ? "Analyzing..." : "✨ Analyze My Resume"}
          </button>

          {error && <p role="alert" className="resume-error">{error}</p>}

          {loading && (
            <p className="loading-message">
              Please wait while your resume is being analyzed...
            </p>
          )}
        </section>

        {analysis && (
          <>
            <section className="results-heading">
              <div>
                <h2>Your Resume Analysis</h2>
                <p>Review your resume and personalized feedback below.</p>
              </div>

              <div className="results-actions">
                <div className="token-balance">
                  🪙 Tokens: {tokens}
                </div>

                <button
                  type="button"
                  className="upload-button"
                  onClick={resetTokens}
                >
                  Reset Tokens
                </button>
              </div>
            </section>

            <section className="resume-analysis-layout">
              {/* LEFT PANEL: ORIGINAL PDF */}
              <article className="resume-panel">
                <div className="panel-heading">
                  <div>
                    <h2>📄 Your Resume</h2>
                    <p>{file?.name || "Uploaded PDF preview"}</p>
                  </div>
                </div>

                {resumeUrl ? (
                  <iframe
                    className="resume-pdf-viewer"
                    src={resumeUrl}
                    title="Original resume PDF"
                  />
                ) : (
                  <p>No PDF selected.</p>
                )}

                <p className="pdf-help">
                  Your original document is shown here for reference.
                </p>
              </article>

              {/* RIGHT PANEL: RESUME COACH */}
              <article className="resume-panel coach-panel">
                <div className="panel-heading">
                  <div>
                    <h2>✨ Resume Coach</h2>
                    <p>Your personalized resume feedback</p>
                  </div>
                </div>

                <div className="score-card">
                  <span>Overall Resume Score</span>

                  <strong>
                    {score !== null ? `${score}%` : "—"}
                  </strong>

                  <span className="score-status">
                    {score !== null
                      ? Number(score) >= 75
                        ? "Strong Resume"
                        : Number(score) >= 55
                        ? "Good Start"
                        : "Needs Improvement"
                      : "Analysis complete"}
                  </span>

                  <div className="progress-bar">
                    <div
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(100, Number(score) || 0)
                        )}%`,
                      }}
                    />
                  </div>

                  <p>Use the feedback below to improve your resume.</p>
                </div>

                <div className="summary-grid">
                  <div>
                    <strong>{Array.isArray(issues) ? issues.length : 0}</strong>
                    <span>Issues</span>
                  </div>

                  <div>
                    <strong>{Array.isArray(tips) ? tips.length : 0}</strong>
                    <span>Suggestions</span>
                  </div>

                  <div>
                    <strong>{Array.isArray(skills) ? skills.length : 0}</strong>
                    <span>Skills Found</span>
                  </div>
                </div>

                <section className="coach-section">
                  <h3>🔍 Issues to Review</h3>

                  {unlockedSections.includes("issues") ? (
                    renderFeedback(issues, "No issues were returned by the API.")
                  ) : (
                    <>
                      <p>Unlock to read detailed issues in your resume.</p>
                      <button
                        className="unlock-button"
                        type="button"
                        onClick={() => unlockSection("issues")}
                      >
                        🔒 Unlock Issues · 2 tokens
                      </button>
                    </>
                  )}
                </section>

                <section className="coach-section">
                  <h3>💡 Improvement Tips</h3>

                  {unlockedSections.includes("tips") ? (
                    renderFeedback(tips, "No tips were returned by the API.")
                  ) : (
                    <>
                      <p>Unlock personalized suggestions for improvement.</p>
                      <button
                        className="unlock-button"
                        type="button"
                        onClick={() => unlockSection("tips")}
                      >
                        🔒 Unlock Tips · 2 tokens
                      </button>
                    </>
                  )}
                </section>

                <section className="coach-section">
                  <h3>🧩 Skills & Suggested Keywords</h3>
                  <p>Use these only when they match your real experience.</p>

                  <div className="keyword-list">
                    {Array.isArray(skills) && skills.length > 0 ? (
                      skills.map((skill, index) => (
                        <span key={`skill-${index}`}>{toText(skill)}</span>
                      ))
                    ) : (
                      <span>No skills returned</span>
                    )}

                    {Array.isArray(keywords) &&
                      keywords.map((keyword, index) => (
                        <span key={`keyword-${index}`}>{toText(keyword)}</span>
                      ))}
                  </div>
                </section>

                <section className="improved-resume-cta">
                  <h3>🚀 Ready to Improve Your Resume?</h3>
                  <p>
                    Open a separate, professional resume preview page.
                    Unlocking costs 2 demo tokens.
                  </p>

                  <button
                    className="unlock-button"
                    type="button"
                    onClick={unlockImprovedResume}
                  >
                    {unlockedSections.includes("resume")
                      ? "View Improved Resume →"
                      : "🔒 Unlock Improved Resume · 2 tokens"}
                  </button>
                </section>
              </article>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
