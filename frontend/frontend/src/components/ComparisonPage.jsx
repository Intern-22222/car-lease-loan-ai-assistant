// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify"; // npm install react-toastify if missing

// const ComparisonPage = () => {
//   const [history, setHistory] = useState([]);
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [comparisonData, setComparisonData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [historyLoading, setHistoryLoading] = useState(true);

//   // 1. Fetch History
//   useEffect(() => {
//     fetch("https://car-lease-loan-ai-assistant.onrender.com/api/history")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success && Array.isArray(data.data)) {
//           // Check for data.data (standardized)
//           setHistory(data.data); // data.data is the array from history.route.js
//         } else if (data.success && Array.isArray(data.history)) {
//           setHistory(data.history); // Fallback if route returns 'history'
//         }
//       })
//       .catch((err) => console.error("History fetch error:", err))
//       .finally(() => setHistoryLoading(false));
//   }, []);

//   const toggleSelection = (id) => {
//     if (selectedIds.includes(id)) {
//       setSelectedIds(selectedIds.filter((i) => i !== id));
//     } else {
//       if (selectedIds.length >= 3) {
//         toast.warning("Select max 3 contracts.");
//         return;
//       }
//       setSelectedIds([...selectedIds, id]);
//     }
//   };

//   const runComparison = async () => {
//     if (selectedIds.length < 2) {
//       toast.info("Select at least 2 contracts.");
//       return;
//     }
//     setLoading(true);
//     setComparisonData([]);

//     try {
//       // 👇 This endpoint now exists in the backend file I provided above
//       const res = await fetch("https://car-lease-loan-ai-assistant.onrender.com/api/comparison/compare", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ids: selectedIds }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setComparisonData(data.data);
//         toast.success("Comparison Complete!");
//       } else {
//         toast.error(data.message || "Comparison failed");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Server connection failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 font-sans">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-extrabold text-gray-900">
//             ⚖️ Compare Contracts
//           </h1>
//           <Link to="/" className="text-indigo-600 font-bold hover:underline">
//             ⬅ Home
//           </Link>
//         </div>

//         {/* SELECTION GRID */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
//           <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">
//             Select Contracts (Max 3)
//           </h3>

//           {historyLoading ? (
//             <div className="text-gray-500">Loading history...</div>
//           ) : history.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               No contracts found. Upload some files first!
//             </div>
//           ) : (
//             <div className="flex gap-4 overflow-x-auto pb-2">
//               {history.map((rec) => (
//                 <div
//                   key={rec._id}
//                   onClick={() => toggleSelection(rec._id)}
//                   className={`flex-shrink-0 w-64 p-4 rounded-lg border-2 cursor-pointer transition ${
//                     selectedIds.includes(rec._id)
//                       ? "border-indigo-600 bg-indigo-50"
//                       : "border-gray-200 hover:bg-gray-50"
//                   }`}
//                 >
//                   <div className="font-bold truncate">{rec.fileName}</div>
//                   <div className="text-xs text-gray-500">
//                     {new Date(rec.uploadedAt).toLocaleDateString()}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           <button
//             onClick={runComparison}
//             disabled={loading || selectedIds.length < 2}
//             className={`mt-6 px-6 py-3 rounded-lg font-bold text-white transition ${
//               loading || selectedIds.length < 2
//                 ? "bg-gray-400"
//                 : "bg-indigo-600 hover:bg-indigo-700"
//             }`}
//           >
//             {loading
//               ? "Analyzing..."
//               : `Compare ${selectedIds.length} Contracts`}
//           </button>
//         </div>

//         {/* RESULTS GRID */}
//         {comparisonData.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {comparisonData.map((contract) => (
//               <div
//                 key={contract._id}
//                 className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden"
//               >
//                 <div className="bg-gray-800 text-white p-4">
//                   <h3 className="font-bold truncate">{contract.fileName}</h3>
//                 </div>
//                 <div className="p-6 space-y-4">
//                   <Row
//                     label="Loan Amount"
//                     value={contract.fields?.loan_amount}
//                   />
//                   <Row
//                     label="Interest Rate"
//                     value={contract.fields?.interest_rate}
//                     highlight
//                   />
//                   <Row
//                     label="Monthly EMI"
//                     value={contract.fields?.monthly_payment}
//                   />
//                   <Row label="Tenure" value={contract.fields?.tenure_months} />

//                   {/* Hidden Fees */}
//                   <div className="bg-red-50 p-4 rounded mt-4">
//                     <h4 className="text-xs font-bold text-red-600 uppercase mb-2">
//                       Hidden Fees
//                     </h4>
//                     {contract.hiddenFees?.fees?.length > 0 ? (
//                       <ul className="text-sm space-y-1">
//                         {contract.hiddenFees.fees.map((f, i) => (
//                           <li key={i} className="flex justify-between">
//                             <span>{f.name}</span>
//                             <span className="font-bold text-red-600">
//                               {f.amount || "?"}
//                             </span>
//                           </li>
//                         ))}
//                       </ul>
//                     ) : (
//                       <span className="text-sm text-green-600">
//                         No junk fees found.
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const Row = ({ label, value, highlight }) => (
//   <div className="flex justify-between border-b border-gray-100 pb-2">
//     <span className="text-gray-500 text-sm">{label}</span>
//     <span
//       className={`font-bold ${highlight ? "text-indigo-600" : "text-gray-900"}`}
//     >
//       {value || "--"}
//     </span>
//   </div>
// );

// export default ComparisonPage;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";

// const ComparisonPage = () => {
//   const [history, setHistory] = useState([]);
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [comparisonData, setComparisonData] = useState([]);
//   const [aiVerdict, setAiVerdict] = useState(""); // Store the AI summary
//   const [loading, setLoading] = useState(false);
//   const [historyLoading, setHistoryLoading] = useState(true);

//   // 1. Fetch History
//   useEffect(() => {
//     fetch("https://car-lease-loan-ai-assistant.onrender.com/api/history")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) setHistory(data.data || data.history || []);
//       })
//       .finally(() => setHistoryLoading(false));
//   }, []);

//   const toggleSelection = (id) => {
//     if (selectedIds.includes(id)) {
//       setSelectedIds(selectedIds.filter((i) => i !== id));
//     } else {
//       if (selectedIds.length >= 3) {
//         toast.warning("Select max 3 contracts.");
//         return;
//       }
//       setSelectedIds([...selectedIds, id]);
//     }
//   };

//   const runComparison = async () => {
//     if (selectedIds.length < 2) {
//       toast.info("Select at least 2 contracts.");
//       return;
//     }
//     setLoading(true);
//     setComparisonData([]);
//     setAiVerdict("");

//     try {
//       const res = await fetch("https://car-lease-loan-ai-assistant.onrender.com/api/comparison/compare", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ids: selectedIds }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setComparisonData(data.data);
//         setAiVerdict(data.verdict); // Save the AI summary
//         toast.success("Comparison Complete!");
//       } else {
//         toast.error(data.message);
//       }
//     } catch (err) {
//       toast.error("Server connection failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper to highlight the best (lowest) value
//   const getBestClass = (currentVal, allVals, type = "low") => {
//     if (!currentVal) return "";
//     const cleanVals = allVals
//       .map((v) => parseFloat(String(v).replace(/[^0-9.]/g, "")) || 0)
//       .filter((v) => v > 0);
//     const current = parseFloat(String(currentVal).replace(/[^0-9.]/g, "")) || 0;

//     if (cleanVals.length === 0) return "";
//     const best =
//       type === "low" ? Math.min(...cleanVals) : Math.max(...cleanVals);

//     return current === best
//       ? "bg-green-100 text-green-800 font-bold border-green-200"
//       : "";
//   };

//   return (
//     <div className="min-h-screen dynamic-bg p-6 font-sans">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white drop-shadow-sm">
//             ⚖️ Smart Comparison
//           </h1>
//           <Link to="/" className="text-indigo-600 font-bold hover:underline">
//             ⬅ Home
//           </Link>
//         </div>

//         {/* SELECTION AREA */}
//         <div className="glass-card p-6 mb-8 border-none">
//           <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase mb-4">
//             Select Contracts (Max 3)
//           </h3>

//           {historyLoading ? (
//             <div className="text-gray-500">Loading...</div>
//           ) : (
//             <div className="flex gap-4 overflow-x-auto pb-4">
//               {history.map((rec) => (
//                 <div
//                   key={rec._id}
//                   onClick={() => toggleSelection(rec._id)}
//                   className={`flex-shrink-0 w-64 p-4 rounded-lg border-2 cursor-pointer transition relative ${
//                     selectedIds.includes(rec._id)
//                       ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/30 ring-2 ring-indigo-200 dark:ring-indigo-700"
//                       : "border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-300 dark:hover:border-indigo-500 bg-white/40 dark:bg-gray-800/40"
//                   }`}
//                 >
//                   {selectedIds.includes(rec._id) && (
//                     <div className="absolute top-2 right-2 text-indigo-600 text-xl">
//                       ✓
//                     </div>
//                   )}
//                   <div className="font-bold truncate pr-6">{rec.fileName}</div>
//                   <div className="text-xs text-gray-500 mt-1">
//                     {new Date(rec.uploadedAt).toLocaleDateString()}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           <button
//             onClick={runComparison}
//             disabled={loading || selectedIds.length < 2}
//             className={`mt-6 w-full sm:w-auto flex justify-center py-3 px-8 text-center ${
//               loading || selectedIds.length < 2
//                 ? "opacity-60 cursor-not-allowed glass-button text-gray-200"
//                 : "glass-button"
//             }`}
//           >
//             {loading ? "🤖 AI Analyzing..." : "Compare Contracts 🚀"}
//           </button>
//         </div>

//         {/* COMPARISON RESULTS */}
//         {comparisonData.length > 0 && (
//           <div className="space-y-8 animate-fade-in-up">
//             {/* 1. AI VERDICT BOX */}
//             {aiVerdict && (
//               <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
//                 <h3 className="flex items-center text-lg font-bold mb-2">
//                   <span className="text-2xl mr-2">🏆</span> AI Verdict
//                 </h3>
//                 <p className="text-indigo-50 text-lg leading-relaxed font-medium">
//                   "{aiVerdict}"
//                 </p>
//               </div>
//             )}

//             {/* 2. COMPARISON TABLE */}
//             <div className="glass-card overflow-hidden border-none text-gray-900 dark:text-gray-100">
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left border-collapse">
//                   <thead>
//                     <tr className="bg-white/40 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
//                       <th className="p-4 text-gray-600 dark:text-gray-300 font-bold uppercase text-sm w-48">
//                         Feature
//                       </th>
//                       {comparisonData.map((contract, idx) => (
//                         <th key={idx} className="p-4 min-w-[200px]">
//                           <div
//                             className="font-extrabold text-gray-900 dark:text-white text-lg truncate max-w-[200px]"
//                             title={contract.fileName}
//                           >
//                             {contract.fileName}
//                           </div>
//                           <Link
//                             to={`/results/${contract._id}`}
//                             className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
//                           >
//                             View Full Analysis ↗
//                           </Link>
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
//                     {/* Loan Amount */}
//                     <tr className="hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors">
//                       <td className="p-4 font-bold text-gray-700 dark:text-gray-300">
//                         Loan Amount
//                       </td>
//                       {comparisonData.map((c, i) => (
//                         <td key={i} className="p-4 text-gray-900">
//                           {c.fields?.loan_amount || "--"}
//                         </td>
//                       ))}
//                     </tr>

//                     {/* Interest Rate (Highlight Lowest) */}
//                     {/* <tr>
//                       <td className="p-4 font-bold text-gray-700">
//                         Interest Rate
//                       </td>
//                       {comparisonData.map((c, i) => (
//                         <td key={i} className="p-4">
//                           <span
//                             className={`px-2 py-1 rounded ${getBestClass(
//                               c.fields?.interest_rate,
//                               comparisonData.map(
//                                 (d) => d.fields?.interest_rate,
//                               ),
//                               "low",
//                             )}`}
//                           >
//                             {c.fields?.interest_rate || "--"}%
//                           </span>
//                         </td>
//                       ))}
//                     </tr> */}

//                     {/* Interest Rate (Highlight Lowest) */}
//                     <tr className="hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors">
//                       <td className="p-4 font-bold text-gray-700 dark:text-gray-300">
//                         Interest Rate
//                       </td>
//                       {comparisonData.map((c, i) => {
//                         // FIX: Remove '%' if it exists in data, so we don't double it up
//                         const rawRate = c.fields?.interest_rate
//                           ? String(c.fields.interest_rate).replace("%", "")
//                           : "--";

//                         return (
//                           <td key={i} className="p-4">
//                             <span
//                               className={`px-2 py-1 rounded ${getBestClass(
//                                 rawRate,
//                                 comparisonData.map(
//                                   (d) => d.fields?.interest_rate,
//                                 ),
//                                 "low",
//                               )}`}
//                             >
//                               {rawRate}%
//                             </span>
//                           </td>
//                         );
//                       })}
//                     </tr>

//                     {/* Monthly Payment (Highlight Lowest) */}
//                     <tr className="hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors">
//                       <td className="p-4 font-bold text-gray-700 dark:text-gray-300">
//                         Monthly EMI
//                       </td>
//                       {comparisonData.map((c, i) => (
//                         <td key={i} className="p-4">
//                           <span
//                             className={`px-2 py-1 rounded ${getBestClass(
//                               c.fields?.monthly_payment,
//                               comparisonData.map(
//                                 (d) => d.fields?.monthly_payment,
//                               ),
//                               "low",
//                             )}`}
//                           >
//                             {c.fields?.monthly_payment || "--"}
//                           </span>
//                         </td>
//                       ))}
//                     </tr>

//                     {/* Hidden Fees Count */}
//                     <tr className="hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors">
//                       <td className="p-4 font-bold text-gray-700 dark:text-gray-300">
//                         Hidden Fees
//                       </td>
//                       {comparisonData.map((c, i) => (
//                         <td key={i} className="p-4 align-top">
//                           {c.hiddenFees?.fees?.length > 0 ? (
//                             <div>
//                               <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-bold text-sm">
//                                 {c.hiddenFees.fees.length} Found
//                               </span>
//                               <ul className="mt-2 space-y-1 text-xs text-gray-600">
//                                 {c.hiddenFees.fees.map((f, idx) => (
//                                   // <li
//                                   //   key={idx}
//                                   //   className="flex justify-between w-full max-w-[180px]"
//                                   // >
//                                   //   <span className="truncate pr-2">
//                                   //     {f.name}
//                                   //   </span>
//                                   //   <span className="font-bold text-red-600">
//                                   //     {f.amount || "?"}
//                                   //   </span>
//                                   // </li>

//                                   <li
//                                     key={idx}
//                                     className="flex justify-between w-full max-w-[180px]"
//                                   >
//                                     <span
//                                       className="truncate pr-2"
//                                       title={f.name}
//                                     >
//                                       {f.name}
//                                     </span>
//                                     <span className="font-bold text-red-600">
//                                       {/* FIX: Check if amount exists. If not, show 'Variable' instead of '?' */}
//                                       {/* {f.amount && f.amount !== "0"
//                                         ? `₹${f.amount}`
//                                         : "Variable"} */}
//                                       {f.amount && f.amount !== "0"
//                                         ? `₹${f.amount}`
//                                         : f.description || "Variable"}
//                                     </span>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                           ) : (
//                             <span className="text-green-600 text-sm font-medium flex items-center">
//                               ✅ Clean
//                             </span>
//                           )}
//                         </td>
//                       ))}
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ComparisonPage;


//STABLE

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import API_BASE from "../config/api";
// const ComparisonPage = () => {
//   const [history, setHistory] = useState([]);
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [comparisonData, setComparisonData] = useState([]);
//   const [aiVerdict, setAiVerdict] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [historyLoading, setHistoryLoading] = useState(true);

//   useEffect(() => {
//     fetch(`${API_BASE}/api/history`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) setHistory(data.data || data.history || []);
//       })
//       .finally(() => setHistoryLoading(false));
//   }, []);

//   const toggleSelection = (id) => {
//     if (selectedIds.includes(id)) {
//       setSelectedIds(selectedIds.filter((i) => i !== id));
//     } else {
//       if (selectedIds.length >= 3) {
//         toast.warning("Select max 3 contracts.");
//         return;
//       }
//       setSelectedIds([...selectedIds, id]);
//     }
//   };

//   const runComparison = async () => {
//     if (selectedIds.length < 2) {
//       toast.info("Select at least 2 contracts.");
//       return;
//     }
//     setLoading(true);
//     setComparisonData([]);
//     setAiVerdict("");
//     try {
//       const res = await fetch(
//         `${API_BASE}/api/comparison/compare`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ ids: selectedIds }),
//         },
//       );
//       const data = await res.json();
//       if (data.success) {
//         setComparisonData(data.data);
//         setAiVerdict(data.verdict);
//         toast.success("Comparison Complete!");
//       } else toast.error(data.message);
//     } catch (err) {
//       toast.error("Server connection failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getBestClass = (currentVal, allVals, type = "low") => {
//     if (!currentVal) return "";
//     const cleanVals = allVals
//       .map((v) => parseFloat(String(v).replace(/[^0-9.]/g, "")) || 0)
//       .filter((v) => v > 0);
//     const current = parseFloat(String(currentVal).replace(/[^0-9.]/g, "")) || 0;
//     if (cleanVals.length === 0) return "";
//     const best =
//       type === "low" ? Math.min(...cleanVals) : Math.max(...cleanVals);
//     return current === best ? "best" : "";
//   };

//   const colAccents = ["#6c63ff", "#10b981", "#f59e0b"];

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
//         *, *::before, *::after { box-sizing: border-box; }

//         .cp-root {
//           font-family: 'Sora', sans-serif;
//           min-height: 100vh;
//           background: #050816;
//           position: relative;
//           overflow-x: hidden;
//           padding: 2.5rem 1.25rem 5rem;
//         }
//         .cp-orb { position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0;animation:cp-drift 14s ease-in-out infinite alternate; }
//         .cp-orb-1 { width:520px;height:520px;background:radial-gradient(circle,#4f46e5,#1e1b4b);top:-160px;left:-160px;opacity:0.3; }
//         .cp-orb-2 { width:440px;height:440px;background:radial-gradient(circle,#0ea5e9,#0369a1);bottom:-150px;right:-130px;opacity:0.22;animation-delay:-7s; }
//         .cp-orb-3 { width:270px;height:270px;background:radial-gradient(circle,#8b5cf6,#6d28d9);top:38%;left:60%;opacity:0.17;animation-delay:-11s; }
//         @keyframes cp-drift { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(28px,22px) scale(1.06)} }
//         .cp-grid-bg { position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);background-size:48px 48px; }

//         .cp-wrap { position:relative;z-index:1;max-width:1100px;margin:0 auto; }

//         /* Header */
//         .cp-header { display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:2.5rem;gap:1rem;flex-wrap:wrap; }
//         .cp-badge { display:inline-flex;align-items:center;gap:6px;background:rgba(108,99,255,0.14);border:1px solid rgba(108,99,255,0.3);border-radius:999px;padding:4px 14px;font-size:10px;font-weight:600;letter-spacing:0.08em;color:#a5b4fc;text-transform:uppercase;margin-bottom:0.75rem; }
//         .cp-badge-dot { width:6px;height:6px;border-radius:50%;background:#6c63ff;box-shadow:0 0 6px #6c63ff;animation:cp-pulse 2s ease-in-out infinite; }
//         @keyframes cp-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
//         .cp-title { font-size:clamp(1.6rem,4vw,2.2rem);font-weight:800;color:#fff;letter-spacing:-0.04em;line-height:1.1;margin:0 0 0.3rem; }
//         .cp-sub { font-family:'DM Sans',sans-serif;font-size:0.875rem;color:rgba(255,255,255,0.38); }
//         .cp-back { display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:11px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.55);font-family:'Sora',sans-serif;font-size:0.8rem;font-weight:600;text-decoration:none;transition:background 0.2s,border-color 0.2s,transform 0.15s;white-space:nowrap;align-self:flex-start; }
//         .cp-back:hover { background:rgba(255,255,255,0.09);border-color:rgba(255,255,255,0.2);transform:translateY(-1px); }

//         /* Glass card */
//         .cp-card {
//           background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);
//           border-radius:22px;padding:1.75rem;
//           backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);
//           box-shadow:0 20px 56px rgba(0,0,0,0.4),0 0 0 1px rgba(255,255,255,0.03) inset;
//           position:relative;
//           animation:cp-cardIn 0.55s cubic-bezier(0.22,1,0.36,1) both;
//         }
//         @keyframes cp-cardIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
//         .cp-card::before { content:'';position:absolute;top:0;left:8%;right:8%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent); }

//         .cp-section-label { font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:1rem;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:6px; }

//         /* Selection cards */
//         .cp-scroll { display:flex;gap:12px;overflow-x:auto;padding-bottom:8px; }
//         .cp-scroll::-webkit-scrollbar { height:3px; }
//         .cp-scroll::-webkit-scrollbar-thumb { background:rgba(108,99,255,0.3);border-radius:99px; }

//         .cp-sel-card {
//           flex-shrink:0;width:220px;padding:14px 16px;border-radius:14px;
//           border:1px solid rgba(255,255,255,0.08);
//           background:rgba(255,255,255,0.04);
//           cursor:pointer;position:relative;
//           transition:border-color 0.2s,background 0.2s,box-shadow 0.2s,transform 0.15s;
//         }
//         .cp-sel-card:hover { border-color:rgba(108,99,255,0.4);background:rgba(108,99,255,0.06);transform:translateY(-2px); }
//         .cp-sel-card.selected { border-color:rgba(108,99,255,0.7);background:rgba(108,99,255,0.1);box-shadow:0 0 0 2px rgba(108,99,255,0.2); }

//         .cp-sel-check { position:absolute;top:10px;right:10px;width:20px;height:20px;border-radius:6px;background:linear-gradient(135deg,#6c63ff,#4f46e5);display:flex;align-items:center;justify-content:center; }
//         .cp-sel-icon { width:32px;height:32px;border-radius:9px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.4);margin-bottom:9px;transition:color 0.2s,background 0.2s; }
//         .cp-sel-card.selected .cp-sel-icon { background:rgba(108,99,255,0.15);border-color:rgba(108,99,255,0.3);color:#a5b4fc; }
//         .cp-sel-name { font-size:0.82rem;font-weight:600;color:rgba(255,255,255,0.75);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-right:24px;margin-bottom:3px; }
//         .cp-sel-date { font-family:'DM Sans',sans-serif;font-size:0.72rem;color:rgba(255,255,255,0.28); }

//         /* Selection counter */
//         .cp-sel-meta { display:flex;align-items:center;justify-content:space-between;margin-top:1.25rem;flex-wrap:wrap;gap:10px; }
//         .cp-sel-counter { display:inline-flex;align-items:center;gap:6px;font-family:'DM Sans',sans-serif;font-size:0.8rem;color:rgba(255,255,255,0.35); }
//         .cp-sel-pip { width:8px;height:8px;border-radius:50%; }

//         /* Run button */
//         .cp-run-btn {
//           display:inline-flex;align-items:center;gap:8px;
//           padding:12px 26px;border-radius:13px;border:none;cursor:pointer;
//           font-family:'Sora',sans-serif;font-size:0.9rem;font-weight:600;color:#fff;
//           background:linear-gradient(135deg,#6c63ff,#4f46e5,#3b2fd6);
//           position:relative;overflow:hidden;
//           transition:transform 0.18s,box-shadow 0.18s,opacity 0.2s;
//           box-shadow:0 4px 22px rgba(108,99,255,0.35);
//         }
//         .cp-run-btn::before { content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);transition:left 0.5s; }
//         .cp-run-btn:hover:not(:disabled)::before { left:100%; }
//         .cp-run-btn:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 8px 28px rgba(108,99,255,0.5); }
//         .cp-run-btn:disabled { opacity:0.45;cursor:not-allowed; }

//         /* Spinner */
//         .cp-spin { animation:spin 0.8s linear infinite; }
//         @keyframes spin { to{transform:rotate(360deg)} }

//         /* Loading dots */
//         .cp-loading { display:flex;gap:6px;padding:1.5rem;justify-content:center; }
//         .cp-ldot { width:7px;height:7px;border-radius:50%;background:#6c63ff;animation:cp-bounce 1.2s ease-in-out infinite; }
//         .cp-ldot:nth-child(2){animation-delay:.2s}.cp-ldot:nth-child(3){animation-delay:.4s}
//         @keyframes cp-bounce { 0%,80%,100%{transform:scale(0.7);opacity:.4}40%{transform:scale(1);opacity:1} }

//         /* Verdict card */
//         .cp-verdict-card {
//           background:rgba(108,99,255,0.08);border:1px solid rgba(108,99,255,0.22);
//           border-radius:20px;padding:1.5rem;margin-bottom:1.25rem;position:relative;
//           animation:cp-cardIn 0.55s 0.05s both;
//         }
//         .cp-verdict-card::before { content:'';position:absolute;top:0;left:8%;right:8%;height:1px;background:linear-gradient(90deg,transparent,rgba(108,99,255,0.3),transparent); }
//         .cp-verdict-icon { width:40px;height:40px;border-radius:11px;background:linear-gradient(135deg,#6c63ff,#4f46e5);display:flex;align-items:center;justify-content:center;color:#fff;margin-bottom:1rem;box-shadow:0 4px 14px rgba(108,99,255,0.35); }
//         .cp-verdict-label { font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#a5b4fc;margin-bottom:6px; }
//         .cp-verdict-text { font-family:'DM Sans',sans-serif;font-size:0.95rem;color:rgba(255,255,255,0.72);line-height:1.7;font-style:italic; }

//         /* Table */
//         .cp-table-wrap { overflow-x:auto; }
//         .cp-table-wrap::-webkit-scrollbar { height:4px; }
//         .cp-table-wrap::-webkit-scrollbar-thumb { background:rgba(108,99,255,0.3);border-radius:99px; }

//         .cp-table { width:100%;border-collapse:collapse;min-width:480px; }

//         .cp-th-feature { padding:14px 16px;font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.3);width:140px;border-bottom:1px solid rgba(255,255,255,0.07); }
//         .cp-th-contract { padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.07);min-width:200px; }
//         .cp-th-file { font-size:0.88rem;font-weight:700;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:180px;margin-bottom:3px; }
//         .cp-th-link { font-size:11px;color:#a5b4fc;text-decoration:none;display:inline-flex;align-items:center;gap:3px; }
//         .cp-th-link:hover { color:#c4b5fd; }
//         .cp-th-accent-bar { height:2px;border-radius:999px;margin-bottom:8px; }

//         .cp-td-label { padding:12px 16px;font-family:'DM Sans',sans-serif;font-size:0.8rem;color:rgba(255,255,255,0.38);border-bottom:1px solid rgba(255,255,255,0.05);white-space:nowrap; }
//         .cp-td-val { padding:12px 16px;font-size:0.88rem;font-weight:600;color:rgba(255,255,255,0.75);border-bottom:1px solid rgba(255,255,255,0.05); }
//         .cp-table tr:last-child .cp-td-label,
//         .cp-table tr:last-child .cp-td-val { border-bottom:none; }
//         .cp-table tr:hover .cp-td-label,
//         .cp-table tr:hover .cp-td-val { background:rgba(255,255,255,0.02); }

//         .cp-best-chip { display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:8px;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.3);color:#34d399;font-weight:700;font-size:0.85rem; }
//         .cp-neutral-chip { display:inline-flex;align-items:center;padding:3px 10px;border-radius:8px;background:rgba(255,255,255,0.05);font-size:0.85rem;color:rgba(255,255,255,0.6); }

//         .cp-fee-badge-red { display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:8px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);color:#f87171;font-size:0.78rem;font-weight:700;margin-bottom:6px; }
//         .cp-fee-clean { display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:8px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);color:#34d399;font-size:0.82rem;font-weight:600; }
//         .cp-fee-row { display:flex;justify-content:space-between;align-items:center;gap:8px;font-family:'DM Sans',sans-serif;font-size:0.75rem;color:rgba(255,255,255,0.4);padding:3px 0; }
//         .cp-fee-amt { color:#f87171;font-weight:600;white-space:nowrap; }
//       `}</style>

//       <div className="cp-root page-enter">
//         <div className="cp-orb cp-orb-1" />
//         <div className="cp-orb cp-orb-2" />
//         <div className="cp-orb cp-orb-3" />
//         <div className="cp-grid-bg" />

//         <div className="cp-wrap">
//           {/* Header */}
//           <div className="cp-header">
//             <div>
//               <div>
//                 <span className="cp-badge">
//                   <span className="cp-badge-dot" />
//                   Smart Comparison
//                 </span>
//               </div>
//               <h1 className="cp-title">Compare Contracts</h1>
//               <p className="cp-sub">
//                 Select up to 3 contracts to compare side-by-side
//               </p>
//             </div>
//             <Link to="/" className="cp-back">
//               <svg
//                 width="13"
//                 height="13"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M19 12H5M12 5l-7 7 7 7" />
//               </svg>
//               Home
//             </Link>
//           </div>

//           {/* Selection Panel */}
//           <div className="cp-card" style={{ marginBottom: "1.25rem" }}>
//             <div className="cp-section-label">
//               <svg
//                 width="12"
//                 height="12"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//                 <polyline points="14 2 14 8 20 8" />
//               </svg>
//               Select Contracts (Max 3)
//             </div>

//             {historyLoading ? (
//               <div className="cp-loading">
//                 <div className="cp-ldot" />
//                 <div className="cp-ldot" />
//                 <div className="cp-ldot" />
//               </div>
//             ) : history.length === 0 ? (
//               <p
//                 style={{
//                   fontFamily: "'DM Sans',sans-serif",
//                   fontSize: "0.85rem",
//                   color: "rgba(255,255,255,0.28)",
//                 }}
//               >
//                 No contracts found. Upload some first.
//               </p>
//             ) : (
//               <div className="cp-scroll">
//                 {history.map((rec) => {
//                   const sel = selectedIds.includes(rec._id);
//                   return (
//                     <div
//                       key={rec._id}
//                       className={`cp-sel-card${sel ? " selected" : ""}`}
//                       onClick={() => toggleSelection(rec._id)}
//                     >
//                       {sel && (
//                         <div className="cp-sel-check">
//                           <svg
//                             width="10"
//                             height="10"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="white"
//                             strokeWidth="3"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           >
//                             <polyline points="20 6 9 17 4 12" />
//                           </svg>
//                         </div>
//                       )}
//                       <div className="cp-sel-icon">
//                         <svg
//                           width="14"
//                           height="14"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         >
//                           <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//                           <polyline points="14 2 14 8 20 8" />
//                         </svg>
//                       </div>
//                       <div className="cp-sel-name" title={rec.fileName}>
//                         {rec.fileName}
//                       </div>
//                       <div className="cp-sel-date">
//                         {new Date(rec.uploadedAt).toLocaleDateString()}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}

//             <div className="cp-sel-meta">
//               <div className="cp-sel-counter">
//                 {[0, 1, 2].map((i) => (
//                   <div
//                     key={i}
//                     className="cp-sel-pip"
//                     style={{
//                       background:
//                         i < selectedIds.length
//                           ? "#6c63ff"
//                           : "rgba(255,255,255,0.12)",
//                       boxShadow:
//                         i < selectedIds.length ? "0 0 6px #6c63ff" : "none",
//                     }}
//                   />
//                 ))}
//                 <span>{selectedIds.length} of 3 selected</span>
//               </div>
//               <button
//                 onClick={runComparison}
//                 disabled={loading || selectedIds.length < 2}
//                 className="cp-run-btn"
//               >
//                 {loading ? (
//                   <>
//                     <svg
//                       className="cp-spin"
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2.5"
//                     >
//                       <path
//                         d="M21 12a9 9 0 1 1-6.219-8.56"
//                         strokeLinecap="round"
//                       />
//                     </svg>
//                     Analyzing…
//                   </>
//                 ) : (
//                   <>
//                     Compare Contracts
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2.5"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="M5 12h14M12 5l7 7-7 7" />
//                     </svg>
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Results */}
//           {comparisonData.length > 0 && (
//             <div style={{ animation: "cp-cardIn 0.5s ease both" }}>
//               {/* AI Verdict */}
//               {aiVerdict && (
//                 <div className="cp-verdict-card">
//                   <div className="cp-verdict-icon">
//                     <svg
//                       width="18"
//                       height="18"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//                     </svg>
//                   </div>
//                   <div className="cp-verdict-label">AI Verdict</div>
//                   <div className="cp-verdict-text">"{aiVerdict}"</div>
//                 </div>
//               )}

//               {/* Comparison Table */}
//               <div
//                 className="cp-card"
//                 style={{ padding: "0", animationDelay: "0.08s" }}
//               >
//                 <div className="cp-table-wrap">
//                   <table className="cp-table">
//                     <thead>
//                       <tr>
//                         <th className="cp-th-feature">Feature</th>
//                         {comparisonData.map((contract, idx) => (
//                           <th key={idx} className="cp-th-contract">
//                             <div
//                               className="cp-th-accent-bar"
//                               style={{ background: colAccents[idx] }}
//                             />
//                             <div
//                               className="cp-th-file"
//                               title={contract.fileName}
//                             >
//                               {contract.fileName}
//                             </div>
//                             <Link
//                               to={`/results/${contract._id}`}
//                               className="cp-th-link"
//                             >
//                               View Analysis
//                               <svg
//                                 width="10"
//                                 height="10"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 strokeWidth="2.5"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                               >
//                                 <path d="M7 17L17 7M7 7h10v10" />
//                               </svg>
//                             </Link>
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {/* Loan Amount */}
//                       <tr>
//                         <td className="cp-td-label">Loan Amount</td>
//                         {comparisonData.map((c, i) => (
//                           <td key={i} className="cp-td-val">
//                             {c.fields?.loan_amount || "—"}
//                           </td>
//                         ))}
//                       </tr>

//                       {/* Interest Rate */}
//                       <tr>
//                         <td className="cp-td-label">Interest Rate</td>
//                         {comparisonData.map((c, i) => {
//                           const rawRate = c.fields?.interest_rate
//                             ? String(c.fields.interest_rate).replace("%", "")
//                             : "--";
//                           const isBest =
//                             getBestClass(
//                               rawRate,
//                               comparisonData.map(
//                                 (d) => d.fields?.interest_rate,
//                               ),
//                               "low",
//                             ) === "best";
//                           return (
//                             <td key={i} className="cp-td-val">
//                               {isBest ? (
//                                 <span className="cp-best-chip">
//                                   <svg
//                                     width="10"
//                                     height="10"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     strokeWidth="3"
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                   >
//                                     <polyline points="20 6 9 17 4 12" />
//                                   </svg>
//                                   {rawRate}%
//                                 </span>
//                               ) : (
//                                 <span className="cp-neutral-chip">
//                                   {rawRate}%
//                                 </span>
//                               )}
//                             </td>
//                           );
//                         })}
//                       </tr>

//                       {/* Monthly EMI */}
//                       <tr>
//                         <td className="cp-td-label">Monthly EMI</td>
//                         {comparisonData.map((c, i) => {
//                           const isBest =
//                             getBestClass(
//                               c.fields?.monthly_payment,
//                               comparisonData.map(
//                                 (d) => d.fields?.monthly_payment,
//                               ),
//                               "low",
//                             ) === "best";
//                           return (
//                             <td key={i} className="cp-td-val">
//                               {isBest ? (
//                                 <span className="cp-best-chip">
//                                   <svg
//                                     width="10"
//                                     height="10"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     strokeWidth="3"
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                   >
//                                     <polyline points="20 6 9 17 4 12" />
//                                   </svg>
//                                   {c.fields?.monthly_payment || "—"}
//                                 </span>
//                               ) : (
//                                 <span className="cp-neutral-chip">
//                                   {c.fields?.monthly_payment || "—"}
//                                 </span>
//                               )}
//                             </td>
//                           );
//                         })}
//                       </tr>

//                       {/* Hidden Fees */}
//                       <tr>
//                         <td className="cp-td-label">Hidden Fees</td>
//                         {comparisonData.map((c, i) => (
//                           <td
//                             key={i}
//                             className="cp-td-val"
//                             style={{ verticalAlign: "top" }}
//                           >
//                             {c.hiddenFees?.fees?.length > 0 ? (
//                               <div>
//                                 <span className="cp-fee-badge-red">
//                                   <svg
//                                     width="10"
//                                     height="10"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     strokeWidth="2.5"
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                   >
//                                     <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
//                                     <line x1="12" y1="9" x2="12" y2="13" />
//                                     <line x1="12" y1="17" x2="12.01" y2="17" />
//                                   </svg>
//                                   {c.hiddenFees.fees.length} Found
//                                 </span>
//                                 {c.hiddenFees.fees.map((f, idx) => (
//                                   <div key={idx} className="cp-fee-row">
//                                     <span
//                                       style={{
//                                         overflow: "hidden",
//                                         textOverflow: "ellipsis",
//                                         whiteSpace: "nowrap",
//                                         maxWidth: "120px",
//                                       }}
//                                       title={f.name}
//                                     >
//                                       {f.name}
//                                     </span>
//                                     <span className="cp-fee-amt">
//                                       {f.amount && f.amount !== "0"
//                                         ? `₹${f.amount}`
//                                         : f.description || "Variable"}
//                                     </span>
//                                   </div>
//                                 ))}
//                               </div>
//                             ) : (
//                               <span className="cp-fee-clean">
//                                 <svg
//                                   width="11"
//                                   height="11"
//                                   viewBox="0 0 24 24"
//                                   fill="none"
//                                   stroke="currentColor"
//                                   strokeWidth="3"
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                 >
//                                   <polyline points="20 6 9 17 4 12" />
//                                 </svg>
//                                 Clean
//                               </span>
//                             )}
//                           </td>
//                         ))}
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default ComparisonPage;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import API_BASE from "../config/api";

// const ComparisonPage = () => {
//   const [history, setHistory] = useState([]);
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [comparisonData, setComparisonData] = useState([]);
//   const [aiVerdict, setAiVerdict] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [historyLoading, setHistoryLoading] = useState(true);

//   useEffect(() => {
//     const token = sessionStorage.getItem("token");
//     fetch(`${API_BASE}/api/history`, {
//       headers: token ? { Authorization: `Bearer ${token}` } : {}
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) setHistory(data.data || data.history || []);
//       })
//       .finally(() => setHistoryLoading(false));
//   }, []);

