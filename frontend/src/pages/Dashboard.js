import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock Data (or Real Data if you connected it)
  const contractData = {
    name: "Toyota_Lease_Agreement_2024.pdf",
    monthly: "$450.00",
    apr: "4.5%",
    term: "36 Months"
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          📊 Your Financial Dashboard
        </h2>
        <button 
          onClick={() => navigate('/upload')} // Uses Router navigation now
          style={{
            backgroundColor: '#28a745', color: 'white', border: 'none',
            padding: '12px 24px', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold'
          }}
        >
          + Start New Fairness Check
        </button>
      </div>

      <p style={{ fontSize: '18px', color: '#555', marginBottom: '20px' }}>
        Showing latest analysis for: <b>{contractData.name}</b>
      </p>

      {/* CARDS SECTION */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Monthly Payment</h3>
          <p style={styles.cardValue}>{contractData.monthly}</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>APR (Interest)</h3>
          <p style={styles.cardValue}>{contractData.apr}</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Lease Term</h3>
          <p style={styles.cardValue}>{contractData.term}</p>
        </div>
      </div>

    </div>
  );
};

const styles = {
  card: {
    flex: 1, minWidth: '250px', padding: '30px', backgroundColor: 'white',
    borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'center', border: '1px solid #eee'
  },
  cardTitle: { margin: '0 0 10px 0', color: '#666', fontSize: '16px' },
  cardValue: { margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#333' }
};

export default Dashboard;