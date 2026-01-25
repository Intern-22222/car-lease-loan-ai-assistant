import React, { useState } from "react";
import {
  X,
  Info,
  CreditCard,
  Search,
  Copy,
  Check,
  Calendar,
  ShoppingCart,
} from "lucide-react";
import "./SummaryPanel.css";

const SummaryPanel = ({ summary, carName, onClose }) => {
  const [copied, setCopied] = useState(false);

  // Function to copy VIN to clipboard
  const handleCopyVin = () => {
    if (!summary?.vin) return;
    navigator.clipboard.writeText(summary.vin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Logic to determine the car title for the panel header
  const getCarTitle = () => {
      if (summary?.model || summary?.make) {
        return `${summary?.make || ""} ${summary?.model || ""}`.trim();
      }
      // Fallback to VIN if no model is found
      return summary?.vin ? `${summary.vin}` : "---";
    };

  // Calculate total amount payable based on contract metrics
  const calculateTotalPayable = () => {
    if (!summary) return null;

    const emi = Number(summary?.monthly_payment || summary?.monthly_emi || 0);
    const months = Number(summary?.contract_term || summary?.tenure || 0);
    const downPayment = Number(summary?.total_deposit || summary?.down_payment || 0);
    const balloon = Number(summary?.balloon_payment || summary?.balloon || 0);

    const total = emi * months + downPayment + balloon;
    return total > 0 ? total : null;
  };

  const totalPayable = calculateTotalPayable();

  // Helper to format numeric values with local separators or return dash
  const formatValue = (val) => {
    if (val === undefined || val === null || val === "" || isNaN(val) || val === 0) {
      return "---";
    }
    return Number(val).toLocaleString();
  };

  return (
    <div className="summary-panel">
      <div className="summary-header">
        <div className="flex items-center gap-2">
          <h3>Intelligence Panel</h3>
        </div>
        <X size={20} className="close-icon" onClick={onClose} />
      </div>

      <div className="summary-main">
        {/* VEHICLE IDENTITY SECTION */}
        <div className="car-identity">
          <h2 className="car-title">
            {getCarTitle()} 
          </h2>

          <div className="vin-badge-container">
            <span className="vin-badge-text">VIN: {summary?.vin || "---"}</span>
            {summary?.vin && (
              <button className="vin-copy-btn" onClick={handleCopyVin}>
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            )}
          </div>
        </div>

        {/* METRICS HERO SECTION - EMI and Tenure highlights */}
        <div className="metrics-hero-grid">
          <div className="hero-card emi-theme">
            <div className="hero-card-header">
              <CreditCard size={16} />
              <span>Monthly EMI</span>
            </div>
            <div className="hero-card-body">
              <span className="hero-currency">$</span>
              <span className="hero-value">
                {formatValue(summary?.monthly_payment || summary?.monthly_emi)}
              </span>
            </div>
          </div>

          <div className="hero-card tenure-theme">
            <div className="hero-card-header">
              <Calendar size={16} />
              <span>Tenure</span>
            </div>
            <div className="hero-card-body">
              <span className="hero-value">
                {summary?.contract_term || summary?.tenure || "---"}
              </span>
              <span className="hero-unit">Months</span>
            </div>
          </div>
        </div>

        {/* FINANCIAL OVERVIEW */}
        <div className="plain-summary">
          <h4 className="section-title">
            <Info size={14} style={{ marginRight: "6px" }} />
            Financial Overview
          </h4>
          <div className="financial-data-list">
            <div className="data-row">
              <span>Interest Rate (APR)</span>
              <strong>
                {summary?.apr || summary?.interest_rate ? `${summary.apr || summary.interest_rate}%` : "---"}
              </strong>
            </div>
            <div className="data-row">
              <span>Down Payment</span>
              <strong>
                {summary?.total_deposit || summary?.down_payment ? `$${formatValue(summary?.total_deposit || summary?.down_payment)}` : "---"}
              </strong>
            </div>
            <div className="data-row total-payable-row">
              <span>Total Amount Payable</span>
              <span className="total-highlight-val">
                {totalPayable ? `$${formatValue(totalPayable)}` : "---"}
              </span>
            </div>
          </div>
        </div>

        {/* JUNK FEE DETECTION */}
        <h4 className="section-title" style={{ color: "#f59e0b", marginTop: "20px" }}>
          <Search size={14} style={{ marginRight: "6px" }} />
          Junk Fee Detection
        </h4>
        <div className="junk-fees-container">
          {summary?.junk_fees && summary.junk_fees.length > 0 ? (
            summary.junk_fees.map((fee, index) => (
              <div key={index} className="junk-fee-item">
                <div className="flex items-start gap-2">
                  <ShoppingCart size={16} className="text-amber-500 mt-1" />
                  <div>
                    <p className="junk-fee-name"><strong>{fee.name}</strong></p>
                    <p className="junk-fee-desc text-xs text-gray-500">{fee.description}</p>
                  </div>
                </div>
                <span className="junk-fee-amount">${formatValue(fee.amount)}</span>
              </div>
            ))
          ) : (
            <div className="no-junk-fees">
              <p className="text-xs text-gray-400 italic">No suspicious junk fees detected.</p>
            </div>
          )}
        </div>

        {/* CONTRACTUAL TERMS - Detailed breakdown of principal and balloon */}
        <h4 className="section-title" style={{ marginTop: "20px" }}>Contractual Terms</h4>
        <div className="metrics-grid">
          <div className="metric-card">
            <p className="label">Loan Principal</p>
            <p className="val">
              {summary?.principal || summary?.amount_financed || summary?.loan_amount
                ? `$${formatValue(summary.principal || summary.amount_financed || summary.loan_amount)}`
                : "---"}
            </p>
          </div>
          <div className="metric-card">
            <p className="label">Balloon / GFV</p>
            <p className="val">
              {summary?.balloon_payment || summary?.balloon
                ? `$${formatValue(summary?.balloon_payment || summary?.balloon)}`
                : "---"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPanel;





























// import React from 'react';
// import {
//   X, Target, TrendingUp, AlertTriangle,
//   CheckCircle, Info, DollarSign, Calendar
// } from 'lucide-react';
// import './SummaryPanel.css';

// const SummaryPanel = ({ summary, carName, analysis, onClose }) => {
//   // Helper to choose color and icon based on the Market Deal Rating
//   const getRatingStyles = (rating) => {
//     if (!rating) return { color: '#8b949e', icon: <Target size={20} /> };
//     if (rating.includes("Great")) return { color: '#21CAB9', icon: <CheckCircle size={20} /> };
//     if (rating.includes("Fair")) return { color: '#FFD700', icon: <TrendingUp size={20} /> };
//     return { color: '#FF4D4D', icon: <AlertTriangle size={20} /> };
//   };

//   const ratingStyles = getRatingStyles(analysis?.deal_rating);

//   return (
//     <div className="summary-panel">
//       {/* 1. Header Section */}
//       <div className="summary-header">
//         <h3>Contract Intelligence</h3>
//         <X size={20} className="close-icon" onClick={onClose} />
//       </div>

//       <div className="summary-main">
//         <h2 className="car-title">{carName || "Vehicle Contract"}</h2>

//         {/* 2. NEW: Market Intelligence Card (Top Priority) */}
//         <div className="analysis-card" style={{ borderLeft: `4px solid ${ratingStyles.color}` }}>
//           <div className="analysis-header">
//             {ratingStyles.icon}
//             <span style={{ color: ratingStyles.color, fontWeight: 'bold', marginLeft: '8px' }}>
//               {analysis?.deal_rating || "Analysis Pending"}
//             </span>
//           </div>
//           <div className="price-comparison">
//             <div className="price-item">
//               <span>Market Value</span>
//               <strong>${analysis?.market_price?.toLocaleString() || "---"}</strong>
//             </div>
//             <div className="price-item">
//               <span>Your Price</span>
//               <strong>${analysis?.your_price?.toLocaleString() || "---"}</strong>
//             </div>
//           </div>
//         </div>

//         {/* 3. Main Highlights (Monthly & Term) */}
//         <div className="price-highlight">
//           <div className="highlight-item">
//             <span className="price">{summary?.monthly || "---"}</span>
//             <span className="label">Monthly Payment</span>
//           </div>
//           <div className="highlight-item">
//             <span className="term">{summary?.duration || "---"}</span>
//             <span className="label">Contract Term</span>
//           </div>
//         </div>

//         {/* 4. Simple Explanation Section */}
//         <div className="plain-summary">
//           <h4 className="section-title">
//             <Info size={14} style={{ marginRight: '6px' }} />
//             Simple Explanation
//           </h4>
//           <ul>
//             <li>You are entering a {summary?.duration || 'set-term'} agreement.</li>
//             <li>Responsibility for maintenance and insurance is yours.</li>
//             <li>Excess mileage fees of {summary?.excessMileage || 'standard rates'} apply.</li>
//           </ul>
//         </div>

//         {/* 5. Detailed Financial Grid */}
//         <h4 className="section-title">Financial Details</h4>
//         <div className="metrics-grid">
//           <div className="metric-card">
//             <p className="label">APR / Interest</p>
//             <p className="val">{summary?.apr || "N/A"}</p>
//           </div>
//           <div className="metric-card">
//             <p className="label">Total Deposit</p>
//             <p className="val">{summary?.deposit || "N/A"}</p>
//           </div>
//           <div className="metric-card">
//             <p className="label">Annual Mileage</p>
//             <p className="val">{summary?.mileage || "N/A"}</p>
//           </div>
//           <div className="metric-card">
//             <p className="label">Early Exit Fee</p>
//             <p className="val">{summary?.earlyTermination || "N/A"}</p>
//           </div>
//         </div>

//         {/* 6. Red Flags / Risks */}
//         <h4 className="section-title" style={{ color: '#FF4D4D' }}>Risk Alerts</h4>
//         <div className="red-flags">
//           <div className="flag-item">
//             <AlertTriangle size={16} />
//             <p><strong>Wear & Tear:</strong> Return standards are strictly dictated by the lender.</p>
//           </div>
//           <div className="flag-item">
//             <AlertTriangle size={16} />
//             <p><strong>Arbitration:</strong> Mandatory out-of-court dispute resolution active.</p>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default SummaryPanel;