//   const toggleSelection = (id) => {
//     if (selectedIds.includes(id)) {
//       setSelectedIds(selectedIds.filter((i) => i !== id));
//     } else {
//       if (selectedIds.length >= 3) {
//         toast.warning("Select max 3 contracts.");
//         return;
//       }
//       setSelectedIds([...selectedIds, id]);
//     }
//   };

//   const runComparison = async () => {
//     if (selectedIds.length < 2) {
//       toast.info("Select at least 2 contracts.");
//       return;
//     }
//     setLoading(true);
//     setComparisonData([]);
//     setAiVerdict("");
//     try {
//       const res = await fetch(
//         `${API_BASE}/api/comparison/compare`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${sessionStorage.getItem("token")}`
//           },
//           body: JSON.stringify({ ids: selectedIds }),
//         },
//       );
//       const data = await res.json();
//       if (data.success) {
//         setComparisonData(data.data);
//         setAiVerdict(data.verdict);
//         toast.success("Comparison Complete!");
//       } else toast.error(data.message);
//     } catch (err) {
//       toast.error("Server connection failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper to extract clean numbers for our charts and table
//   const extractNum = (str) => parseFloat(String(str).replace(/[^0-9.]/g, "")) || 0;

//   const getBestClass = (currentVal, allVals, type = "low") => {
//     if (!currentVal) return "";
//     const cleanVals = allVals.map(v => extractNum(v)).filter((v) => v > 0);
//     const current = extractNum(currentVal);
//     if (cleanVals.length === 0 || current === 0) return "";
//     const best = type === "low" ? Math.min(...cleanVals) : Math.max(...cleanVals);
//     return current === best ? "best" : "";
//   };

