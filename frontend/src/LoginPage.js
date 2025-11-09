// LoginPage.js
import React, { useState } from 'react';
import './App.css';
import { Mail, Lock } from 'lucide-react'; // Assuming you have lucide-react installed

const LoginPage = ({ onLogin, onSignupRedirect }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Essential for receiving the httpOnly cookie
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      if (res.ok) {
        // Success: The cookie is set by the backend.
        onLogin(); 
      } else {
        setError(data.error || "Login failed. Check credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Server might be down.");
    }
  };

  // Removed the client-side hashPassword function

  return (
    <div className="login-container">
      <form className="form login-form" onSubmit={handleSubmit}>
        <p className="form-title">Welcome Back to FSO Simulator</p>

        <div className="input-container">
          <input
            placeholder="Enter email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <span><Mail /></span>
        </div>

        <div className="input-container">
          <input
            placeholder="Enter password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span><Lock /></span>
        </div>

        {error && <p className="error-message" style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <button className="submit" type="submit">Sign in</button>

        <p className="signup-link">
          No account?{' '}
          <span style={{ cursor: 'pointer' }} onClick={onSignupRedirect}>
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;