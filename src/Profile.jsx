import React from "react";
import { Link } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const savedStudent = localStorage.getItem("student");
  const student = savedStudent ? JSON.parse(savedStudent) : null;

  if (!student) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h1>Profile Not Found</h1>

          <p>Please login again to view your profile.</p>

          <Link to="/login" className="profile-button">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">

        <div className="profile-header">
          <div className="profile-icon">👤</div>

          <h1>My Profile</h1>

          <p>
            View and manage your student information.
          </p>
        </div>

        <div className="profile-details">

          <div className="profile-item">
            <span>Full Name</span>
            <strong>{student.fullName}</strong>
          </div>

          <div className="profile-item">
            <span>Email Address</span>
            <strong>{student.email}</strong>
          </div>

          <div className="profile-item">
            <span>Phone Number</span>
            <strong>{student.phone}</strong>
          </div>

          <div className="profile-item">
            <span>Course</span>
            <strong>{student.course}</strong>
          </div>

          <div className="profile-item">
            <span>Graduation Year</span>
            <strong>{student.graduationYear}</strong>
          </div>

          <div className="profile-item">
            <span>College / University</span>
            <strong>{student.college}</strong>
          </div>

        </div>

        <Link to="/dashboard" className="profile-button">
          ← Back to Dashboard
        </Link>

      </div>
    </div>
  );
}

export default Profile;