// import React, { useState } from "react";

// const ManualVinLookup = () => {
//   const [vin, setVin] = useState("");
//   const [vehicleDetails, setVehicleDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSearch = async () => {
//     if (!vin || vin.length !== 17)
//       return setError("Enter a valid 17-char VIN.");
//     setLoading(true);
//     setError("");
//     setVehicleDetails(null);

//     try {
//       // Ensure backend index.js has: app.use("/api/v1/vin", vinRoutes);
//       const response = await fetch("https://car-lease-loan-ai-assistant.onrender.com/api/v1/vin/decode", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ vin }),
//       });
//       const data = await response.json();
//       if (data.vehicleDetails) setVehicleDetails(data.vehicleDetails);
//       else setError("Could not decode VIN.");
//     } catch (err) {
//       setError("Server error.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white shadow rounded-xl p-6 border border-gray-100 mt-8">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4">
//         🔍 Manual VIN Check
//       </h3>
//       <div className="flex gap-3">
//         <input
//           value={vin}
//           onChange={(e) => setVin(e.target.value.toUpperCase())}
//           placeholder="Enter VIN..."
//           className="flex-1 border p-2 rounded"
//           maxLength={17}
//         />
//         <button
//           onClick={handleSearch}
//           disabled={loading}
//           className="bg-indigo-600 text-white px-4 py-2 rounded"
//         >
//           {loading ? "Checking..." : "Check"}
//         </button>
//       </div>
//       {error && <p className="text-red-500 mt-2">{error}</p>}

//       {vehicleDetails && (
//         <div className="mt-4 p-4 bg-indigo-50 rounded border border-indigo-100">
//           <p>
//             <strong>Make:</strong> {vehicleDetails.make}
//           </p>
//           <p>
//             <strong>Model:</strong> {vehicleDetails.model}
//           </p>
//           <p>
//             <strong>Year:</strong> {vehicleDetails.year}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManualVinLookup;


import React, { useState } from "react";

