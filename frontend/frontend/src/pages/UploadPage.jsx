// import React, { useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import ManualVinLookup from "../components/ManualVinLookup";
// import ContractGenerator from "../components/ContractGenerator";
// import API_BASE from "../config/api";

// // ─────────────────────────────────────────────
// // Progress Stepper
// // ─────────────────────────────────────────────
// const ProgressStepper = ({ currentStep }) => {
//   const steps = [
//     { id: 1, name: "Upload PDF" },
//     { id: 2, name: "Processing AI" },
//     { id: 3, name: "Analysis Ready" },
//   ];
//   return (
//     <div className="w-full py-4 mb-2">
//       <div className="flex items-center justify-center gap-2">
//         {steps.map((step, index) => {
//           const isCompleted = currentStep > step.id;
//           const isCurrent = currentStep === step.id;
//           return (
//             <div key={step.id} className="flex items-center">
//               {index > 0 && (
//                 <div
//                   style={{
//                     height: "2px", width: "48px", margin: "0 8px",
//                     background: currentStep >= step.id
//                       ? "linear-gradient(90deg,#6c63ff,#a78bfa)"
//                       : "rgba(255,255,255,0.1)",
//                     borderRadius: "2px", transition: "background 0.4s",
//                   }}
//                 />
//               )}
//               <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
//                 <div style={{
//                   width: "34px", height: "34px", borderRadius: "50%",
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   fontWeight: 700, fontSize: "0.8rem", transition: "all 0.3s",
//                   background: isCompleted
//                     ? "linear-gradient(135deg,#6c63ff,#4f46e5)"
//                     : isCurrent ? "rgba(108,99,255,0.15)" : "rgba(255,255,255,0.05)",
//                   border: isCompleted || isCurrent ? "2px solid #6c63ff" : "2px solid rgba(255,255,255,0.12)",
//                   color: isCompleted ? "#fff" : isCurrent ? "#a5b4fc" : "rgba(255,255,255,0.3)",
//                   boxShadow: isCurrent ? "0 0 14px rgba(108,99,255,0.4)" : "none",
//                   transform: isCurrent ? "scale(1.12)" : "scale(1)",
//                 }}>
//                   {isCompleted ? (
//                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
//                       <polyline points="20 6 9 17 4 12" />
//                     </svg>
//                   ) : step.id}
//                 </div>
//                 <span style={{
//                   position: "absolute", top: "38px", whiteSpace: "nowrap",
//                   fontSize: "10px", fontWeight: 600, letterSpacing: "0.04em",
//                   color: isCurrent || isCompleted ? "#a5b4fc" : "rgba(255,255,255,0.25)",
//                   transition: "color 0.3s",
//                 }}>
//                   {step.name}
//                 </span>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────
// // InfoCard helper
// // ─────────────────────────────────────────────
// const InfoCard = ({ label, value, highlight = false }) => (
//   <div style={{
//     padding: "12px 14px", borderRadius: "12px",
//     background: highlight ? "rgba(108,99,255,0.1)" : "rgba(255,255,255,0.04)",
//     border: `1px solid ${highlight ? "rgba(108,99,255,0.3)" : "rgba(255,255,255,0.08)"}`,
//   }}>
//     <p style={{
//       fontSize: "9px", fontWeight: 700, letterSpacing: "0.09em",
//       textTransform: "uppercase", color: highlight ? "#a5b4fc" : "rgba(255,255,255,0.35)",
//       marginBottom: "5px",
//     }}>{label}</p>
//     <p style={{
//       fontSize: "0.85rem", fontWeight: 700,
//       color: highlight ? "#c4b5fd" : "#fff",
//       overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
//     }}>
//       {value && value !== "Not Specified" ? value : "—"}
//     </p>
//   </div>
// );

// const SectionHeading = ({ icon, title }) => (
//   <div style={{
//     display: "flex", alignItems: "center", gap: "8px",
//     marginBottom: "10px", paddingBottom: "8px",
//     borderBottom: "1px solid rgba(255,255,255,0.07)",
//   }}>
//     <span style={{ fontSize: "14px" }}>{icon}</span>
//     <span style={{
//       fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
//       textTransform: "uppercase", color: "rgba(255,255,255,0.35)",
//     }}>{title}</span>
//   </div>
// );

// // ─────────────────────────────────────────────
// // EMI & Amortization Helpers (Phase 3)
// // ─────────────────────────────────────────────
// const computeEMI = (principal, annualRate, months) => {
//   if (!principal || !annualRate || !months) return 0;
//   const r = annualRate / 100 / 12;
//   if (r === 0) return Math.round(principal / months);
//   return Math.round((principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
// };

// const computeAmortization = (principal, annualRate, months) => {
//   const emi = computeEMI(principal, annualRate, months);
//   let balance = principal;
//   const r = annualRate / 100 / 12;
//   let totalInterest = 0;
//   for (let i = 0; i < months; i++) {
//     const interest = Math.round(balance * r);
//     const principalPaid = emi - interest;
//     totalInterest += interest;
//     balance -= principalPaid;
//   }
//   return { emi, totalInterest: Math.round(totalInterest), totalPayment: emi * months, principal };
// };


// // ─────────────────────────────────────────────
// // Main Page
// // ─────────────────────────────────────────────
// const UploadPage = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [resultId, setResultId] = useState(null);
//   const [ocrText, setOcrText] = useState("");
//   const [data, setData] = useState(null);          // extracted fields object
//   const [confidence, setConfidence] = useState(null);
//   const [dragOver, setDragOver] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const fileInputRef = useRef(null);

//   // Phase 3: Calculator States
//   const [calcOpen, setCalcOpen] = useState(false);
//   const [calcLoan, setCalcLoan] = useState(500000);
//   const [calcRate, setCalcRate] = useState(10);
//   const [calcTenure, setCalcTenure] = useState(36);

