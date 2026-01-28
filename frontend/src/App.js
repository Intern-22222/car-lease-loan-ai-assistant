import PricePredictor from './pages/PricePredictor';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';

// Pages
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard'; 
import UploadContract from './pages/Upload'; 

function AppContent() {
  const [user, setUser] = useState(null); // Tracks logged in user

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // 1. IF NOT LOGGED IN -> SHOW LOGIN PAGE
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // 2. IF LOGGED IN -> SHOW MAIN APP WITH ROUTING
  return (
    <div>
      <Navbar onLogout={handleLogout} username={user.name || user.email} />
      
      <div style={{ marginTop: '20px' }}>
        <Routes>
          {/* If path is /dashboard, show Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* If path is /upload, show Upload Page */}
          <Route path="/upload" element={<UploadContract />} />

          <Route path="/price" element={<PricePredictor />} />
          
          {/* Default: Redirect plain "/" to "/dashboard" */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>

      <Chatbot />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}