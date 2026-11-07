const express = require("express");
const cors = require("cors");
require("dotenv").config();

const multer = require("multer");
const fs = require("fs");

// pdf-parse v2.4.5
const { PDFParse } = require("pdf-parse");

const connectDB = require("./db");
const Student = require("./Student");
const Application = require("./Application");

const app = express();

const PORT = 5000;

// =====================================================
// RESUME UPLOAD SETUP
// =====================================================

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,

  fileFilter: function (req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed."));
    }
  },
});

// =====================================================
// DATABASE + MIDDLEWARE
// =====================================================

connectDB();

app.use(cors());

app.use(express.json());

// =====================================================
// HOME ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "CampusConnect AI Backend is running!",
  });
});

// =====================================================
// REGISTER
// =====================================================

app.post("/api/register", async (req, res) => {
  try {
    const {
      name,
      fullName,
      email,
      phone,
      course,
      graduationYear,
      college,
      password,
    } = req.body;

    const studentName = fullName || name;

    if (
      !studentName ||
      !email ||
      !phone ||
      !course ||
      !graduationYear ||
      !college ||
      !password
    ) {
      return res.status(400).json({
        message: "Please fill in all fields.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingEmail = await Student.findOne({
      email: cleanEmail,
    });

    if (existingEmail) {
      return res.status(400).json({
        message:
          "Email already registered. Please use another email.",
      });
    }

    const existingPhone = await Student.findOne({
      phone: phone.trim(),
    });

    if (existingPhone) {
      return res.status(400).json({
        message:
          "Phone number already registered. Please use another number.",
      });
    }

    const student = new Student({
      fullName: studentName,
      email: cleanEmail,
      phone: phone.trim(),
      course,
      graduationYear,
      college,
      password,
    });

    await student.save();

    res.status(201).json({
      message: "Registration successful!",
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Registration failed. Please try again.",
    });
  }
});

// =====================================================
// LOGIN
// =====================================================

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password.",
      });
    }

    const student = await Student.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!student) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (student.password !== password) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    res.status(200).json({
      message: "Login successful!",

      student: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
        phone: student.phone,
        course: student.course,
        graduationYear: student.graduationYear,
        college: student.college,
        tipTokens: student.tipTokens || 0,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed. Please try again.",
    });
  }
});

// =====================================================
// RESUME ANALYZER
// =====================================================

