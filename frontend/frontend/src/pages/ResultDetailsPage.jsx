// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import jsPDF from "jspdf";

// const ResultDetailsPage = () => {
//   const { id } = useParams();

//   const [record, setRecord] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchRecord = async () => {
//       try {
//         const response = await fetch(`https://car-lease-loan-ai-assistant.onrender.com/api/results/${id}`);
//         const data = await response.json();

//         if (!data.success) {
//           setError("Record not found");
//         } else {
//           setRecord(data.record);
//         }
//       } catch (err) {
//         setError("Server error while fetching record");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchRecord();
//   }, [id]);

//   const generateAnalysisPDF = () => {
//     const doc = new jsPDF();

//     doc.setFontSize(16);
//     doc.text("AI Contract Analysis Report", 20, 20);

//     doc.setFontSize(12);

//     // --- SAFE VIN & VEHICLE SECTION ---
//     const vinText = record.vin || "Not Detected";
//     doc.text(`VIN: ${vinText}`, 20, 35);

//     if (record.vehicleDetails) {
//       doc.text(
//         `Vehicle: ${record.vehicleDetails.year} ${record.vehicleDetails.make} ${record.vehicleDetails.model}`,
//         20,
//         45,
//       );
//     } else {
//       doc.text("Vehicle: Details not available", 20, 45);
//     }

//     // --- SAFE PRICING SECTION ---
//     if (record.pricingAnalysis) {
//       doc.text(
//         `Contract Price: ${record.pricingAnalysis.contractPrice ? "Rs. " + record.pricingAnalysis.contractPrice : "N/A"}`,
//         20,
//         60,
//       );
//       doc.text(
//         `Market Fair Price: ${record.pricingAnalysis.marketFairPrice ? "Rs. " + record.pricingAnalysis.marketFairPrice : "N/A"}`,
//         20,
//         70,
//       );
//       doc.text(`Verdict: ${record.pricingAnalysis.verdict || "N/A"}`, 20, 80);

//       doc.text("Recommendation:", 20, 100);

//       // Handle long recommendation text by splitting it
//       const recommendation =
//         record.pricingAnalysis.recommendation ||
//         (record.pricingAnalysis.verdict === "Overpriced"
//           ? "Negotiate or consider alternative vehicles."
//           : "Proceed with the deal.");

//       const splitText = doc.splitTextToSize(recommendation, 170); // Wrap text at 170 units
//       doc.text(splitText, 20, 110);
//     } else {
//       doc.text("Pricing Analysis: Not available", 20, 60);
//     }

//     doc.save("contract_analysis_report.pdf");
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <a href="/">⬅ Back to Upload</a> |{" "}
//       <a href="/history">📜 Back to History</a>
//       <h2 style={{ marginTop: "10px" }}>📄 OCR Result Details</h2>
//       {isLoading && <p>⏳ Loading...</p>}
//       {error && <p style={{ color: "red" }}>❌ {error}</p>}
//       {record && (
//         <div style={{ marginTop: "15px" }}>
//           {/* SUMMARY CARD */}
//           <div
//             style={{
//               padding: "16px",
//               borderRadius: "12px",
//               backgroundColor: "white",
//               border: "1px solid #e5e7eb",
//               boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
//               marginBottom: "15px",
//             }}
//           >
//             <h3 style={{ marginBottom: "8px" }}>📄 File Summary</h3>

//             <p>
//               <strong>File:</strong> {record.fileName || "Untitled"}
//             </p>
//             <p>
//               <strong>Uploaded:</strong>{" "}
//               {new Date(record.uploadedAt).toLocaleString()}
//             </p>

//             <p>
//               <strong>Confidence:</strong>{" "}
//               <span
//                 style={{
//                   color:
//                     record.confidence >= 0.7
//                       ? "#16a34a"
//                       : record.confidence >= 0.4
//                         ? "#ca8a04"
//                         : "#dc2626",
//                 }}
//               >
//                 {(record.confidence * 100).toFixed(1)}%
//               </span>
//             </p>
//           </div>

//           {/* EXTRACTED FIELDS CARD */}
//           <div
//             style={{
//               padding: "16px",
//               borderRadius: "12px",
//               backgroundColor: "white",
//               border: "1px solid #e5e7eb",
//               boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
//               marginBottom: "15px",
//             }}
//           >
//             <h3 style={{ marginBottom: "10px" }}>📊 Extracted Fields</h3>

//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(2, 1fr)",
//                 gap: "10px",
//               }}
//             >
//               <div>
//                 <strong>Loan Amount:</strong>
//                 <br />
//                 {record.fields?.loan_amount
//                   ? "₹" + record.fields.loan_amount
//                   : "N/A"}
//               </div>

//               <div>
//                 <strong>Interest Rate:</strong>
//                 <br />
//                 {record.fields?.interest_rate
//                   ? record.fields.interest_rate + "%"
//                   : "N/A"}
//               </div>

//               <div>
//                 <strong>Tenure:</strong>
//                 <br />
//                 {record.fields?.tenure_months
//                   ? record.fields.tenure_months + " months"
//                   : "N/A"}
//               </div>

//               <div>
//                 <strong>EMI:</strong>
//                 <br />
//                 {record.fields?.emi ? "₹" + record.fields.emi : "N/A"}
//               </div>
//             </div>
//           </div>

//           {record.vehicleDetails && (
//             <div
//               style={{
//                 padding: "16px",
//                 borderRadius: "12px",
//                 backgroundColor: "#f8fafc",
//                 border: "1px solid #e5e7eb",
//                 marginBottom: "15px",
//               }}
//             >
//               <h3> Vehicle Details</h3>

//               <p>
//                 <strong>VIN:</strong> {record.vin}
//               </p>
//               <p>
//                 <strong>Year:</strong> {record.vehicleDetails.year}
//               </p>
//               <p>
//                 <strong>Make:</strong> {record.vehicleDetails.make}
//               </p>
//               <p>
//                 <strong>Model:</strong> {record.vehicleDetails.model}
//               </p>
//               <p>
//                 <strong>Trim:</strong> {record.vehicleDetails.trim}
//               </p>
//               <p>
//                 <strong>Body Type:</strong> {record.vehicleDetails.bodyClass}
//               </p>
//             </div>
//           )}

//           {record.pricingAnalysis &&
//             record.pricingAnalysis.contractPrice != null && (
//               <div
//                 style={{
//                   padding: "16px",
//                   borderRadius: "12px",
//                   backgroundColor: "#ecfeff",
//                   border: "1px solid #67e8f9",
//                   marginBottom: "15px",
//                 }}
//               >
//                 <h3>💰 Market Fair Price Analysis</h3>

//                 <p>
//                   <strong>Contract Price:</strong> ₹
//                   {record.pricingAnalysis.contractPrice.toLocaleString()}
//                 </p>

//                 <p>
//                   <strong>Market Fair Price:</strong> ₹
//                   {record.pricingAnalysis.marketFairPrice?.toLocaleString() ??
//                     "N/A"}
//                 </p>

//                 <p>
//                   <strong>Difference:</strong> ₹
//                   {record.pricingAnalysis.difference?.toLocaleString() ?? "N/A"}
//                 </p>

//                 <p>
//                   <strong>Verdict:</strong>{" "}
//                   <span
//                     style={{
//                       color:
//                         record.pricingAnalysis.verdict === "Overpriced"
//                           ? "red"
//                           : "green",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     {record.pricingAnalysis.verdict}
//                   </span>
//                 </p>

//                 <p>
//                   <strong>Confidence:</strong>{" "}
//                   {record.pricingAnalysis.confidence ?? "N/A"}
//                 </p>
//               </div>
//             )}

//           {/* {record.pricingAnalysis && (
//             <div
//               style={{
//                 padding: "16px",
//                 borderRadius: "12px",
//                 backgroundColor: "#f0fdf4",
//                 border: "1px solid #86efac",
//                 marginBottom: "15px",
//               }}
//             >
//               <h3>✅ Recommendation</h3>

//               {record.pricingAnalysis.verdict === "Overpriced" ? (
//                 <p>
//                   ⚠️ The vehicle appears overpriced compared to market value.
//                   Consider negotiating or exploring similar alternatives.
//                 </p>
//               ) : (
//                 <p>
//                   ✅ The pricing appears fair based on market analysis. You may
//                   proceed or negotiate minor terms.
//                 </p>
//               )}
//             </div>
//           )} */}

//           {record.pricingAnalysis?.recommendation && (
//             <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//               <h3 className="font-semibold mb-1">✅ Recommendation</h3>
//               <p className="text-sm text-gray-700">
//                 {record.pricingAnalysis.recommendation}
//               </p>
//             </div>
//           )}

//           <button
//             onClick={generateAnalysisPDF}
//             style={{
//               padding: "10px 16px",
//               borderRadius: "8px",
//               backgroundColor: "#2563eb",
//               color: "white",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             📄 Download Analysis Report (PDF)
//           </button>

//           {/* RAW TEXT CARD */}
//           <div
//             style={{
//               padding: "16px",
//               borderRadius: "12px",
//               backgroundColor: "white",
//               border: "1px solid #e5e7eb",
//               boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
//               marginBottom: "15px",
//             }}
//           >
//             <h3 style={{ marginBottom: "8px" }}>📝 Raw OCR Text</h3>

//             <pre
//               style={{
//                 background: "#f1f5f9",
//                 padding: "12px",
//                 borderRadius: "8px",
//                 overflowX: "auto",
//               }}
//             >
//               {record.rawText}
//             </pre>
//           </div>

//           {/* NOTES CARD */}
//           <div
//             style={{
//               padding: "16px",
//               borderRadius: "12px",
//               backgroundColor: "white",
//               border: "1px solid #e5e7eb",
//               boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
//             }}
//           >
//             <h3 style={{ marginBottom: "8px" }}>🧠 AI Reasoning Notes</h3>

//             {record.notes?.length > 0 ? (
//               <ul>
//                 {record.notes.map((n, i) => (
//                   <li key={i} style={{ marginBottom: "6px" }}>
//                     {n}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No notes available.</p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResultDetailsPage;

// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import jsPDF from "jspdf";

// const ResultDetailsPage = () => {
//   const { id } = useParams();

//   const [record, setRecord] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchRecord = async () => {
//       try {
//         const response = await fetch(`https://car-lease-loan-ai-assistant.onrender.com/api/results/${id}`);
//         const data = await response.json();

//         if (!data.success) {
//           setError("Record not found");
//         } else {
//           setRecord(data.record);
//         }
//       } catch (err) {
//         setError("Server error while fetching record");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchRecord();
//   }, [id]);

//   const generateAnalysisPDF = () => {
//     const doc = new jsPDF();

//     doc.setFontSize(16);
//     doc.text("AI Contract Analysis Report", 20, 20);

//     doc.setFontSize(12);
//     const vinText = record.vin || "Not Detected";
//     doc.text(`VIN: ${vinText}`, 20, 35);

//     if (record.vehicleDetails) {
//       doc.text(
//         `Vehicle: ${record.vehicleDetails.year} ${record.vehicleDetails.make} ${record.vehicleDetails.model}`,
//         20,
//         45,
//       );
//     } else {
//       doc.text("Vehicle: Details not available", 20, 45);
//     }

