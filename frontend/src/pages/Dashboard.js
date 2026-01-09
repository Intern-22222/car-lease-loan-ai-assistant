import React from 'react';
import Navbar from '../components/Navbar';

function Dashboard() {
  // MOCK DATA: This simulates what the AI will eventually send us!
  const mockData = {
    contractName: "Toyota_Lease_Agreement_2024.pdf",
    extractedDate: "2025-01-09",
    apr: "4.5%",
    monthlyPayment: "$450.00",
    leaseTerm: "36 Months",
    mileageLimit: "12,000 miles/year",
    terminationFee: "$350.00"
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '40px' }}>
        <h1>📊 SLA Summary Dashboard</h1>
        <p>Showing latest analysis for: <strong>{mockData.contractName}</strong></p>

        {/* The Cards Layout */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '30px' }}>
          
          <SummaryCard title="Monthly Payment" value={mockData.monthlyPayment} color="#007bff" />
          <SummaryCard title="APR (Interest)" value={mockData.apr} color="#28a745" />
          <SummaryCard title="Lease Term" value={mockData.leaseTerm} color="#fd7e14" />
          <SummaryCard title="Mileage Limit" value={mockData.mileageLimit} color="#6c757d" />
        
        </div>

        {/* Detailed Section */}
        <div style={{ marginTop: '40px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
          <h3>⚠️ Important Terms & Fees</h3>
          <ul>
            <li>Early Termination Fee: <strong>{mockData.terminationFee}</strong></li>
            <li>Processed Date: {mockData.extractedDate}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// A reusable small component for the cards
function SummaryCard({ title, value, color }) {
  return (
    <div style={{ 
      border: `2px solid ${color}`, 
      padding: '20px', 
      borderRadius: '10px', 
      width: '200px',
      textAlign: 'center',
      backgroundColor: '#f8f9fa'
    }}>
      <h4 style={{ color: color, margin: '0 0 10px 0' }}>{title}</h4>
      <h2 style={{ margin: 0 }}>{value}</h2>
    </div>
  );
}

export default Dashboard;