//   const colAccents = ["#6c63ff", "#10b981", "#f59e0b"];

//   // Helper component for the new animated Bar Charts
//   const VisualBar = ({ label, value, max, color, format = "" }) => {
//     const [w, setW] = useState(0);
//     const pct = max > 0 ? (value / max) * 100 : 0;

//     useEffect(() => {
//       // Small delay to trigger the CSS transition
//       const t = setTimeout(() => setW(pct), 150);
//       return () => clearTimeout(t);
//     }, [pct]);

//     return (
//       <div style={{ marginBottom: '14px' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px', color: '#94A3B8' }}>
//           <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }} title={label}>
//             {label}
//           </span>
//           <span style={{ color: '#fff', fontWeight: 700 }}>
//             {format === 'currency' ? `₹${value.toLocaleString('en-IN')}` : format === 'percent' ? `${value}%` : value}
//           </span>
//         </div>
//         <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
//           <div style={{ height: '100%', width: `${w}%`, background: color, borderRadius: '4px', transition: 'width 1s cubic-bezier(0.22, 1, 0.36, 1)' }} />
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
//         *, *::before, *::after { box-sizing: border-box; }

//         .cp-root {
//           font-family: 'Sora', sans-serif;
//           min-height: 100vh;
//           background: #050816;
//           position: relative;
//           overflow-x: hidden;
//           padding: 2.5rem 1.25rem 5rem;
//         }
//         .cp-orb { position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0;animation:cp-drift 14s ease-in-out infinite alternate; }
//         .cp-orb-1 { width:520px;height:520px;background:radial-gradient(circle,#4f46e5,#1e1b4b);top:-160px;left:-160px;opacity:0.3; }
//         .cp-orb-2 { width:440px;height:440px;background:radial-gradient(circle,#0ea5e9,#0369a1);bottom:-150px;right:-130px;opacity:0.22;animation-delay:-7s; }
//         .cp-orb-3 { width:270px;height:270px;background:radial-gradient(circle,#8b5cf6,#6d28d9);top:38%;left:60%;opacity:0.17;animation-delay:-11s; }
//         @keyframes cp-drift { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(28px,22px) scale(1.06)} }
//         .cp-grid-bg { position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);background-size:48px 48px; }

