import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

const ResultDetailsPage = () => {
  const location = useLocation();
  const { filename } = location.state || { filename: "Unknown Contract" };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>📄 Contract Analysis: {filename}</h2>
      
      {/* 1. Fairness Score (Milestone 3 Requirement) */}
      <Card title="AI Fairness Score">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--warning)' }}>74</div>
          <div>
            <Badge type="warning" text="Moderate Risk" />
            <p style={{ color: 'var(--text-muted)', marginTop: '5px' }}>
              The APR is fair, but hidden fees were detected.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid-2" style={{ marginTop: '20px' }}>
        {/* 2. SLA Summary Fields (Milestone 3 Requirement) */}
        <Card title="Key Contract Terms">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>APR</p>
              <h3>4.9%</h3>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Monthly Payment</p>
              <h3>₹42,500</h3>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Term</p>
              <h3>36 Months</h3>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Mileage Cap</p>
              <h3>10,000 km/yr</h3>
            </div>
          </div>
        </Card>

        {/* 3. Red Flags (Milestone 3 Requirement) */}
        <Card title="⚠️ Red Flags Detected">
          <ul style={{ color: 'var(--danger)', paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>High Acquisition Fee (₹15,000)</li>
            <li>Early Termination Penalty: Above market rate</li>
            <li>Disposition Fee: Non-standard amount detected</li>
          </ul>
        </Card>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <Link to="/negotiate">
          <button style={{ 
            padding: '12px 24px', 
            background: 'var(--accent)', 
            border: 'none', 
            borderRadius: '8px', 
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Ask AI How to Negotiate These Terms →
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ResultDetailsPage;