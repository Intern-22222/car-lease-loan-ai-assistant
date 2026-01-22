import React, { useState } from "react";
import {
  Search,
  ShieldCheck,
  DollarSign,
  Car,
  AlertCircle,
  Loader2,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import "./VinPriceCheck.css";

const VinPriceCheck = ({ onCheck, onBack }) => {
  const [vin, setVin] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // Local state for the output

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (vin.length !== 17 || !price) return;

    setLoading(true);
    setResult(null); // Clear previous results

    try {
      // Call the function from App.jsx and catch the return data
      const data = await onCheck(vin, price);
      setResult(data);
    } catch (err) {
      alert(err.message || "Error analyzing deal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vin-check-container">
      <div className="vin-header">
        <div className="logo-badge">
          <ShieldCheck size={40} className="text-teal-400" />
        </div>
        <h1>VIN & Price Intelligence</h1>
        <p>Compare your contract price against real-time market valuations.</p>
      </div>

      <div className="vin-card">
        <form onSubmit={handleSubmit} className="vin-form-vertical">
          <div className="input-field-group">
            <label className="input-label">Vehicle Identification Number</label>
            <div className="input-with-icon">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Enter 17-character VIN..."
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                maxLength={17}
                disabled={loading}
              />
            </div>
          </div>

          <div className="input-field-group">
            <label className="input-label">Contract Price ($)</label>
            <div className="input-with-icon">
              <DollarSign className="search-icon" size={18} />
              <input
                type="number"
                placeholder="e.g. 1000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="check-btn-full"
            disabled={vin.length < 17 || !price || loading}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Analyze Deal Quality"
            )}
          </button>
        </form>
      </div>

      {/* --- RESULTS SECTION --- */}
      {result && (
        <div className="result-display-card">
          <div className="result-header">
            <Car size={20} />
            <h3>{result.vehicle}</h3>
          </div>

          <div
            className={`rating-banner ${
              result.analysis.deal_rating.toLowerCase().includes("bad")
                ? "bad"
                : result.analysis.deal_rating.toLowerCase().includes("fair")
                  ? "fair"
                  : "good"
            }`}
          >
            {result.analysis.deal_rating.toLowerCase().includes("bad") ? (
              <AlertTriangle size={18} />
            ) : result.analysis.deal_rating.toLowerCase().includes("fair") ? (
              <AlertCircle size={18} />
            ) : (
              <CheckCircle size={18} />
            )}
            <span>{result.analysis.deal_rating}</span>
          </div>

          <div className="price-comparison-grid">
            <div className="price-box">
              <span className="label">Market Value</span>
              <span className="value">
                ${result.analysis.market_price.toLocaleString()}
              </span>
            </div>
            <div className="price-box">
              <span className="label">Your Price</span>
              <span className="value">
                ${result.analysis.your_price.toLocaleString()}
              </span>
            </div>
            <div className="price-box">
              <span className="label">Difference</span>
              <span
                className={`value ${result.analysis.difference > 0 ? "text-red" : "text-green"}`}
              >
                ${result.analysis.difference.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="specs-footer">
            <span>
              <strong>Trim:</strong> {result.details.Trim}
            </span>
            <span>
              <strong>Year:</strong> {result.details.Year}
            </span>
            <span>
              <strong>Model:</strong> {result.details.Model}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VinPriceCheck;
