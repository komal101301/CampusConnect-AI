import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ApplicationTracking.css";

function ApplicationTracking() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  // ===============================
  // FETCH APPLICATIONS
  // ===============================

  const fetchApplications = async () => {
    const savedStudent = localStorage.getItem("student");

    if (!savedStudent) {
      setLoading(false);
      return;
    }

    const student = JSON.parse(savedStudent);

    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/${student.id}`
      );

      const data = await response.json();

      if (response.ok) {
        setApplications(data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }

    setLoading(false);
  };

  // ===============================
  // REMOVE APPLICATION
  // ===============================

  const handleRemove = async (applicationId) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this application?"
    );

    if (!confirmRemove) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/${applicationId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to remove application.");
        return;
      }

      // Remove application from the screen
      setApplications((previousApplications) =>
        previousApplications.filter(
          (application) => application._id !== applicationId
        )
      );

      alert("Application removed successfully!");
    } catch (error) {
      console.error("Remove application error:", error);

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    }
  };

  return (
    <div className="applications-page">

      {/* ===============================
          HEADER
      =============================== */}

      <header className="applications-header">

        <div className="applications-logo">
          Campus<span>Connect</span> AI
        </div>

        <Link
          to="/dashboard"
          className="applications-back"
        >
          ← Dashboard
        </Link>

      </header>

      {/* ===============================
          MAIN CONTENT
      =============================== */}

      <main className="applications-container">

        <h1>
          Application Tracking 📊
        </h1>

        <p className="applications-subtitle">
          Track your job applications and placement progress in one place.
        </p>

        {/* ===============================
            LOADING
        =============================== */}

        {loading ? (
          <div className="no-applications">
            <h2>Loading applications...</h2>
          </div>

        ) : applications.length === 0 ? (

          /* ===============================
             NO APPLICATIONS
          =============================== */

          <div className="no-applications">

            <h2>No Applications Yet</h2>

            <p>
              Apply for a job from the Jobs page to see it here.
            </p>

            <Link to="/jobs">
              <button>
                Explore Jobs
              </button>
            </Link>

          </div>

        ) : (

          /* ===============================
             APPLICATION LIST
          =============================== */

          <div className="application-list">

            {applications.map((application) => (

              <div
                className="application-card"
                key={application._id}
              >

                <div>

                  <h2>
                    {application.jobTitle}
                  </h2>

                  <p>
                    {application.company}
                  </p>

                </div>

                <div className="application-actions">

                  <span className="application-status">
                    {application.status}
                  </span>

                  <button
                    onClick={() =>
                      handleRemove(application._id)
                    }
                  >
                    Remove
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default ApplicationTracking;