const ManualVinLookup = () => {
  const [vin, setVin] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSearch = async () => {
    if (!vin || vin.length !== 17)
      return setError("Enter a valid 17-character VIN.");
    setLoading(true);
    setError("");
    setVehicleDetails(null);
    try {
      const response = await fetch(
        "https://car-lease-loan-ai-assistant.onrender.com/api/v1/vin/decode",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vin }),
        },
      );
      const data = await response.json();
      if (data.vehicleDetails) setVehicleDetails(data.vehicleDetails);
      else setError("Could not decode VIN.");
    } catch (err) {
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };
  const charCount = vin.length;
  const isComplete = charCount === 17;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .vin-wrap {
          margin-top: 2rem;
          border-radius: 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          padding: 1.5rem;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03) inset;
          position: relative;
          font-family: 'Sora', sans-serif;
          animation: vin-in 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes vin-in { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .vin-wrap::before { content:'';position:absolute;top:0;left:8%;right:8%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent); }

        /* Header */
        .vin-header { display:flex;align-items:center;gap:10px;margin-bottom:1.25rem; }
        .vin-icon { width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#6c63ff,#4f46e5);display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;box-shadow:0 4px 12px rgba(108,99,255,0.3); }
        .vin-title { font-size:0.9rem;font-weight:700;color:#fff;letter-spacing:-0.01em; }
        .vin-sub { font-family:'DM Sans',sans-serif;font-size:0.75rem;color:rgba(255,255,255,0.35); }

        /* Input row */
        .vin-row { display:flex;gap:8px;align-items:stretch; }
        .vin-input-wrap { position:relative;flex:1; }
        .vin-input-icon { position:absolute;left:12px;top:50%;transform:translateY(-50%);display:flex;align-items:center;color:rgba(255,255,255,0.22);pointer-events:none;transition:color 0.2s; }
        .vin-input-icon.active { color:#6c63ff; }
        .vin-counter { position:absolute;right:12px;top:50%;transform:translateY(-50%);font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;pointer-events:none;transition:color 0.2s; }

        .vin-input {
          width:100%;padding:11px 44px 11px 38px;
          background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);
          border-radius:12px;color:#fff;
          font-family:monospace;font-size:0.88rem;letter-spacing:0.06em;
          outline:none;transition:border-color 0.25s,background 0.25s,box-shadow 0.25s;
          text-transform:uppercase;
        }
        .vin-input::placeholder { color:rgba(255,255,255,0.2);font-family:'DM Sans',sans-serif;letter-spacing:0; }
        .vin-input:focus { border-color:rgba(108,99,255,0.65);background:rgba(108,99,255,0.07);box-shadow:0 0 0 3px rgba(108,99,255,0.12); }
        .vin-input.complete { border-color:rgba(16,185,129,0.5);box-shadow:0 0 0 3px rgba(16,185,129,0.1); }

        .vin-btn {
          padding:11px 20px;border-radius:12px;border:none;cursor:pointer;
          font-family:'Sora',sans-serif;font-size:0.85rem;font-weight:600;color:#fff;
          background:linear-gradient(135deg,#6c63ff,#4f46e5);
          display:flex;align-items:center;gap:7px;white-space:nowrap;
          position:relative;overflow:hidden;
          transition:transform 0.18s,box-shadow 0.18s,opacity 0.2s;
          box-shadow:0 4px 18px rgba(108,99,255,0.35);
          flex-shrink:0;
        }
        .vin-btn::before { content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);transition:left 0.5s; }
        .vin-btn:hover:not(:disabled)::before { left:100%; }
        .vin-btn:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 8px 26px rgba(108,99,255,0.5); }
        .vin-btn:disabled { opacity:0.55;cursor:not-allowed; }
        .vin-spin { animation:vspin 0.8s linear infinite; }
        @keyframes vspin { to{transform:rotate(360deg)} }

        /* Progress pips */
        .vin-progress { display:flex;align-items:center;gap:4px;margin-top:8px; }
        .vin-pip { height:3px;flex:1;border-radius:999px;transition:background 0.2s; }

        /* Error */
        .vin-error { display:flex;align-items:center;gap:7px;margin-top:10px;padding:10px 13px;border-radius:11px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.22);font-family:'DM Sans',sans-serif;font-size:0.8rem;color:#f87171; }

        /* Result card */
        .vin-result {
          margin-top:1.1rem;
          border-radius:14px;
          background:rgba(16,185,129,0.07);
          border:1px solid rgba(16,185,129,0.2);
          padding:14px 16px;
          animation:vin-in 0.4s ease both;
          position:relative;
        }
        .vin-result::before { content:'';position:absolute;top:0;left:8%;right:8%;height:1px;background:linear-gradient(90deg,transparent,rgba(16,185,129,0.2),transparent); }
        .vin-result-header { display:flex;align-items:center;gap:8px;margin-bottom:10px; }
        .vin-result-icon { width:28px;height:28px;border-radius:8px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);display:flex;align-items:center;justify-content:center;color:#34d399; }
        .vin-result-label { font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#34d399; }

        .vin-detail-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:8px; }
        .vin-detail-item { padding:8px 10px;border-radius:9px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07); }
        .vin-detail-key { font-size:9px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:3px; }
        .vin-detail-val { font-size:0.85rem;font-weight:700;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
      `}</style>

      <div className="vin-wrap">
        {/* Header */}
        <div className="vin-header">
          <div className="vin-icon">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <div>
            <div className="vin-title">Manual VIN Check</div>
            <div className="vin-sub">
              Decode any 17-character vehicle identifier
            </div>
          </div>
        </div>

        {/* Input row */}
        <div className="vin-row">
          <div className="vin-input-wrap">
            <span className={`vin-input-icon${focused ? " active" : ""}`}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </span>
            <input
              value={vin}
              onChange={(e) => {
                setVin(e.target.value.toUpperCase());
                setError("");
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Enter 17-char VIN…"
              className={`vin-input${isComplete ? " complete" : ""}`}
              maxLength={17}
            />
            <span
              className="vin-counter"
              style={{
                color: isComplete
                  ? "#34d399"
                  : charCount > 0
                    ? "rgba(255,255,255,0.35)"
                    : "rgba(255,255,255,0.15)",
              }}
            >
              {charCount}/17
            </span>
          </div>
          <button onClick={handleSearch} disabled={loading} className="vin-btn">
            {loading ? (
              <>
                <svg
                  className="vin-spin"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                </svg>
                Checking
              </>
            ) : (
              <>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Check
              </>
            )}
          </button>
        </div>

        {/* Progress bar */}
        <div className="vin-progress">
          {Array.from({ length: 17 }).map((_, i) => (
            <div
              key={i}
              className="vin-pip"
              style={{
                background:
                  i < charCount
                    ? isComplete
                      ? "#34d399"
                      : "#6c63ff"
                    : "rgba(255,255,255,0.07)",
              }}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="vin-error">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Result */}
        {vehicleDetails && (
          <div className="vin-result">
            <div className="vin-result-header">
              <div className="vin-result-icon">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="vin-result-label">VIN Decoded Successfully</span>
            </div>
            <div className="vin-detail-grid">
              {[
                { key: "Make", val: vehicleDetails.make },
                { key: "Model", val: vehicleDetails.model },
                { key: "Year", val: vehicleDetails.year },
              ].map((d) => (
                <div key={d.key} className="vin-detail-item">
                  <div className="vin-detail-key">{d.key}</div>
                  <div className="vin-detail-val">{d.val || "—"}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManualVinLookup;