//     if (record.pricingAnalysis) {
//       doc.text(
//         `Contract Price: ${record.pricingAnalysis.contractPrice ? "Rs. " + record.pricingAnalysis.contractPrice : "N/A"}`,
//         20,
//         60,
//       );
//       doc.text(
//         `Market Fair Price: ${record.pricingAnalysis.marketFairPrice ? "Rs. " + record.pricingAnalysis.marketFairPrice : "N/A"}`,
//         20,
//         70,
//       );

//       // Add Score to PDF
//       if (record.pricingAnalysis.score) {
//         doc.text(`Fairness Score: ${record.pricingAnalysis.score}/100`, 20, 80);
//         doc.text(`Verdict: ${record.pricingAnalysis.verdict}`, 20, 90);
//       } else {
//         doc.text(`Verdict: ${record.pricingAnalysis.verdict || "N/A"}`, 20, 80);
//       }

//       doc.text("Recommendation:", 20, 110);

//       const recommendation =
//         record.pricingAnalysis.recommendation ||
//         (record.pricingAnalysis.verdict === "Overpriced"
//           ? "Negotiate or consider alternative vehicles."
//           : "Proceed with the deal.");

//       const splitText = doc.splitTextToSize(recommendation, 170);
//       doc.text(splitText, 20, 120);
//     } else {
//       doc.text("Pricing Analysis: Not available", 20, 60);
//     }

//     doc.save("contract_analysis_report.pdf");
//   };

//   // Helper to determine colors based on score
//   const getScoreColor = (score) => {
//     if (score >= 80) return "text-green-600 border-green-500 bg-green-50";
//     if (score >= 60) return "text-yellow-600 border-yellow-500 bg-yellow-50";
//     return "text-red-600 border-red-500 bg-red-50";
//   };

//   if (isLoading)
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-500">
//         ⏳ Loading Analysis...
//       </div>
//     );
//   if (error)
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-500">
//         ❌ {error}
//       </div>
//     );

//   const price = record.pricingAnalysis;

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 font-sans">
//       <div className="max-w-5xl mx-auto">
//         {/* HEADER & NAV */}
//         <div className="mb-6 flex justify-between items-center">
//           <Link
//             to="/"
//             className="text-gray-500 hover:text-indigo-600 font-medium transition flex items-center"
//           >
//             ⬅ Upload Another
//           </Link>
//           <Link
//             to="/history"
//             className="text-indigo-600 font-medium hover:text-indigo-800"
//           >
//             📜 History
//           </Link>
//         </div>

//         <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
//           📊 Contract Analysis Result
//         </h2>

//         {/* --- TOP SECTION: VEHICLE INFO & FAIRNESS SCORE --- */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           {/* 1. VEHICLE CARD */}
//           <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center">
//             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
//               Vehicle Identity
//             </h3>
//             {record.vehicleDetails ? (
//               <div>
//                 <div className="text-4xl font-bold text-gray-900 mb-1">
//                   {record.vehicleDetails.year} {record.vehicleDetails.make}{" "}
//                   {record.vehicleDetails.model}
//                 </div>
//                 <div className="text-lg text-gray-600 font-medium">
//                   {record.vehicleDetails.trim}{" "}
//                   {record.vehicleDetails.bodyClass
//                     ? `• ${record.vehicleDetails.bodyClass}`
//                     : ""}
//                 </div>
//                 <div className="mt-4 inline-flex items-center bg-gray-100 text-gray-600 text-sm font-mono px-3 py-1 rounded-md border border-gray-300">
//                   VIN: {record.vin || "Not Detected"}
//                 </div>
//               </div>
//             ) : (
//               <div className="text-gray-500 italic">
//                 Vehicle details could not be extracted from text or VIN.
//               </div>
//             )}
//           </div>

//           {/* 2. FAIRNESS SCORE GAUGE */}
//           {price && (
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
//               <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
//                 Fairness Score
//               </div>

//               <div
//                 className={`relative w-32 h-32 rounded-full border-8 flex items-center justify-center ${getScoreColor(price.score).split(" ")[1]} bg-white`}
//               >
//                 <div>
//                   <span
//                     className={`text-4xl font-extrabold ${getScoreColor(price.score).split(" ")[0]}`}
//                   >
//                     {price.score}
//                   </span>
//                   <span className="text-gray-400 text-xs block font-medium">
//                     / 100
//                   </span>
//                 </div>
//               </div>

//               <div
//                 className={`mt-4 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getScoreColor(price.score)}`}
//               >
//                 {price.verdict}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* --- PRICE COMPARISON & RECOMMENDATION --- */}
//         {price && (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
//             <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
//               💰 Price Analysis
//             </h3>

//             {/* PROGRESS BARS */}
//             <div className="space-y-8 mb-8">
//               {/* Market Price Bar */}
//               <div>
//                 <div className="flex justify-between text-sm mb-2">
//                   <span className="font-semibold text-gray-600">
//                     Market Fair Value
//                   </span>
//                   <span className="font-bold text-gray-900">
//                     ₹{price.marketFairPrice?.toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-100 rounded-full h-3">
//                   <div
//                     className="bg-blue-500 h-3 rounded-full shadow-lg shadow-blue-500/30"
//                     style={{ width: "70%" }}
//                   ></div>
//                 </div>
//               </div>

//               {/* Contract Price Bar */}
//               <div>
//                 <div className="flex justify-between text-sm mb-2">
//                   <span className="font-semibold text-gray-600">
//                     Contract Price
//                   </span>
//                   <span
//                     className={`font-bold ${price.difference > 0 ? "text-red-600" : "text-green-600"}`}
//                   >
//                     ₹{price.contractPrice?.toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-100 rounded-full h-3 relative">
//                   {/* Calculate width percentage relative to Market Price (capped at 100%) */}
//                   <div
//                     className={`h-3 rounded-full shadow-lg ${price.difference > 0 ? "bg-red-500 shadow-red-500/30" : "bg-green-500 shadow-green-500/30"}`}
//                     style={{
//                       width: `${Math.min((price.contractPrice / price.marketFairPrice) * 70, 100)}%`,
//                     }}
//                   ></div>
//                 </div>
//                 <p className="text-right text-xs mt-2 font-medium text-gray-500">
//                   {price.difference > 0
//                     ? `⚠️ Overpriced by ₹${price.difference.toLocaleString()}`
//                     : `✅ Underpriced by ₹${Math.abs(price.difference).toLocaleString()}`}
//                 </p>
//               </div>
//             </div>

//             {/* RECOMMENDATION BOX */}
//             <div
//               className={`p-6 rounded-xl border-l-4 ${price.score >= 60 ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"}`}
//             >
//               <h4 className="font-bold text-gray-900 mb-2 text-lg">
//                 💡 AI Recommendation
//               </h4>
//               <p className="text-gray-700 leading-relaxed text-sm md:text-base">
//                 {price.recommendation}
//               </p>

//               {/* REASONS LIST */}
//               {price.scoreReasons && price.scoreReasons.length > 0 && (
//                 <div className="mt-4 pt-4 border-t border-gray-200/60">
//                   <p className="text-xs font-bold text-gray-500 uppercase mb-2">
//                     Key Factors:
//                   </p>
//                   <ul className="space-y-1">
//                     {price.scoreReasons.map((reason, idx) => (
//                       <li
//                         key={idx}
//                         className="flex items-start text-sm text-gray-700"
//                       >
//                         <span className="mr-2 mt-1 block w-1.5 h-1.5 rounded-full bg-gray-400"></span>
//                         {reason}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* --- RAW EXTRACTED DATA (GRID) --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           {/* LEFT: Financials */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
//               Loan Details
//             </h3>
//             <div className="space-y-4">
//               <div className="flex justify-between border-b border-gray-100 pb-2">
//                 <span className="text-gray-500 text-sm">Loan Amount</span>
//                 <span className="font-semibold text-gray-900">
//                   ₹{record.fields?.loan_amount?.toLocaleString() || "N/A"}
//                 </span>
//               </div>
//               <div className="flex justify-between border-b border-gray-100 pb-2">
//                 <span className="text-gray-500 text-sm">Interest Rate</span>
//                 <span className="font-semibold text-gray-900">
//                   {record.fields?.interest_rate
//                     ? record.fields.interest_rate + "%"
//                     : "N/A"}
//                 </span>
//               </div>
//               <div className="flex justify-between border-b border-gray-100 pb-2">
//                 <span className="text-gray-500 text-sm">Tenure</span>
//                 <span className="font-semibold text-gray-900">
//                   {record.fields?.tenure_months
//                     ? record.fields.tenure_months + " months"
//                     : "N/A"}
//                 </span>
//               </div>
//               <div className="flex justify-between pt-1">
//                 <span className="text-gray-500 text-sm">Monthly EMI</span>
//                 <span className="font-semibold text-gray-900">
//                   ₹{record.fields?.emi?.toLocaleString() || "N/A"}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT: AI Context */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
//             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
//               Metadata
//             </h3>
//             <div className="space-y-4 flex-1">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-500 text-sm">Confidence Score</span>
//                 <span
//                   className={`px-2 py-1 rounded text-xs font-bold ${
//                     record.confidence >= 0.7
//                       ? "bg-green-100 text-green-700"
//                       : "bg-yellow-100 text-yellow-700"
//                   }`}
//                 >
//                   {(record.confidence * 100).toFixed(1)}%
//                 </span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-500 text-sm">File Name</span>
//                 <span className="text-xs text-gray-700 font-mono truncate max-w-[180px]">
//                   {record.fileName}
//                 </span>
//               </div>
//               <div className="bg-gray-50 p-3 rounded-lg mt-2 h-full">
//                 <p className="text-xs text-gray-400 uppercase mb-2 font-bold">
//                   Extraction Notes
//                 </p>
//                 {record.notes?.length > 0 ? (
//                   <ul className="text-xs text-gray-600 space-y-1">
//                     {record.notes.slice(0, 3).map((n, i) => (
//                       <li key={i}>• {n}</li>
//                     ))}
//                     {record.notes.length > 3 && (
//                       <li>...and {record.notes.length - 3} more</li>
//                     )}
//                   </ul>
//                 ) : (
//                   <span className="text-xs text-gray-400">
//                     No notes available.
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* --- RAW TEXT DROPDOWN --- */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-10">
//           <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
//             <h3 className="text-xs font-bold text-gray-500 uppercase">
//               Raw OCR Text
//             </h3>
//           </div>
//           <div className="p-6 bg-gray-50/50">
//             <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono leading-relaxed max-h-60 overflow-y-auto">
//               {record.rawText}
//             </pre>
//           </div>
//         </div>

//         {/* ACTIONS */}
//         <div className="flex justify-center pb-12">
//           <button
//             onClick={generateAnalysisPDF}
//             className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition shadow-md font-medium"
//           >
//             <span>📄</span> Download Full Analysis PDF
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResultDetailsPage;

// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import jsPDF from "jspdf";

// const ResultDetailsPage = () => {
//   const { id } = useParams();

//   const [record, setRecord] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchRecord = async () => {
//       try {
//         const response = await fetch(`https://car-lease-loan-ai-assistant.onrender.com/api/results/${id}`);
//         const data = await response.json();

//         if (!data.success) {
//           setError("Record not found");
//         } else {
//           setRecord(data.record);
//         }
//       } catch (err) {
//         setError("Server error while fetching record");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchRecord();
//   }, [id]);

