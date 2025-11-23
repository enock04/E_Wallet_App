import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    // Temporarily disabling profile fetch to avoid 404 errors
    /*
    if (token) {
      fetchProfile();
    }
    */
  }, [token]);

  const fetchProfile = async () => {
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const profile = await response.json();
        setName(profile.name || '');
        setEmail(profile.email || '');
        setPhone(profile.phone || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSave = async () => {
    if (!token) return;

    try {
      // Temporarily disabling profile update to avoid 404 errors
      /*
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone }),
      });

      if (response.ok) {
        setIsEditing(false);
      }
      */
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        {/* Header Section */}
        <div className="profile-header">
          <div className="profile-avatar">👤</div>
          <h1 className="profile-name">{name || (typeof user === 'string' ? user : (user as any)?.name || 'User')}</h1>
          <p className="profile-email">{email}</p>
        </div>

        {/* Security Section */}
        <div className="profile-section">
          <h2 className="section-title">Security</h2>

          <div className="profile-item">
            <div className="item-icon biometric">👆</div>
            <div className="item-content">
              <div className="item-title">Biometric Login</div>
              <div className="item-subtitle">Use fingerprint or Face ID</div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={biometricEnabled}
                onChange={(e) => setBiometricEnabled(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="profile-item" onClick={() => {/* Navigate to PIN change */}}>
            <div className="item-icon pin">🔒</div>
            <div className="item-content">
              <div className="item-title">Change PIN</div>
              <div className="item-subtitle">Update your security PIN</div>
            </div>
            <div className="item-arrow">›</div>
          </div>

          <div className="profile-item" onClick={() => {/* Navigate to security logs */}}>
            <div className="item-icon logs">📋</div>
            <div className="item-content">
              <div className="item-title">Security Logs</div>
              <div className="item-subtitle">View authentication history</div>
            </div>
            <div className="item-arrow">›</div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="profile-section">
          <h2 className="section-title">Preferences</h2>

          <div className="profile-item" onClick={() => {/* Navigate to notifications */}}>
            <div className="item-icon notifications">🔔</div>
            <div className="item-content">
              <div className="item-title">Notifications</div>
              <div className="item-subtitle">Manage notification settings</div>
            </div>
            <div className="item-arrow">›</div>
          </div>
        </div>

        {/* Support Section */}
        <div className="profile-section">
          <h2 className="section-title">Support</h2>

          <div className="profile-item" onClick={() => {/* Navigate to help center */}}>
            <div className="item-icon help">❓</div>
            <div className="item-content">
              <div className="item-title">Help Center</div>
              <div className="item-subtitle">Get help and support</div>
            </div>
            <div className="item-arrow">›</div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="profile-actions">
          <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="nav-item" onClick={() => navigate('/')}>
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </div>
        <div className="nav-item active">
          <span className="nav-icon">👤</span>
          <span className="nav-label">Profile</span>
        </div>
      </nav>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <p>Update your personal information</p>
            </div>

            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button className="add-card-btn" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