app.post(
  "/api/analyze-resume",
  upload.single("resume"),

  async (req, res) => {
    let parser = null;

    try {
      // -------------------------------------------------
      // CHECK FILE
      // -------------------------------------------------

      if (!req.file) {
        return res.status(400).json({
          message: "Please upload a PDF resume.",
        });
      }

      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({
          message: "Only PDF files are allowed.",
        });
      }

      console.log(
        "Resume received:",
        req.file.originalname
      );

      // -------------------------------------------------
      // READ PDF
      // -------------------------------------------------

      const pdfBuffer = fs.readFileSync(
        req.file.path
      );

      console.log(
        "PDF size:",
        pdfBuffer.length,
        "bytes"
      );

      // -------------------------------------------------
      // PDF-PARSE v2.4.5
      // -------------------------------------------------

      parser = new PDFParse({
        data: pdfBuffer,
      });

      const result = await parser.getText();

      const resumeText = result.text || "";

      console.log(
        "Extracted resume text length:",
        resumeText.length
      );

      if (!resumeText.trim()) {
        return res.status(400).json({
          message:
            "The PDF was opened, but no readable text was found. Please upload a text-based PDF.",
        });
      }

      const text = resumeText.toLowerCase();

      // =================================================
      // CONTACT INFORMATION
      // =================================================

      const hasEmail =
        /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(
          resumeText
        );

      const hasPhone =
        /(\+91[\s-]?)?[6-9]\d{9}/.test(
          resumeText
        );

      const hasLinkedIn =
        text.includes("linkedin");

      const hasGitHub =
        text.includes("github");

      const hasContactInformation =
        hasEmail && hasPhone;

      // =================================================
      // PROFILE / SUMMARY
      // =================================================

      const hasProfile =
        text.includes("profile") ||
        text.includes("summary") ||
        text.includes("objective") ||
        text.includes("about me");

      // =================================================
      // SKILL DETECTION
      // =================================================

      const possibleSkills = [
        "html",
        "css",
        "javascript",
        "react",
        "react.js",
        "python",
        "java",
        "sql",
        "mongodb",
        "node.js",
        "node",
        "express",
        "express.js",
        "c++",
        "c",
        "power bi",
        "excel",
        "git",
        "github",
        "django",
        "machine learning",
        "data analysis",
        "mysql",
        "tailwindcss",
        "typescript",
        "bootstrap",
        "php",
        "figma",
      ];

      const detectedSkills =
        possibleSkills.filter((skill) =>
          text.includes(skill.toLowerCase())
        );

      const uniqueSkills = [
        ...new Set(detectedSkills),
      ];

      // =================================================
      // SECTION DETECTION
      // =================================================

      const hasEducation =
        text.includes("education") ||
        text.includes("academic") ||
        text.includes("university") ||
        text.includes("college") ||
        text.includes("degree");

      const hasProjects =
        text.includes("project") ||
        text.includes("projects") ||
        text.includes("project work");

      const hasExperience =
        text.includes("experience") ||
        text.includes("internship") ||
        text.includes("intern") ||
        text.includes("work experience") ||
        text.includes("employment");

      const hasSkills =
        text.includes("skills") ||
        text.includes("technical skills") ||
        uniqueSkills.length > 0;

      const hasCertifications =
        text.includes("certification") ||
        text.includes("certificate") ||
        text.includes("certificates") ||
        text.includes("course");

      const hasAchievements =
        text.includes("achievement") ||
        text.includes("achievements") ||
        text.includes("award") ||
        text.includes("awards");

      // =================================================
      // PROJECT QUALITY CHECK
      // =================================================

      const hasProjectTechnology =
        text.includes("developed") ||
        text.includes("built") ||
        text.includes("created") ||
        text.includes("implemented") ||
        text.includes("using");

      const hasProjectResult =
        text.includes("improved") ||
        text.includes("increased") ||
        text.includes("reduced") ||
        text.includes("result") ||
        text.includes("performance");

      // =================================================
      // MEASURABLE ACHIEVEMENTS
      // =================================================

      const hasNumbers =
        /\b\d+%|\b\d+\+|\b\d+\s*(users|projects|records|students|customers|days|months|years)\b/i.test(
          resumeText
        );

      // =================================================
      // ONLINE PRESENCE
      // =================================================

      const hasOnlinePresence =
        hasLinkedIn || hasGitHub;

      // =================================================
      // SCORE
      // =================================================

      let score = 0;

      if (hasContactInformation) {
        score += 10;
      }

      if (hasProfile) {
        score += 10;
      }

      if (hasEducation) {
        score += 15;
      }

      if (hasProjects) {
        score += 20;
      }

      if (hasExperience) {
        score += 15;
      }

      if (hasSkills) {
        score += 15;
      }

      if (uniqueSkills.length >= 5) {
        score += 5;
      }

      if (hasCertifications) {
        score += 5;
      }

      if (hasAchievements || hasNumbers) {
        score += 5;
      }

      score = Math.min(score, 100);

      // =================================================
      // STRENGTHS
      // =================================================

      const strengths = [];

      if (hasContactInformation) {
        strengths.push(
          "Contact information is clearly available."
        );
      }

      if (hasProfile) {
        strengths.push(
          "A professional profile or summary is included."
        );
      }

      if (hasEducation) {
        strengths.push(
          "Education details are included."
        );
      }

      if (hasProjects) {
        strengths.push(
          "Projects are mentioned."
        );
      }

      if (hasExperience) {
        strengths.push(
          "Experience or internship details are included."
        );
      }

      if (uniqueSkills.length > 0) {
        strengths.push(
          `${uniqueSkills.length} technical skill(s) detected.`
        );
      }

      if (hasCertifications) {
        strengths.push(
          "Certifications or courses are included."
        );
      }

      if (hasAchievements) {
        strengths.push(
          "Achievements are mentioned."
        );
      }

      if (hasOnlinePresence) {
        strengths.push(
          "Online professional presence is included."
        );
      }

      if (hasNumbers) {
        strengths.push(
          "The resume contains measurable information or results."
        );
      }

      // =================================================
      // AREAS TO IMPROVE
      // =================================================

      const improvements = [];

      if (!hasContactInformation) {
        improvements.push(
          "Make sure your email address and phone number are clearly visible."
        );
      }

      if (!hasProfile) {
        improvements.push(
          "Add a short professional profile or career objective."
        );
      }

      if (!hasProjects) {
        improvements.push(
          "Add 2–3 projects describing technologies used, your contribution, and results."
        );
      }

      if (!hasExperience) {
        improvements.push(
          "Add internship, training, freelance work, or relevant experience if available."
        );
      }

      if (uniqueSkills.length < 3) {
        improvements.push(
          "Add more relevant technical skills related to your target job."
        );
      }

      if (!hasCertifications) {
        improvements.push(
          "Consider adding relevant certifications or courses."
        );
      }

      if (!hasAchievements) {
        improvements.push(
          "Add measurable achievements, awards, or project outcomes."
        );
      }

      if (!hasOnlinePresence) {
        improvements.push(
          "Consider adding GitHub or LinkedIn to strengthen your professional profile."
        );
      }

      if (!hasNumbers) {
        improvements.push(
          "Use numbers and measurable results wherever possible."
        );
      }

      // =================================================
      // HIGHLIGHTED ISSUES
      // =================================================

      const issues = [];

      // -------------------------------------------------
      // GENERIC PROFILE PHRASES
      // -------------------------------------------------

      const genericPhrases = [
        {
          text: "strong passion",
          tip:
            "Replace generic wording with a specific achievement, project, or technical interest.",
          category: "Profile",
        },

        {
          text: "keen interest",
          tip:
            "Mention the specific technology or career area you are interested in.",
          category: "Profile",
        },

        {
          text: "impactful projects",
          tip:
            "Describe the actual projects you have built instead of using a general phrase.",
          category: "Profile",
        },

        {
          text: "strong analytical thinking",
          tip:
            "Support this claim with a project, achievement, competition, or measurable result.",
          category: "Profile",
        },

        {
          text: "effective collaboration",
          tip:
            "Mention a team project or specific situation where you collaborated successfully.",
          category: "Profile",
        },

        {
          text: "hard working",
          tip:
            "Replace this generic phrase with a specific achievement or result.",
          category: "Profile",
        },

        {
          text: "quick learner",
          tip:
            "Show learning through certifications, projects, or technologies you have successfully applied.",
          category: "Profile",
        },
      ];

      genericPhrases.forEach((item) => {
        if (
          text.includes(
            item.text.toLowerCase()
          )
        ) {
          issues.push({
            text: item.text,
            type: "warning",
            category: item.category,
            tip: item.tip,
          });
        }
      });

      // -------------------------------------------------
      // SKILL LEVEL WARNINGS
      // -------------------------------------------------

      const weakSkillWords = [
        {
          text: "beginner",
          tip:
            "Instead of emphasizing a beginner level, show practical experience through projects and applications.",
          category: "Skills",
        },

        {
          text: "skillful",
          tip:
            "Replace skill-level labels with concrete evidence such as projects, coursework, or achievements.",
          category: "Skills",
        },

        {
          text: "experienced",
          tip:
            "Specify how you used this skill and what you achieved with it.",
          category: "Skills",
        },
      ];

      weakSkillWords.forEach((item) => {
        if (
          text.includes(
            item.text.toLowerCase()
          )
        ) {
          issues.push({
            text: item.text,
            type: "warning",
            category: item.category,
            tip: item.tip,
          });
        }
      });

      // -------------------------------------------------
      // MISSING CONTACT
      // -------------------------------------------------

      if (!hasContactInformation) {
        issues.push({
          text: "Contact Information",
          type: "error",
          category: "Missing Information",
          tip:
            "Make sure your email address and phone number are clearly visible.",
        });
      }

      // -------------------------------------------------
      // MISSING PROFILE
      // -------------------------------------------------

      if (!hasProfile) {
        issues.push({
          text: "Profile / Summary",
          type: "warning",
          category: "Missing Section",
          tip:
            "Add a short professional summary describing your background, technical strengths, and target career area.",
        });
      }

      // -------------------------------------------------
      // MISSING PROJECTS
      // -------------------------------------------------

      if (!hasProjects) {
        issues.push({
          text: "Projects",
          type: "error",
          category: "Missing Section",
          tip:
            "Add 2–3 projects. Mention the technologies used, your contribution, and the result.",
        });
      } else if (
        !hasProjectTechnology ||
        !hasProjectResult
      ) {
        issues.push({
          text: "Project Details",
          type: "warning",
          category: "Projects",
          tip:
            "Improve project descriptions by mentioning the technology used, what you implemented, and the result.",
        });
      }

      // -------------------------------------------------
      // MISSING EXPERIENCE
      // -------------------------------------------------

      if (!hasExperience) {
        issues.push({
          text: "Experience",
          type: "error",
          category: "Missing Section",
          tip:
            "Add internships, training, freelance work, or relevant practical experience if available.",
        });
      }

      // -------------------------------------------------
      // MISSING ACHIEVEMENTS
      // -------------------------------------------------

      if (!hasAchievements) {
        issues.push({
          text: "Achievements",
          type: "warning",
          category: "Missing Section",
          tip:
            "Add measurable achievements such as competition results, performance improvements, certifications, or project outcomes.",
        });
      }

      // -------------------------------------------------
      // MISSING ONLINE PRESENCE
      // -------------------------------------------------

      if (!hasOnlinePresence) {
        issues.push({
          text: "GitHub / LinkedIn",
          type: "warning",
          category: "Profile",
          tip:
            "Add GitHub or LinkedIn links so recruiters can learn more about your work and professional profile.",
        });
      }

      // =================================================
      // GOOD CONTENT
      // =================================================

      const goodContent = [];

      if (hasContactInformation) {
        goodContent.push({
          text: "Contact Information",
          type: "good",
          tip:
            "Your contact information is available for recruiters.",
        });
      }

      if (uniqueSkills.length > 0) {
        goodContent.push({
          text: "Technical Skills",
          type: "good",
          tip:
            "Your resume includes technical skills that can be matched with job requirements.",
        });
      }

      if (hasEducation) {
        goodContent.push({
          text: "Education",
          type: "good",
          tip:
            "Your education section provides your academic background.",
        });
      }

      if (hasProjects) {
        goodContent.push({
          text: "Projects",
          type: "good",
          tip:
            "Projects provide evidence of practical technical experience.",
        });
      }

      if (hasCertifications) {
        goodContent.push({
          text: "Certifications",
          type: "good",
          tip:
            "Relevant certifications can strengthen your profile.",
        });
      }

      if (hasOnlinePresence) {
        goodContent.push({
          text: "Professional Links",
          type: "good",
          tip:
            "GitHub or LinkedIn provides additional information about your professional profile.",
        });
      }

      // =================================================
      // SUGGESTED KEYWORDS
      // =================================================

      const suggestedKeywords = [];

      const keywordSuggestions = [
        "React.js",
        "JavaScript",
        "HTML",
        "CSS",
        "Node.js",
        "MongoDB",
        "SQL",
        "Git",
        "GitHub",
        "REST API",
        "Responsive Web Design",
        "Problem Solving",
        "Data Structures",
        "Communication",
        "Team Collaboration",
        "Agile",
        "API Integration",
      ];

      keywordSuggestions.forEach((keyword) => {
        if (
          !text.includes(
            keyword.toLowerCase()
          )
        ) {
          suggestedKeywords.push(keyword);
        }
      });

      // =================================================
      // PERSONALIZED TIPS
      // =================================================

      const tips = [];

      if (!hasProjects) {
        tips.push(
          "Add 2–3 strong projects and describe the technology, your role, and the result."
        );
      } else {
        tips.push(
          "For every project, mention the problem, technologies used, your contribution, and the final result."
        );
      }

      if (!hasExperience) {
        tips.push(
          "Include internships, training, freelance work, or practical experience when available."
        );
      }

      if (uniqueSkills.length < 5) {
        tips.push(
          "Add relevant technical skills and show where you used them."
        );
      }

      if (!hasAchievements || !hasNumbers) {
        tips.push(
          "Use numbers and measurable results wherever possible."
        );
      }

      if (!hasOnlinePresence) {
        tips.push(
          "Add your GitHub and LinkedIn profiles to make your resume more recruiter-friendly."
        );
      }

      tips.push(
        "Match your resume keywords with the requirements of the job you are applying for."
      );

      tips.push(
        "Replace generic statements with specific examples from your projects or experience."
      );

      tips.push(
        "Keep your resume clear, concise, and focused on skills relevant to your target role."
      );

      tips.push(
        "Use action words such as developed, created, implemented, analyzed, designed, and improved."
      );

      tips.push(
        "Make sure your contact information is easy to find at the top of the resume."
      );

      // =================================================
      // RESPONSE
      // =================================================

      res.status(200).json({
        message:
          "Resume analyzed successfully!",

        fileName:
          req.file.originalname,

        score,

        skills:
          uniqueSkills,

        sections: {
          contact:
            hasContactInformation,

          profile:
            hasProfile,

          education:
            hasEducation,

          projects:
            hasProjects,

          experience:
            hasExperience,

          skills:
            hasSkills,

          certifications:
            hasCertifications,

          achievements:
            hasAchievements,

          linkedin:
            hasLinkedIn,

          github:
            hasGitHub,
        },

        strengths,

        improvements,

        issues,

        goodContent,

        tips,

        suggestedKeywords,

        resumeText:
          resumeText.substring(0, 10000),
      });

    } catch (error) {
      console.error(
        "Resume analysis error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to analyze the resume. Please make sure the PDF is valid.",

        error:
          error.message,
      });

    } finally {
      // -------------------------------------------------
      // CLEAN UP PDF PARSER
      // -------------------------------------------------

      if (parser) {
        try {
          await parser.destroy();
        } catch (destroyError) {
          console.error(
            "Parser cleanup error:",
            destroyError
          );
        }
      }
    }
  }
);