//   useEffect(() => {
//     if (!data) return;
//     if (data.loan_amount) {
//       const parsed = parseInt(String(data.loan_amount).replace(/[^0-9]/g, ''));
//       if (parsed > 0) setCalcLoan(parsed);
//     }
//     if (data.interest_rate) {
//       const parsed = parseFloat(String(data.interest_rate).replace(/[^0-9.]/g, ''));
//       if (parsed > 0) setCalcRate(parsed);
//     }
//     if (data.tenure_months) {
//       const parsed = parseInt(String(data.tenure_months).replace(/[^0-9]/g, ''));
//       if (parsed > 0) setCalcTenure(parsed);
//     }
//     if (data) setCalcOpen(true);
//   }, [data]);


//   // Stepper logic
//   let activeStep = 1;
//   if (isUploading) activeStep = 2;
//   if (resultId) activeStep = 3;

//   const formatFileSize = (bytes) => {
//     if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
//     return (bytes / 1024).toFixed(0) + " KB";
//   };

//   // ✅ FIX 1: Send the auth token with every request
//   const getAuthHeaders = () => {
//     const token = sessionStorage.getItem("token");
//     return token ? { Authorization: `Bearer ${token}` } : {};
//   };

//   // ✅ FIX 2: Direct upload — no polling. Backend returns everything synchronously.
//   const handleUpload = async () => {
//     if (!selectedFile) return toast.error("Please select a file first");

