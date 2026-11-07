
import React, { useEffect, useState } from "react";
import "./SkillRoadmap.css";

const ROADMAPS = {
  html: {
    title: "HTML",
    icon: "🌐",
    color: "blue",
    duration: "3–5 days",
    description: "Learn to structure web pages and build your web development foundation.",
    steps: [
      { title: "HTML Structure", description: "Learn headings, paragraphs, links and images.", task: "Create a personal introduction page." },
      { title: "Forms and Tables", description: "Learn inputs, labels, forms and tables.", task: "Build a student registration form." },
      { title: "Semantic HTML", description: "Learn header, nav, main, section and footer.", task: "Build a portfolio page." }
    ]
  },
  css: {
    title: "CSS",
    icon: "🎨",
    color: "purple",
    duration: "5–7 days",
    description: "Design beautiful and responsive websites.",
    steps: [
      { title: "CSS Fundamentals", description: "Learn selectors, colours, fonts and borders.", task: "Style your introduction webpage." },
      { title: "Layouts and Flexbox", description: "Practise Flexbox, Grid and spacing.", task: "Create a responsive card layout." },
      { title: "Responsive Design", description: "Learn media queries and responsive layouts.", task: "Make your page mobile-friendly." }
    ]
  },
  javascript: {
    title: "JavaScript",
    icon: "⚡",
    color: "orange",
    duration: "10–14 days",
    description: "Add interactive features to websites.",
    steps: [
      { title: "JavaScript Basics", description: "Learn variables, data types and conditions.", task: "Build a simple calculator." },
      { title: "Functions and Arrays", description: "Practise functions, loops and objects.", task: "Create a marks calculator." },
      { title: "DOM and Events", description: "Learn DOM selection and event listeners.", task: "Build an interactive to-do list." }
    ]
  },
  react: {
    title: "React",
    icon: "⚛️",
    color: "blue",
    duration: "10–14 days",
    description: "Build modern user interfaces using React.",
    steps: [
      { title: "React Fundamentals", description: "Learn components, JSX and props.", task: "Create a profile component." },
      { title: "State and Events", description: "Practise useState and event handling.", task: "Build an interactive form." },
      { title: "Hooks and APIs", description: "Learn useEffect and fetching data.", task: "Build an app that displays API data." }
    ]
  },
  python: {
    title: "Python",
    icon: "🐍",
    color: "green",
    duration: "10–14 days",
    description: "Learn programming through practical projects.",
    steps: [
      { title: "Python Basics", description: "Learn variables, data types and input/output.", task: "Create a marks calculator." },
      { title: "Conditions and Loops", description: "Practise if-else, loops and lists.", task: "Build a number guessing game." },
      { title: "Functions and Files", description: "Learn functions and file handling.", task: "Build a student record program." }
    ]
  },
  sql: {
    title: "SQL",
    icon: "🗄️",
    color: "purple",
    duration: "5–7 days",
    description: "Store, retrieve and analyse data using SQL.",
    steps: [
      { title: "SQL Basics", description: "Learn tables, SELECT and WHERE.", task: "Create a student table." },
      { title: "Filtering and Joins", description: "Practise ORDER BY, GROUP BY and JOIN.", task: "Combine student and course data." },
      { title: "Aggregations", description: "Learn COUNT, SUM, AVG, MIN and MAX.", task: "Calculate average student marks." }
    ]
  },
  excel: {
    title: "Excel",
    icon: "📊",
    color: "green",
    duration: "5–7 days",
    description: "Organise data and create useful reports.",
    steps: [
      { title: "Excel Fundamentals", description: "Learn cells, formatting and formulas.", task: "Create a monthly expense sheet." },
      { title: "Functions and Analysis", description: "Practise IF, SUMIF and filtering.", task: "Analyse student marks." },
      { title: "Charts and PivotTables", description: "Summarise data visually.", task: "Build a sales report." }
    ]
  },
  "power bi": {
    title: "Power BI",
    icon: "📈",
    color: "orange",
    duration: "7–10 days",
    description: "Transform data into interactive dashboards.",
    steps: [
      { title: "Import and Clean Data", description: "Learn Power Query.", task: "Clean a sales dataset." },
      { title: "Data Modelling", description: "Learn relationships and basic DAX.", task: "Create a sales measure." },
      { title: "Interactive Dashboard", description: "Build charts, cards and slicers.", task: "Create a regional sales dashboard." }
    ]
  },
  java: {
    title: "Java",
    icon: "☕",
    color: "orange",
    duration: "10–14 days",
    description: "Learn object-oriented programming with Java.",
    steps: [
      { title: "Java Fundamentals", description: "Learn variables, data types and conditions.", task: "Create a calculator." },
      { title: "Loops and Methods", description: "Practise loops, arrays and methods.", task: "Analyse student marks." },
      { title: "Object-Oriented Java", description: "Learn classes, objects and inheritance.", task: "Build a library management program." }
    ]
  },
  git: {
    title: "Git",
    icon: "🔧",
    color: "orange",
    duration: "3–5 days",
    description: "Manage code changes and collaborate on projects.",
    steps: [
      { title: "Git Fundamentals", description: "Learn repositories and commits.", task: "Create a Git repository." },
      { title: "Branches and Merging", description: "Practise branches and merging.", task: "Create and merge a feature branch." },
      { title: "GitHub Collaboration", description: "Learn push, pull and clone.", task: "Upload a project to GitHub." }
    ]
  },
  django: {
    title: "Django",
    icon: "🐍",
    color: "green",
    duration: "7–10 days",
    description: "Build web applications using Python and Django.",
    steps: [
      { title: "Django Fundamentals", description: "Learn projects, apps, URLs and views.", task: "Create a welcome page." },
      { title: "Templates and Models", description: "Learn templates and database models.", task: "Build a student information page." },
      { title: "CRUD Application", description: "Practise create, read, update and delete.", task: "Build a task management application." }
    ]
  }
};

