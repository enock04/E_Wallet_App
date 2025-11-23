import React, { useState, useContext } from 'react';
import { AuthContext, AuthContextType } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const OtpVerification: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

// Use non-null assertion to handle potentially undefined context
  const authContext = useContext(AuthContext)!;
  const navigate = useNavigate();

  if (!authContext) {
    throw new Error('AuthContext is not provided');
  }

  const { login } = authContext;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !otpCode.trim()) {
      setError('Please enter both email and OTP code');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), otpCode: otpCode.trim() }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.token, data.user);
        navigate('/dashboard'); // Redirect to dashboard or home page after successful login
      } else {
        setError(data.error || 'Failed to verify OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="wallet-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
            <path d="M20 7V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v2H2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7h-2zM6 5h12v2H6V5zm14 12H4V9h2v4h2V9h2v4h2V9h2v4h2V9h2v6z" />
          </svg>
        </div>
        <h2>Enter OTP Code</h2>
        <p>Enter the OTP sent to your registered email</p>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="otpCode">OTP Code:</label>
          <input
            id="otpCode"
            type="text"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
            inputMode="numeric"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
    </div>
  );
};

export default OtpVerification;
