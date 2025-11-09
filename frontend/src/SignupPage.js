// SignupPage.js
import React, { useState } from 'react';
import './App.css';
import { Mail, Lock } from 'lucide-react';

const SignupPage = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  // Simple password strength check (optional)
  const isStrongPassword = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return strongRegex.test(password);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirm) { 
      setError("Passwords do not match"); 
      return; 
    }
    
    // if (!isStrongPassword(password)) {
    //   setError("Password is too weak. Must be 8+ chars, with upper, lower, and digit.");
    //   return;
    // }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }), // Sending raw password to backend for bcrypt hashing
      });
      
      const data = await res.json();
      if (res.ok) {
        alert("Account created successfully! Please log in.");
        onBackToLogin();
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Server might be down.");
    }
  };

  // Removed the client-side hashPassword function

  return (
    <div className="login-container">
      <form className="form login-form" onSubmit={handleSignup}>
        <p className="form-title">Create Your FSO Account</p>

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

        <div className="input-container">
          <input
            placeholder="Confirm password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <span><Lock /></span>
        </div>

        {error && <p className="error-message" style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <button className="submit" type="submit">Sign up</button>

        <p className="signup-link">
          Already have an account?{' '}
          <span style={{ cursor: 'pointer' }} onClick={onBackToLogin}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;