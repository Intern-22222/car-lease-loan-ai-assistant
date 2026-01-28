import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout, username }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/'); // Go back to login screen
  };

  return (
    <nav style={styles.navbar}>
      <h2 style={{color: 'white', margin: 0}}>🚗 Car Lease AI</h2>
      
      <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
        {/* Navigation Links */}
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/upload" style={styles.link}>Upload Contract</Link>
        <Link to="/price" style={styles.link}>Price Predictor</Link>
        
        <span style={{color: '#ddd'}}>|</span>
        <span style={{color: '#FFD700', fontWeight: 'bold'}}>Hello, {username}</span>
        
        <button onClick={handleLogoutClick} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '15px 40px', backgroundColor: '#333', color: 'white'
  },
  link: {
    color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: '500',
    padding: '8px 12px', borderRadius: '5px', transition: '0.3s'
  },
  logoutBtn: {
    padding: '8px 16px', backgroundColor: '#ff6b6b', color: 'white',
    border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
  }
};

export default Navbar;