import React from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom'; // Import navigation tool

function Dashboard() {
  const navigate = useNavigate(); // Activate navigation

  return (
    <div>
      <Navbar />
      <div style={{ padding: '40px' }}>
        
        {/* HEADER SECTION */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>📊 Your Financial Dashboard</h1>
          
          {/* NEW BUTTON: Links M3 Dashboard to M4 Tools */}
          <button 
            onClick={() => navigate('/upload')} 
            style={styles.newBtn}
          >
            ➕ Start New Fairness Check
          </button>
        </div>

        {/* --- OLD MILESTONE 3 CONTENT BELOW --- */}
        <p>Showing latest analysis for: <strong>Toyota_Lease_Agreement_2024.pdf</strong></p>

        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <div style={styles.card}>
            <h3>Monthly Payment</h3>
            <h1>$450.00</h1>
          </div>
          <div style={styles.card}>
            <h3>APR (Interest)</h3>
            <h1>4.5%</h1>
          </div>
          <div style={styles.card}>
            <h3>Lease Term</h3>
            <h1>36 Months</h1>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  card: { border: '1px solid #ddd', padding: '20px', borderRadius: '10px', width: '200px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  newBtn: { 
    backgroundColor: '#28a745', color: 'white', padding: '12px 24px', 
    border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' 
  }
};

export default Dashboard;