//         .cp-wrap { position:relative;z-index:1;max-width:1100px;margin:0 auto; }

//         /* Header */
//         .cp-header { display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:2.5rem;gap:1rem;flex-wrap:wrap; }
//         .cp-badge { display:inline-flex;align-items:center;gap:6px;background:rgba(108,99,255,0.14);border:1px solid rgba(108,99,255,0.3);border-radius:999px;padding:4px 14px;font-size:10px;font-weight:600;letter-spacing:0.08em;color:#a5b4fc;text-transform:uppercase;margin-bottom:0.75rem; }
//         .cp-badge-dot { width:6px;height:6px;border-radius:50%;background:#6c63ff;box-shadow:0 0 6px #6c63ff;animation:cp-pulse 2s ease-in-out infinite; }
//         @keyframes cp-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
//         .cp-title { font-size:clamp(1.6rem,4vw,2.2rem);font-weight:800;color:#fff;letter-spacing:-0.04em;line-height:1.1;margin:0 0 0.3rem; }
//         .cp-sub { font-family:'DM Sans',sans-serif;font-size:0.875rem;color:rgba(255,255,255,0.38); }
//         .cp-back { display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:11px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.55);font-family:'Sora',sans-serif;font-size:0.8rem;font-weight:600;text-decoration:none;transition:background 0.2s,border-color 0.2s,transform 0.15s;white-space:nowrap;align-self:flex-start; }
//         .cp-back:hover { background:rgba(255,255,255,0.09);border-color:rgba(255,255,255,0.2);transform:translateY(-1px); }

