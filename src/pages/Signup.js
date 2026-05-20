import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("beneficiary");

  const handleSignup = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);
      window.location.href = "/dashboard";
    } catch (error) {
      const message =
        error?.response?.data?.message || "Signup failed. Please try again.";
      alert(message);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Create a New Account</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="auth-input"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="auth-select"
        >
          <option value="beneficiary">Beneficiary</option>
          <option value="officer">Officer</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={handleSignup} className="button">
          Sign Up
        </button>

        <div className="auth-footer">
          Already signed up? <Link to="/" className="auth-link">Login now</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