//   const generateAnalysisPDF = () => {
//     if (!record) return;

//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text("AI Contract Analysis Report", 20, 20);

//     doc.setFontSize(12);
//     const vinText = record.vin || "Not Detected";
//     doc.text(`VIN: ${vinText}`, 20, 35);

//     if (record.vehicleDetails) {
//       doc.text(
//         `Vehicle: ${record.vehicleDetails.year} ${record.vehicleDetails.make} ${record.vehicleDetails.model}`,
//         20,
//         45,
//       );
//     } else {
//       doc.text("Vehicle: Details not available", 20, 45);
//     }

//     if (record.pricingAnalysis) {
//       doc.text(
//         `Contract Price: ${record.pricingAnalysis.contractPrice ? "Rs. " + record.pricingAnalysis.contractPrice : "N/A"}`,
//         20,
//         60,
//       );
//       doc.text(
//         `Market Fair Price: ${record.pricingAnalysis.marketFairPrice ? "Rs. " + record.pricingAnalysis.marketFairPrice : "N/A"}`,
//         20,
//         70,
//       );
//       doc.text(`Verdict: ${record.pricingAnalysis.verdict || "N/A"}`, 20, 80);

//       doc.text("Recommendation:", 20, 100);
//       const recommendation =
//         record.pricingAnalysis.recommendation ||
//         (record.pricingAnalysis.verdict === "Overpriced"
//           ? "Negotiate price."
//           : "Proceed.");

//       const splitText = doc.splitTextToSize(recommendation, 170);
//       doc.text(splitText, 20, 110);
//     }

//     doc.save("contract_analysis_report.pdf");
//   };

//   if (isLoading)
//     return (
//       <div style={{ padding: "40px", textAlign: "center" }}>⏳ Loading...</div>
//     );
//   if (error)
//     return (
//       <div style={{ padding: "40px", textAlign: "center", color: "red" }}>
//         ❌ {error}
//       </div>
//     );

//   return (
//     <div
//       style={{
//         padding: "20px",
//         maxWidth: "900px",
//         margin: "0 auto",
//         fontFamily: "sans-serif",
//       }}
//     >
//       {/* NAVIGATION */}
//       <div
//         style={{
//           marginBottom: "20px",
//           display: "flex",
//           justifyContent: "space-between",
//         }}
//       >
//         <Link
//           to="/"
//           style={{
//             textDecoration: "none",
//             color: "#2563eb",
//             fontWeight: "bold",
//           }}
//         >
//           ⬅ Back to Upload
//         </Link>
//         <Link
//           to="/history"
//           style={{ textDecoration: "none", color: "#4b5563" }}
//         >
//           📜 History
//         </Link>
//       </div>

//       <h2 style={{ marginBottom: "20px", color: "#111827" }}>
//         📄 OCR Analysis Results
//       </h2>

//       {record && (
//         <div style={{ display: "grid", gap: "20px" }}>
//           {/* 1. FILE SUMMARY CARD */}
//           <div style={cardStyle}>
//             <h3 style={headerStyle}>📁 File Summary</h3>
//             <p>
//               <strong>File:</strong> {record.fileName || "Untitled"}
//             </p>
//             <p>
//               <strong>Uploaded:</strong>{" "}
//               {new Date(record.uploadedAt).toLocaleString()}
//             </p>
//             <p>
//               <strong>Confidence:</strong>{" "}
//               <span
//                 style={{
//                   color:
//                     record.confidence >= 0.7
//                       ? "#16a34a"
//                       : record.confidence >= 0.4
//                         ? "#ca8a04"
//                         : "#dc2626",
//                   fontWeight: "bold",
//                 }}
//               >
//                 {(record.confidence * 100).toFixed(1)}%
//               </span>
//             </p>
//           </div>

//           {/* 2. EXTRACTED FIELDS CARD */}
//           <div style={cardStyle}>
//             <h3 style={headerStyle}>📊 Extracted Data</h3>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: "15px",
//               }}
//             >
//               <div>
//                 <strong>Loan Amount:</strong> <br />{" "}
//                 {record.fields?.loan_amount
//                   ? "₹" + record.fields.loan_amount.toLocaleString()
//                   : "N/A"}
//               </div>
//               <div>
//                 <strong>Interest Rate:</strong> <br />{" "}
//                 {record.fields?.interest_rate
//                   ? record.fields.interest_rate + "%"
//                   : "N/A"}
//               </div>
//               <div>
//                 <strong>Tenure:</strong> <br />{" "}
//                 {record.fields?.tenure_months
//                   ? record.fields.tenure_months + " months"
//                   : "N/A"}
//               </div>
//               <div>
//                 <strong>EMI:</strong> <br />{" "}
//                 {record.fields?.emi
//                   ? "₹" + record.fields.emi.toLocaleString()
//                   : "N/A"}
//               </div>
//             </div>
//           </div>

//           {/* 3. VEHICLE DETAILS CARD */}
//           {record.vehicleDetails && (
//             <div style={{ ...cardStyle, backgroundColor: "#f8fafc" }}>
//               <h3 style={headerStyle}>🚗 Vehicle Details</h3>
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gap: "10px",
//                 }}
//               >
//                 <div>
//                   <strong>Year:</strong> {record.vehicleDetails.year}
//                 </div>
//                 <div>
//                   <strong>Make:</strong> {record.vehicleDetails.make}
//                 </div>
//                 <div>
//                   <strong>Model:</strong> {record.vehicleDetails.model}
//                 </div>
//                 <div>
//                   <strong>Trim:</strong> {record.vehicleDetails.trim || "N/A"}
//                 </div>
//                 <div style={{ gridColumn: "span 2" }}>
//                   <strong>VIN:</strong> {record.vin}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* 4. MARKET PRICE & FAIRNESS CARD */}
//           {record.pricingAnalysis && record.pricingAnalysis.contractPrice && (
//             <div
//               style={{
//                 ...cardStyle,
//                 backgroundColor: "#ecfeff",
//                 borderColor: "#a5f3fc",
//               }}
//             >
//               <h3 style={{ ...headerStyle, color: "#0e7490" }}>
//                 💰 Market Fairness Analysis
//               </h3>

//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gap: "15px",
//                   marginBottom: "15px",
//                 }}
//               >
//                 <div>
//                   <span style={{ fontSize: "12px", color: "#6b7280" }}>
//                     Contract Price
//                   </span>
//                   <div style={{ fontSize: "18px", fontWeight: "bold" }}>
//                     ₹{record.pricingAnalysis.contractPrice.toLocaleString()}
//                   </div>
//                 </div>
//                 <div>
//                   <span style={{ fontSize: "12px", color: "#6b7280" }}>
//                     Market Fair Price
//                   </span>
//                   <div style={{ fontSize: "18px", fontWeight: "bold" }}>
//                     ₹{record.pricingAnalysis.marketFairPrice?.toLocaleString()}
//                   </div>
//                 </div>
//               </div>

//               <div
//                 style={{
//                   padding: "10px",
//                   backgroundColor: "white",
//                   borderRadius: "8px",
//                   border: "1px solid #cffafe",
//                 }}
//               >
//                 <p style={{ margin: "0 0 5px 0" }}>
//                   <strong>Verdict:</strong>
//                   <span
//                     style={{
//                       color: record.pricingAnalysis.verdict?.includes("Over")
//                         ? "#dc2626"
//                         : "#16a34a",
//                       fontWeight: "bold",
//                       marginLeft: "6px",
//                     }}
//                   >
//                     {record.pricingAnalysis.verdict || "Fair"}
//                   </span>
//                 </p>
//                 <p style={{ margin: 0, fontSize: "14px", color: "#374151" }}>
//                   {record.pricingAnalysis.recommendation}
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* 5. RAW TEXT & NOTES */}
//           <div style={cardStyle}>
//             <h3 style={headerStyle}>📝 Raw OCR Text</h3>
//             <div
//               style={{
//                 maxHeight: "150px",
//                 overflowY: "auto",
//                 backgroundColor: "#f3f4f6",
//                 padding: "10px",
//                 borderRadius: "6px",
//                 fontSize: "12px",
//                 fontFamily: "monospace",
//               }}
//             >
//               {record.rawText}
//             </div>

//             {record.notes?.length > 0 && (
//               <div style={{ marginTop: "15px" }}>
//                 <strong>Debug Notes:</strong>
//                 <ul
//                   style={{
//                     fontSize: "12px",
//                     color: "#6b7280",
//                     paddingLeft: "20px",
//                   }}
//                 >
//                   {record.notes.map((n, i) => (
//                     <li key={i}>{n}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>

//           <button
//             onClick={generateAnalysisPDF}
//             style={{
//               padding: "14px",
//               backgroundColor: "#2563eb",
//               color: "white",
//               border: "none",
//               borderRadius: "8px",
//               fontWeight: "bold",
//               cursor: "pointer",
//               fontSize: "16px",
//             }}
//           >
//             📄 Download Analysis PDF
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// // Simple styles objects to keep JSX clean
// const cardStyle = {
//   padding: "20px",
//   borderRadius: "12px",
//   backgroundColor: "white",
//   border: "1px solid #e5e7eb",
//   boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
// };

// const headerStyle = {
//   marginTop: 0,
//   marginBottom: "15px",
//   fontSize: "18px",
//   color: "#111827",
//   borderBottom: "1px solid #f3f4f6",
//   paddingBottom: "10px",
// };

// export default ResultDetailsPage;

// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import jsPDF from "jspdf";

// const ResultDetailsPage = () => {
//   const { id } = useParams();

//   const [record, setRecord] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchRecord = async () => {
//       try {
//         const response = await fetch(`https://car-lease-loan-ai-assistant.onrender.com/api/results/${id}`);
//         const data = await response.json();

//         if (!data.success) {
//           setError("Record not found");
//         } else {
//           setRecord(data.record);
//         }
//       } catch (err) {
//         setError("Server error while fetching record");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchRecord();
//   }, [id]);

//   const generateAnalysisPDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text("AI Contract Analysis Report", 20, 20);

//     doc.setFontSize(12);
//     const vinText = record.vin || "Not Detected";
//     doc.text(`VIN: ${vinText}`, 20, 35);

//     if (record.vehicleDetails) {
//       doc.text(
//         `Vehicle: ${record.vehicleDetails.year} ${record.vehicleDetails.make} ${record.vehicleDetails.model}`,
//         20,
//         45,
//       );
//     }

//     if (record.pricingAnalysis) {
//       doc.text(
//         `Contract Price: ${record.pricingAnalysis.contractPrice ? "Rs. " + record.pricingAnalysis.contractPrice : "N/A"}`,
//         20,
//         60,
//       );
//       doc.text(
//         `Market Fair Price: ${record.pricingAnalysis.marketFairPrice ? "Rs. " + record.pricingAnalysis.marketFairPrice : "N/A"}`,
//         20,
//         70,
//       );

//       if (record.pricingAnalysis.score) {
//         doc.text(`Fairness Score: ${record.pricingAnalysis.score}/100`, 20, 80);
//       }
//       doc.text(`Verdict: ${record.pricingAnalysis.verdict || "N/A"}`, 20, 90);

//       const recommendation =
//         record.pricingAnalysis.recommendation || "Proceed with caution.";
//       const splitText = doc.splitTextToSize(recommendation, 170);
//       doc.text("Recommendation:", 20, 110);
//       doc.text(splitText, 20, 120);
//     }