//         /* Glass card */
//         .cp-card {
//           background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);
//           border-radius:22px;padding:1.75rem;
//           backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);
//           box-shadow:0 20px 56px rgba(0,0,0,0.4),0 0 0 1px rgba(255,255,255,0.03) inset;
//           position:relative;
//           animation:cp-cardIn 0.55s cubic-bezier(0.22,1,0.36,1) both;
//         }
//         @keyframes cp-cardIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
//         .cp-card::before { content:'';position:absolute;top:0;left:8%;right:8%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent); }

//         .cp-section-label { font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:1rem;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:6px; }

//         /* Selection cards */
//         .cp-scroll { display:flex;gap:12px;overflow-x:auto;padding-bottom:8px; }
//         .cp-scroll::-webkit-scrollbar { height:3px; }
//         .cp-scroll::-webkit-scrollbar-thumb { background:rgba(108,99,255,0.3);border-radius:99px; }

//         .cp-sel-card {
//           flex-shrink:0;width:220px;padding:14px 16px;border-radius:14px;
//           border:1px solid rgba(255,255,255,0.08);
//           background:rgba(255,255,255,0.04);
//           cursor:pointer;position:relative;
//           transition:border-color 0.2s,background 0.2s,box-shadow 0.2s,transform 0.15s;
//         }
//         .cp-sel-card:hover { border-color:rgba(108,99,255,0.4);background:rgba(108,99,255,0.06);transform:translateY(-2px); }
//         .cp-sel-card.selected { border-color:rgba(108,99,255,0.7);background:rgba(108,99,255,0.1);box-shadow:0 0 0 2px rgba(108,99,255,0.2); }

//         .cp-sel-check { position:absolute;top:10px;right:10px;width:20px;height:20px;border-radius:6px;background:linear-gradient(135deg,#6c63ff,#4f46e5);display:flex;align-items:center;justify-content:center; }
//         .cp-sel-icon { width:32px;height:32px;border-radius:9px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.4);margin-bottom:9px;transition:color 0.2s,background 0.2s; }
//         .cp-sel-card.selected .cp-sel-icon { background:rgba(108,99,255,0.15);border-color:rgba(108,99,255,0.3);color:#a5b4fc; }
//         .cp-sel-name { font-size:0.82rem;font-weight:600;color:rgba(255,255,255,0.75);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-right:24px;margin-bottom:3px; }
//         .cp-sel-date { font-family:'DM Sans',sans-serif;font-size:0.72rem;color:rgba(255,255,255,0.28); }

//         /* Selection counter */
//         .cp-sel-meta { display:flex;align-items:center;justify-content:space-between;margin-top:1.25rem;flex-wrap:wrap;gap:10px; }
//         .cp-sel-counter { display:inline-flex;align-items:center;gap:6px;font-family:'DM Sans',sans-serif;font-size:0.8rem;color:rgba(255,255,255,0.35); }
//         .cp-sel-pip { width:8px;height:8px;border-radius:50%; }

//         /* Run button */
//         .cp-run-btn {
//           display:inline-flex;align-items:center;gap:8px;
//           padding:12px 26px;border-radius:13px;border:none;cursor:pointer;
//           font-family:'Sora',sans-serif;font-size:0.9rem;font-weight:600;color:#fff;
//           background:linear-gradient(135deg,#6c63ff,#4f46e5,#3b2fd6);
//           position:relative;overflow:hidden;
//           transition:transform 0.18s,box-shadow 0.18s,opacity 0.2s;
//           box-shadow:0 4px 22px rgba(108,99,255,0.35);
//         }
//         .cp-run-btn::before { content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);transition:left 0.5s; }
//         .cp-run-btn:hover:not(:disabled)::before { left:100%; }
//         .cp-run-btn:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 8px 28px rgba(108,99,255,0.5); }
//         .cp-run-btn:disabled { opacity:0.45;cursor:not-allowed; }

//         /* Spinner */
//         .cp-spin { animation:spin 0.8s linear infinite; }
//         @keyframes spin { to{transform:rotate(360deg)} }