//     setIsUploading(true);
//     setResultId(null);
//     setData(null);
//     setOcrText("");

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       const res = await fetch(`${API_BASE}/api/upload`, {
//         method: "POST",
//         headers: getAuthHeaders(),   // ✅ attach token
//         body: formData,
//       });

//       const resData = await res.json();

//       if (!resData.success) {
//         toast.error("Upload failed: " + (resData.message || "Unknown error"));
//         setIsUploading(false);
//         return;
//       }

//       toast.success("AI Extraction Complete!");

//       // ✅ FIX 2: Set everything from the direct response — no polling needed
//       setResultId(resData.savedId);
//       setOcrText(resData.rawText || "");
//       setData(resData.extracted?.fields || {});
//       setConfidence(resData.extracted?.confidence ?? null);
//     } catch (err) {
//       console.error(err);
//       toast.error("Server Error. Please try again.");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleReset = () => {
//     setSelectedFile(null);
//     setOcrText("");
//     setData(null);
//     setResultId(null);
//     setConfidence(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
//         *, *::before, *::after { box-sizing: border-box; }

//         .up-root {
//           font-family: 'Sora', sans-serif;
//           min-height: 100vh;
//           background: #050816;
//           position: relative;
//           overflow-x: hidden;
//           padding: 2rem 1rem 4rem;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//         }
//         .up-orb { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; animation: up-drift 14s ease-in-out infinite alternate; }
//         .up-orb-1 { width:550px;height:550px; background:radial-gradient(circle,#4f46e5,#1e1b4b); top:-180px;left:-180px; opacity:0.3; }
//         .up-orb-2 { width:450px;height:450px; background:radial-gradient(circle,#0ea5e9,#0369a1); bottom:-160px;right:-130px; opacity:0.25; animation-delay:-7s; }
//         .up-orb-3 { width:280px;height:280px; background:radial-gradient(circle,#8b5cf6,#6d28d9); top:35%;left:60%; opacity:0.18; animation-delay:-11s; }
//         @keyframes up-drift { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(30px,22px) scale(1.06)} }
//         .up-grid { position:fixed;inset:0;z-index:0;pointer-events:none; background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px); background-size:48px 48px; }

//         .up-card {
//           position: relative; z-index: 1;
//           width: 100%; max-width: 780px;
//           background: rgba(255,255,255,0.04);
//           border: 1px solid rgba(255,255,255,0.1);
//           border-radius: 28px;
//           padding: 2.5rem 2.25rem;
//           backdrop-filter: blur(28px);
//           -webkit-backdrop-filter: blur(28px);
//           box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset;
//           animation: up-cardIn 0.65s cubic-bezier(0.22,1,0.36,1) both;
//         }
//         @keyframes up-cardIn { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
//         .up-card::before {
//           content:''; position:absolute; top:0; left:10%; right:10%; height:1px;
//           background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);
//         }

//         .up-header { text-align: center; margin-bottom: 2rem; }
//         .up-badge {
//           display: inline-flex; align-items: center; gap: 6px;
//           background: rgba(108,99,255,0.14); border: 1px solid rgba(108,99,255,0.3);
//           border-radius: 999px; padding: 4px 14px;
//           font-size: 10px; font-weight: 600; letter-spacing: 0.08em;
//           color: #a5b4fc; text-transform: uppercase; margin-bottom: 1rem;
//         }
//         .up-badge-dot { width:6px;height:6px;border-radius:50%;background:#6c63ff;box-shadow:0 0 6px #6c63ff;animation:up-pulse 2s ease-in-out infinite; }
//         @keyframes up-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
//         .up-title { font-size:1.85rem;font-weight:800;color:#fff;letter-spacing:-0.04em;line-height:1.1;margin-bottom:0.4rem; }
//         .up-sub { font-family:'DM Sans',sans-serif;font-size:0.875rem;color:rgba(255,255,255,0.38); }
//         .up-divider { height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent);margin:1.75rem 0; }

//         .up-dropzone {
//           border: 2px dashed rgba(255,255,255,0.12);
//           border-radius: 18px; padding: 2.5rem 1.5rem;
//           text-align: center; cursor: pointer;
//           transition: border-color 0.25s, background 0.25s;
//           background: rgba(255,255,255,0.02);
//         }
//         .up-dropzone:hover, .up-dropzone.dragover { border-color: rgba(108,99,255,0.6); background: rgba(108,99,255,0.06); }
//         .up-dropzone-icon {
//           width: 52px; height: 52px; background: rgba(108,99,255,0.12);
//           border: 1px solid rgba(108,99,255,0.25); border-radius: 14px;
//           display: flex; align-items: center; justify-content: center;
//           margin: 0 auto 1rem; color: #a5b4fc; transition: transform 0.2s;
//         }
//         .up-dropzone:hover .up-dropzone-icon { transform: scale(1.08); }
//         .up-dropzone-title { font-size: 0.95rem; font-weight: 600; color: #fff; margin-bottom: 4px; }
//         .up-dropzone-sub { font-family:'DM Sans',sans-serif; font-size: 0.8rem; color: rgba(255,255,255,0.3); }
//         .up-dropzone-link { color: #a5b4fc; font-weight: 700; }

//         .up-file-pill {
//           display: flex; align-items: center; gap: 10px;
//           padding: 10px 14px; background: rgba(108,99,255,0.1);
//           border: 1px solid rgba(108,99,255,0.25); border-radius: 12px; margin-top: 1rem;
//         }
//         .up-file-icon { color: #a5b4fc; flex-shrink: 0; }
//         .up-file-name { font-family:'DM Sans',sans-serif; font-size:0.875rem; font-weight:500; color:#c4b5fd; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1; }
//         .up-file-size { font-size:0.75rem; color:rgba(255,255,255,0.3); white-space:nowrap; }
//         .up-file-remove { background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.25);display:flex;align-items:center;transition:color 0.2s; }
//         .up-file-remove:hover { color:#f87171; }

//         .up-submit-btn {
//           width:100%; margin-top:1.25rem; padding:14px;
//           border-radius:14px; border:none; cursor:pointer;
//           font-family:'Sora',sans-serif; font-size:0.95rem; font-weight:600; color:#fff;
//           background:linear-gradient(135deg,#6c63ff 0%,#4f46e5 50%,#3b2fd6 100%);
//           display:flex;align-items:center;justify-content:center;gap:10px;
//           position:relative;overflow:hidden;
//           transition:transform 0.18s,box-shadow 0.18s,opacity 0.2s;
//           box-shadow:0 4px 24px rgba(108,99,255,0.35);
//         }
//         .up-submit-btn:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 8px 30px rgba(108,99,255,0.5); }
//         .up-submit-btn:disabled { opacity:0.6;cursor:not-allowed; }
//         .up-spin { animation: spin 0.8s linear infinite; }
//         @keyframes spin { to { transform: rotate(360deg); } }

//         .up-action-row { display:flex;gap:12px;margin-top:1.25rem; }
//         .up-reset-btn {
//           flex:1;padding:12px;border-radius:14px;
//           background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);
//           color:rgba(255,255,255,0.6);font-family:'Sora',sans-serif;font-size:0.875rem;font-weight:600;
//           cursor:pointer;transition:background 0.2s,border-color 0.2s,transform 0.15s;
//         }
//         .up-reset-btn:hover { background:rgba(255,255,255,0.09);border-color:rgba(255,255,255,0.22);transform:translateY(-1px); }
//         .up-view-btn {
//           flex:1;padding:12px;border-radius:14px;
//           background:linear-gradient(135deg,#10b981,#059669);
//           border:none;color:#fff;font-family:'Sora',sans-serif;font-size:0.875rem;font-weight:700;
//           cursor:pointer;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:8px;
//           transition:transform 0.18s,box-shadow 0.18s;
//           box-shadow:0 4px 20px rgba(16,185,129,0.3);
//         }
//         .up-view-btn:hover { transform:translateY(-2px);box-shadow:0 8px 28px rgba(16,185,129,0.45); }

//         .up-data-section { margin-bottom: 1.75rem; }
//         .up-info-grid-4 { display:grid;grid-template-columns:repeat(2,1fr);gap:10px; }
//         .up-info-grid-3 { display:grid;grid-template-columns:repeat(2,1fr);gap:10px; }
//         .up-info-grid-2 { display:grid;grid-template-columns:repeat(2,1fr);gap:10px; }
//         @media(min-width:560px) {
//           .up-info-grid-4 { grid-template-columns:repeat(4,1fr); }
//           .up-info-grid-3 { grid-template-columns:repeat(3,1fr); }
//         }

//         .up-text-card { padding:12px 14px; border-radius:12px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); }
//         .up-text-label { font-size:9px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:6px; }
//         .up-text-val { font-family:'DM Sans',sans-serif;font-size:0.8rem;color:rgba(255,255,255,0.6);line-height:1.6; }

//         .up-confidence { padding:12px 14px; border-radius:12px; background:rgba(108,99,255,0.1); border:1px solid rgba(108,99,255,0.3); display:flex;flex-direction:column;align-items:center;justify-content:center; }
//         .up-confidence-label { font-size:9px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:#a5b4fc;margin-bottom:4px; }
//         .up-confidence-val { font-size:1.5rem;font-weight:800;color:#c4b5fd; }

//         .up-ocr-wrap { margin-top:2rem; }
//         .up-ocr-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:10px; }
//         .up-ocr-title { font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.4); }
//         .up-copy-btn { display:flex;align-items:center;gap:5px; padding:5px 12px;border-radius:8px; background:rgba(108,99,255,0.15);border:1px solid rgba(108,99,255,0.3); color:#a5b4fc;font-family:'Sora',sans-serif;font-size:11px;font-weight:600; cursor:pointer;transition:background 0.2s; }
//         .up-copy-btn:hover { background:rgba(108,99,255,0.25); }
//         .up-ocr-box { background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.07); border-radius:14px;padding:16px;max-height:200px;overflow:auto; }
//         .up-ocr-box pre { font-family:monospace;font-size:11px;color:rgba(255,255,255,0.55);white-space:pre-wrap;line-height:1.65;margin:0; }
//         .up-ocr-box::-webkit-scrollbar { width:5px; }
//         .up-ocr-box::-webkit-scrollbar-track { background:transparent; }
//         .up-ocr-box::-webkit-scrollbar-thumb { background:rgba(108,99,255,0.3);border-radius:99px; }
//       `}</style>

//       <div className="up-root page-enter">
//         <div className="up-orb up-orb-1" />
//         <div className="up-orb up-orb-2" />
//         <div className="up-orb up-orb-3" />
//         <div className="up-grid" />

//         <div className="up-card">
//           {/* Header */}
//           <div className="up-header">
//             <div>
//               <span className="up-badge">
//                 <span className="up-badge-dot" />
//                 AI Powered
//               </span>
//             </div>
//             <div className="up-title">PDF OCR Extractor</div>
//             <div className="up-sub">AI-Powered Contract Analysis</div>
//           </div>

//           {/* Stepper */}
//           <ProgressStepper currentStep={activeStep} />
//           <div style={{ height: "32px" }} />
//           <div className="up-divider" />

//           {/* Upload zone — only shown when no result yet */}
//           {!resultId && (
//             <>
//               <div
//                 className={`up-dropzone${dragOver ? " dragover" : ""}${isDragging ? " drag-active" : ""}`}
//                 onClick={() => fileInputRef.current?.click()}
//                 onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
//                 onDragEnter={() => setIsDragging(true)}
//                 onDragLeave={() => setIsDragging(false)}
//                 onDrop={(e) => {
//                   e.preventDefault();
//                   setDragOver(false);
//                   const file = e.dataTransfer.files[0];
//                   if (file) setSelectedFile(file);
//                 }}
//               >
//                 <div className="up-dropzone-icon">
//                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//                     <polyline points="14 2 14 8 20 8" />
//                     <line x1="12" y1="18" x2="12" y2="12" />
//                     <line x1="9" y1="15" x2="15" y2="15" />
//                   </svg>
//                 </div>
//                 <div className="up-dropzone-title">
//                   Drop your PDF here, or <span className="up-dropzone-link">browse</span>
//                 </div>
//                 <div className="up-dropzone-sub">Supported format: PDF · Max 10MB</div>
//                 <input
//                   type="file" accept="application/pdf"
//                   style={{ display: "none" }} ref={fileInputRef}
//                   onChange={(e) => { const file = e.target.files[0]; if (file) setSelectedFile(file); }}
//                 />
//               </div>

//               {selectedFile && (
//                 <div className="up-file-pill">
//                   <span className="up-file-icon">
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//                       <polyline points="14 2 14 8 20 8" />
//                     </svg>
//                   </span>
//                   <span className="up-file-name">{selectedFile.name}</span>
//                   <span className="up-file-size">({formatFileSize(selectedFile.size)})</span>
//                   <button className="up-file-remove" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}>
//                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                       <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
//                     </svg>
//                   </button>
//                 </div>
//               )}

//               <button onClick={handleUpload} disabled={isUploading} className="up-submit-btn">
//                 {isUploading ? (
//                   <>
//                     <svg className="up-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                       <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
//                     </svg>
//                     AI is Analyzing…
//                   </>
//                 ) : (
//                   <>
//                     Extract Data
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                       <path d="M5 12h14M12 5l7 7-7 7" />
//                     </svg>
//                   </>
//                 )}
//               </button>
//             </>
//           )}

//           {!selectedFile && !resultId && <ContractGenerator />}

//           {/* After successful upload */}
//           {resultId && (
//             <div className="up-action-row">
//               <button onClick={handleReset} className="up-reset-btn">Upload Another</button>
//               <Link to={`/results/${resultId}`} className="up-view-btn">
//                 View Full Analysis
//                 <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M5 12h14M12 5l7 7-7 7" />
//                 </svg>
//               </Link>
//             </div>
//           )}

//           {/* ✅ FIX 2: All 15 extracted fields displayed as soon as data is available */}
//           {data && (
//             <div style={{ marginTop: "2rem", animation: "up-cardIn 0.5s ease both" }}>
//               <div className="up-divider" />

//               {/* Section 1: Financials */}
//               <div className="up-data-section">
//                 <SectionHeading icon="💰" title="Financial Details" />
//                 <div className="up-info-grid-4">
//                   <InfoCard label="Loan Amount" value={data.loan_amount} highlight />
//                   <InfoCard label="EMI / Month" value={data.monthly_payment || data.emi} highlight />
//                   <InfoCard label="Interest Rate" value={data.interest_rate} />
//                   <InfoCard label="Down Payment" value={data.down_payment} />
//                 </div>
//               </div>

//               {/* Section 2: Contract Terms */}
//               <div className="up-data-section">
//                 <SectionHeading icon="📜" title="Contract Terms" />
//                 <div className="up-info-grid-3">
//                   <InfoCard label="Tenure" value={data.tenure_months} />
//                   <InfoCard label="Residual Value" value={data.residual_value} />
//                   <InfoCard label="Buyout Price" value={data.purchase_option_price} />
//                 </div>
//               </div>

//               {/* Section 3: Coverage & Penalties */}
//               <div className="up-data-section">
//                 <SectionHeading icon="🛡️" title="Coverage & Penalties" />
//                 <div className="up-info-grid-4">
//                   <InfoCard label="Warranty" value={data.warranty_coverage} />
//                   <InfoCard label="Mileage Limit" value={data.mileage_allowance} />
//                   <InfoCard label="Early Termination" value={data.early_termination_fee} />
//                   <InfoCard label="Late Penalty" value={data.late_payment_penalty} />
//                 </div>
//               </div>

//               {/* Section 4: Maintenance & Summary */}
//               <div className="up-data-section">
//                 <div className="up-info-grid-2">
//                   <div className="up-text-card">
//                     <div className="up-text-label">🔧 Maintenance</div>
//                     <div className="up-text-val">{data.maintenance_responsibilities || "Not specified in extract."}</div>
//                   </div>
//                   <div className="up-text-card">
//                     <div className="up-text-label">📝 Summary & Clauses</div>
//                     <div className="up-text-val">{data.summary || "No non-financial clauses available."}</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Section 5: Vehicle Info + Confidence */}
//               <div className="up-data-section">
//                 <SectionHeading icon="🚗" title="Vehicle Info" />
//                 <div className="up-info-grid-3">
//                   <InfoCard label="VIN" value={data.vin} />
//                   <InfoCard label="Vehicle Make" value={data.vehicle_make} />
//                   <div className="up-confidence">
//                     <div className="up-confidence-label">AI Confidence</div>
//                     <div className="up-confidence-val">
//                       {confidence != null ? `${(confidence * 100).toFixed(0)}%` : "N/A"}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Raw OCR Text */}
//           {ocrText && (
//             <div className="up-ocr-wrap">
//               <div className="up-ocr-header">
//                 <span className="up-ocr-title">Raw OCR Result</span>
//                 <button className="up-copy-btn" onClick={async () => {
//                   try { await navigator.clipboard.writeText(ocrText); toast.success("OCR text copied!"); }
//                   catch (e) { toast.error("Copy failed."); }
//                 }}>
//                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                     <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
//                     <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
//                   </svg>
//                   Copy Text
//                 </button>
//               </div>
//               <div className="up-ocr-box"><pre>{ocrText}</pre></div>
//             </div>
//           )}

//           <ManualVinLookup />
//         </div>
//       </div>
//     </>
//   );
// };

// export default UploadPage;


import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ManualVinLookup from "../components/ManualVinLookup";
import ContractGenerator from "../components/ContractGenerator";
import API_BASE from "../config/api";

// ─────────────────────────────────────────────
// Progress Stepper
// ─────────────────────────────────────────────
const ProgressStepper = ({ currentStep }) => {
  const steps = [
    { id: 1, name: "Upload PDF" },
    { id: 2, name: "Processing AI" },
    { id: 3, name: "Analysis Ready" },
  ];
  return (
    <div className="w-full py-4 mb-2">
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          return (
            <div key={step.id} className="flex items-center">
              {index > 0 && (
                <div
                  style={{
                    height: "2px", width: "48px", margin: "0 8px",
                    background: currentStep >= step.id
                      ? "linear-gradient(90deg,#6c63ff,#a78bfa)"
                      : "rgba(255,255,255,0.1)",
                    borderRadius: "2px", transition: "background 0.4s",
                  }}
                />
              )}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                <div style={{
                  width: "34px", height: "34px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: "0.8rem", transition: "all 0.3s",
                  background: isCompleted
                    ? "linear-gradient(135deg,#6c63ff,#4f46e5)"
                    : isCurrent ? "rgba(108,99,255,0.15)" : "rgba(255,255,255,0.05)",
                  border: isCompleted || isCurrent ? "2px solid #6c63ff" : "2px solid rgba(255,255,255,0.12)",
                  color: isCompleted ? "#fff" : isCurrent ? "#a5b4fc" : "rgba(255,255,255,0.3)",
                  boxShadow: isCurrent ? "0 0 14px rgba(108,99,255,0.4)" : "none",
                  transform: isCurrent ? "scale(1.12)" : "scale(1)",
                }}>
                  {isCompleted ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : step.id}
                </div>
                <span style={{
                  position: "absolute", top: "38px", whiteSpace: "nowrap",
                  fontSize: "10px", fontWeight: 600, letterSpacing: "0.04em",
                  color: isCurrent || isCompleted ? "#a5b4fc" : "rgba(255,255,255,0.25)",
                  transition: "color 0.3s",
                }}>
                  {step.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// ─────────────────────────────────────────────
// InfoCard helper
// ─────────────────────────────────────────────
const InfoCard = ({ label, value, highlight = false }) => (
  <div style={{
    padding: "12px 14px", borderRadius: "12px",
    background: highlight ? "rgba(108,99,255,0.1)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${highlight ? "rgba(108,99,255,0.3)" : "rgba(255,255,255,0.08)"}`,
  }}>
    <p style={{
      fontSize: "9px", fontWeight: 700, letterSpacing: "0.09em",
      textTransform: "uppercase", color: highlight ? "#a5b4fc" : "rgba(255,255,255,0.35)",
      marginBottom: "5px",
    }}>{label}</p>
    <p style={{
      fontSize: "0.85rem", fontWeight: 700,
      color: highlight ? "#c4b5fd" : "#fff",
      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
    }}>
      {value && value !== "Not Specified" ? value : "—"}
    </p>
  </div>
);

const SectionHeading = ({ icon, title }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: "8px",
    marginBottom: "10px", paddingBottom: "8px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  }}>
    <span style={{ fontSize: "14px" }}>{icon}</span>
    <span style={{
      fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
      textTransform: "uppercase", color: "rgba(255,255,255,0.35)",
    }}>{title}</span>
  </div>
);

// ─────────────────────────────────────────────
// EMI & Amortization Helpers (Phase 3)
// ─────────────────────────────────────────────
const computeEMI = (principal, annualRate, months) => {
  if (!principal || !annualRate || !months) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return Math.round(principal / months);
  return Math.round((principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
};

const computeAmortization = (principal, annualRate, months) => {
  const emi = computeEMI(principal, annualRate, months);
  let balance = principal;
  const r = annualRate / 100 / 12;
  let totalInterest = 0;
  for (let i = 0; i < months; i++) {
    const interest = Math.round(balance * r);
    const principalPaid = emi - interest;
    totalInterest += interest;
    balance -= principalPaid;
  }
  return { emi, totalInterest: Math.round(totalInterest), totalPayment: emi * months, principal };
};


// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [resultId, setResultId] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [data, setData] = useState(null);          // extracted fields object
  const [confidence, setConfidence] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Phase 3: Calculator States
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcLoan, setCalcLoan] = useState(500000);
  const [calcRate, setCalcRate] = useState(10);
  const [calcTenure, setCalcTenure] = useState(36);

  useEffect(() => {
    if (!data) return;
    if (data.loan_amount) {
      const parsed = parseInt(String(data.loan_amount).replace(/[^0-9]/g, ''));
      if (parsed > 0) setCalcLoan(parsed);
    }
    if (data.interest_rate) {
      const parsed = parseFloat(String(data.interest_rate).replace(/[^0-9.]/g, ''));
      if (parsed > 0) setCalcRate(parsed);
    }
    if (data.tenure_months) {
      const parsed = parseInt(String(data.tenure_months).replace(/[^0-9]/g, ''));
      if (parsed > 0) setCalcTenure(parsed);
    }
    if (data) setCalcOpen(true);
  }, [data]);


  // Stepper logic
  let activeStep = 1;
  if (isUploading) activeStep = 2;
  if (resultId) activeStep = 3;

  const formatFileSize = (bytes) => {
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / 1024).toFixed(0) + " KB";
  };

  // ✅ FIX 1: Send the auth token with every request
  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // ✅ FIX 2: Direct upload — no polling. Backend returns everything synchronously.
  const handleUpload = async () => {
    if (!selectedFile) return toast.error("Please select a file first");

    setIsUploading(true);
    setResultId(null);
    setData(null);
    setOcrText("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        headers: getAuthHeaders(),   // ✅ attach token
        body: formData,
      });

      const resData = await res.json();

      if (!resData.success) {
        toast.error("Upload failed: " + (resData.message || "Unknown error"));
        setIsUploading(false);
        return;
      }

      toast.success("AI Extraction Complete!");

      // ✅ FIX 2: Set everything from the direct response — no polling needed
      setResultId(resData.savedId);
      setOcrText(resData.rawText || "");
      setData(resData.extracted?.fields || {});
      setConfidence(resData.extracted?.confidence ?? null);
    } catch (err) {
      console.error(err);
      toast.error("Server Error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setOcrText("");
    setData(null);
    setResultId(null);
    setConfidence(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .up-root {
          font-family: 'Sora', sans-serif;
          min-height: 100vh;
          background: #050816;
          position: relative;
          overflow-x: hidden;
          padding: 2rem 1rem 4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .up-orb { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; animation: up-drift 14s ease-in-out infinite alternate; }
        .up-orb-1 { width:550px;height:550px; background:radial-gradient(circle,#4f46e5,#1e1b4b); top:-180px;left:-180px; opacity:0.3; }
        .up-orb-2 { width:450px;height:450px; background:radial-gradient(circle,#0ea5e9,#0369a1); bottom:-160px;right:-130px; opacity:0.25; animation-delay:-7s; }
        .up-orb-3 { width:280px;height:280px; background:radial-gradient(circle,#8b5cf6,#6d28d9); top:35%;left:60%; opacity:0.18; animation-delay:-11s; }
        @keyframes up-drift { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(30px,22px) scale(1.06)} }
        .up-grid { position:fixed;inset:0;z-index:0;pointer-events:none; background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px); background-size:48px 48px; }

        .up-card {
          position: relative; z-index: 1;
          width: 100%; max-width: 780px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 28px;
          padding: 2.5rem 2.25rem;
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset;
          animation: up-cardIn 0.65s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes up-cardIn { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        .up-card::before {
          content:''; position:absolute; top:0; left:10%; right:10%; height:1px;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);
        }

        .up-header { text-align: center; margin-bottom: 2rem; }
        .up-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(108,99,255,0.14); border: 1px solid rgba(108,99,255,0.3);
          border-radius: 999px; padding: 4px 14px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.08em;
          color: #a5b4fc; text-transform: uppercase; margin-bottom: 1rem;
        }
        .up-badge-dot { width:6px;height:6px;border-radius:50%;background:#6c63ff;box-shadow:0 0 6px #6c63ff;animation:up-pulse 2s ease-in-out infinite; }
        @keyframes up-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
        .up-title { font-size:1.85rem;font-weight:800;color:#fff;letter-spacing:-0.04em;line-height:1.1;margin-bottom:0.4rem; }
        .up-sub { font-family:'DM Sans',sans-serif;font-size:0.875rem;color:rgba(255,255,255,0.38); }
        .up-divider { height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent);margin:1.75rem 0; }

        .up-dropzone {
          border: 2px dashed rgba(255,255,255,0.12);
          border-radius: 18px; padding: 2.5rem 1.5rem;
          text-align: center; cursor: pointer;
          transition: border-color 0.25s, background 0.25s;
          background: rgba(255,255,255,0.02);
        }
        .up-dropzone:hover, .up-dropzone.dragover { border-color: rgba(108,99,255,0.6); background: rgba(108,99,255,0.06); }
        .up-dropzone-icon {
          width: 52px; height: 52px; background: rgba(108,99,255,0.12);
          border: 1px solid rgba(108,99,255,0.25); border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1rem; color: #a5b4fc; transition: transform 0.2s;
        }
        .up-dropzone:hover .up-dropzone-icon { transform: scale(1.08); }
        .up-dropzone-title { font-size: 0.95rem; font-weight: 600; color: #fff; margin-bottom: 4px; }
        .up-dropzone-sub { font-family:'DM Sans',sans-serif; font-size: 0.8rem; color: rgba(255,255,255,0.3); }
        .up-dropzone-link { color: #a5b4fc; font-weight: 700; }

        .up-file-pill {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; background: rgba(108,99,255,0.1);
          border: 1px solid rgba(108,99,255,0.25); border-radius: 12px; margin-top: 1rem;
        }
        .up-file-icon { color: #a5b4fc; flex-shrink: 0; }
        .up-file-name { font-family:'DM Sans',sans-serif; font-size:0.875rem; font-weight:500; color:#c4b5fd; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1; }
        .up-file-size { font-size:0.75rem; color:rgba(255,255,255,0.3); white-space:nowrap; }
        .up-file-remove { background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.25);display:flex;align-items:center;transition:color 0.2s; }
        .up-file-remove:hover { color:#f87171; }

        .up-submit-btn {
          width:100%; margin-top:1.25rem; padding:14px;
          border-radius:14px; border:none; cursor:pointer;
          font-family:'Sora',sans-serif; font-size:0.95rem; font-weight:600; color:#fff;
          background:linear-gradient(135deg,#6c63ff 0%,#4f46e5 50%,#3b2fd6 100%);
          display:flex;align-items:center;justify-content:center;gap:10px;
          position:relative;overflow:hidden;
          transition:transform 0.18s,box-shadow 0.18s,opacity 0.2s;
          box-shadow:0 4px 24px rgba(108,99,255,0.35);
        }
        .up-submit-btn:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 8px 30px rgba(108,99,255,0.5); }
        .up-submit-btn:disabled { opacity:0.6;cursor:not-allowed; }
        .up-spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .up-action-row { display:flex;gap:12px;margin-top:1.25rem; }
        .up-reset-btn {
          flex:1;padding:12px;border-radius:14px;
          background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);
          color:rgba(255,255,255,0.6);font-family:'Sora',sans-serif;font-size:0.875rem;font-weight:600;
          cursor:pointer;transition:background 0.2s,border-color 0.2s,transform 0.15s;
        }
        .up-reset-btn:hover { background:rgba(255,255,255,0.09);border-color:rgba(255,255,255,0.22);transform:translateY(-1px); }
        .up-view-btn {
          flex:1;padding:12px;border-radius:14px;
          background:linear-gradient(135deg,#10b981,#059669);
          border:none;color:#fff;font-family:'Sora',sans-serif;font-size:0.875rem;font-weight:700;
          cursor:pointer;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:8px;
          transition:transform 0.18s,box-shadow 0.18s;
          box-shadow:0 4px 20px rgba(16,185,129,0.3);
        }
        .up-view-btn:hover { transform:translateY(-2px);box-shadow:0 8px 28px rgba(16,185,129,0.45); }

        .up-data-section { margin-bottom: 1.75rem; }
        .up-info-grid-4 { display:grid;grid-template-columns:repeat(2,1fr);gap:10px; }
        .up-info-grid-3 { display:grid;grid-template-columns:repeat(2,1fr);gap:10px; }
        .up-info-grid-2 { display:grid;grid-template-columns:repeat(2,1fr);gap:10px; }
        @media(min-width:560px) {
          .up-info-grid-4 { grid-template-columns:repeat(4,1fr); }
          .up-info-grid-3 { grid-template-columns:repeat(3,1fr); }
        }

        .up-text-card { padding:12px 14px; border-radius:12px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); }
        .up-text-label { font-size:9px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:6px; }
        .up-text-val { font-family:'DM Sans',sans-serif;font-size:0.8rem;color:rgba(255,255,255,0.6);line-height:1.6; }

        .up-confidence { padding:12px 14px; border-radius:12px; background:rgba(108,99,255,0.1); border:1px solid rgba(108,99,255,0.3); display:flex;flex-direction:column;align-items:center;justify-content:center; }
        .up-confidence-label { font-size:9px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:#a5b4fc;margin-bottom:4px; }
        .up-confidence-val { font-size:1.5rem;font-weight:800;color:#c4b5fd; }

        .up-ocr-wrap { margin-top:2rem; }
        .up-ocr-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:10px; }
        .up-ocr-title { font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.4); }
        .up-copy-btn { display:flex;align-items:center;gap:5px; padding:5px 12px;border-radius:8px; background:rgba(108,99,255,0.15);border:1px solid rgba(108,99,255,0.3); color:#a5b4fc;font-family:'Sora',sans-serif;font-size:11px;font-weight:600; cursor:pointer;transition:background 0.2s; }
        .up-copy-btn:hover { background:rgba(108,99,255,0.25); }
        .up-ocr-box { background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.07); border-radius:14px;padding:16px;max-height:200px;overflow:auto; }
        .up-ocr-box pre { font-family:monospace;font-size:11px;color:rgba(255,255,255,0.55);white-space:pre-wrap;line-height:1.65;margin:0; }
        .up-ocr-box::-webkit-scrollbar { width:5px; }
        .up-ocr-box::-webkit-scrollbar-track { background:transparent; }
        .up-ocr-box::-webkit-scrollbar-thumb { background:rgba(108,99,255,0.3);border-radius:99px; }
      `}</style>

      <div className="up-root page-enter">
        <div className="up-orb up-orb-1" />
        <div className="up-orb up-orb-2" />
        <div className="up-orb up-orb-3" />
        <div className="up-grid" />

        <div className="up-card">
          {/* Header */}
          <div className="up-header">
            <div>
              <span className="up-badge">
                <span className="up-badge-dot" />
                AI Powered
              </span>
            </div>
            <div className="up-title">PDF OCR Extractor</div>
            <div className="up-sub">AI-Powered Contract Analysis</div>
          </div>

          {/* Stepper */}
          <ProgressStepper currentStep={activeStep} />
          <div style={{ height: "32px" }} />
          <div className="up-divider" />

          {/* Upload zone — only shown when no result yet */}
          {!resultId && (
            <>
              <div
                className={`up-dropzone${dragOver ? " dragover" : ""}${isDragging ? " drag-active" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file) setSelectedFile(file);
                }}
              >
                <div className="up-dropzone-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                </div>
                <div className="up-dropzone-title">
                  Drop your PDF here, or <span className="up-dropzone-link">browse</span>
                </div>
                <div className="up-dropzone-sub">Supported format: PDF · Max 10MB</div>
                <input
                  type="file" accept="application/pdf"
                  style={{ display: "none" }} ref={fileInputRef}
                  onChange={(e) => { const file = e.target.files[0]; if (file) setSelectedFile(file); }}
                />
              </div>

              {selectedFile && (
                <div className="up-file-pill">
                  <span className="up-file-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </span>
                  <span className="up-file-name">{selectedFile.name}</span>
                  <span className="up-file-size">({formatFileSize(selectedFile.size)})</span>
                  <button className="up-file-remove" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              )}

              <button onClick={handleUpload} disabled={isUploading} className="up-submit-btn">
                {isUploading ? (
                  <>
                    <svg className="up-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                    </svg>
                    AI is Analyzing…
                  </>
                ) : (
                  <>
                    Extract Data
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </>
          )}

          {!selectedFile && !resultId && <ContractGenerator />}

          {/* After successful upload */}
          {resultId && (
            <div className="up-action-row">
              <button onClick={handleReset} className="up-reset-btn">Upload Another</button>
              <Link to={`/results/${resultId}`} className="up-view-btn">
                View Full Analysis
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}

          {/* ✅ FIX 2: All 15 extracted fields displayed as soon as data is available */}
          {data && (
            <div style={{ marginTop: "2rem", animation: "up-cardIn 0.5s ease both" }}>
              <div className="up-divider" />

              {/* Section 1: Financials */}
              <div className="up-data-section">
                <SectionHeading icon="💰" title="Financial Details" />
                <div className="up-info-grid-4">
                  <InfoCard label="Loan Amount" value={data.loan_amount} highlight />
                  <InfoCard label="EMI / Month" value={data.monthly_payment || data.emi} highlight />
                  <InfoCard label="Interest Rate" value={data.interest_rate} />
                  <InfoCard label="Down Payment" value={data.down_payment} />
                </div>
              </div>

              {/* Section 2: Contract Terms */}
              <div className="up-data-section">
                <SectionHeading icon="📜" title="Contract Terms" />
                <div className="up-info-grid-3">
                  <InfoCard label="Tenure" value={data.tenure_months} />
                  <InfoCard label="Residual Value" value={data.residual_value} />
                  <InfoCard label="Buyout Price" value={data.purchase_option_price} />
                </div>
              </div>

              {/* Section 3: Coverage & Penalties */}
              <div className="up-data-section">
                <SectionHeading icon="🛡️" title="Coverage & Penalties" />
                <div className="up-info-grid-4">
                  <InfoCard label="Warranty" value={data.warranty_coverage} />
                  <InfoCard label="Mileage Limit" value={data.mileage_allowance} />
                  <InfoCard label="Early Termination" value={data.early_termination_fee} />
                  <InfoCard label="Late Penalty" value={data.late_payment_penalty} />
                </div>
              </div>

              {/* Section 4: Maintenance & Summary */}
              <div className="up-data-section">
                <div className="up-info-grid-2">
                  <div className="up-text-card">
                    <div className="up-text-label">🔧 Maintenance</div>
                    <div className="up-text-val">{data.maintenance_responsibilities || "Not specified in extract."}</div>
                  </div>
                  <div className="up-text-card">
                    <div className="up-text-label">📝 Summary & Clauses</div>
                    <div className="up-text-val">{data.summary || "No non-financial clauses available."}</div>
                  </div>
                </div>
              </div>

              {/* Section 5: Vehicle Info + Confidence */}
              <div className="up-data-section">
                <SectionHeading icon="🚗" title="Vehicle Info" />
                <div className="up-info-grid-3">
                  <InfoCard label="VIN" value={data.vin} />
                  <InfoCard label="Vehicle Make" value={data.vehicle_make} />
                  <div className="up-confidence">
                    <div className="up-confidence-label">AI Confidence</div>
                    <div className="up-confidence-val">
                      {confidence != null ? `${(confidence * 100).toFixed(0)}%` : "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase 3: LIVE EMI CALCULATOR */}
              <div style={{ marginTop: '2rem' }}>
                <button onClick={() => setCalcOpen(v => !v)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px', background: 'rgba(200,168,80,0.06)', border: '1px solid rgba(200,168,80,0.2)',
                  borderRadius: calcOpen ? '14px 14px 0 0' : '14px', cursor: 'pointer', color: '#F1F5F9',
                  fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '0.9rem', transition: 'background 0.2s',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#C8A850' }}>🧮</span> EMI Calculator
                    <span style={{ background: 'rgba(200,168,80,0.15)', color: '#C8A850', border: '1px solid rgba(200,168,80,0.3)', borderRadius: '999px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 600 }}>
                      Auto-filled from extract
                    </span>
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8A850" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: calcOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {calcOpen && (() => {
                  const { emi, totalInterest, totalPayment } = computeAmortization(calcLoan, calcRate, calcTenure);
                  const interestPct = Math.round((totalInterest / totalPayment) * 100) || 0;
                  return (
                    <div style={{ background: '#111827', border: '1px solid rgba(200,168,80,0.15)', borderTop: 'none', borderRadius: '0 0 14px 14px', padding: '1.5rem' }}>
                      {[
                        { label: 'Loan Amount', val: calcLoan, min: 50000, max: 5000000, step: 10000, set: setCalcLoan, fmt: v => `₹${v.toLocaleString('en-IN')}` },
                        { label: 'Interest Rate', val: calcRate, min: 1, max: 30, step: 0.1, set: setCalcRate, fmt: v => `${v}%` },
                        { label: 'Tenure', val: calcTenure, min: 6, max: 120, step: 6, set: setCalcTenure, fmt: v => `${v} months` },
                      ].map(s => (
                        <div key={s.label} style={{ marginBottom: '1.25rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>{s.label}</span>
                            <span style={{ color: '#C8A850', fontWeight: 700, fontSize: '0.875rem' }}>{s.fmt(s.val)}</span>
                          </div>
                          <input type="range" min={s.min} max={s.max} step={s.step} value={s.val} onChange={e => s.set(Number(e.target.value))} style={{ width: '100%', accentColor: '#C8A850', cursor: 'pointer', height: '4px' }} />
                        </div>
                      ))}
                      <div style={{ background: 'rgba(200,168,80,0.08)', border: '1px solid rgba(200,168,80,0.2)', borderRadius: '12px', padding: '1.25rem', marginTop: '0.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                          {[
                            { label: 'Monthly EMI', val: `₹${emi.toLocaleString('en-IN')}`, color: '#C8A850', big: true },
                            { label: 'Total Interest', val: `₹${totalInterest.toLocaleString('en-IN')}`, color: '#EF4444' },
                            { label: 'Total Payment', val: `₹${totalPayment.toLocaleString('en-IN')}`, color: '#F1F5F9' },
                          ].map(item => (
                            <div key={item.label} style={{ textAlign: 'center' }}>
                              <div style={{ color: '#94A3B8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>{item.label}</div>
                              <div style={{ color: item.color, fontWeight: 800, fontSize: item.big ? '1.4rem' : '1rem' }}>{item.val}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: '0.75rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94A3B8', marginBottom: '4px' }}>
                            <span>Principal {100 - interestPct}%</span>
                            <span>Interest {interestPct}%</span>
                          </div>
                          <div style={{ height: '8px', borderRadius: '4px', overflow: 'hidden', background: 'rgba(255,255,255,0.06)', display: 'flex' }}>
                            <div style={{ width: `${100 - interestPct}%`, background: '#10B981', transition: 'width 0.4s ease' }} />
                            <div style={{ width: `${interestPct}%`, background: '#EF4444', transition: 'width 0.4s ease' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>
          )}

          {/* Raw OCR Text */}
          {ocrText && (
            <div className="up-ocr-wrap">
              <div className="up-ocr-header">
                <span className="up-ocr-title">Raw OCR Result</span>
                <button className="up-copy-btn" onClick={async () => {
                  try { await navigator.clipboard.writeText(ocrText); toast.success("OCR text copied!"); }
                  catch (e) { toast.error("Copy failed."); }
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy Text
                </button>
              </div>
              <div className="up-ocr-box"><pre>{ocrText}</pre></div>
            </div>
          )}

          <ManualVinLookup />
        </div>
      </div>
    </>
  );
};

export default UploadPage;