//     doc.save("contract_analysis_report.pdf");
//   };

//   // Helper for colors
//   const getScoreColor = (score) => {
//     if (!score) return "text-gray-400 border-gray-300 bg-gray-50";
//     if (score >= 80) return "text-green-600 border-green-500 bg-green-50";
//     if (score >= 60) return "text-yellow-600 border-yellow-500 bg-yellow-50";
//     return "text-red-600 border-red-500 bg-red-50";
//   };

//   if (isLoading)
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-500">
//         ⏳ Loading Analysis...
//       </div>
//     );
//   if (error)
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-500">
//         ❌ {error}
//       </div>
//     );

//   const price = record.pricingAnalysis;
//   const vehicle = record.vehicleDetails;

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 font-sans">
//       <div className="max-w-5xl mx-auto">
//         {/* HEADER & NAV */}
//         <div className="mb-6 flex justify-between items-center">
//           <Link
//             to="/"
//             className="text-gray-500 hover:text-indigo-600 font-medium transition flex items-center"
//           >
//             ⬅ Upload Another
//           </Link>
//           <Link
//             to="/history"
//             className="text-indigo-600 font-medium hover:text-indigo-800"
//           >
//             📜 History
//           </Link>
//         </div>

//         <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
//           📊 Contract Analysis Result
//         </h2>

//         {/* --- TOP ROW: VEHICLE & GAUGE --- */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           {/* 1. VEHICLE IDENTITY CARD */}
//           <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center">
//             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
//               Vehicle Identity
//             </h3>
//             {vehicle ? (
//               <div>
//                 <div className="text-4xl font-bold text-gray-900 mb-1">
//                   {vehicle.year} {vehicle.make} {vehicle.model}
//                 </div>
//                 <div className="text-lg text-gray-600 font-medium">
//                   {vehicle.trim}{" "}
//                   {vehicle.bodyClass ? `• ${vehicle.bodyClass}` : ""}
//                 </div>
//                 <div className="mt-4 inline-flex items-center bg-gray-100 text-gray-600 text-sm font-mono px-3 py-1 rounded-md border border-gray-300">
//                   VIN: {record.vin || "Not Detected"}
//                 </div>
//               </div>
//             ) : (
//               <div className="text-gray-500 italic">
//                 Vehicle details could not be extracted.
//               </div>
//             )}
//           </div>

//           {/* 2. FAIRNESS SCORE GAUGE */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
//             <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
//               Fairness Score
//             </div>

//             {/* Circular Gauge Visual */}
//             <div
//               className={`relative w-32 h-32 rounded-full border-8 flex items-center justify-center ${getScoreColor(price?.score).split(" ")[1]} bg-white`}
//             >
//               <div>
//                 <span
//                   className={`text-4xl font-extrabold ${getScoreColor(price?.score).split(" ")[0]}`}
//                 >
//                   {price?.score ?? "--"}
//                 </span>
//                 <span className="text-gray-400 text-xs block font-medium">
//                   / 100
//                 </span>
//               </div>
//             </div>

//             <div
//               className={`mt-4 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getScoreColor(price?.score)}`}
//             >
//               {price?.verdict || "Analysis Pending"}
//             </div>
//           </div>
//         </div>

//         {/* --- PRICE ANALYSIS BARS --- */}
//         {price && (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
//             <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
//               💰 Price Analysis
//             </h3>

//             <div className="space-y-8 mb-8">
//               {/* Market Price Bar */}
//               <div>
//                 <div className="flex justify-between text-sm mb-2">
//                   <span className="font-semibold text-gray-600">
//                     Market Fair Value
//                   </span>
//                   <span className="font-bold text-gray-900">
//                     {price.marketFairPrice
//                       ? `₹${price.marketFairPrice.toLocaleString()}`
//                       : "N/A"}
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-100 rounded-full h-3">
//                   <div
//                     className="bg-blue-500 h-3 rounded-full shadow-lg shadow-blue-500/30"
//                     style={{ width: "75%" }}
//                   ></div>
//                 </div>
//               </div>

//               {/* Contract Price Bar */}
//               <div>
//                 <div className="flex justify-between text-sm mb-2">
//                   <span className="font-semibold text-gray-600">
//                     Contract Price
//                   </span>
//                   <span
//                     className={`font-bold ${price.difference > 0 ? "text-red-600" : "text-green-600"}`}
//                   >
//                     {price.contractPrice
//                       ? `₹${price.contractPrice.toLocaleString()}`
//                       : "N/A"}
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-100 rounded-full h-3 relative">
//                   <div
//                     className={`h-3 rounded-full shadow-lg ${price.difference > 0 ? "bg-red-500 shadow-red-500/30" : "bg-green-500 shadow-green-500/30"}`}
//                     style={{
//                       // Simple logic to show relative bar width
//                       width:
//                         price.marketFairPrice && price.contractPrice
//                           ? `${Math.min((price.contractPrice / price.marketFairPrice) * 75, 100)}%`
//                           : "0%",
//                     }}
//                   ></div>
//                 </div>
//                 <p className="text-right text-xs mt-2 font-medium text-gray-500">
//                   {price.difference > 0
//                     ? `⚠️ Overpriced by ₹${price.difference.toLocaleString()}`
//                     : `✅ Underpriced by ₹${Math.abs(price.difference).toLocaleString()}`}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* --- LOAN DETAILS & METADATA --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           {/* LOAN DETAILS */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
//               Loan Details
//             </h3>
//             <div className="space-y-4 text-sm">
//               <div className="flex justify-between border-b pb-2">
//                 <span className="text-gray-500">Loan Amount</span>
//                 <span className="font-semibold text-gray-900">
//                   ₹{record.fields?.loan_amount?.toLocaleString() || "N/A"}
//                 </span>
//               </div>
//               <div className="flex justify-between border-b pb-2">
//                 <span className="text-gray-500">Interest Rate</span>
//                 <span className="font-semibold text-gray-900">
//                   {record.fields?.interest_rate
//                     ? record.fields.interest_rate + "%"
//                     : "N/A"}
//                 </span>
//               </div>
//               <div className="flex justify-between border-b pb-2">
//                 <span className="text-gray-500">Tenure</span>
//                 <span className="font-semibold text-gray-900">
//                   {record.fields?.tenure_months
//                     ? record.fields.tenure_months + " months"
//                     : "N/A"}
//                 </span>
//               </div>
//               <div className="flex justify-between pt-1">
//                 <span className="text-gray-500">Monthly EMI</span>
//                 <span className="font-semibold text-gray-900">
//                   ₹{record.fields?.emi?.toLocaleString() || "N/A"}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* METADATA */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
//             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
//               Metadata
//             </h3>
//             <div className="space-y-4 flex-1">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-500 text-sm">Confidence Score</span>
//                 <span
//                   className={`px-2 py-1 rounded text-xs font-bold ${
//                     record.confidence >= 0.7
//                       ? "bg-green-100 text-green-700"
//                       : "bg-yellow-100 text-yellow-700"
//                   }`}
//                 >
//                   {(record.confidence * 100).toFixed(1)}%
//                 </span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-500 text-sm">File Name</span>
//                 <span className="text-xs text-gray-700 font-mono truncate max-w-[180px]">
//                   {record.fileName}
//                 </span>
//               </div>

//               <div className="bg-gray-50 p-3 rounded-lg mt-2 h-full">
//                 <p className="text-xs text-gray-400 uppercase mb-2 font-bold">
//                   Extraction Notes
//                 </p>
//                 {record.notes?.length > 0 ? (
//                   <ul className="text-xs text-gray-600 space-y-1">
//                     {record.notes.slice(0, 3).map((n, i) => (
//                       <li key={i}>• {n}</li>
//                     ))}
//                     {record.notes.length > 3 && (
//                       <li>...and {record.notes.length - 3} more</li>
//                     )}
//                   </ul>
//                 ) : (
//                   <span className="text-xs text-gray-400">
//                     No notes available.
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* --- RAW OCR TEXT --- */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-10">
//           <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
//             <h3 className="text-xs font-bold text-gray-500 uppercase">
//               Raw OCR Text
//             </h3>
//           </div>
//           <div className="p-6 bg-gray-50/50">
//             <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono leading-relaxed max-h-60 overflow-y-auto">
//               {record.rawText}
//             </pre>
//           </div>
//         </div>

//         {/* ACTIONS */}
//         <div className="flex justify-center pb-12">
//           <button
//             onClick={generateAnalysisPDF}
//             className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition shadow-md font-medium"
//           >
//             <span>📄</span> Download Full Analysis PDF
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResultDetailsPage;

// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import jsPDF from "jspdf";

// const ResultDetailsPage = () => {
//   const { id } = useParams();
//   const [record, setRecord] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchRecord = async () => {
//       try {
//         const response = await fetch(`https://car-lease-loan-ai-assistant.onrender.com/api/results/${id}`);
//         const data = await response.json();
//         if (!data.success) {
//           setError("Record not found");
//         } else {
//           setRecord(data.record);
//         }
//       } catch (err) {
//         setError("Server error while fetching record");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchRecord();
//   }, [id]);

//   const generateAnalysisPDF = () => {
//     if (!record) return;
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text("Contract Analysis Report", 20, 20);
//     // (Add your PDF logic here as before)
//     doc.save("report.pdf");
//   };

//   const getScoreColor = (score) => {
//     if (!score && score !== 0) return "#9ca3af"; // Gray
//     if (score >= 80) return "#16a34a"; // Green
//     if (score >= 60) return "#ca8a04"; // Yellow
//     return "#dc2626"; // Red
//   };

//   if (isLoading) return <div className="p-10 text-center">⏳ Loading...</div>;
//   if (error)
//     return <div className="p-10 text-center text-red-600">❌ {error}</div>;

//   const price = record.pricingAnalysis;
//   const vehicle = record.vehicleDetails;

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 font-sans">
//       <div className="max-w-5xl mx-auto">
//         {/* NAV */}
//         <div className="mb-6 flex justify-between">
//           <Link to="/" className="text-blue-600 font-bold">
//             ⬅ Upload Another
//           </Link>
//           <Link to="/history" className="text-gray-600 font-bold">
//             📜 History
//           </Link>
//         </div>

//         <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
//           📊 Contract Analysis Result
//         </h2>

//         {/* --- TOP ROW --- */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           {/* VEHICLE INFO */}
//           <div className="md:col-span-2 bg-white rounded-xl shadow p-6 border border-gray-200">
//             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
//               Vehicle Identity
//             </h3>
//             {vehicle ? (
//               <div>
//                 <div className="text-4xl font-bold text-gray-900 mb-1">
//                   {vehicle.year} {vehicle.make} {vehicle.model}
//                 </div>
//                 <div className="text-lg text-gray-600 font-medium">
//                   {vehicle.trim}
//                 </div>
//                 <div className="mt-4 inline-block bg-gray-100 text-gray-600 text-sm font-mono px-3 py-1 rounded border">
//                   VIN: {record.vin || "Not Detected"}
//                 </div>
//               </div>
//             ) : (
//               <div className="text-gray-500 italic">
//                 Vehicle details missing.
//               </div>
//             )}
//           </div>

//           {/* FAIRNESS GAUGE */}
//           <div className="bg-white rounded-xl shadow p-6 border border-gray-200 flex flex-col items-center justify-center text-center">
//             <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
//               Fairness Score
//             </div>