// =====================================================
// SAVE JOB APPLICATION
// =====================================================

app.post(
  "/api/applications",
  async (req, res) => {
    try {
      const {
        studentId,
        jobTitle,
        company,
      } = req.body;

      if (
        !studentId ||
        !jobTitle ||
        !company
      ) {
        return res.status(400).json({
          message:
            "Missing application details.",
        });
      }

      const application =
        new Application({
          studentId,
          jobTitle,
          company,
          status: "Applied",
        });

      await application.save();

      res.status(201).json({
        message:
          "Application saved successfully!",

        application,
      });
    } catch (error) {
      console.error(
        "Application error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to save application.",
      });
    }
  }
);

// =====================================================
// GET STUDENT APPLICATIONS
// =====================================================

app.get(
  "/api/applications/:studentId",
  async (req, res) => {
    try {
      const { studentId } =
        req.params;

      const applications =
        await Application.find({
          studentId: studentId,
        }).sort({
          createdAt: -1,
        });

      res.json(applications);
    } catch (error) {
      console.error(
        "Fetch applications error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch applications.",
      });
    }
  }
);

// =====================================================
// DELETE APPLICATION
// =====================================================

app.delete(
  "/api/applications/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      const deletedApplication =
        await Application.findByIdAndDelete(
          id
        );

      if (!deletedApplication) {
        return res.status(404).json({
          message:
            "Application not found.",
        });
      }

      res.json({
        message:
          "Application removed successfully!",
      });
    } catch (error) {
      console.error(
        "Delete application error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to remove application.",
      });
    }
  }
);

