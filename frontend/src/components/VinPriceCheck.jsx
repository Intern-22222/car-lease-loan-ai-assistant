import React, { useState, useEffect, useRef } from "react";
import {
  Search, ShieldCheck, DollarSign, Car, Loader2, RotateCcw
} from "lucide-react";
import "./VinPriceCheck.css";

const VinPriceCheck = ({ 
  onCheck, 
  onBack, 
  vin: initialVin 
}) => {
  const [vin, setVin] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [submittedPrice, setSubmittedPrice] = useState("");
  
  const hasAutoFilled = useRef(false);

  // Sync with VIN from the active contract ONLY on initial mount or session change
  useEffect(() => {
    if (initialVin && !hasAutoFilled.current) {
      setVin(initialVin);
      hasAutoFilled.current = true;
    }
  }, [initialVin]);

  const handleReset = () => {
    setVin("");
    setPrice("");
    setResult(null);
    setSubmittedPrice("");
    hasAutoFilled.current = true; // Prevent re-autofill after manual reset
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (vin.length !== 17 || !price) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await onCheck(vin, price);
      setSubmittedPrice(price);
      setResult(data);
    } catch (err) {
      console.error("Market Analysis Error:", err);
      alert(err.message || "Error analyzing deal. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const getRatingClass = (rating) => {
    if (!rating) return "good";
    const r = rating.toLowerCase();
    if (r.includes("overpriced") || r.includes("bad") || r.includes("high")) return "bad";
    if (r.includes("fair") || r.includes("market") || r.includes("average")) return "fair";
    return "good";
  };

  return (
    <div className="vin-check-container">
      {/* INTERNAL HEADER REMOVED: 
          The Header is now managed globally in App.jsx to prevent 
          the layout from shifting during view changes.
      */}

      <div className="vin-content-area">
        <div className="vin-header">
          <div className="logo-badge">
            <ShieldCheck size={40} className="text-teal-400" />
          </div>
          <h1>Market Intelligence</h1>
          <p>Compare your contract price against real-time market valuations.</p>
        </div>

        <div className="vin-card">
          <form onSubmit={handleSubmit} className="vin-form-vertical">
            <div className="input-field-group">
              <label className="input-label">Vehicle Identification Number (VIN)</label>
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
              <label className="input-label">Contract Purchase Price ($)</label>
              <div className="input-with-icon">
                <DollarSign className="search-icon" size={18} />
                <input
                  type="number"
                  placeholder="e.g. 55000"
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
              {loading ? <Loader2 size={18} className="animate-spin" /> : "Run Market Valuation"}
            </button>
          </form>
        </div>

        {result && (
          <div className="result-display-card animate-in">
            <div className="result-header">
              <Car size={20} className="text-teal-400" />
              <h3>
                {result.vehicle?.Year} {result.vehicle?.Make} {result.vehicle?.Model}
              </h3>
            </div>

            <div className={`rating-banner ${getRatingClass(result.rating)}`}>
              <span>{result.rating}</span>
            </div>

            <div className="price-comparison-grid">
              <div className="price-box">
                <span className="label">Fair Market Value</span>
                <span className="value">${result.market_price?.toLocaleString()}</span>
              </div>
              <div className="price-box">
                <span className="label">Your Price</span>
                <span className="value">${Number(submittedPrice)?.toLocaleString()}</span>
              </div>
              <div className="price-box">
                <span className="label">Difference</span>
                <span className={`value ${result.difference > 0 ? "text-red" : "text-green"}`}>
                  {result.difference > 0 ? "+" : "-"}${Math.abs(result.difference)?.toLocaleString()}
                  {result.difference <= 0 && <small className="diff-label"> (Savings)</small>}
                </span>
              </div>
            </div>

            <div className="specs-footer">
              <div className="spec-tag"><strong>Trim:</strong> {result.vehicle?.Trim || "Standard"}</div>
              <div className="spec-tag"><strong>VIN:</strong> {vin}</div>
            </div>

            <button className="reset-analysis-btn" onClick={handleReset}>
              <RotateCcw size={16} /> New Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VinPriceCheck;



















// import React, { useState, useEffect, useRef } from "react"; // Added useRef
// import {
//   Search, ShieldCheck, DollarSign, Car, AlertCircle,
//   Loader2, ArrowLeft, AlertTriangle, CheckCircle, RotateCcw,
// } from "lucide-react";
// import "./VinPriceCheck.css";

// const VinPriceCheck = ({ onCheck, onBack, vin: initialVin }) => {
//   const [vin, setVin] = useState("");
//   const [price, setPrice] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [submittedPrice, setSubmittedPrice] = useState("");
  
//   // Use a Ref to ensure auto-fill only happens once per session
//   const hasAutoFilled = useRef(false);

//   // Sync with VIN from the active contract ONLY on initial mount or session change


//   const handleReset = () => {
//     setVin("");
//     setPrice("");
//     setResult(null);
//     setSubmittedPrice("");
//     hasAutoFilled.current = true; // Prevent re-autofill after manual reset
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (vin.length !== 17 || !price) return;

//     setLoading(true);
//     setResult(null);

//     try {
//       const data = await onCheck(vin, price);
//       setSubmittedPrice(price);
//       setResult(data);
//     } catch (err) {
//       console.error("Market Analysis Error:", err);
//       alert(err.message || "Error analyzing deal. Please check your connection.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getRatingClass = (rating) => {
//     if (!rating) return "good";
//     const r = rating.toLowerCase();
//     if (r.includes("overpriced") || r.includes("bad") || r.includes("high")) return "bad";
//     if (r.includes("fair") || r.includes("market") || r.includes("average")) return "fair";
//     return "good";
//   };

//   return (
//     <div className="vin-check-container">
//       {/* Added Back Button explicitly for better UX */}

//       <div className="vin-header">
//         <div className="logo-badge">
//           <ShieldCheck size={40} className="text-teal-400" />
//         </div>
//         <h1>Market Intelligence</h1>
//         <p>Compare your contract price against real-time market valuations.</p>
//       </div>

//       <div className="vin-card">
//         <form onSubmit={handleSubmit} className="vin-form-vertical">
//           <div className="input-field-group">
//             <label className="input-label">Vehicle Identification Number (VIN)</label>
//             <div className="input-with-icon">
//               <Search className="search-icon" size={18} />
//               <input
//                 type="text"
//                 placeholder="Enter 17-character VIN..."
//                 value={vin}
//                 onChange={(e) => setVin(e.target.value.toUpperCase())}
//                 maxLength={17}
//                 disabled={loading}
//               />
//             </div>
//           </div>

//           <div className="input-field-group">
//             <label className="input-label">Contract Purchase Price ($)</label>
//             <div className="input-with-icon">
//               <DollarSign className="search-icon" size={18} />
//               <input
//                 type="number"
//                 placeholder="e.g. 55000"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//                 disabled={loading}
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="check-btn-full"
//             disabled={vin.length < 17 || !price || loading}
//           >
//             {loading ? <Loader2 size={18} className="animate-spin" /> : "Run Market Valuation"}
//           </button>
//         </form>
//       </div>

//       {result && (
//         <div className="result-display-card animate-in">
//           <div className="result-header">
//             <Car size={20} className="text-teal-400" />
//             <h3>
//               {result.vehicle?.Year} {result.vehicle?.Make} {result.vehicle?.Model}
//             </h3>
//           </div>

//           <div className={`rating-banner ${getRatingClass(result.rating)}`}>
//             <span>{result.rating}</span>
//           </div>

//           <div className="price-comparison-grid">
//             <div className="price-box">
//               <span className="label">Fair Market Value</span>
//               <span className="value">${result.market_price?.toLocaleString()}</span>
//             </div>
//             <div className="price-box">
//               <span className="label">Your Price</span>
//               <span className="value">${Number(submittedPrice)?.toLocaleString()}</span>
//             </div>
//             <div className="price-box">
//               <span className="label">Difference</span>
//               <span className={`value ${result.difference > 0 ? "text-red" : "text-green"}`}>
//                 {result.difference > 0 ? "+" : "-"}${Math.abs(result.difference)?.toLocaleString()}
//                 {result.difference <= 0 && <small className="diff-label"> (Savings)</small>}
//               </span>
//             </div>
//           </div>

//           <div className="specs-footer">
//             <div className="spec-tag"><strong>Trim:</strong> {result.vehicle?.Trim || "Standard"}</div>
//             <div className="spec-tag"><strong>VIN:</strong> {vin}</div>
//           </div>

//           <button className="reset-analysis-btn" onClick={handleReset}>
//             <RotateCcw size={16} /> New Analysis
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VinPriceCheck;




















