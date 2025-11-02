import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="auth-button">Sign In</button>
      </form>
      <p className="auth-link">Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
};

export default Login;