// =====================================================
// SIMPLE RESUME UPLOAD
// =====================================================

app.post(
  "/api/resume/upload",
  upload.single("resume"),

  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message:
            "Please upload a PDF resume.",
        });
      }

      res.status(200).json({
        message:
          "Resume uploaded successfully!",

        fileName:
          req.file.filename,
      });
    } catch (error) {
      console.error(
        "Resume upload error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to upload resume.",
      });
    }
  }
);

// =====================================================
// DEMO: BUY RESUME TIP TOKENS
// =====================================================

app.post(
  "/api/tip-tokens/buy",
  async (req, res) => {
    try {
      const {
        studentId,
        packageName,
      } = req.body;

      if (!studentId || !packageName) {
        return res.status(400).json({
          message:
            "Student ID and package name are required.",
        });
      }

      const packages = {
        basic: 10,
        standard: 25,
        premium: 50,
      };

      const packageKey =
        packageName.toLowerCase();

      const tokensToAdd =
        packages[packageKey];

      if (!tokensToAdd) {
        return res.status(400).json({
          message:
            "Invalid package.",
        });
      }

      const student =
        await Student.findById(
          studentId
        );

      if (!student) {
        return res.status(404).json({
          message:
            "Student not found.",
        });
      }

      student.tipTokens =
        (student.tipTokens || 0) +
        tokensToAdd;

      await student.save();

      res.status(200).json({
        message:
          `${tokensToAdd} tip tokens added successfully.`,

        tipTokens:
          student.tipTokens,
      });
    } catch (error) {
      console.error(
        "Token purchase error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to add tip tokens.",
      });
    }
  }
);

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});