//         /* Loading dots */
//         .cp-loading { display:flex;gap:6px;padding:1.5rem;justify-content:center; }
//         .cp-ldot { width:7px;height:7px;border-radius:50%;background:#6c63ff;animation:cp-bounce 1.2s ease-in-out infinite; }
//         .cp-ldot:nth-child(2){animation-delay:.2s}.cp-ldot:nth-child(3){animation-delay:.4s}
//         @keyframes cp-bounce { 0%,80%,100%{transform:scale(0.7);opacity:.4}40%{transform:scale(1);opacity:1} }

//         /* Verdict card */
//         .cp-verdict-card {
//           background:rgba(200,168,80,0.06);border:1px solid rgba(200,168,80,0.22);
//           border-radius:20px;padding:1.5rem;margin-bottom:1.25rem;position:relative;
//           animation:cp-cardIn 0.55s 0.05s both;
//         }
//         .cp-verdict-card::before { content:'';position:absolute;top:0;left:8%;right:8%;height:1px;background:linear-gradient(90deg,transparent,rgba(200,168,80,0.3),transparent); }
//         .cp-verdict-icon { width:40px;height:40px;border-radius:11px;background:linear-gradient(135deg,#C8A850,#a07830);display:flex;align-items:center;justify-content:center;color:#0F172A;margin-bottom:1rem;box-shadow:0 4px 14px rgba(200,168,80,0.35); font-size: 1.2rem; }
//         .cp-verdict-label { font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#C8A850;margin-bottom:6px; }
//         .cp-verdict-text { font-family:'DM Sans',sans-serif;font-size:0.95rem;color:rgba(255,255,255,0.85);line-height:1.7;font-style:italic; }

//         /* Table */
//         .cp-table-wrap { overflow-x:auto; }
//         .cp-table-wrap::-webkit-scrollbar { height:4px; }
//         .cp-table-wrap::-webkit-scrollbar-thumb { background:rgba(108,99,255,0.3);border-radius:99px; }

//         .cp-table { width:100%;border-collapse:collapse;min-width:480px; }

//         .cp-th-feature { padding:14px 16px;font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.3);width:140px;border-bottom:1px solid rgba(255,255,255,0.07); }
//         .cp-th-contract { padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.07);min-width:200px; }
//         .cp-th-file { font-size:0.88rem;font-weight:700;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:180px;margin-bottom:3px; }
//         .cp-th-link { font-size:11px;color:#a5b4fc;text-decoration:none;display:inline-flex;align-items:center;gap:3px; transition: color 0.2s; }
//         .cp-th-link:hover { color:#c4b5fd; }
//         .cp-th-accent-bar { height:4px;border-radius:999px;margin-bottom:8px; width: 40px; }

//         .cp-td-label { padding:12px 16px;font-family:'DM Sans',sans-serif;font-size:0.8rem;color:rgba(255,255,255,0.38);border-bottom:1px solid rgba(255,255,255,0.05);white-space:nowrap; }
//         .cp-td-val { padding:12px 16px;font-size:0.88rem;font-weight:600;color:rgba(255,255,255,0.75);border-bottom:1px solid rgba(255,255,255,0.05); }
//         .cp-table tr:last-child .cp-td-label,
//         .cp-table tr:last-child .cp-td-val { border-bottom:none; }
//         .cp-table tr:hover .cp-td-label,
//         .cp-table tr:hover .cp-td-val { background:rgba(255,255,255,0.02); }

//         .cp-best-chip { display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:8px;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.3);color:#34d399;font-weight:700;font-size:0.85rem; }
//         .cp-neutral-chip { display:inline-flex;align-items:center;padding:3px 10px;border-radius:8px;background:rgba(255,255,255,0.05);font-size:0.85rem;color:rgba(255,255,255,0.6); }

//         .cp-fee-badge-red { display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:8px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);color:#f87171;font-size:0.78rem;font-weight:700;margin-bottom:6px; }
//         .cp-fee-clean { display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:8px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);color:#34d399;font-size:0.82rem;font-weight:600; }
//         .cp-fee-row { display:flex;justify-content:space-between;align-items:center;gap:8px;font-family:'DM Sans',sans-serif;font-size:0.75rem;color:rgba(255,255,255,0.4);padding:3px 0; }
//         .cp-fee-amt { color:#f87171;font-weight:600;white-space:nowrap; }

//         /* Chart Grid Layout */
//         .cp-charts-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem; }
//         @media(min-width: 768px) { .cp-charts-grid { grid-template-columns: 1fr 1fr; } }
//       `}</style>

//       <div className="cp-root page-enter">
//         <div className="cp-orb cp-orb-1" />
//         <div className="cp-orb cp-orb-2" />
//         <div className="cp-orb cp-orb-3" />
//         <div className="cp-grid-bg" />

//         <div className="cp-wrap">
//           {/* Header */}
//           <div className="cp-header">
//             <div>
//               <div>
//                 <span className="cp-badge">
//                   <span className="cp-badge-dot" />
//                   Smart Comparison
//                 </span>
//               </div>
//               <h1 className="cp-title">Compare Contracts</h1>
//               <p className="cp-sub">
//                 Select up to 3 contracts to compare side-by-side
//               </p>
//             </div>
//             <Link to="/" className="cp-back">
//               <svg
//                 width="13"
//                 height="13"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M19 12H5M12 5l-7 7 7 7" />
//               </svg>
//               Home
//             </Link>
//           </div>

//           {/* Selection Panel */}
//           <div className="cp-card" style={{ marginBottom: "1.25rem" }}>
//             <div className="cp-section-label">
//               <svg
//                 width="12"
//                 height="12"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//                 <polyline points="14 2 14 8 20 8" />
//               </svg>
//               Select Contracts (Max 3)
//             </div>

//             {historyLoading ? (
//               <div className="cp-loading">
//                 <div className="cp-ldot" />
//                 <div className="cp-ldot" />
//                 <div className="cp-ldot" />
//               </div>
//             ) : history.length === 0 ? (
//               <p
//                 style={{
//                   fontFamily: "'DM Sans',sans-serif",
//                   fontSize: "0.85rem",
//                   color: "rgba(255,255,255,0.28)",
//                 }}
//               >
//                 No contracts found. Upload some first.
//               </p>
//             ) : (
//               <div className="cp-scroll">
//                 {history.map((rec) => {
//                   const sel = selectedIds.includes(rec._id);
//                   return (
//                     <div
//                       key={rec._id}
//                       className={`cp-sel-card${sel ? " selected" : ""}`}
//                       onClick={() => toggleSelection(rec._id)}
//                     >
//                       {sel && (
//                         <div className="cp-sel-check">
//                           <svg
//                             width="10"
//                             height="10"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="white"
//                             strokeWidth="3"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           >
//                             <polyline points="20 6 9 17 4 12" />
//                           </svg>
//                         </div>
//                       )}
//                       <div className="cp-sel-icon">
//                         <svg
//                           width="14"
//                           height="14"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         >
//                           <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//                           <polyline points="14 2 14 8 20 8" />
//                         </svg>
//                       </div>
//                       <div className="cp-sel-name" title={rec.fileName}>
//                         {rec.fileName}
//                       </div>
//                       <div className="cp-sel-date">
//                         {new Date(rec.uploadedAt).toLocaleDateString()}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}

//             <div className="cp-sel-meta">
//               <div className="cp-sel-counter">
//                 {[0, 1, 2].map((i) => (
//                   <div
//                     key={i}
//                     className="cp-sel-pip"
//                     style={{
//                       background:
//                         i < selectedIds.length
//                           ? "#6c63ff"
//                           : "rgba(255,255,255,0.12)",
//                       boxShadow:
//                         i < selectedIds.length ? "0 0 6px #6c63ff" : "none",
//                     }}
//                   />
//                 ))}
//                 <span>{selectedIds.length} of 3 selected</span>
//               </div>
//               <button
//                 onClick={runComparison}
//                 disabled={loading || selectedIds.length < 2}
//                 className="cp-run-btn"
//               >
//                 {loading ? (
//                   <>
//                     <svg
//                       className="cp-spin"
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2.5"
//                     >
//                       <path
//                         d="M21 12a9 9 0 1 1-6.219-8.56"
//                         strokeLinecap="round"
//                       />
//                     </svg>
//                     Analyzing…
//                   </>
//                 ) : (
//                   <>
//                     Compare Contracts
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2.5"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="M5 12h14M12 5l7 7-7 7" />
//                     </svg>
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Results */}
//           {comparisonData.length > 0 && (
//             <div style={{ animation: "cp-cardIn 0.5s ease both" }}>

//               {/* AI Verdict */}
//               {aiVerdict && (
//                 <div className="cp-verdict-card">
//                   <div className="cp-verdict-icon">💡</div>
//                   <div className="cp-verdict-label">AI Deal Verdict</div>
//                   <div className="cp-verdict-text" dangerouslySetInnerHTML={{ __html: `"${aiVerdict.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #C8A850">$1</strong>')}"` }} />
                  
//                 </div>
//               )}

//               {/* NEW Visual Dashboard */}
//               <div className="cp-card" style={{ marginBottom: "1.25rem", animationDelay: "0.06s" }}>
//                 <div className="cp-section-label">📊 Visual Comparison</div>

//                 <div className="cp-charts-grid">

//                   {/* Interest Rate Chart */}
//                   <div>
//                     <h4 style={{ color: '#F1F5F9', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 600 }}>Interest Rate comparison</h4>
//                     {comparisonData.map((c, i) => {
//                       const val = extractNum(c.fields?.interest_rate);
//                       const maxVal = Math.max(...comparisonData.map(d => extractNum(d.fields?.interest_rate))) || 1;
//                       return (
//                         <VisualBar
//                           key={i}
//                           label={c.fileName}
//                           value={val}
//                           max={maxVal}
//                           color={colAccents[i]}
//                           format="percent"
//                         />
//                       );
//                     })}
//                   </div>

