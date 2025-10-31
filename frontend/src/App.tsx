import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import Dashboard from './pages/Dashboard.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