//             <div
//               style={{
//                 width: "120px",
//                 height: "120px",
//                 borderRadius: "50%",
//                 border: `8px solid ${getScoreColor(price?.score)}`,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexDirection: "column",
//               }}
//             >
//               <span
//                 style={{
//                   fontSize: "36px",
//                   fontWeight: "bold",
//                   color: getScoreColor(price?.score),
//                 }}
//               >
//                 {price?.score ?? "--"}
//               </span>
//               <span className="text-gray-400 text-xs">/ 100</span>
//             </div>

//             <div
//               style={{
//                 marginTop: "15px",
//                 padding: "4px 12px",
//                 borderRadius: "20px",
//                 border: `1px solid ${getScoreColor(price?.score)}`,
//                 color: getScoreColor(price?.score),
//                 fontWeight: "bold",
//                 fontSize: "12px",
//                 textTransform: "uppercase",
//               }}
//             >
//               {price?.verdict || "Pending"}
//             </div>
//           </div>
//         </div>

//         {/* --- PRICING BARS (Inline Styles Force Visibility) --- */}
//         {price && (
//           <div className="bg-white rounded-xl shadow border border-gray-200 p-8 mb-8">
//             <h3 className="text-xl font-bold text-gray-900 mb-6">
//               💰 Price Analysis
//             </h3>

//             {/* Market Price Bar */}
//             <div className="mb-6">
//               <div className="flex justify-between text-sm mb-2">
//                 <span className="font-semibold text-gray-600">
//                   Market Fair Value
//                 </span>
//                 <span className="font-bold text-gray-900">
//                   ₹{price.marketFairPrice?.toLocaleString()}
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-4">
//                 <div
//                   className="h-4 rounded-full"
//                   style={{ backgroundColor: "#3b82f6", width: "70%" }}
//                 ></div>
//               </div>
//             </div>

//             {/* Contract Price Bar */}
//             <div className="mb-6">
//               <div className="flex justify-between text-sm mb-2">
//                 <span className="font-semibold text-gray-600">
//                   Contract Price
//                 </span>
//                 <span
//                   className={`font-bold ${price.difference > 0 ? "text-red-600" : "text-green-600"}`}
//                 >
//                   ₹{price.contractPrice?.toLocaleString()}
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-4">
//                 <div
//                   className="h-4 rounded-full"
//                   style={{
//                     backgroundColor:
//                       price.difference > 0 ? "#ef4444" : "#22c55e",
//                     width: price.marketFairPrice
//                       ? `${Math.min((price.contractPrice / price.marketFairPrice) * 70, 100)}%`
//                       : "0%",
//                   }}
//                 ></div>
//               </div>
//               <p className="text-right text-xs mt-2 font-bold text-gray-500">
//                 {price.difference > 0
//                   ? `⚠️ Overpriced by ₹${price.difference.toLocaleString()}`
//                   : `✅ Underpriced by ₹${Math.abs(price.difference).toLocaleString()}`}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* --- RAW DATA & NOTES --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
//             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
//               Loan Details
//             </h3>
//             <div className="space-y-4 text-sm">
//               <div className="flex justify-between border-b pb-2">
//                 <span>Loan Amount</span>
//                 <span className="font-bold">
//                   ₹{record.fields?.loan_amount?.toLocaleString()}
//                 </span>
//               </div>
//               <div className="flex justify-between border-b pb-2">
//                 <span>Interest Rate</span>
//                 <span className="font-bold">
//                   {record.fields?.interest_rate}%
//                 </span>
//               </div>
//               <div className="flex justify-between border-b pb-2">
//                 <span>Tenure</span>
//                 <span className="font-bold">
//                   {record.fields?.tenure_months} months
//                 </span>
//               </div>
//               <div className="flex justify-between pt-1">
//                 <span>Monthly EMI</span>
//                 <span className="font-bold">
//                   ₹{record.fields?.emi?.toLocaleString()}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
//             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
//               System Notes
//             </h3>
//             <div className="bg-gray-100 p-3 rounded h-40 overflow-y-auto text-xs font-mono">
//               {record.notes?.map((n, i) => (
//                 <div key={i}>• {n}</div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResultDetailsPage;

// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import jsPDF from "jspdf";

// const ResultDetailsPage = () => {
//   const { id } = useParams();
//   const [record, setRecord] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchRecord = async () => {
//       try {
//         const response = await fetch(`https://car-lease-loan-ai-assistant.onrender.com/api/results/${id}`);
//         const data = await response.json();

//         if (!data.success) {
//           setError("Record not found");
//         } else {
//           setRecord(data.record);
//         }
//       } catch (err) {
//         setError("Server error while fetching record");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchRecord();
//   }, [id]);

//   const generateAnalysisPDF = () => {
//     if (!record) return;
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text("Contract Analysis Report", 20, 20);

//     doc.setFontSize(12);
//     doc.text(`File: ${record.fileName}`, 20, 30);

//     if (record.fields) {
//       doc.text(`Loan Amount: ${record.fields.loan_amount || "N/A"}`, 20, 40);
//       doc.text(
//         `Interest Rate: ${record.fields.interest_rate || "N/A"}%`,
//         20,
//         50,
//       );
//     }

//     if (record.pricingAnalysis) {
//       doc.text(
//         `Market Value: ${record.pricingAnalysis.marketFairPrice || "N/A"}`,
//         20,
//         70,
//       );
//       doc.text(`Verdict: ${record.pricingAnalysis.verdict || "N/A"}`, 20, 80);
//     }

//     doc.save("analysis_report.pdf");
//   };

//   // Safe Helper for Color Logic
//   const getScoreColor = (score) => {
//     if (score === undefined || score === null) return "#9ca3af"; // Gray
//     if (score >= 80) return "#16a34a"; // Green
//     if (score >= 60) return "#ca8a04"; // Yellow
//     return "#dc2626"; // Red
//   };

//   if (isLoading)
//     return (
//       <div className="p-10 text-center text-gray-500">⏳ Loading data...</div>
//     );
//   if (error)
//     return <div className="p-10 text-center text-red-600">❌ {error}</div>;
//   if (!record) return null;

//   const price = record.pricingAnalysis || {};
//   const vehicle = record.vehicleDetails || {};
//   const fields = record.fields || {};

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 font-sans">
//       <div className="max-w-4xl mx-auto">
//         {/* NAV */}
//         <div className="mb-6 flex justify-between items-center">
//           <Link to="/" className="text-blue-600 font-bold hover:underline">
//             ⬅ Back to Upload
//           </Link>
//           <Link
//             to="/history"
//             className="text-gray-600 font-medium hover:underline"
//           >
//             📜 History
//           </Link>
//         </div>

//         <h2 className="text-2xl font-bold text-gray-900 mb-6">
//           📊 Contract Analysis Result
//         </h2>

//         {/* --- 1. TOP ROW: VEHICLE & SCORE --- */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           {/* VEHICLE INFO CARD */}
//           <div className="md:col-span-2 bg-white rounded-xl shadow p-6 border border-gray-200">
//             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
//               Vehicle Identity
//             </h3>
//             {vehicle.make ? (
//               <div>
//                 <div className="text-3xl font-bold text-gray-900 mb-1">
//                   {vehicle.year} {vehicle.make} {vehicle.model}
//                 </div>
//                 <div className="text-md text-gray-600 font-medium">
//                   {vehicle.trim} {vehicle.bodyClass}
//                 </div>
//                 <div className="mt-4 inline-block bg-gray-100 text-gray-600 text-sm font-mono px-3 py-1 rounded border">
//                   VIN: {record.vin || "Not Detected"}
//                 </div>
//               </div>
//             ) : (
//               <div className="text-gray-500 italic py-4">
//                 Vehicle details could not be extracted automatically.
//               </div>
//             )}
//           </div>

//           {/* FAIRNESS SCORE CARD */}
//           <div className="bg-white rounded-xl shadow p-6 border border-gray-200 flex flex-col items-center justify-center text-center">
//             <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
//               Fairness Score
//             </div>

//             {/* Simple Circle Gauge */}
//             <div
//               style={{
//                 width: "100px",
//                 height: "100px",
//                 borderRadius: "50%",
//                 border: `6px solid ${getScoreColor(price.score)}`,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexDirection: "column",
//               }}
//             >
//               <span
//                 style={{
//                   fontSize: "28px",
//                   fontWeight: "bold",
//                   color: getScoreColor(price.score),
//                 }}
//               >
//                 {price.score ?? "--"}
//               </span>
//             </div>

//             <div
//               style={{
//                 marginTop: "12px",
//                 color: getScoreColor(price.score),
//                 fontWeight: "bold",
//                 fontSize: "14px",
//                 textTransform: "uppercase",
//               }}
//             >
//               {price.verdict || "Pending"}
//             </div>
//           </div>
//         </div>

//         {/* --- 2. PRICE ANALYSIS (Only show if price exists) --- */}
//         {price.marketFairPrice && (
//           <div className="bg-white rounded-xl shadow border border-gray-200 p-8 mb-8">
//             <h3 className="text-lg font-bold text-gray-900 mb-6">
//               💰 Price Fairness Analysis
//             </h3>

//             {/* Market Price Bar */}
//             <div className="mb-5">
//               <div className="flex justify-between text-sm mb-1">
//                 <span className="text-gray-600">Market Value</span>
//                 <span className="font-bold">
//                   ₹{price.marketFairPrice.toLocaleString()}
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-3">
//                 <div
//                   className="bg-blue-500 h-3 rounded-full"
//                   style={{ width: "70%" }}
//                 ></div>
//               </div>
//             </div>

//             {/* Contract Price Bar */}
//             <div className="mb-2">
//               <div className="flex justify-between text-sm mb-1">
//                 <span className="text-gray-600">Contract Price</span>
//                 <span
//                   className={`font-bold ${price.difference > 0 ? "text-red-600" : "text-green-600"}`}
//                 >
//                   ₹{price.contractPrice?.toLocaleString()}
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-3">
//                 <div
//                   className="h-3 rounded-full"
//                   style={{
//                     backgroundColor:
//                       price.difference > 0 ? "#ef4444" : "#22c55e",
//                     width: `${Math.min((price.contractPrice / price.marketFairPrice) * 70, 100)}%`,
//                   }}
//                 ></div>
//               </div>
//             </div>

//             <p className="text-right text-sm font-bold mt-2 text-gray-500">
//               {price.difference > 0
//                 ? `Overpriced by ₹${price.difference.toLocaleString()}`
//                 : `Underpriced by ₹${Math.abs(price.difference).toLocaleString()}`}
//             </p>
//           </div>
//         )}

//         {/* --- 3. LOAN DETAILS GRID --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
//             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
//               Loan Terms
//             </h3>
//             <div className="space-y-3 text-sm">
//               <div className="flex justify-between border-b pb-2">
//                 <span>Loan Amount</span>
//                 <span className="font-bold">
//                   ₹{fields.loan_amount?.toLocaleString() || "N/A"}
//                 </span>
//               </div>
//               <div className="flex justify-between border-b pb-2">
//                 <span>Interest Rate</span>
//                 <span className="font-bold">
//                   {fields.interest_rate || "N/A"}%
//                 </span>
//               </div>
//               <div className="flex justify-between border-b pb-2">
//                 <span>Tenure</span>
//                 <span className="font-bold">
//                   {fields.tenure_months || "N/A"} months
//                 </span>
//               </div>
//               <div className="flex justify-between pt-1">
//                 <span>EMI</span>
//                 <span className="font-bold">
//                   ₹{fields.emi?.toLocaleString() || "N/A"}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
//             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
//               Raw Text
//             </h3>
//             <div className="bg-gray-100 p-3 rounded h-40 overflow-y-auto text-xs font-mono text-gray-600">
//               {record.rawText}
//             </div>
//           </div>
//         </div>

