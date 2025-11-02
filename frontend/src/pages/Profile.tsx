import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('John Doe'); // Mock name, in real app from API
  const [email, setEmail] = useState(user || '');
  const [phone, setPhone] = useState('+1234567890'); // Mock phone

  const handleSave = () => {
    // In real app, call API to update profile
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <h1>Profile</h1>
            <p>Manage your account settings</p>
          </div>
          <div className="header-actions">
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="dashboard-content">
        <div className="auth-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="auth-header">
            <div className="wallet-icon" style={{ margin: '0 auto 20px auto' }}>
              👤
            </div>
            <h2>Profile Information</h2>
            <p>View and edit your profile details</p>
          </div>

          <div className="form-group">
            <label>Name:</label>
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            ) : (
              <p style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '12px', margin: 0 }}>{name}</p>
            )}
          </div>

          <div className="form-group">
            <label>Email:</label>
            {isEditing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            ) : (
              <p style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '12px', margin: 0 }}>{email}</p>
            )}
          </div>

          <div className="form-group">
            <label>Phone:</label>
            {isEditing ? (
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            ) : (
              <p style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '12px', margin: 0 }}>{phone}</p>
            )}
          </div>

          <div className="modal-actions" style={{ marginTop: '30px' }}>
            {isEditing ? (
              <>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button className="add-card-btn" onClick={handleSave}>
                  Save Changes
                </button>
              </>
            ) : (
              <button className="auth-button" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