const RESOURCES = {
  html: {
    website: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
    video: "https://www.youtube.com/results?search_query=HTML+full+course+for+beginners"
  },
  css: {
    website: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics",
    video: "https://www.youtube.com/results?search_query=CSS+full+course+for+beginners"
  },
  javascript: {
    website: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    video: "https://www.youtube.com/results?search_query=JavaScript+full+course+for+beginners"
  },
  react: {
    website: "https://react.dev/learn",
    video: "https://www.youtube.com/results?search_query=React+JS+full+course+for+beginners"
  },
  python: {
    website: "https://docs.python.org/3/tutorial/",
    video: "https://www.youtube.com/results?search_query=Python+full+course+for+beginners"
  },
  sql: {
    website: "https://www.w3schools.com/sql/",
    video: "https://www.youtube.com/results?search_query=SQL+full+course+for+beginners"
  },
  excel: {
    website: "https://support.microsoft.com/en-us/excel",
    video: "https://www.youtube.com/results?search_query=Microsoft+Excel+full+course+for+beginners"
  },
  "power bi": {
    website: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi/",
    video: "https://www.youtube.com/results?search_query=Power+BI+full+course+for+beginners"
  },
  java: {
    website: "https://dev.java/learn/",
    video: "https://www.youtube.com/results?search_query=Java+full+course+for+beginners"
  },
  git: {
    website: "https://git-scm.com/book/en/v2",
    video: "https://www.youtube.com/results?search_query=Git+and+GitHub+for+beginners"
  },
  django: {
    website: "https://docs.djangoproject.com/en/stable/intro/tutorial01/",
    video: "https://www.youtube.com/results?search_query=Django+full+course+for+beginners"
  }
};

const DEFAULT_ROADMAP = (skill) => ({
  title: skill,
  icon: "🚀",
  color: "blue",
  duration: "5–7 days",
  description: `Build your ${skill} skills with this beginner-friendly plan.`,
  steps: [
    { title: `${skill} Fundamentals`, description: `Understand the basics of ${skill}.`, task: `Write notes on the main concepts of ${skill}.` },
    { title: "Guided Practice", description: "Practise essential concepts with examples.", task: "Complete three beginner exercises." },
    { title: "Mini Project", description: "Apply what you have learned.", task: `Create a mini project using ${skill}.` }
  ]
});

