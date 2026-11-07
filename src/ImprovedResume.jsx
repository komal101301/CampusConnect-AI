import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import "./ImprovedResume.css";

const DEFAULT_RESUME = {
  name: "Your Name",
  title: "BCA Student | Aspiring Software Developer",
  email: "your.email@example.com",
  phone: "+91 XXXXX XXXXX",
  location: "India",
  summary:
    "Motivated BCA student interested in software development, web technologies, and data analytics. Eager to apply technical knowledge to practical projects and continue learning.",
  skills: "Python, JavaScript, HTML, CSS, SQL, React",
  education:
    "Bachelor of Computer Applications (BCA)\nYour University | Expected Graduation: 2027",
  projects:
    "CampusConnect AI\nDeveloped a student-focused web application with resume analysis and personalized feedback features.\n\nRetail Sales Analytics\nCreated dashboards to analyze sales performance, profit, and business trends.",
  experience: "Fresher — Open to internships and entry-level opportunities.",
  certifications: "Add your certifications, courses, and achievements here.",
};

function getInitialResume() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("improvedResumeData") || "null"
    );

    return saved && typeof saved === "object"
      ? { ...DEFAULT_RESUME, ...saved }
      : { ...DEFAULT_RESUME };
  } catch {
    return { ...DEFAULT_RESUME };
  }
}

export default function ImprovedResume() {
  const navigate = useNavigate();
  const [resume, setResume] = useState(getInitialResume);

  useEffect(() => {
    try {
      localStorage.setItem("improvedResumeData", JSON.stringify(resume));
    } catch (error) {
      console.error("Could not save resume:", error);
    }
  }, [resume]);

  const updateField = (field, value) => {
    setResume((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const downloadPDF = async () => {
    const element = document.getElementById("improved-resume-paper");

    if (!element) {
      window.alert("Resume preview not found.");
      return;
    }

    const safeName =
      (resume.name || "Resume").replace(/[\\/:*?"<>|]/g, "").trim() ||
      "Resume";

    try {
      await html2pdf()
        .set({
          margin: 0,
          filename: `${safeName}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            scrollY: 0,
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
          pagebreak: {
            mode: ["css", "legacy"],
          },
        })
        .from(element)
        .save();
    } catch (error) {
      console.error("PDF download error:", error);
      window.alert("PDF download failed. Please try again.");
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset resume details to the default template?")) {
      setResume({ ...DEFAULT_RESUME });
    }
  };

  const renderLines = (value) =>
    String(value || "")
      .split("\n")
      .filter((line) => line.trim())
      .map((line, index) => <p key={index}>{line}</p>);

  return (
    <div className="improved-resume-page">
      <header className="improved-resume-header">
        <div>
          <h1>Improved Resume</h1>
          <p>Edit your details and prepare a professional resume.</p>
        </div>

        <button
          type="button"
          className="ir-button ir-secondary ir-back-button"
          onClick={() => navigate(-1)}
        >
         <span>←</span> Back
       </button>
      </header>

      <div className="ir-workspace">
        <aside className="ir-editor">
          <h2>Edit Your Details</h2>
          <p className="ir-help">
            Replace the sample details with your real information.
          </p>

          <label>
            Full Name
            <input
              value={resume.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Your full name"
            />
          </label>

          <label>
            Professional Title
            <input
              value={resume.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="BCA Student / Developer"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={resume.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="your@email.com"
            />
          </label>

          <label>
            Phone
            <input
              type="tel"
              value={resume.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+91..."
            />
          </label>

          <label>
            Location
            <input
              value={resume.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="City, State"
            />
          </label>

          <label>
            Professional Summary
            <textarea
              rows={5}
              value={resume.summary}
              onChange={(e) => updateField("summary", e.target.value)}
            />
          </label>

          <label>
            Technical Skills
            <textarea
              rows={3}
              value={resume.skills}
              onChange={(e) => updateField("skills", e.target.value)}
              placeholder="Python, HTML, CSS..."
            />
          </label>

          <label>
            Education
            <textarea
              rows={4}
              value={resume.education}
              onChange={(e) => updateField("education", e.target.value)}
            />
          </label>

          <label>
            Projects
            <textarea
              rows={6}
              value={resume.projects}
              onChange={(e) => updateField("projects", e.target.value)}
            />
          </label>

          <label>
            Experience
            <textarea
              rows={3}
              value={resume.experience}
              onChange={(e) => updateField("experience", e.target.value)}
            />
          </label>

          <label>
            Certifications &amp; Achievements
            <textarea
              rows={3}
              value={resume.certifications}
              onChange={(e) =>
                updateField("certifications", e.target.value)
              }
            />
          </label>

          <button
            type="button"
            className="ir-button ir-primary"
            onClick={downloadPDF}
          >
            Download Resume PDF
          </button>

          <button
            type="button"
            className="ir-button ir-print"
            onClick={() => window.print()}
          >
            Print Resume
          </button>

          <button
            type="button"
            className="ir-button ir-reset"
            onClick={handleReset}
          >
            Reset Template
          </button>
        </aside>

        <main className="ir-preview-area">
          <div className="ir-preview-toolbar">
            <span>Live Preview · A4 Document</span>

            <button
              type="button"
              className="ir-download-preview-btn"
              onClick={downloadPDF}
            >
              ⬇ Download PDF
            </button>
          </div>

          <article id="improved-resume-paper" className="ir-paper">
            <div className="ir-paper-top">
              <h1>{resume.name || "Your Name"}</h1>
              <p className="ir-professional-title">{resume.title}</p>

              <div className="ir-contact">
                {[resume.email, resume.phone, resume.location]
                  .filter(Boolean)
                  .join(" | ")}
              </div>
            </div>

            <section className="ir-resume-section">
              <h2>Professional Summary</h2>
              <p className="ir-summary">{resume.summary}</p>
            </section>

            <section className="ir-resume-section">
              <h2>Technical Skills</h2>
              <div className="ir-skill-list">
                {String(resume.skills || "")
                  .split(/[,;\n]/)
                  .map((skill) => skill.trim())
                  .filter(Boolean)
                  .map((skill, index) => (
                    <span key={index}>{skill}</span>
                  ))}
              </div>
            </section>

            <section className="ir-resume-section">
              <h2>Education</h2>
              {renderLines(resume.education)}
            </section>

            <section className="ir-resume-section">
              <h2>Projects</h2>
              {renderLines(resume.projects)}
            </section>

            <section className="ir-resume-section">
              <h2>Experience</h2>
              {renderLines(resume.experience)}
            </section>

            <section className="ir-resume-section">
              <h2>Certifications &amp; Achievements</h2>
              {renderLines(resume.certifications)}
            </section>
          </article>
        </main>
      </div>
    </div>
  );
}