//         <div className="text-center pb-12">
//           <button
//             onClick={generateAnalysisPDF}
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium shadow-md"
//           >
//             📄 Download Report PDF
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResultDetailsPage;

// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import jsPDF from "jspdf";
// import axios from "axios"; // Ensure axios is installed or use fetch
// import ChatbotWidget from "../components/ChatbotWidget";

// const ResultDetailsPage = () => {
//   const { id } = useParams();
//   const [record, setRecord] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchRecord = async () => {
//       try {
//         // 👇 FIXED: Backend sends data in response.data.data
//         const response = await axios.get(
//           `https://car-lease-loan-ai-assistant.onrender.com/api/results/${id}`,
//         );

//         if (response.data.success) {
//           setRecord(response.data.data); // Matches backend structure
//         } else {
//           setError("Record not found");
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Server error while fetching record");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchRecord();
//   }, [id]);

//   const generateAnalysisPDF = () => {
//     if (!record) return;
//     const doc = new jsPDF();

//     // Header
//     doc.setFontSize(20);
//     doc.setTextColor(40);
//     doc.text("AutoLoan AI - Analysis Report", 20, 20);

//     // File Info
//     doc.setFontSize(12);
//     doc.setTextColor(100);
//     doc.text(`File Name: ${record.fileName}`, 20, 30);
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 36);

//     // Separator
//     doc.setDrawColor(200);
//     doc.line(20, 40, 190, 40);

//     // Financial Details
//     doc.setFontSize(14);
//     doc.setTextColor(0);
//     doc.text("Financial Details", 20, 50);

//     doc.setFontSize(12);
//     doc.setTextColor(60);
//     let y = 60;
//     if (record.fields) {
//       doc.text(`Loan Amount: ${record.fields.loan_amount || "N/A"}`, 20, y);
//       doc.text(
//         `Interest Rate: ${record.fields.interest_rate || "N/A"}`,
//         120,
//         y,
//       );
//       y += 10;
//       doc.text(`Tenure: ${record.fields.tenure_months || "N/A"}`, 20, y);
//       doc.text(`EMI: ${record.fields.monthly_payment || "N/A"}`, 120, y);
//     }

//     // Pricing Analysis
//     if (record.pricingAnalysis) {
//       y += 20;
//       doc.setFontSize(14);
//       doc.setTextColor(0);
//       doc.text("Market Analysis", 20, y);

//       y += 10;
//       doc.setFontSize(12);
//       doc.setTextColor(60);
//       doc.text(
//         `Market Fair Price: Rs ${record.pricingAnalysis.marketFairPrice || "N/A"}`,
//         20,
//         y,
//       );
//       doc.text(
//         `Contract Price: Rs ${record.pricingAnalysis.contractPrice || "N/A"}`,
//         20,
//         y + 10,
//       );
//       doc.text(
//         `Fairness Score: ${record.pricingAnalysis.score}/100`,
//         20,
//         y + 20,
//       );
//       doc.text(`Verdict: ${record.pricingAnalysis.verdict}`, 120, y + 20);

//       // Recommendation
//       if (record.pricingAnalysis.recommendation) {
//         y += 35;
//         doc.setFontSize(11);
//         doc.setTextColor(0);
//         doc.text("AI Recommendation:", 20, y);
//         const splitText = doc.splitTextToSize(
//           record.pricingAnalysis.recommendation,
//           170,
//         );
//         doc.text(splitText, 20, y + 7);
//       }
//     }

//     doc.save(`Analysis_${record.fileName}.pdf`);
//   };

//   // Safe Helper for Color Logic
//   const getScoreColor = (score) => {
//     if (score === undefined || score === null) return "#9ca3af"; // Gray
//     if (score >= 80) return "#16a34a"; // Green
//     if (score >= 60) return "#ca8a04"; // Yellow
//     return "#dc2626"; // Red
//   };

//   if (isLoading)
//     return (
//       <div className="flex h-screen items-center justify-center bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="p-10 text-center text-red-600 font-bold text-xl">
//         ❌ {error}
//       </div>
//     );

//   if (!record) return null;

//   // const price = record.pricingAnalysis || {};
//   // 👇 FIXED LOGIC HERE
//   const price = record.pricingAnalysis || {};
//   if (price.contractPrice && price.marketFairPrice) {
//     price.difference = price.contractPrice - price.marketFairPrice;
//   }
//   const vehicle = record.vehicleDetails || {};
//   const fields = record.fields || {};
//   const hiddenFees = record.hiddenFees || {};

//   return (
//     <div className="min-h-screen dynamic-bg p-6 font-sans">
//       <div className="max-w-5xl mx-auto space-y-8">
//         {/* NAV */}
//         <div className="flex justify-between items-center">
//           <Link
//             to="/"
//             className="text-blue-600 font-bold hover:underline flex items-center"
//           >
//             ⬅ Back to Upload
//           </Link>
//           <div className="flex gap-4">
//             <Link
//               to="/history"
//               className="text-gray-600 font-medium hover:text-gray-900 transition"
//             >
//               📜 History
//             </Link>
//             <button
//               onClick={generateAnalysisPDF}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm transition"
//             >
//               📄 Download Report
//             </button>
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white drop-shadow-sm">
//             Contract Analysis Result
//           </h2>
//           <span className="text-sm text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-md">
//             ID: {id}
//           </span>
//         </div>

//         {/* --- 1. TOP ROW: VEHICLE & SCORE --- */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* VEHICLE INFO CARD */}
//           <div className="md:col-span-2 glass-card p-6 border-l-4 border-blue-500 border-t-0 border-r-0 border-b-0">
//             <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
//               Vehicle Identity
//             </h3>
//             {vehicle.make ? (
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
//                     {vehicle.year} {vehicle.make} {vehicle.model}
//                   </div>
//                   <div className="text-md text-gray-600 font-medium">
//                     {vehicle.trim} {vehicle.bodyClass}
//                   </div>
//                 </div>
//                 <div className="flex flex-col justify-center items-end">
//                   <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">
//                     VIN Detected
//                   </div>
//                   <div className="font-mono text-gray-800 dark:text-gray-200 bg-gray-100/50 dark:bg-gray-800/50 px-3 py-1 rounded mt-1 border border-gray-200/50 dark:border-gray-700/50">
//                     {record.vin || "N/A"}
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="text-gray-500 italic py-4">
//                 Vehicle details could not be extracted automatically.
//               </div>
//             )}
//           </div>

//           {/* FAIRNESS SCORE CARD */}
//           <div className="glass-card p-6 border-none flex flex-col items-center justify-center text-center">
//             <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
//               Fairness Score
//             </div>

//             {/* Simple Circle Gauge */}
//             <div
//               className="relative w-24 h-24 flex items-center justify-center rounded-full border-4 shadow-inner"
//               style={{ borderColor: getScoreColor(price.score) }}
//             >
//               <span
//                 className="text-3xl font-bold"
//                 style={{ color: getScoreColor(price.score) }}
//               >
//                 {price.score ?? "--"}
//               </span>
//             </div>

//             <div
//               className="mt-3 font-bold text-sm uppercase tracking-wide px-3 py-1 rounded-full"
//               style={{
//                 backgroundColor: `${getScoreColor(price.score)}20`, // 20% opacity background
//                 color: getScoreColor(price.score),
//               }}
//             >
//               {price.verdict || "Pending"}
//             </div>
//           </div>
//         </div>

//         {/* --- 2. AI RECOMMENDATION --- */}
//         {price.recommendation && (
//           <div className="glass-card bg-indigo-50/50 dark:bg-indigo-900/30 border-indigo-200/50 dark:border-indigo-800/50 p-6">
//             <h3 className="flex items-center text-indigo-800 dark:text-indigo-300 font-bold mb-2">
//               <span className="text-2xl mr-2">🤖</span> AI Advisor
//               Recommendation
//             </h3>
//             <p className="text-gray-800 dark:text-gray-200 italic leading-relaxed">
//               "{price.recommendation}"
//             </p>
//           </div>
//         )}

//         {/* --- 3. PRICE ANALYSIS (Only show if price exists) --- */}
//         {price.marketFairPrice && (
//           <div className="glass-card p-8 border-none">
//             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
//               💰 Price Fairness Analysis [Image of balance scale icon]
//             </h3>

//             {/* Price Bars Container */}
//             <div className="space-y-6">
//               {/* Market Price Bar */}
//               <div>
//                 <div className="flex justify-between text-sm mb-2">
//                   <span className="text-gray-600 font-medium">
//                     Market Fair Value
//                   </span>
//                   <span className="font-bold text-gray-900">
//                     ₹{price.marketFairPrice.toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
//                   <div className="bg-blue-500 h-full rounded-full w-3/4 opacity-80"></div>
//                 </div>
//               </div>

//               {/* Contract Price Bar */}
//               <div>
//                 <div className="flex justify-between text-sm mb-2">
//                   <span className="text-gray-600 dark:text-gray-300 font-medium">
//                     Your Contract Price
//                   </span>
//                   <span
//                     className={`font-bold ${price.difference > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
//                   >
//                     ₹{price.contractPrice?.toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden relative">
//                   {/* Visualizing the difference */}
//                   <div
//                     className={`h-full rounded-full ${price.difference > 0 ? "bg-red-500" : "bg-green-500"}`}
//                     style={{
//                       width: `${Math.min((price.contractPrice / price.marketFairPrice) * 75, 100)}%`,
//                     }}
//                   ></div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
//               <p
//                 className={`text-sm font-bold px-4 py-2 rounded-lg ${price.difference > 0 ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
//               >
//                 {price.difference > 0
//                   ? `⚠️ Overpriced by ₹${price.difference.toLocaleString()}`
//                   : `✅ Underpriced by ₹${Math.abs(price.difference).toLocaleString()}`}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* --- 4. LOAN DETAILS GRID --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="glass-card p-6 border-none">
//             <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200/50 dark:border-gray-700/50 pb-2 text-gray-900 dark:text-gray-100">
//               Loan Terms
//             </h3>
//             <div className="space-y-4">
//               <DetailRow label="Loan Amount" value={fields.loan_amount} />
//               <DetailRow
//                 label="Interest Rate"
//                 value={fields.interest_rate}
//                 highlight
//               />
//               <DetailRow label="Tenure" value={fields.tenure_months} />
//               <DetailRow
//                 label="Monthly Payment"
//                 value={fields.monthly_payment}
//               />
//               <DetailRow label="Down Payment" value={fields.down_payment} />
//             </div>
//           </div>

//           <div className="glass-card p-6 border-none">
//             <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200/50 dark:border-gray-700/50 pb-2 text-gray-900 dark:text-gray-100">
//               Hidden Fees & Penalties
//             </h3>