//                   {/* Monthly EMI Chart */}
//                   <div>
//                     <h4 style={{ color: '#F1F5F9', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 600 }}>Monthly EMI comparison</h4>
//                     {comparisonData.map((c, i) => {
//                       const val = extractNum(c.fields?.monthly_payment) || extractNum(c.fields?.emi);
//                       const maxVal = Math.max(...comparisonData.map(d => extractNum(d.fields?.monthly_payment) || extractNum(d.fields?.emi))) || 1;
//                       return (
//                         <VisualBar
//                           key={i}
//                           label={c.fileName}
//                           value={val}
//                           max={maxVal}
//                           color={colAccents[i]}
//                           format="currency"
//                         />
//                       );
//                     })}
//                   </div>

//                 </div>
//               </div>

//               {/* Comparison Table */}
//               <div
//                 className="cp-card"
//                 style={{ padding: "0", animationDelay: "0.08s" }}
//               >
//                 <div className="cp-table-wrap">
//                   <table className="cp-table">
//                     <thead>
//                       <tr>
//                         <th className="cp-th-feature">Feature</th>
//                         {comparisonData.map((contract, idx) => (
//                           <th key={idx} className="cp-th-contract">
//                             <div
//                               className="cp-th-accent-bar"
//                               style={{ background: colAccents[idx] }}
//                             />
//                             <div
//                               className="cp-th-file"
//                               title={contract.fileName}
//                             >
//                               {contract.fileName}
//                             </div>
//                             <Link
//                               to={`/results/${contract._id}`}
//                               className="cp-th-link"
//                             >
//                               View Detailed Analysis
//                               <svg
//                                 width="10"
//                                 height="10"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 strokeWidth="2.5"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                               >
//                                 <path d="M7 17L17 7M7 7h10v10" />
//                               </svg>
//                             </Link>
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {/* Loan Amount */}
//                       <tr>
//                         <td className="cp-td-label">Loan Amount</td>
//                         {comparisonData.map((c, i) => (
//                           <td key={i} className="cp-td-val">
//                             {c.fields?.loan_amount || "—"}
//                           </td>
//                         ))}
//                       </tr>

//                       {/* Interest Rate */}
//                       <tr>
//                         <td className="cp-td-label">Interest Rate</td>
//                         {comparisonData.map((c, i) => {
//                           const rawRate = c.fields?.interest_rate
//                             ? String(c.fields.interest_rate).replace("%", "")
//                             : "--";
//                           const isBest =
//                             getBestClass(
//                               rawRate,
//                               comparisonData.map(
//                                 (d) => d.fields?.interest_rate,
//                               ),
//                               "low",
//                             ) === "best";
//                           return (
//                             <td key={i} className="cp-td-val">
//                               {isBest ? (
//                                 <span className="cp-best-chip">
//                                   <svg
//                                     width="10"
//                                     height="10"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     strokeWidth="3"
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                   >
//                                     <polyline points="20 6 9 17 4 12" />
//                                   </svg>
//                                   {rawRate}%
//                                 </span>
//                               ) : (
//                                 <span className="cp-neutral-chip">
//                                   {rawRate}%
//                                 </span>
//                               )}
//                             </td>
//                           );
//                         })}
//                       </tr>

//                       {/* Monthly EMI */}
//                       <tr>
//                         <td className="cp-td-label">Monthly EMI</td>
//                         {comparisonData.map((c, i) => {
//                           const emiValue = c.fields?.monthly_payment || c.fields?.emi;
//                           const isBest =
//                             getBestClass(
//                               emiValue,
//                               comparisonData.map(
//                                 (d) => d.fields?.monthly_payment || d.fields?.emi,
//                               ),
//                               "low",
//                             ) === "best";
//                           return (
//                             <td key={i} className="cp-td-val">
//                               {isBest ? (
//                                 <span className="cp-best-chip">
//                                   <svg
//                                     width="10"
//                                     height="10"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     strokeWidth="3"
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                   >
//                                     <polyline points="20 6 9 17 4 12" />
//                                   </svg>
//                                   {emiValue || "—"}
//                                 </span>
//                               ) : (
//                                 <span className="cp-neutral-chip">
//                                   {emiValue || "—"}
//                                 </span>
//                               )}
//                             </td>
//                           );
//                         })}
//                       </tr>

//                       {/* Hidden Fees */}
//                       <tr>
//                         <td className="cp-td-label">Hidden Fees</td>
//                         {comparisonData.map((c, i) => (
//                           <td
//                             key={i}
//                             className="cp-td-val"
//                             style={{ verticalAlign: "top" }}
//                           >
//                             {c.hiddenFees?.fees?.length > 0 ? (
//                               <div>
//                                 <span className="cp-fee-badge-red">
//                                   <svg
//                                     width="10"
//                                     height="10"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     strokeWidth="2.5"
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                   >
//                                     <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
//                                     <line x1="12" y1="9" x2="12" y2="13" />
//                                     <line x1="12" y1="17" x2="12.01" y2="17" />
//                                   </svg>
//                                   {c.hiddenFees.fees.length} Found
//                                 </span>
//                                 {c.hiddenFees.fees.map((f, idx) => (
//                                   <div key={idx} className="cp-fee-row">
//                                     <span
//                                       style={{
//                                         overflow: "hidden",
//                                         textOverflow: "ellipsis",
//                                         whiteSpace: "nowrap",
//                                         maxWidth: "120px",
//                                       }}
//                                       title={f.name}
//                                     >
//                                       {f.name}
//                                     </span>
//                                     <span className="cp-fee-amt">
//                                       {f.amount && f.amount !== "0"
//                                         ? `₹${f.amount}`
//                                         : f.description || "Variable"}
//                                     </span>
//                                   </div>
//                                 ))}
//                               </div>
//                             ) : (
//                               <span className="cp-fee-clean">
//                                 <svg
//                                   width="11"
//                                   height="11"
//                                   viewBox="0 0 24 24"
//                                   fill="none"
//                                   stroke="currentColor"
//                                   strokeWidth="3"
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                 >
//                                   <polyline points="20 6 9 17 4 12" />
//                                 </svg>
//                                 Clean
//                               </span>
//                             )}
//                           </td>
//                         ))}
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default ComparisonPage;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE from "../config/api";

