import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Removed test credentials to avoid hardcoded test data
  // Ensure no user email or password values are statically set
  const { login } = useAuth();
  const navigate = useNavigate();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
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
        <h2>Welcome Back</h2>
        <p>Sign in to access your digital wallet</p>
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
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="show-password-toggle"
              onClick={toggleShowPassword}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: '5px' }}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.359 12.238l1.666-1.666a.5.5 0 0 0 0-.707l-1.536-1.537C13.28 8.39 14 7.3 14 6c0-1.863-3.582-6-8-6a10.01 10.01 0 0 0-2.406.302l1.73 1.73a7.71 7.71 0 0 1 6.676 6.676zm-2.535-4.38a3 3 0 0 0-3.758 3.758l-2.055-2.056a5.498 5.498 0 0 1 7.17-7.17l-1.357 1.357zm-2.842 2.45a1.53 1.53 0 0 1-2.17-2.17l2.17 2.17z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3 8 3c1.311 0 2.558.58 3.516 1.298l1.129-1.128A.5.5 0 0 1 13.854 3.146l-12 12a.5.5 0 0 1-.708-.708l1.027-1.028zM8 13a5 5 0 0 1-4.546-2.916c.5-.725 1.193-1.69 2.083-2.63L8 13zm4.495-5.618L10.405 5.2 9.12 6.484a3 3 0 0 0-4.235 4.236L11.5 7.382z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="auth-button">Sign In</button>
      </form>
      <p className="auth-link">Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
};

export default Login;