//             {hiddenFees?.fees?.length > 0 ? (
//               <div className="space-y-3">
//                 {hiddenFees.fees.map((fee, idx) => (
//                   <div
//                     key={idx}
//                     className="flex justify-between items-start text-sm"
//                   >
//                     <span className="text-gray-600">{fee.name}</span>
//                     <span className="font-bold text-red-600">
//                       {fee.amount || "Variable"}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <DetailRow
//                   label="Early Termination"
//                   value={fields.early_termination_fee}
//                 />
//                 <DetailRow
//                   label="Late Penalty"
//                   value={fields.late_payment_penalty}
//                 />
//                 <DetailRow
//                   label="Mileage Limit"
//                   value={fields.mileage_allowance}
//                 />
//                 <DetailRow
//                   label="Residual Value"
//                   value={fields.residual_value}
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Raw Text Toggle (Optional) */}
//         <div className="text-center">
//           <details className="inline-block">
//             <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 select-none">
//               View Raw Extracted Text
//             </summary>
//             <div className="mt-4 text-left p-4 bg-gray-200 rounded text-xs font-mono text-gray-600 max-h-40 overflow-auto w-full max-w-2xl mx-auto">
//               {record.rawText}
//             </div>
//           </details>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Helper Component for rows
// const DetailRow = ({ label, value, highlight }) => (
//   <div className="flex justify-between items-center">
//     <span className="text-gray-500 dark:text-gray-400 text-sm">{label}</span>
//     <span
//       className={`font-medium ${highlight ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-900 dark:text-gray-100"}`}
//     >
//       {value && value !== "Not Specified" ? value : "--"}
//     </span>

//     <ChatbotWidget />
//   </div>
// );

// export default ResultDetailsPage;


import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import jsPDF from "jspdf";
import axios from "axios";
import ChatbotWidget from "../components/ChatbotWidget";