function SkillRoadmap({ skills = [], jobTitle = "Your Target Job" }) {
  const availableSkills = [...new Set(
    (Array.isArray(skills) ? skills : [])
      .map((skill) => String(skill).trim())
      .filter(Boolean)
  )];

  const [selectedSkill, setSelectedSkill] = useState(availableSkills[0] || "HTML");
  const [completed, setCompleted] = useState({});

  const storageKey = `campusconnect-roadmap-${String(jobTitle).toLowerCase()}`;

  useEffect(() => {
    setSelectedSkill(availableSkills[0] || "HTML");
  }, [skills.join("|")]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setCompleted(saved ? JSON.parse(saved) : {});
    } catch {
      setCompleted({});
    }
  }, [storageKey]);

  const skillKey = selectedSkill.toLowerCase();
  const roadmap = ROADMAPS[skillKey] || DEFAULT_ROADMAP(selectedSkill);
  const resources = RESOURCES[skillKey] || {
    website: `https://www.google.com/search?q=${encodeURIComponent(selectedSkill + " official documentation tutorial")}`,
    video: `https://www.youtube.com/results?search_query=${encodeURIComponent(selectedSkill + " tutorial for beginners")}`
  };

  const skillCompleted = completed[selectedSkill] || {};
  const totalSteps = roadmap.steps.length;
  const completedCount = roadmap.steps.filter((_, i) => skillCompleted[i]).length;
  const progress = totalSteps ? Math.round((completedCount / totalSteps) * 100) : 0;

  const toggleStep = (index) => {
    setCompleted((previous) => {
      const updated = {
        ...previous,
        [selectedSkill]: {
          ...(previous[selectedSkill] || {}),
          [index]: !(previous[selectedSkill] || {})[index]
        }
      };

      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (error) {
        console.error("Unable to save roadmap progress:", error);
      }

      return updated;
    });
  };

  return (
    <section className={`skill-roadmap roadmap-${roadmap.color}`}>
      <div className="roadmap-banner">
        <div className="roadmap-banner-icon">🗺️</div>
        <div className="roadmap-banner-copy">
          <span className="roadmap-eyebrow">YOUR CAREER GROWTH PLAN</span>
          <h2>Skill Learning Roadmap</h2>
          <p>Learn step by step, practise with projects and track your progress.</p>
        </div>
        <div className="roadmap-banner-note">
          <span>Learn</span><span>Grow</span><strong>Get Hired ✨</strong>
        </div>
      </div>

      <div className="roadmap-job-overview">
        <div className="roadmap-target">
          <div className="roadmap-target-icon">🎯</div>
          <div>
            <span className="roadmap-label">Target Job</span>
            <h3>{jobTitle}</h3>
            <p>Your personalised learning plan</p>
          </div>
        </div>

        <div className="roadmap-required">
          <span className="roadmap-label">Skills to Learn</span>
          <div className="roadmap-skill-chips">
            {availableSkills.map((skill) => (
              <button
                type="button"
                className={`roadmap-chip ${selectedSkill === skill ? "roadmap-chip-active" : ""}`}
                key={skill}
                onClick={() => setSelectedSkill(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        <div className="roadmap-match-card">
          <div className="roadmap-match-ring" style={{ "--progress": `${progress}%` }}>
            <span>{progress}%</span>
          </div>
          <strong>Skill Progress</strong>
          <span>{progress === 100 ? "Amazing work! 🎉" : "Keep moving forward"}</span>
        </div>
      </div>

      <div className="roadmap-main-grid">
        <aside className="roadmap-sidebar">
          <div className="roadmap-side-card roadmap-choose-card">
            <div className="roadmap-side-heading">
              <span className="roadmap-side-icon">📘</span>
              <h3>Choose a Skill</h3>
            </div>
            <p>Select a skill to view its learning plan.</p>
            <label className="roadmap-select-wrap">
              <span>🧩</span>
              <select value={selectedSkill} onChange={(event) => setSelectedSkill(event.target.value)}>
                {availableSkills.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="roadmap-side-card roadmap-progress-card">
            <div className="roadmap-side-heading">
              <span className="roadmap-side-icon">📊</span>
              <h3>Your Progress</h3>
            </div>
            <div className="roadmap-progress-ring" style={{ "--progress": `${progress}%` }}>
              <div><strong>{completedCount}/{totalSteps}</strong><span>completed</span></div>
            </div>
            <div className="roadmap-progress-legend">
              <div><span className="legend-dot legend-done" /><span>Completed</span><strong>{completedCount}</strong></div>
              <div><span className="legend-dot legend-progress" /><span>In Progress</span><strong>{completedCount > 0 && completedCount < totalSteps ? 1 : 0}</strong></div>
              <div><span className="legend-dot legend-not-started" /><span>Not Started</span><strong>{totalSteps - completedCount}</strong></div>
            </div>
          </div>

          <div className="roadmap-side-card roadmap-tip-card">
            <div className="roadmap-side-heading"><span className="roadmap-side-icon">💡</span><h3>Pro Tip</h3></div>
            <p>Practise a little every day. Building projects helps you remember what you learn. 🚀</p>
          </div>
        </aside>

        <div className="roadmap-content">
          <div className="roadmap-content-heading">
            <div className="roadmap-language-icon">{roadmap.icon}</div>
            <div className="roadmap-language-info">
              <h2>{roadmap.title}</h2>
              <p>{roadmap.description}</p>
            </div>
            <span className="roadmap-duration">◷ {roadmap.duration}</span>
          </div>

          <div className="roadmap-linear-progress">
            <div className="roadmap-linear-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="roadmap-linear-caption"><span>Learning progress</span><strong>{progress}%</strong></div>

          <div className="roadmap-steps">
            {roadmap.steps.map((step, index) => {
              const isCompleted = Boolean(skillCompleted[index]);

              return (
                <article className={`roadmap-step-card step-${index + 1} ${isCompleted ? "step-is-completed" : ""}`} key={`${selectedSkill}-${step.title}`}>
                  <div className="roadmap-step-number">{index + 1}</div>
                  <div className="roadmap-step-icon">{isCompleted ? "✅" : ["📄", "🧩", "🚀"][index]}</div>

                  <div className="roadmap-step-body">
                    <div className="roadmap-step-title-row">
                      <h3>{step.title}</h3>
                      {isCompleted && <span className="roadmap-done-badge">Completed</span>}
                    </div>
                    <p>{step.description}</p>
                    <div className="roadmap-practice">
                      <strong>🎯 Practice Task</strong>
                      <p>{step.task}</p>
                    </div>
                  </div>

                  <label className="roadmap-step-check">
                    <input type="checkbox" checked={isCompleted} onChange={() => toggleStep(index)} />
                    <span className="roadmap-custom-checkbox" />
                    <span>{isCompleted ? "Completed" : "Mark as completed"}</span>
                  </label>
                </article>
              );
            })}
          </div>

          <section className="roadmap-resources">
            <div className="roadmap-resources-heading">
              <span>🎓</span>
              <div>
                <h3>Free Learning Resources</h3>
                <p>Use these resources to study {roadmap.title} and practise at your own pace.</p>
              </div>
            </div>

            <div className="roadmap-resource-grid">
              <article className="roadmap-resource-card resource-video">
                <div className="roadmap-resource-icon">▶️</div>
                <span className="roadmap-resource-tag">VIDEO LEARNING</span>
                <h4>{roadmap.title} Video Tutorials</h4>
                <p>Find beginner-friendly video lessons and follow along with examples.</p>
                <a href={resources.video} target="_blank" rel="noreferrer" className="roadmap-resource-button">
                  Watch on YouTube ↗
                </a>
              </article>

              <article className="roadmap-resource-card resource-docs">
                <div className="roadmap-resource-icon">📚</div>
                <span className="roadmap-resource-tag">READ & PRACTISE</span>
                <h4>Learning Guide</h4>
                <p>Read tutorials, explore examples and build your understanding.</p>
                <a href={resources.website} target="_blank" rel="noreferrer" className="roadmap-resource-button">
                  Start Learning ↗
                </a>
              </article>
            </div>
            <p className="roadmap-resource-disclaimer">ℹ️ External websites open in a new tab. Course availability and features may vary.</p>
          </section>

          <div className="roadmap-resource-note">
            <span>📚</span>
            <div><strong>Keep practising!</strong><p>Complete each practice task before moving to the next step.</p></div>
          </div>
        </div>
      </div>

      <div className="roadmap-footer">
        <div className="roadmap-footer-icon">🚀</div>
        <div className="roadmap-footer-copy">
          <h3>{progress === 100 ? "You completed this roadmap!" : "You're on the right track!"}</h3>
          <p>Every skill you learn brings you closer to your dream job. Keep going!</p>
        </div>
        <span className="roadmap-footer-badge">{progress === 100 ? "Skill unlocked ✓" : "Keep growing ✨"}</span>
      </div>
    </section>
  );
}

export default SkillRoadmap;
