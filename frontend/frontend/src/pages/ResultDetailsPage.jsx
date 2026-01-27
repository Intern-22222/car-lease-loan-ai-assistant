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
//         const response = await fetch(`http://localhost:3000/api/results/${id}`);
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
//         const response = await fetch(`http://localhost:3000/api/results/${id}`);
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
//         const response = await fetch(`http://localhost:3000/api/results/${id}`);
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
//         const response = await fetch(`http://localhost:3000/api/results/${id}`);
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
//         const response = await fetch(`http://localhost:3000/api/results/${id}`);
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
//         const response = await fetch(`http://localhost:3000/api/results/${id}`);
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

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import jsPDF from "jspdf";
import axios from "axios"; // Ensure axios is installed or use fetch

const ResultDetailsPage = () => {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        // 👇 FIXED: Backend sends data in response.data.data
        const response = await axios.get(
          `http://localhost:3000/api/results/${id}`,
        );

        if (response.data.success) {
          setRecord(response.data.data); // Matches backend structure
        } else {
          setError("Record not found");
        }
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

    // Header
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("AutoLoan AI - Analysis Report", 20, 20);

    // File Info
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`File Name: ${record.fileName}`, 20, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 36);

    // Separator
    doc.setDrawColor(200);
    doc.line(20, 40, 190, 40);

    // Financial Details
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

    // Pricing Analysis
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

      // Recommendation
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

  // Safe Helper for Color Logic
  const getScoreColor = (score) => {
    if (score === undefined || score === null) return "#9ca3af"; // Gray
    if (score >= 80) return "#16a34a"; // Green
    if (score >= 60) return "#ca8a04"; // Yellow
    return "#dc2626"; // Red
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-center text-red-600 font-bold text-xl">
        ❌ {error}
      </div>
    );

  if (!record) return null;

  const price = record.pricingAnalysis || {};
  const vehicle = record.vehicleDetails || {};
  const fields = record.fields || {};
  const hiddenFees = record.hiddenFees || {};

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* NAV */}
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="text-blue-600 font-bold hover:underline flex items-center"
          >
            ⬅ Back to Upload
          </Link>
          <div className="flex gap-4">
            <Link
              to="/history"
              className="text-gray-600 font-medium hover:text-gray-900 transition"
            >
              📜 History
            </Link>
            <button
              onClick={generateAnalysisPDF}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm transition"
            >
              📄 Download Report
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">
            Contract Analysis Result
          </h2>
          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
            ID: {id}
          </span>
        </div>

        {/* --- 1. TOP ROW: VEHICLE & SCORE --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* VEHICLE INFO CARD */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Vehicle Identity
            </h3>
            {vehicle.make ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </div>
                  <div className="text-md text-gray-600 font-medium">
                    {vehicle.trim} {vehicle.bodyClass}
                  </div>
                </div>
                <div className="flex flex-col justify-center items-end">
                  <div className="text-xs text-gray-400 uppercase">
                    VIN Detected
                  </div>
                  <div className="font-mono text-gray-800 bg-gray-100 px-3 py-1 rounded mt-1">
                    {record.vin || "N/A"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 italic py-4">
                Vehicle details could not be extracted automatically.
              </div>
            )}
          </div>

          {/* FAIRNESS SCORE CARD */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Fairness Score
            </div>

            {/* Simple Circle Gauge */}
            <div
              className="relative w-24 h-24 flex items-center justify-center rounded-full border-4 shadow-inner"
              style={{ borderColor: getScoreColor(price.score) }}
            >
              <span
                className="text-3xl font-bold"
                style={{ color: getScoreColor(price.score) }}
              >
                {price.score ?? "--"}
              </span>
            </div>

            <div
              className="mt-3 font-bold text-sm uppercase tracking-wide px-3 py-1 rounded-full"
              style={{
                backgroundColor: `${getScoreColor(price.score)}20`, // 20% opacity background
                color: getScoreColor(price.score),
              }}
            >
              {price.verdict || "Pending"}
            </div>
          </div>
        </div>

        {/* --- 2. AI RECOMMENDATION --- */}
        {price.recommendation && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-6 shadow-sm">
            <h3 className="flex items-center text-indigo-800 font-bold mb-2">
              <span className="text-2xl mr-2">🤖</span> AI Advisor
              Recommendation
            </h3>
            <p className="text-gray-800 italic leading-relaxed">
              "{price.recommendation}"
            </p>
          </div>
        )}

        {/* --- 3. PRICE ANALYSIS (Only show if price exists) --- */}
        {price.marketFairPrice && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              💰 Price Fairness Analysis [Image of balance scale icon]
            </h3>

            {/* Price Bars Container */}
            <div className="space-y-6">
              {/* Market Price Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">
                    Market Fair Value
                  </span>
                  <span className="font-bold text-gray-900">
                    ₹{price.marketFairPrice.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full w-3/4 opacity-80"></div>
                </div>
              </div>

              {/* Contract Price Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">
                    Your Contract Price
                  </span>
                  <span
                    className={`font-bold ${price.difference > 0 ? "text-red-600" : "text-green-600"}`}
                  >
                    ₹{price.contractPrice?.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden relative">
                  {/* Visualizing the difference */}
                  <div
                    className={`h-full rounded-full ${price.difference > 0 ? "bg-red-500" : "bg-green-500"}`}
                    style={{
                      width: `${Math.min((price.contractPrice / price.marketFairPrice) * 75, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
              <p
                className={`text-sm font-bold px-4 py-2 rounded-lg ${price.difference > 0 ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
              >
                {price.difference > 0
                  ? `⚠️ Overpriced by ₹${price.difference.toLocaleString()}`
                  : `✅ Underpriced by ₹${Math.abs(price.difference).toLocaleString()}`}
              </p>
            </div>
          </div>
        )}

        {/* --- 4. LOAN DETAILS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">
              Loan Terms
            </h3>
            <div className="space-y-4">
              <DetailRow label="Loan Amount" value={fields.loan_amount} />
              <DetailRow
                label="Interest Rate"
                value={fields.interest_rate}
                highlight
              />
              <DetailRow label="Tenure" value={fields.tenure_months} />
              <DetailRow
                label="Monthly Payment"
                value={fields.monthly_payment}
              />
              <DetailRow label="Down Payment" value={fields.down_payment} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">
              Hidden Fees & Penalties
            </h3>

            {hiddenFees?.fees?.length > 0 ? (
              <div className="space-y-3">
                {hiddenFees.fees.map((fee, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start text-sm"
                  >
                    <span className="text-gray-600">{fee.name}</span>
                    <span className="font-bold text-red-600">
                      {fee.amount || "Variable"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <DetailRow
                  label="Early Termination"
                  value={fields.early_termination_fee}
                />
                <DetailRow
                  label="Late Penalty"
                  value={fields.late_payment_penalty}
                />
                <DetailRow
                  label="Mileage Limit"
                  value={fields.mileage_allowance}
                />
                <DetailRow
                  label="Residual Value"
                  value={fields.residual_value}
                />
              </div>
            )}
          </div>
        </div>

        {/* Raw Text Toggle (Optional) */}
        <div className="text-center">
          <details className="inline-block">
            <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 select-none">
              View Raw Extracted Text
            </summary>
            <div className="mt-4 text-left p-4 bg-gray-200 rounded text-xs font-mono text-gray-600 max-h-40 overflow-auto w-full max-w-2xl mx-auto">
              {record.rawText}
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

// Helper Component for rows
const DetailRow = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-500 text-sm">{label}</span>
    <span
      className={`font-medium ${highlight ? "text-blue-600 font-bold" : "text-gray-900"}`}
    >
      {value && value !== "Not Specified" ? value : "--"}
    </span>
  </div>
);

export default ResultDetailsPage;