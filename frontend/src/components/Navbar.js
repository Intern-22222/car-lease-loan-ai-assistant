import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>🚗 Car Lease AI</h2>
      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/upload" style={styles.link}>Upload Contract</Link>
        <Link to="/" style={styles.logout}>Logout</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#333',
    color: 'white',
  },
  logo: { margin: 0 },
  links: { display: 'flex', gap: '20px' },
  link: { color: 'white', textDecoration: 'none', fontSize: '18px' },
  logout: { color: '#ff6b6b', textDecoration: 'none', fontSize: '18px' }
};

export default Navbar;