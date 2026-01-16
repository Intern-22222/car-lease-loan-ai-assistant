import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';

// Import Pages
import UploadPage from './pages/UploadPage';
import ResultDetailsPage from './pages/ResultDetailsPage';
import HistoryPage from './pages/HistoryPage';
import NegotiationChatPage from './pages/NegotiationChatPage';

// Import Global Styles
import './styles/theme.css';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar Navigation */}
        <nav className="sidebar" style={{ width: '250px', borderRight: '1px solid var(--border)', padding: '20px' }}>
          <h2 style={{ color: 'var(--accent)', marginBottom: '30px' }}>ContractAI</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Upload
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              History
            </NavLink>
            <NavLink to="/negotiate" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              AI Negotiator
            </NavLink>
            {/* Optional: Results link (Hidden by default, shown for UX) */}
            <NavLink to="/results" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} style={{ opacity: 0.5 }}>
              Last Results
            </NavLink>
          </div>
        </nav>

        {/* Main Content Area */}
        <main style={{ flex: 1, padding: '40px', backgroundColor: 'var(--bg-main)' }}>
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/results" element={<ResultDetailsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/negotiate" element={<NegotiationChatPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;