const ResultDetailsPage = () => {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [rawOpen, setRawOpen] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await axios.get(
          `https://car-lease-loan-ai-assistant.onrender.com/api/results/${id}`,
        );
        if (response.data.success) setRecord(response.data.data);
        else setError("Record not found");
      } catch (err) {
        console.error(err);
        setError("Server error while fetching record");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecord();
  }, [id]);

  const generateAnalysisPDF = () => {
    if (!record) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("AutoLoan AI - Analysis Report", 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`File Name: ${record.fileName}`, 20, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 36);
    doc.setDrawColor(200);
    doc.line(20, 40, 190, 40);
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Financial Details", 20, 50);
    doc.setFontSize(12);
    doc.setTextColor(60);
    let y = 60;
    if (record.fields) {
      doc.text(`Loan Amount: ${record.fields.loan_amount || "N/A"}`, 20, y);
      doc.text(
        `Interest Rate: ${record.fields.interest_rate || "N/A"}`,
        120,
        y,
      );
      y += 10;
      doc.text(`Tenure: ${record.fields.tenure_months || "N/A"}`, 20, y);
      doc.text(`EMI: ${record.fields.monthly_payment || "N/A"}`, 120, y);
    }
    if (record.pricingAnalysis) {
      y += 20;
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text("Market Analysis", 20, y);
      y += 10;
      doc.setFontSize(12);
      doc.setTextColor(60);
      doc.text(
        `Market Fair Price: Rs ${record.pricingAnalysis.marketFairPrice || "N/A"}`,
        20,
        y,
      );
      doc.text(
        `Contract Price: Rs ${record.pricingAnalysis.contractPrice || "N/A"}`,
        20,
        y + 10,
      );
      doc.text(
        `Fairness Score: ${record.pricingAnalysis.score}/100`,
        20,
        y + 20,
      );
      doc.text(`Verdict: ${record.pricingAnalysis.verdict}`, 120, y + 20);
      if (record.pricingAnalysis.recommendation) {
        y += 35;
        doc.setFontSize(11);
        doc.setTextColor(0);
        doc.text("AI Recommendation:", 20, y);
        const splitText = doc.splitTextToSize(
          record.pricingAnalysis.recommendation,
          170,
        );
        doc.text(splitText, 20, y + 7);
      }
    }
    doc.save(`Analysis_${record.fileName}.pdf`);
  };

  const getScoreColor = (score) => {
    if (score === undefined || score === null) return "#6b7280";
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  if (isLoading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#050816",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600&display=swap');.rd-dot{width:9px;height:9px;border-radius:50%;background:#6c63ff;animation:rd-b 1.2s ease-in-out infinite}.rd-dot:nth-child(2){animation-delay:.2s}.rd-dot:nth-child(3){animation-delay:.4s}@keyframes rd-b{0%,80%,100%{transform:scale(0.7);opacity:.4}40%{transform:scale(1);opacity:1}}`}</style>
        <div style={{ display: "flex", gap: "7px" }}>
          <div className="rd-dot" />
          <div className="rd-dot" />
          <div className="rd-dot" />
        </div>
      </div>
    );

  if (error)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#050816",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'Sora',sans-serif",
            color: "#f87171",
            fontSize: "1rem",
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      </div>
    );

  if (!record) return null;

  const price = record.pricingAnalysis || {};
  if (price.contractPrice && price.marketFairPrice)
    price.difference = price.contractPrice - price.marketFairPrice;
  const vehicle = record.vehicleDetails || {};
  const fields = record.fields || {};
  const hiddenFees = record.hiddenFees || {};
  const sc = getScoreColor(price.score);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .rd-root {
          font-family: 'Sora', sans-serif;
          min-height: 100vh;
          background: #050816;
          position: relative;
          overflow-x: hidden;
          padding: 2.5rem 1.25rem 6rem;
        }
        .rd-orb { position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0;animation:rd-drift 14s ease-in-out infinite alternate; }
        .rd-orb-1 { width:520px;height:520px;background:radial-gradient(circle,#4f46e5,#1e1b4b);top:-150px;left:-160px;opacity:0.3; }
        .rd-orb-2 { width:440px;height:440px;background:radial-gradient(circle,#0ea5e9,#0369a1);bottom:-140px;right:-120px;opacity:0.22;animation-delay:-7s; }
        .rd-orb-3 { width:270px;height:270px;background:radial-gradient(circle,#8b5cf6,#6d28d9);top:35%;left:60%;opacity:0.17;animation-delay:-11s; }
        @keyframes rd-drift { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(28px,22px) scale(1.06)} }
        .rd-grid-bg { position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);background-size:48px 48px; }

        .rd-wrap { position:relative;z-index:1;max-width:960px;margin:0 auto; }

        /* Nav */
        .rd-nav { display:flex;justify-content:space-between;align-items:center;margin-bottom:2.5rem;flex-wrap:wrap;gap:12px; }
        .rd-nav-left { display:flex;align-items:center;gap:10px; }
        .rd-nav-right { display:flex;align-items:center;gap:10px; }

        .rd-pill-btn { display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:11px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.55);font-family:'Sora',sans-serif;font-size:0.8rem;font-weight:600;text-decoration:none;cursor:pointer;transition:background 0.2s,border-color 0.2s,transform 0.15s;white-space:nowrap; }
        .rd-pill-btn:hover { background:rgba(255,255,255,0.09);border-color:rgba(255,255,255,0.2);transform:translateY(-1px); }

        .rd-pdf-btn { display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:11px;background:linear-gradient(135deg,#6c63ff,#4f46e5);border:none;color:#fff;font-family:'Sora',sans-serif;font-size:0.8rem;font-weight:600;cursor:pointer;transition:transform 0.18s,box-shadow 0.18s;box-shadow:0 4px 18px rgba(108,99,255,0.3); }
        .rd-pdf-btn:hover { transform:translateY(-2px);box-shadow:0 8px 26px rgba(108,99,255,0.45); }

        /* Page header */
        .rd-page-header { margin-bottom:2rem; }
        .rd-badge { display:inline-flex;align-items:center;gap:6px;background:rgba(108,99,255,0.14);border:1px solid rgba(108,99,255,0.3);border-radius:999px;padding:4px 14px;font-size:10px;font-weight:600;letter-spacing:0.08em;color:#a5b4fc;text-transform:uppercase;margin-bottom:0.75rem; }
        .rd-badge-dot { width:6px;height:6px;border-radius:50%;background:#6c63ff;box-shadow:0 0 6px #6c63ff;animation:rd-pulse 2s ease-in-out infinite; }
        @keyframes rd-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
        .rd-page-title { font-size:clamp(1.6rem,4vw,2.1rem);font-weight:800;color:#fff;letter-spacing:-0.04em;line-height:1.1;margin:0 0 0.4rem; }
        .rd-id-chip { display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:8px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);font-family:'DM Sans',monospace;font-size:0.75rem;color:rgba(255,255,255,0.3); }

        /* Glass card */
        .rd-card {
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.09);
          border-radius:22px;
          padding:1.75rem;
          backdrop-filter:blur(22px);
          -webkit-backdrop-filter:blur(22px);
          box-shadow:0 20px 56px rgba(0,0,0,0.4),0 0 0 1px rgba(255,255,255,0.03) inset;
          position:relative;
          animation:rd-cardIn 0.55s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes rd-cardIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .rd-card::before { content:'';position:absolute;top:0;left:8%;right:8%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent); }

        .rd-section-label { font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:1rem;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:6px; }

        /* Two-col grid */
        .rd-two-col { display:grid;grid-template-columns:1fr;gap:1.25rem; }
        @media(min-width:680px) { .rd-two-col { grid-template-columns:1fr 1fr; } }
        .rd-three-col { display:grid;grid-template-columns:1fr;gap:1.25rem; }
        @media(min-width:700px) { .rd-three-col { grid-template-columns:2fr 1fr; } }

        /* Vehicle */
        .rd-vehicle-big { font-size:clamp(1.4rem,3.5vw,1.9rem);font-weight:800;color:#fff;letter-spacing:-0.03em;line-height:1.15;margin-bottom:4px; }
        .rd-vehicle-sub { font-family:'DM Sans',sans-serif;font-size:0.875rem;color:rgba(255,255,255,0.4); }
        .rd-vin-wrap { display:flex;flex-direction:column;align-items:flex-end;gap:4px; }
        .rd-vin-label { font-size:9px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:rgba(255,255,255,0.3); }
        .rd-vin-code { font-family:monospace;font-size:0.8rem;color:#a5b4fc;background:rgba(108,99,255,0.1);border:1px solid rgba(108,99,255,0.2);padding:5px 12px;border-radius:8px; }

        /* Score gauge */
        .rd-score-wrap { display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem; }
        .rd-score-circle { position:relative;width:100px;height:100px;border-radius:50%;display:flex;align-items:center;justify-content:center; }
        .rd-score-num { font-size:2.2rem;font-weight:800;line-height:1; }
        .rd-verdict-pill { padding:5px 14px;border-radius:999px;font-size:0.75rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase; }

        /* Recommendation */
        .rd-rec-card { background:rgba(108,99,255,0.08);border:1px solid rgba(108,99,255,0.2);border-radius:18px;padding:1.5rem;position:relative; }
        .rd-rec-card::before { content:'';position:absolute;top:0;left:8%;right:8%;height:1px;background:linear-gradient(90deg,transparent,rgba(108,99,255,0.25),transparent); }
        .rd-rec-icon { width:40px;height:40px;border-radius:11px;background:rgba(108,99,255,0.15);border:1px solid rgba(108,99,255,0.25);display:flex;align-items:center;justify-content:center;color:#a5b4fc;margin-bottom:1rem; }
        .rd-rec-title { font-size:0.85rem;font-weight:700;color:#c4b5fd;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.06em; }
        .rd-rec-text { font-family:'DM Sans',sans-serif;font-size:0.9rem;color:rgba(255,255,255,0.65);line-height:1.7;font-style:italic; }

        /* Price bars */
        .rd-bar-label { display:flex;justify-content:space-between;margin-bottom:6px; }
        .rd-bar-key { font-family:'DM Sans',sans-serif;font-size:0.82rem;color:rgba(255,255,255,0.45); }
        .rd-bar-val { font-size:0.88rem;font-weight:700;color:#fff; }
        .rd-bar-track { width:100%;height:8px;background:rgba(255,255,255,0.06);border-radius:999px;overflow:hidden; }
        .rd-bar-fill { height:100%;border-radius:999px;transition:width 0.8s ease; }
        .rd-diff-chip { display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:10px;font-size:0.82rem;font-weight:700; }

        /* Detail rows */
        .rd-detail-row { display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.05); }
        .rd-detail-row:last-child { border-bottom:none; }
        .rd-detail-label { font-family:'DM Sans',sans-serif;font-size:0.82rem;color:rgba(255,255,255,0.38); }
        .rd-detail-val { font-size:0.88rem;font-weight:700;color:#fff; }
        .rd-detail-val.highlight { color:#a5b4fc; }

        /* Fee row */
        .rd-fee-row { display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05); }
        .rd-fee-row:last-child { border-bottom:none; }
        .rd-fee-name { font-family:'DM Sans',sans-serif;font-size:0.82rem;color:rgba(255,255,255,0.45); }
        .rd-fee-amt { font-size:0.82rem;font-weight:700;color:#f87171; }

        /* Raw text */
        .rd-raw-toggle { display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);cursor:pointer;font-family:'DM Sans',sans-serif;font-size:0.8rem;color:rgba(255,255,255,0.35);transition:background 0.2s;width:100%;justify-content:center; }
        .rd-raw-toggle:hover { background:rgba(255,255,255,0.07); }
        .rd-raw-box { margin-top:10px;background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.07);border-radius:13px;padding:14px;max-height:180px;overflow:auto; }
        .rd-raw-box pre { font-family:monospace;font-size:11px;color:rgba(255,255,255,0.5);white-space:pre-wrap;line-height:1.65;margin:0; }
        .rd-raw-box::-webkit-scrollbar { width:4px; }
        .rd-raw-box::-webkit-scrollbar-thumb { background:rgba(108,99,255,0.3);border-radius:99px; }

        /* Spacer */
        .rd-space { height: 1.25rem; }
      `}</style>

      <div className="rd-root">
        <div className="rd-orb rd-orb-1" />
        <div className="rd-orb rd-orb-2" />
        <div className="rd-orb rd-orb-3" />
        <div className="rd-grid-bg" />

        <div className="rd-wrap">
          {/* Nav */}
          <div className="rd-nav">
            <div className="rd-nav-left">
              <Link to="/" className="rd-pill-btn">
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
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                Upload
              </Link>
              <Link to="/history" className="rd-pill-btn">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                History
              </Link>
            </div>
            <button onClick={generateAnalysisPDF} className="rd-pdf-btn">
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              Download Report
            </button>
          </div>

          {/* Page header */}
          <div className="rd-page-header">
            <div>
              <span className="rd-badge">
                <span className="rd-badge-dot" />
                Analysis Result
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <h2 className="rd-page-title">Contract Analysis</h2>
              <span className="rd-id-chip">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                {id}
              </span>
            </div>
          </div>

          {/* Row 1: Vehicle + Score */}
          <div className="rd-three-col" style={{ marginBottom: "1.25rem" }}>
            {/* Vehicle */}
            <div className="rd-card" style={{ animationDelay: "0.05s" }}>
              <div className="rd-section-label">
                <svg
                  width="12"
                  height="12"
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
                Vehicle Identity
              </div>
              {vehicle.make ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div className="rd-vehicle-big">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </div>
                    <div className="rd-vehicle-sub">
                      {vehicle.trim} {vehicle.bodyClass}
                    </div>
                  </div>
                  <div className="rd-vin-wrap">
                    <div className="rd-vin-label">VIN Detected</div>
                    <div className="rd-vin-code">{record.vin || "N/A"}</div>
                  </div>
                </div>
              ) : (
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.875rem",
                    color: "rgba(255,255,255,0.3)",
                    fontStyle: "italic",
                  }}
                >
                  Vehicle details could not be extracted automatically.
                </p>
              )}
            </div>

            {/* Score */}
            <div className="rd-card" style={{ animationDelay: "0.1s" }}>
              <div className="rd-section-label">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Fairness Score
              </div>
              <div className="rd-score-wrap">
                <div
                  className="rd-score-circle"
                  style={{
                    border: `3px solid ${sc}`,
                    boxShadow: `0 0 24px ${sc}30`,
                  }}
                >
                  <span className="rd-score-num" style={{ color: sc }}>
                    {price.score ?? "--"}
                  </span>
                </div>
                <span
                  className="rd-verdict-pill"
                  style={{
                    background: `${sc}18`,
                    border: `1px solid ${sc}40`,
                    color: sc,
                  }}
                >
                  {price.verdict || "Pending"}
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: AI Recommendation */}
          {price.recommendation && (
            <>
              <div
                className="rd-rec-card"
                style={{
                  marginBottom: "1.25rem",
                  animation: "rd-cardIn 0.55s 0.15s both",
                }}
              >
                <div className="rd-rec-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2a10 10 0 1 0 10 10" />
                    <path d="M12 8v4l3 3" />
                    <circle
                      cx="19"
                      cy="5"
                      r="3"
                      fill="currentColor"
                      opacity="0.5"
                      stroke="none"
                    />
                  </svg>
                </div>
                <div className="rd-rec-title">AI Advisor Recommendation</div>
                <div className="rd-rec-text">"{price.recommendation}"</div>
              </div>
            </>
          )}

          {/* Row 3: Price Analysis */}
          {price.marketFairPrice && (
            <div
              className="rd-card"
              style={{ marginBottom: "1.25rem", animationDelay: "0.18s" }}
            >
              <div className="rd-section-label">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                Price Fairness Analysis
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.1rem",
                  marginBottom: "1.25rem",
                }}
              >
                {/* Market */}
                <div>
                  <div className="rd-bar-label">
                    <span className="rd-bar-key">Market Fair Value</span>
                    <span className="rd-bar-val">
                      ₹{price.marketFairPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="rd-bar-track">
                    <div
                      className="rd-bar-fill"
                      style={{
                        width: "75%",
                        background: "linear-gradient(90deg,#6c63ff,#818cf8)",
                      }}
                    />
                  </div>
                </div>
                {/* Contract */}
                <div>
                  <div className="rd-bar-label">
                    <span className="rd-bar-key">Your Contract Price</span>
                    <span
                      className="rd-bar-val"
                      style={{
                        color: price.difference > 0 ? "#f87171" : "#34d399",
                      }}
                    >
                      ₹{price.contractPrice?.toLocaleString()}
                    </span>
                  </div>
                  <div className="rd-bar-track">
                    <div
                      className="rd-bar-fill"
                      style={{
                        width: `${Math.min((price.contractPrice / price.marketFairPrice) * 75, 100)}%`,
                        background:
                          price.difference > 0
                            ? "linear-gradient(90deg,#ef4444,#f87171)"
                            : "linear-gradient(90deg,#10b981,#34d399)",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  paddingTop: "1rem",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <span
                  className="rd-diff-chip"
                  style={{
                    background:
                      price.difference > 0
                        ? "rgba(239,68,68,0.1)"
                        : "rgba(16,185,129,0.1)",
                    border: `1px solid ${price.difference > 0 ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`,
                    color: price.difference > 0 ? "#f87171" : "#34d399",
                  }}
                >
                  {price.difference > 0 ? (
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
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  ) : (
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
                  )}
                  {price.difference > 0
                    ? `Overpriced by ₹${price.difference.toLocaleString()}`
                    : `Underpriced by ₹${Math.abs(price.difference).toLocaleString()}`}
                </span>
              </div>
            </div>
          )}

          {/* Row 4: Loan Terms + Fees */}
          <div className="rd-two-col" style={{ marginBottom: "1.25rem" }}>
            <div className="rd-card" style={{ animationDelay: "0.22s" }}>
              <div className="rd-section-label">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                Loan Terms
              </div>
              {[
                { label: "Loan Amount", val: fields.loan_amount },
                { label: "Interest Rate", val: fields.interest_rate, hi: true },
                { label: "Tenure", val: fields.tenure_months },
                { label: "Monthly Payment", val: fields.monthly_payment },
                { label: "Down Payment", val: fields.down_payment },
              ].map((r) => (
                <div key={r.label} className="rd-detail-row">
                  <span className="rd-detail-label">{r.label}</span>
                  <span className={`rd-detail-val${r.hi ? " highlight" : ""}`}>
                    {r.val && r.val !== "Not Specified" ? r.val : "—"}
                  </span>
                </div>
              ))}
            </div>

            <div className="rd-card" style={{ animationDelay: "0.27s" }}>
              <div className="rd-section-label">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Hidden Fees & Penalties
              </div>
              {hiddenFees?.fees?.length > 0
                ? hiddenFees.fees.map((fee, idx) => (
                    <div key={idx} className="rd-fee-row">
                      <span className="rd-fee-name">{fee.name}</span>
                      <span className="rd-fee-amt">
                        {fee.amount || "Variable"}
                      </span>
                    </div>
                  ))
                : [
                    {
                      label: "Early Termination",
                      val: fields.early_termination_fee,
                    },
                    { label: "Late Penalty", val: fields.late_payment_penalty },
                    { label: "Mileage Limit", val: fields.mileage_allowance },
                    { label: "Residual Value", val: fields.residual_value },
                  ].map((r) => (
                    <div key={r.label} className="rd-detail-row">
                      <span className="rd-detail-label">{r.label}</span>
                      <span className="rd-detail-val">
                        {r.val && r.val !== "Not Specified" ? r.val : "—"}
                      </span>
                    </div>
                  ))}
            </div>
          </div>

          {/* Raw text */}
          {record.rawText && (
            <div style={{ marginBottom: "1.25rem" }}>
              <button
                className="rd-raw-toggle"
                onClick={() => setRawOpen((v) => !v)}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                {rawOpen ? "Hide" : "View"} Raw Extracted Text
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transition: "transform 0.2s",
                    transform: rawOpen ? "rotate(180deg)" : "none",
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {rawOpen && (
                <div className="rd-raw-box">
                  <pre>{record.rawText}</pre>
                </div>
              )}
            </div>
          )}
        </div>

        <ChatbotWidget />
      </div>
    </>
  );
};

const DetailRow = ({ label, value, highlight }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "9px 0",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}
  >
    <span
      style={{
        fontFamily: "'DM Sans',sans-serif",
        fontSize: "0.82rem",
        color: "rgba(255,255,255,0.38)",
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: "0.88rem",
        fontWeight: 700,
        color: highlight ? "#a5b4fc" : "#fff",
      }}
    >
      {value && value !== "Not Specified" ? value : "—"}
    </span>
  </div>
);

export default ResultDetailsPage;