const ComparisonPage = () => {
  const [history, setHistory] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [aiVerdict, setAiVerdict] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    fetch(`${API_BASE}/api/history`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setHistory(data.data || data.history || []);
      })
      .finally(() => setHistoryLoading(false));
  }, []);

  const toggleSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      if (selectedIds.length >= 3) {
        toast.warning("Select max 3 contracts.");
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const runComparison = async () => {
    if (selectedIds.length < 2) {
      toast.info("Select at least 2 contracts.");
      return;
    }
    setLoading(true);
    setComparisonData([]);
    setAiVerdict("");
    try {
      const res = await fetch(`${API_BASE}/api/comparison/compare`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const data = await res.json();
      if (data.success) {
        setComparisonData(data.data);
        setAiVerdict(data.verdict);
        toast.success("Comparison Complete!");
      } else toast.error(data.message);
    } catch (err) {
      toast.error("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const extractNum = (str) => parseFloat(String(str).replace(/[^0-9.]/g, "")) || 0;
  const colAccents = ["#6c63ff", "#10b981", "#f59e0b"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .co-root { font-family: 'Sora', sans-serif; min-height: 100vh; background: #050816; position: relative; overflow-x: hidden; padding: 2.5rem 1.25rem 5rem; color: #F1F5F9; }
        .co-grid-bg { position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);background-size:48px 48px; }
        .co-orb { position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0;animation:co-drift 14s ease-in-out infinite alternate; }
        .co-orb-1 { width:520px;height:520px;background:radial-gradient(circle,#4f46e5,#1e1b4b);top:-160px;left:-160px;opacity:0.2; }
        .co-orb-2 { width:440px;height:440px;background:radial-gradient(circle,#10b981,#064e3b);bottom:-150px;right:-130px;opacity:0.15;animation-delay:-7s; }
        @keyframes co-drift { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(28px,22px) scale(1.06)} }

        .co-wrap { position:relative;z-index:1;max-width:1100px;margin:0 auto; }

        .co-header { display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:2.5rem;flex-wrap:wrap;gap:1rem; }
        .co-badge { display:inline-flex;align-items:center;gap:6px;background:rgba(108,99,255,0.15);border:1px solid rgba(108,99,255,0.3);border-radius:999px;padding:4px 14px;font-size:10px;font-weight:700;letter-spacing:0.08em;color:#a5b4fc;text-transform:uppercase;margin-bottom:0.75rem; }
        .co-title { font-size:clamp(1.6rem,4vw,2.2rem);font-weight:800;color:#fff;letter-spacing:-0.04em;line-height:1.1;margin:0 0 0.3rem; }
        .co-sub { font-family:'DM Sans',sans-serif;font-size:0.9rem;color:rgba(255,255,255,0.4); }

        .co-sel-panel { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:1.5rem; margin-bottom:2rem; backdrop-filter:blur(20px); }
        .co-scroll { display:flex;gap:12px;overflow-x:auto;padding-bottom:12px; }
        .co-scroll::-webkit-scrollbar { height:4px; }
        .co-scroll::-webkit-scrollbar-thumb { background:rgba(108,99,255,0.3);border-radius:99px; }

        .co-sel-card { flex-shrink:0;width:200px;padding:12px 14px;border-radius:12px; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.02); cursor:pointer;position:relative; transition:all 0.2s; }
        .co-sel-card:hover { border-color:rgba(108,99,255,0.4);background:rgba(108,99,255,0.06); transform:translateY(-2px); }
        .co-sel-card.selected { border-color:#6c63ff;background:rgba(108,99,255,0.1);box-shadow:0 0 0 1px #6c63ff; }
        .co-sel-name { font-size:0.8rem;font-weight:600;color:#F1F5F9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:4px; }
        .co-sel-date { font-family:'DM Sans',sans-serif;font-size:0.7rem;color:rgba(255,255,255,0.3); }

        .co-run-btn { display:inline-flex;align-items:center;justify-content:center;gap:8px; padding:12px 28px;border-radius:12px;border:none;cursor:pointer; font-family:'Sora',sans-serif;font-size:0.95rem;font-weight:700;color:#fff; background:linear-gradient(135deg,#6c63ff,#4f46e5); transition:transform 0.2s,box-shadow 0.2s; box-shadow:0 8px 24px rgba(108,99,255,0.3); width:100%; margin-top:1rem; }
        .co-run-btn:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 12px 32px rgba(108,99,255,0.45); }
        .co-run-btn:disabled { opacity:0.5;cursor:not-allowed; }

        /* The Podium / AI Verdict */
        .co-verdict-box { background:linear-gradient(145deg, rgba(200,168,80,0.1), rgba(200,168,80,0.02)); border:1px solid rgba(200,168,80,0.3); border-radius:20px; padding:2rem; margin-bottom:2.5rem; text-align:center; position:relative; overflow:hidden; animation: co-fadeUp 0.6s ease; }
        .co-verdict-icon { font-size:3rem; margin-bottom:1rem; animation: co-bounce 2s infinite; }
        .co-verdict-text { font-family:'DM Sans',sans-serif; font-size:1.05rem; line-height:1.7; color:#FDE68A; font-weight:500; max-width:800px; margin:0 auto; }

        /* Pricing Plan Cards Layout */
        .co-offers-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:1.5rem; align-items:start; }
        .co-offer-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:24px; padding:2rem; position:relative; transition:transform 0.3s, box-shadow 0.3s; animation: co-fadeUp 0.6s ease both; backdrop-filter:blur(20px); display:flex; flex-direction:column; }
        .co-offer-card:hover { transform:translateY(-5px); background:rgba(255,255,255,0.05); }

        .co-offer-color-bar { position:absolute; top:0; left:2rem; right:2rem; height:4px; border-radius:0 0 4px 4px; }
        .co-offer-title { font-size:1.1rem; font-weight:700; color:#F1F5F9; margin-bottom:1.5rem; text-align:center; word-break:break-all; }
        
        .co-offer-price-wrap { text-align:center; margin-bottom:2rem; padding-bottom:1.5rem; border-bottom:1px dashed rgba(255,255,255,0.1); }
        .co-offer-price-label { font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#94A3B8; margin-bottom:0.5rem; }
        .co-offer-price { font-size:2.8rem; font-weight:800; color:#fff; line-height:1; display:flex; align-items:center; justify-content:center; gap:4px; }
        .co-offer-currency { font-size:1.2rem; color:#94A3B8; font-weight:600; }
        .co-offer-mo { font-size:1rem; color:#64748B; font-weight:500; align-self:flex-end; padding-bottom:6px; }

        .co-offer-rate-badge { display:inline-block; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:6px 16px; border-radius:99px; font-weight:700; color:#a5b4fc; margin-top:1rem; font-size:0.9rem; }

        .co-offer-features { list-style:none; padding:0; margin:0 0 2rem 0; display:flex; flex-direction:column; gap:12px; flex:1; }
        .co-offer-feature { display:flex; align-items:flex-start; gap:10px; font-family:'DM Sans',sans-serif; font-size:0.9rem; color:#cbd5e1; }
        .co-feature-icon { color:#10B981; flex-shrink:0; margin-top:2px; }
        
        .co-fee-box { background:rgba(0,0,0,0.2); border-radius:12px; padding:1rem; margin-top:1rem; border:1px solid rgba(255,255,255,0.05); }
        .co-fee-header { display:flex; justify-content:space-between; font-size:0.8rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:10px; }
        .co-fee-item { display:flex; justify-content:space-between; font-family:'DM Sans',sans-serif; font-size:0.85rem; color:#94A3B8; margin-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.03); padding-bottom:6px; }
        .co-fee-item:last-child { margin-bottom:0; border-bottom:none; padding-bottom:0; }
        .co-fee-amt { color:#F1F5F9; font-weight:600; }

        .co-btn-outline { display:block; width:100%; text-align:center; padding:12px; border-radius:12px; border:1px solid rgba(255,255,255,0.15); color:#F1F5F9; text-decoration:none; font-weight:600; font-size:0.9rem; transition:background 0.2s; }
        .co-btn-outline:hover { background:rgba(255,255,255,0.05); }

        @keyframes co-fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes co-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>

      <div className="co-root page-enter">
        <div className="co-grid-bg" />
        <div className="co-orb co-orb-1" />
        <div className="co-orb co-orb-2" />

        <div className="co-wrap">
          <div className="co-header">
            <div>
              <span className="co-badge">Shopping Phase</span>
              <h1 className="co-title">Compare Offers</h1>
              <p className="co-sub">Evaluate different dealer quotes side-by-side to find the absolute best deal.</p>
            </div>
            <Link to="/" className="co-back">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l7 7-7 7" /></svg>
              Dashboard
            </Link>
          </div>

          <div className="co-sel-panel">
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '12px' }}>
              Select up to 3 offers to compare ({selectedIds.length}/3)
            </div>

            {historyLoading ? (
              <div style={{ color: '#6c63ff', fontSize: '0.9rem', fontWeight: 600 }}>Loading your contracts...</div>
            ) : history.length === 0 ? (
              <p style={{ color: '#64748B', fontSize: '0.9rem', margin: 0 }}>No contracts found. Please upload quotes first.</p>
            ) : (
              <div className="co-scroll">
                {history.map((rec) => {
                  const sel = selectedIds.includes(rec._id);
                  return (
                    <div key={rec._id} className={`co-sel-card ${sel ? 'selected' : ''}`} onClick={() => toggleSelection(rec._id)}>
                      {sel && (
                        <div style={{ position: 'absolute', top: 8, right: 8, background: '#6c63ff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                      )}
                      <div className="co-sel-name">{rec.fileName}</div>
                      <div className="co-sel-date">{new Date(rec.uploadedAt).toLocaleDateString()}</div>
                    </div>
                  );
                })}
              </div>
            )}

            <button onClick={runComparison} disabled={loading || selectedIds.length < 2} className="co-run-btn">
              {loading ? 'Evaluating Offers...' : 'Generate Pricing Matrix'}
            </button>
          </div>

          {comparisonData.length > 0 && (
            <div>
              {/* Podium Verdict */}
              {aiVerdict && (
                <div className="co-verdict-box">
                  <div className="co-verdict-icon">🏆</div>
                  <div className="co-verdict-text" dangerouslySetInnerHTML={{ __html: aiVerdict.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #fff">$1</strong>') }} />
                </div>
              )}

              {/* Pricing Cards Grid */}
              <div className="co-offers-grid">
                {comparisonData.map((contract, idx) => {
                  const accent = colAccents[idx % colAccents.length];
                  const emi = extractNum(contract.fields?.monthly_payment || contract.fields?.emi);
                  const rate = contract.fields?.interest_rate ? String(contract.fields.interest_rate).replace("%", "") : "--";
                  const loanAmt = contract.fields?.loan_amount || "—";
                  const tenure = contract.fields?.tenure_months || "—";
                  const fees = contract.hiddenFees?.fees || [];

                  return (
                    <div key={contract._id} className="co-offer-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                      <div className="co-offer-color-bar" style={{ background: accent, boxShadow: `0 0 15px ${accent}` }} />

                      <div className="co-offer-title">{contract.fileName}</div>

                      <div className="co-offer-price-wrap">
                        <div className="co-offer-price-label">Monthly EMI</div>
                        <div className="co-offer-price">
                          {emi > 0 ? (
                            <>
                              <span className="co-offer-currency">₹</span>
                              {emi.toLocaleString('en-IN')}
                              <span className="co-offer-mo">/mo</span>
                            </>
                          ) : (
                            <span style={{ fontSize: '1.5rem', color: '#64748B' }}>Not specified</span>
                          )}
                        </div>
                        <div className="co-offer-rate-badge" style={{ color: accent, borderColor: `${accent}40`, background: `${accent}10` }}>
                          {rate}% Interest Rate
                        </div>
                      </div>

                      <ul className="co-offer-features">
                        <li className="co-offer-feature">
                          <svg className="co-feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                          <span><strong>Total Loan:</strong> {loanAmt}</span>
                        </li>
                        <li className="co-offer-feature">
                          <svg className="co-feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                          <span><strong>Term:</strong> {tenure} months</span>
                        </li>
                      </ul>

                      <div className="co-fee-box">
                        <div className="co-fee-header">
                          <span style={{ color: '#94A3B8' }}>Hidden Fees</span>
                          <span style={{ color: fees.length > 0 ? '#EF4444' : '#10B981' }}>{fees.length} Found</span>
                        </div>
                        {fees.length > 0 ? (
                          fees.map((f, i) => (
                            <div key={i} className="co-fee-item">
                              <span>{f.name}</span>
                              <span className="co-fee-amt">{f.amount && f.amount !== "0" ? `₹${f.amount}` : "Variable"}</span>
                            </div>
                          ))
                        ) : (
                          <div style={{ color: '#10B981', fontSize: '0.85rem', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                            ✅ Clean contract, no junk fees detected.
                          </div>
                        )}
                      </div>

                      <div style={{ marginTop: '2rem' }}>
                        <Link to={`/results/${contract._id}`} className="co-btn-outline">
                          View Deep Analysis
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ComparisonPage;