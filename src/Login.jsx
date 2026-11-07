import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("student", JSON.stringify(data.student));

        alert("Login successful! 🎉");

        navigate("/dashboard");
       }else {
        setError(data.message || "Invalid email or password.");
      }
    } catch (error) {
      setError("Unable to connect to the server.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Welcome Back</h1>

        <p className="login-subtitle">
          Login to continue your CampusConnect AI journey.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          {error && <p className="error-message">{error}</p>}
        </form>

        <p className="register-link">
          Don't have an account?{" "}
          <Link to="/register">Create Account</Link>
        </p>

        <Link to="/" className="back-home">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Login;