import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <h2>Welcome to AfriVault Dashboard, {user}!</h2>
      <p>Your secure digital wallet.</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
