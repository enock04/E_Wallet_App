import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate, Link } from 'react-router-dom';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const success = await signup(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="wallet-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
            <path d="M20 7V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v2H2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7h-2zM6 5h12v2H6V5zm14 12H4V9h2v4h2V9h2v4h2V9h2v4h2V9h2v6z"/>
          </svg>
        </div>
        <h2>Create Account</h2>
        <p>Sign up to start managing your cards</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="auth-button">Sign Up</button>
      </form>
      <p className="auth-link">Already have an account? <Link to="/login">Sign in</Link></p>
    </div>
  );
};

export default Signup;
