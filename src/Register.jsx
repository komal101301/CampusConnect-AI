import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    course: "",
    graduationYear: "",
    college: "",
    password: "",
    confirmPassword: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setSuccess(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess(false);
    setError("");

    // Check all fields
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.course ||
      !formData.graduationYear ||
      !formData.college ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    // Check password
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            course: formData.course,
            graduationYear: formData.graduationYear,
            college: formData.college,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setError("");

        // Clear form
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          course: "",
          graduationYear: "",
          college: "",
          password: "",
          confirmPassword: "",
        });

        // Go to login after 1.5 seconds
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    }
  };

  return (
    <div className="register-page">

      <div className="register-container">

        {/* Heading */}

        <h1>
          Create Your Account
        </h1>

        <p className="register-subtitle">
          Join CampusConnect AI and start your placement journey.
        </p>


        {/* Registration Form */}

        <form onSubmit={handleSubmit}>

          {/* Full Name */}

          <div className="form-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
            />

          </div>


          {/* Email */}

          <div className="form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />

          </div>


          {/* Phone */}

          <div className="form-group">

            <label>
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
            />

          </div>


          {/* Course + Graduation Year */}

          <div className="form-row">

            <div className="form-group">

              <label>
                Course
              </label>

              <input
                type="text"
                name="course"
                placeholder="e.g. BCA"
                value={formData.course}
                onChange={handleChange}
              />

            </div>


            <div className="form-group">

              <label>
                Graduation Year
              </label>

              <select
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
              >

                <option value="">
                  Select Year
                </option>

                <option value="2026">
                  2026
                </option>

                <option value="2027">
                  2027
                </option>

                <option value="2028">
                  2028
                </option>

                <option value="2029">
                  2029
                </option>

                <option value="2030">
                  2030
                </option>

              </select>

            </div>

          </div>


          {/* College */}

          <div className="form-group">

            <label>
              College / University
            </label>

            <input
              type="text"
              name="college"
              placeholder="Enter your college name"
              value={formData.college}
              onChange={handleChange}
            />

          </div>


          {/* Password */}

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />

          </div>


          {/* Confirm Password */}

          <div className="form-group">

            <label>
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

          </div>


          {/* Register Button */}

          <button
            type="submit"
            className="register-button"
          >
            Create Account
          </button>


          {/* Success Message */}

          {success && (
            <p className="success-message">
              Registration successful! 🎉
              <br />
              Redirecting to Login...
            </p>
          )}


          {/* Error Message */}

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

        </form>


        {/* Login Link */}

        <p className="login-link">

          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>

        </p>


        {/* Back Home */}

        <Link
          to="/"
          className="back-home"
        >
          ← Back to Home
        </Link>

      </div>

    </div>
  );
}

export default Register;