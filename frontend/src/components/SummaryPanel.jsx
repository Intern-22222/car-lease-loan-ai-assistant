import React from 'react';
import { 
  X, Target, TrendingUp, AlertTriangle, 
  CheckCircle, Info, DollarSign, Calendar 
} from 'lucide-react';
import './SummaryPanel.css';

const SummaryPanel = ({ summary, carName, analysis, onClose }) => {
  // Helper to choose color and icon based on the Market Deal Rating
  const getRatingStyles = (rating) => {
    if (!rating) return { color: '#8b949e', icon: <Target size={20} /> };
    if (rating.includes("Great")) return { color: '#21CAB9', icon: <CheckCircle size={20} /> };
    if (rating.includes("Fair")) return { color: '#FFD700', icon: <TrendingUp size={20} /> };
    return { color: '#FF4D4D', icon: <AlertTriangle size={20} /> };
  };

  const ratingStyles = getRatingStyles(analysis?.deal_rating);

  return (
    <div className="summary-panel">
      {/* 1. Header Section */}
      <div className="summary-header">
        <h3>Contract Intelligence</h3>
        <X size={20} className="close-icon" onClick={onClose} />
      </div>

      <div className="summary-main">
        <h2 className="car-title">{carName || "Vehicle Contract"}</h2>

        {/* 2. NEW: Market Intelligence Card (Top Priority) */}
        <div className="analysis-card" style={{ borderLeft: `4px solid ${ratingStyles.color}` }}>
          <div className="analysis-header">
            {ratingStyles.icon}
            <span style={{ color: ratingStyles.color, fontWeight: 'bold', marginLeft: '8px' }}>
              {analysis?.deal_rating || "Analysis Pending"}
            </span>
          </div>
          <div className="price-comparison">
            <div className="price-item">
              <span>Market Value</span>
              <strong>${analysis?.market_price?.toLocaleString() || "---"}</strong>
            </div>
            <div className="price-item">
              <span>Your Price</span>
              <strong>${analysis?.your_price?.toLocaleString() || "---"}</strong>
            </div>
          </div>
        </div>

        {/* 3. Main Highlights (Monthly & Term) */}
        <div className="price-highlight">
          <div className="highlight-item">
            <span className="price">{summary?.monthly || "---"}</span>
            <span className="label">Monthly Payment</span>
          </div>
          <div className="highlight-item">
            <span className="term">{summary?.duration || "---"}</span>
            <span className="label">Contract Term</span>
          </div>
        </div>

        {/* 4. Simple Explanation Section */}
        <div className="plain-summary">
          <h4 className="section-title">
            <Info size={14} style={{ marginRight: '6px' }} />
            Simple Explanation
          </h4>
          <ul>
            <li>You are entering a {summary?.duration || 'set-term'} agreement.</li>
            <li>Responsibility for maintenance and insurance is yours.</li>
            <li>Excess mileage fees of {summary?.excessMileage || 'standard rates'} apply.</li>
          </ul>
        </div>

        {/* 5. Detailed Financial Grid */}
        <h4 className="section-title">Financial Details</h4>
        <div className="metrics-grid">
          <div className="metric-card">
            <p className="label">APR / Interest</p>
            <p className="val">{summary?.apr || "N/A"}</p>
          </div>
          <div className="metric-card">
            <p className="label">Total Deposit</p>
            <p className="val">{summary?.deposit || "N/A"}</p>
          </div>
          <div className="metric-card">
            <p className="label">Annual Mileage</p>
            <p className="val">{summary?.mileage || "N/A"}</p>
          </div>
          <div className="metric-card">
            <p className="label">Early Exit Fee</p>
            <p className="val">{summary?.earlyTermination || "N/A"}</p>
          </div>
        </div>

        {/* 6. Red Flags / Risks */}
        <h4 className="section-title" style={{ color: '#FF4D4D' }}>Risk Alerts</h4>
        <div className="red-flags">
          <div className="flag-item">
            <AlertTriangle size={16} />
            <p><strong>Wear & Tear:</strong> Return standards are strictly dictated by the lender.</p>
          </div>
          <div className="flag-item">
            <AlertTriangle size={16} />
            <p><strong>Arbitration:</strong> Mandatory out-of-court dispute resolution active.</p>
          </div>
        </div>
      </div>
 
    </div>
  );
};

export default SummaryPanel;