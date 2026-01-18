import React, { useState } from 'react';
import { X, AlertTriangle, Info, Send, MessageSquare } from 'lucide-react';
import './SummaryPanel.css';

const SummaryPanel = ({ data, onClose }) => {
  const [userQuery, setUserQuery] = useState('');

  // Fallback data for demonstration
  const contract = data || {
    vehicle: "2024 Tesla Model 3",
    summaryPoints: [
      "You are entering a 36-month lease agreement with Tesla Financial.",
      "Ownership only transfers if you select the 'Buyout' option at term end.",
      "You are responsible for all maintenance and insurance costs."
    ],
    financials: {
      price: "$42,990",
      downPayment: "$4,500",
      apr: "6.49%",
      tenure: "36 Months",
      monthly: "$549",
      totalPayable: "$24,264"
    },
    penalties: {
      lateFee: "$25.00 or 5%",
      prepayment: "No penalty",
      excessMileage: "$0.25 / mile"
    },
    redFlags: [
      "Arbitration Clause: Mandatory out-of-court dispute resolution.",
      "Wear & Tear: Return standards are strictly dictated by the lender."
    ]
  };

  return (
    <div className="summary-panel">
      {/* Header */}
      <div className="summary-header">
        <h3>Contract Summary</h3>
        <X size={20} className="close-icon" onClick={onClose} />
      </div>

      {/* Main Content Area */}
      <div className="summary-main">
        <h2 className="car-title">{contract.vehicle}</h2>
        
        <div className="price-highlight">
          <span className="price">{contract.financials.monthly}</span>
          <span className="term">{contract.financials.tenure}</span>
        </div>

        {/* 1. Plain English Summary */}
        <div className="plain-summary">
          <h4 className="section-title" style={{ marginTop: 0, color: '#21CAB9' }}>
            <Info size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Simple Explanation
          </h4>
          <ul>
            {contract.summaryPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>

        {/* 2. Financial Grid */}
        <h4 className="section-title">Financial Terms</h4>
        <div className="metrics-grid">
          {Object.entries(contract.financials).map(([key, value]) => (
            <div key={key} className="metric-card">
              <p className="label">{key.replace(/([A-Z])/g, ' $1')}</p>
              <p className="val">{value}</p>
            </div>
          ))}
        </div>

        {/* 3. Rules & Penalties */}
        <h4 className="section-title">Rules & Penalties</h4>
        <div className="fee-box">
          <p>Late Fee</p>
          <strong>{contract.penalties.lateFee}</strong>
        </div>
        <div className="fee-box">
          <p>Prepayment</p>
          <strong>{contract.penalties.prepayment}</strong>
        </div>
        <div className="fee-box warning">
          <p>Excess Mileage</p>
          <strong>{contract.penalties.excessMileage}</strong>
        </div>

        {/* 4. Red Flags */}
        <h4 className="section-title">Risk Alerts</h4>
        <div className="red-flags">
          {contract.redFlags.map((flag, i) => (
            <div key={i} className="flag-item">
              <AlertTriangle size={16} />
              <p>{flag}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SummaryPanel;