// import React, { useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";

// const UploadPage = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [ocrText, setOcrText] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("");
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastType, setToastType] = useState("");

//   // --- NEW STATE: To store the ID of the uploaded file ---
//   const [resultId, setResultId] = useState(null);

//   const [extractedFields, setExtractedFields] = useState({
//     loanAmount: "",
//     interestRate: "",
//     tenure: "",
//     emi: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const MAX_FILE_SIZE = 10 * 1024 * 1024;
//   const [uploadStatus, setUploadStatus] = useState("idle");
//   const fileInputRef = useRef(null);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const [confidence, setConfidence] = useState(null);
//   const [notes, setNotes] = useState([]);

//   const extractFieldsFromText = (text) => {
//     text = text.replace(/\s+/g, " ").trim();
//     let fields = {
//       loanAmount: "",
//       interestRate: "",
//       tenure: "",
//       emi: "",
//     };
//     const amountMatch = text.match(
//       /loan\s*amount\s*(?:inr|rs\.?)?\s*([\d,]+)/i,
//     );
//     if (amountMatch) {
//       fields.loanAmount = "₹" + amountMatch[1];
//     }
//     const rateMatch =
//       text.match(/interest\s*rate\s*([\d.]+)\s*%/i) ||
//       text.match(/([\d.]+)\s*%\s*(?:per\s*annum)?/i);

//     if (rateMatch) {
//       fields.interestRate = rateMatch[1] + "%";
//     }
//     const tenureMatch =
//       text.match(/tenure\s*([\d]+)\s*months?/i) ||
//       text.match(/([\d]+)\s*(?:month|months)/i);

//     if (tenureMatch) {
//       fields.tenure = tenureMatch[1] + " months";
//     }
//     const emiMatch =
//       text.match(/EMI\S*\s*INR\s*([\d.,]+)/i) ||
//       text.match(/INR\s*([\d.,]+)\s*each/i) ||
//       text.match(/EMI\S*[^0-9]*([\d.,]+)/i);
//     // const emiMatch =
//     //   text.match(/emi\s*(?:inr)?\s*([\d,.\s]+)/i) ||
//     //   text.match(/inr\s*([\d,.\s]+)\s*each/i);

//     if (emiMatch) {
//       const cleanValue = emiMatch[1].replace(/[,\.]/g, "");
//       fields.emi = "₹" + cleanValue;
//     }
//     setExtractedFields(fields);
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes >= 1024 * 1024) {
//       return (bytes / (1024 * 1024)).toFixed(1) + " MB";
//     }
//     return (bytes / 1024).toFixed(0) + " KB";
//   };
//   const copyToClipboard = async () => {
//     try {
//       if (!ocrText) {
//         showMessage("No OCR text to copy", "error");
//         return;
//       }

//       await navigator.clipboard.writeText(ocrText);

//       showMessage("OCR text copied!", "success");
//     } catch (error) {
//       showMessage("Copy failed. Please try manually.", "error");
//     }
//   };

//   const showMessage = (text, type) => {
//     setMessage(text);
//     setMessageType(type);

//     setTimeout(() => {
//       setMessage("");
//       setMessageType("");
//     }, 3000);
//   };

//   const HandleUpdate = () => {
//     if (!selectedFile) {
//       showMessage("Please select a PDF first", "error");
//       return;
//     }
//     setIsUploading(true);
//     setIsLoading(true);
//     setIsProcessing(true);
//     setUploadStatus("processing");

//     const formData = new FormData();
//     formData.append("file", selectedFile);
//     fetch("http://localhost:3000/api/upload", {
//       method: "POST",
//       body: formData,
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data);
//         if (!data.success) {
//           showMessage("OCR failed on server", "error");
//           setUploadStatus("error");
//           return;
//         }
//         //setOcrText(data.rawText);
//         setOcrText(cleanOcrText(data.rawText));
//         setIsProcessing(false);
//         toast.success("OCR extracted successfully!");

//         //showToast("OCR extraction successful", "success");

//         setUploadStatus("success");

//         // extractFieldsFromText(data.rawText);
//         // setIsUploading(false);
//         // setIsLoading(false);

//         setExtractedFields({
//           loanAmount: data.extracted?.fields?.loan_amount ?? "",
//           interestRate: data.extracted?.fields?.interest_rate ?? "",
//           tenure: data.extracted?.fields?.tenure_months
//             ? data.extracted.fields.tenure_months + " months"
//             : "",
//           emi: data.extracted?.fields?.emi ?? "",
//         });

//         setConfidence(data.extracted?.confidence ?? null);
//         setNotes(data.extracted?.notes ?? []);
//         setIsProcessing(false);
//         setIsUploading(false);
//         setIsLoading(false);
//       })
//       .catch((error) => {
//         console.error("Upload error:", error);
//         console.log("Uplod failed with error object:", error);
//         toast.error("Upload failed. Please try again.");

//         //showToast("OCR failed — please try again", "error");

//         setUploadStatus("error");
//         setIsLoading(false);
//         setIsUploading(false);
//         setIsProcessing(false);
//       });
//   };
//   const handleReset = () => {
//     console.log("Reset clicked....");
//     setSelectedFile(null);
//     setOcrText("");
//     setExtractedFields({
//       loanAmount: "",
//       interestRate: "",
//       tenure: "",
//       emi: "",
//     });

//     setUploadStatus("idle");
//     setIsUploading(false);
//     setIsProcessing(false);
//     setIsLoading(false);

//     setMessage("");
//     setMessageType("");
//     setToastMessage("");
//     setToastType("");
//     setConfidence("");
//     setNotes("");

//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const showToast = (msg, type) => {
//     setToastMessage(msg);
//     setToastType(type);

//     setTimeout(() => {
//       setToastMessage("");
//       setToastType("");
//     }, 2500);
//   };

//   const cleanOcrText = (text) => {
//     if (!text) return "";

//     return text
//       .replace(/\r/g, "") // remove carriage returns
//       .replace(/[ \t]+/g, " ") // collapse multiple spaces
//       .replace(/\n\s+/g, "\n") // trim spaces at line start
//       .replace(/\s+\n/g, "\n") // trim spaces at line end
//       .trim(); // remove top/bottom blank space
//   };

//   return (
//     <>
//       {toastMessage && (
//         <div
//           className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white
//     ${toastType === "success" ? "bg-green-600" : "bg-red-600"}`}
//         >
//           {toastMessage}
//         </div>
//       )}

//       <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
//         {message && (
//           <div
//             className={`fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium
//           ${messageType === "success" ? "bg-green-600" : "bg-red-600"}`}
//           >
//             {message}
//           </div>
//         )}

//         <div className="sm:mx-auto sm:w-full sm:max-w-md">
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             PDF OCR Extractor
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Upload your document to extract text instantly
//           </p>
//         </div>

//         <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
//           <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200 sm:rounded-xl sm:px-10 border border-gray-100">
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Upload Document
//                 </label>
//                 <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 hover:bg-gray-50 transition-colors duration-200 relative group cursor-pointer">
//                   <div className="space-y-1 text-center">
//                     {/* Icon */}
//                     <div className="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-500 transition-colors">
//                       <svg
//                         stroke="currentColor"
//                         fill="none"
//                         viewBox="0 0 48 48"
//                         aria-hidden="true"
//                       >
//                         <path
//                           d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                       </svg>
//                     </div>

//                     <div className="flex text-sm text-gray-600 justify-center">
//                       <label
//                         htmlFor="file-upload"
//                         aria-label="Upload PDF document"
//                         className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
//                         // focus:ring-2
//                         // focus:ring-indigo-500
//                         // focus:ring-offset-2
//                       >
//                         <span>Upload a PDF</span>
//                         <input
//                           id="file-upload"
//                           name="file-upload"
//                           type="file"
//                           accept="application/pdf"
//                           className="sr-only"
//                           ref={fileInputRef}
//                           onChange={(event) => {
//                             const file = event.target.files[0];
//                             if (!file) return;

//                             if (file.type !== "application/pdf") {
//                               showMessage(
//                                 "Only PDF files are allowed",
//                                 "error",
//                               );
//                               return;
//                             }

//                             if (file.size > MAX_FILE_SIZE) {
//                               showMessage(
//                                 "File too large. Max size is 10MB.",
//                                 "error",
//                               );
//                               return;
//                             }

//                             setSelectedFile(file);
//                             event.target.value = "";
//                           }}
//                         />
//                       </label>
//                       <p className="pl-1">or drag and drop</p>
//                     </div>
//                     <p className="text-xs text-gray-500">PDF up to 10MB</p>
//                   </div>
//                 </div>
//               </div>

//               {selectedFile && (
//                 <div className="flex items-center p-3 bg-indigo-50 text-indigo-700 rounded-lg text-sm animate-fade-in">
//                   <svg
//                     className="w-5 h-5 mr-2"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                     ></path>
//                   </svg>
//                   <span className="truncate font-medium">
//                     {selectedFile.name}
//                   </span>
//                 </div>
//               )}

//               <button
//                 onClick={HandleUpdate}
//                 disabled={isUploading}
//                 aria-label="Upload PDF and extract OCR text"
//                 className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:cursor-pointer ${
//                   isUploading ? "opacity-75 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {isUploading ? (
//                   <>
//                     <svg
//                       className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Processing...
//                   </>
//                 ) : (
//                   "Extract Text"
//                 )}
//               </button>

//               {selectedFile && (
//                 <div className="mt-3 text-sm text-gray-700">
//                   <div className="font-medium">File : {selectedFile.name}</div>
//                   <div className="text-gray-500">
//                     Size: {formatFileSize(selectedFile.size)}
//                   </div>
//                 </div>
//               )}
//               <button
//                 onClick={handleReset}
//                 // disabled={isLoading || isUploading}
//                 aria-label="Clear uploaded file and OCR results"
//                 className=" px-4 py-2 rounded-xl border hover:cursor-pointer"
//               >
//                 Reset
//               </button>
//             </div>
//             <div style={{ marginTop: "20px" }}>
//               <Link
//                 to="/history"
//                 style={{
//                   padding: "10px 14px",
//                   borderRadius: "10px",
//                   backgroundColor: "#2563eb",
//                   color: "white",
//                   textDecoration: "none",
//                   marginTop: "10px",
//                 }}
//               >
//                 📜 View OCR History
//               </Link>
//             </div>

//             <div className="mt-10">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                 Key Loan Details
//               </h3>

//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div className="bg-white shadow rounded-lg p-4 border">
//                   <p className="text-sm text-gray-500">Loan Amount</p>
//                   <p className="text-xl font-bold">
//                     {extractedFields.loanAmount || "—"}

//                     {confidence !== null && (
//                       <div
//                         style={{
//                           marginTop: "18px",
//                           padding: "14px 16px",
//                           borderRadius: "12px",
//                           backgroundColor: "#f8fafc",
//                           boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
//                           border: "1px solid #e5e7eb",
//                         }}
//                       >
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             marginBottom: "8px",
//                           }}
//                         >
//                           <span
//                             style={{ fontSize: "20px", marginRight: "8px" }}
//                           >
//                             📊
//                           </span>
//                           <strong style={{ fontSize: "15px" }}>
//                             Confidence Score
//                           </strong>
//                         </div>

//                         <div
//                           style={{
//                             fontSize: "26px",
//                             fontWeight: "bold",
//                             color:
//                               confidence >= 0.7
//                                 ? "#16a34a"
//                                 : confidence >= 0.4
//                                   ? "#ca8a04"
//                                   : "#dc2626",
//                           }}
//                         >
//                           {(confidence * 100).toFixed(1)}%
//                         </div>
//                       </div>
//                     )}

//                     {notes.length > 0 && (
//                       <div
//                         style={{
//                           marginTop: "18px",
//                           padding: "14px 16px",
//                           borderRadius: "12px",
//                           backgroundColor: "#f9f9ff",
//                           boxShadow: "0 2px 6px rgba(0,0,150,0.08)",
//                           border: "1px solid #e0e7ff",
//                         }}
//                       >
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             marginBottom: "10px",
//                           }}
//                         >
//                           <span
//                             style={{ fontSize: "20px", marginRight: "8px" }}
//                           >
//                             🧠
//                           </span>
//                           <strong style={{ fontSize: "15px" }}>
//                             AI Reasoning Notes
//                           </strong>
//                         </div>

//                         {notes.map((note, index) => (
//                           <div
//                             key={index}
//                             style={{
//                               padding: "8px 10px",
//                               borderRadius: "8px",
//                               marginBottom: "6px",
//                               backgroundColor: "#eef2ff",
//                               color: "#4338ca",
//                               fontSize: "14px",
//                               lineHeight: "1.5",
//                               display: "flex",
//                             }}
//                           >
//                             <span style={{ marginRight: "8px" }}>✔️</span>
//                             <span>{note}</span>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </p>
//                 </div>
//                 <div className="bg-white shadow rounded-lg p-4 border">
//                   <p className="text-sm text-gray-500">Interest Rate</p>
//                   <p className="text-xl font-bold">
//                     {extractedFields.interestRate || "—"}
//                   </p>
//                 </div>
//                 <div className="bg-white shadow rounded-lg p-4 border">
//                   <p className="text-sm text-gray-500">Tenure</p>
//                   <p className="text-xl font-bold">
//                     {extractedFields.tenure || "—"}
//                   </p>
//                 </div>

//                 <div className="bg-white shadow rounded-lg p-4 border">
//                   <p className="text-sm text-gray-500">Monthly EMI</p>
//                   <p className="text-xl font-bold">
//                     {extractedFields.emi || "—"}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-10">
//               <div className="flex justify-center gap-6 text-sm">
//                 <span
//                   className={
//                     uploadStatus === "idle"
//                       ? "font-semibold text-blue-600"
//                       : "text-gray-400"
//                   }
//                 >
//                   Ready
//                 </span>
//                 <span className="text-gray-400">→</span>
//                 <span
//                   className={
//                     uploadStatus === "processing"
//                       ? "font-semibold text-orange-600"
//                       : "text-gray-400"
//                   }
//                 >
//                   Processing
//                 </span>
//                 <span className="text-gray-400">→</span>
//                 <span
//                   className={
//                     uploadStatus === "success"
//                       ? "font-semibold text-green-600"
//                       : uploadStatus === "error"
//                         ? "font-semibold text-red-600"
//                         : "text-gray-400"
//                   }
//                 >
//                   Result
//                 </span>
//               </div>
//             </div>
//             {ocrText && (
//               <div className="mt-8">
//                 <div className="flex items-center justify-between mb-2">
//                   <button
//                     onClick={copyToClipboard}
//                     disabled={isLoading || isUploading}
//                     className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-md shadow hover:bg-indigo-700 transition"
//                   >
//                     Copy Text
//                   </button>

//                   <h3 className="text-sm font-medium text-gray-900">
//                     OCR Result
//                   </h3>
//                   {/* <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-medium">
//                   Success
//                 </span> */}
//                   {uploadStatus === "processing" && (
//                     <span className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-full font-medium">
//                       Processing...
//                     </span>
//                   )}
//                   {uploadStatus === "success" && (
//                     <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full font-medium">
//                       Success
//                     </span>
//                   )}
//                   {uploadStatus === "error" && (
//                     <span className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded-full font-medium">
//                       Failed
//                     </span>
//                   )}
//                   {uploadStatus === "idle" && (
//                     <span className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded-full font-medium">
//                       Ready
//                     </span>
//                   )}
//                 </div>
//                 <div className="relative group">
//                   <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
//                   <div className="relative bg-gray-900 rounded-lg p-4 max-h-96 overflow-auto custom-scrollbar">
//                     <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
//                       {ocrText}
//                     </pre>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };;

// export default UploadPage;

// import React, { useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";

// const UploadPage = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [ocrText, setOcrText] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("");
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastType, setToastType] = useState("");

//   // --- NEW STATE: To store the ID of the uploaded file ---
//   const [resultId, setResultId] = useState(null);

//   const [extractedFields, setExtractedFields] = useState({
//     loanAmount: "",
//     interestRate: "",
//     tenure: "",
//     emi: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const MAX_FILE_SIZE = 10 * 1024 * 1024;
//   const [uploadStatus, setUploadStatus] = useState("idle");
//   const fileInputRef = useRef(null);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const [confidence, setConfidence] = useState(null);
//   const [notes, setNotes] = useState([]);

//   // Helper to format bytes
//   const formatFileSize = (bytes) => {
//     if (bytes >= 1024 * 1024) {
//       return (bytes / (1024 * 1024)).toFixed(1) + " MB";
//     }
//     return (bytes / 1024).toFixed(0) + " KB";
//   };

//   const copyToClipboard = async () => {
//     try {
//       if (!ocrText) {
//         showMessage("No OCR text to copy", "error");
//         return;
//       }
//       await navigator.clipboard.writeText(ocrText);
//       showMessage("OCR text copied!", "success");
//     } catch (error) {
//       showMessage("Copy failed. Please try manually.", "error");
//     }
//   };

//   const showMessage = (text, type) => {
//     setMessage(text);
//     setMessageType(type);
//     setTimeout(() => {
//       setMessage("");
//       setMessageType("");
//     }, 3000);
//   };

//   const cleanOcrText = (text) => {
//     if (!text) return "";
//     return text
//       .replace(/\r/g, "")
//       .replace(/[ \t]+/g, " ")
//       .replace(/\n\s+/g, "\n")
//       .replace(/\s+\n/g, "\n")
//       .trim();
//   };

//   const HandleUpdate = () => {
//     if (!selectedFile) {
//       showMessage("Please select a PDF first", "error");
//       return;
//     }
//     setIsUploading(true);
//     setIsLoading(true);
//     setIsProcessing(true);
//     setUploadStatus("processing");

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     // Ensure this URL matches your backend
//     fetch("http://localhost:3000/api/upload", {
//       method: "POST",
//       body: formData,
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data);
//         if (!data.success) {
//           showMessage("OCR failed on server", "error");
//           setUploadStatus("error");
//           return;
//         }

//         setOcrText(cleanOcrText(data.rawText));
//         setIsProcessing(false);
//         toast.success("OCR extracted successfully!");
//         setUploadStatus("success");

//         // --- SAVE THE ID FROM BACKEND ---
//         if (data.savedId) {
//           setResultId(data.savedId);
//         }

//         setExtractedFields({
//           loanAmount: data.extracted?.fields?.loan_amount ?? "",
//           interestRate: data.extracted?.fields?.interest_rate ?? "",
//           tenure: data.extracted?.fields?.tenure_months
//             ? data.extracted.fields.tenure_months + " months"
//             : "",
//           emi: data.extracted?.fields?.emi ?? "",
//         });

//         setConfidence(data.extracted?.confidence ?? null);
//         setNotes(data.extracted?.notes ?? []);
//         setIsProcessing(false);
//         setIsUploading(false);
//         setIsLoading(false);
//       })
//       .catch((error) => {
//         console.error("Upload error:", error);
//         toast.error("Upload failed. Please try again.");
//         setUploadStatus("error");
//         setIsLoading(false);
//         setIsUploading(false);
//         setIsProcessing(false);
//       });
//   };

//   const handleReset = () => {
//     console.log("Reset clicked....");
//     setSelectedFile(null);
//     setOcrText("");
//     setExtractedFields({
//       loanAmount: "",
//       interestRate: "",
//       tenure: "",
//       emi: "",
//     });

//     setUploadStatus("idle");
//     setIsUploading(false);
//     setIsProcessing(false);
//     setIsLoading(false);

//     setMessage("");
//     setMessageType("");
//     setToastMessage("");
//     setToastType("");
//     setConfidence("");
//     setNotes("");

//     // --- CLEAR THE ID ---
//     setResultId(null);

//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   return (
//     <>
//       {toastMessage && (
//         <div
//           className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white
//     ${toastType === "success" ? "bg-green-600" : "bg-red-600"}`}
//         >
//           {toastMessage}
//         </div>
//       )}

//       <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
//         {message && (
//           <div
//             className={`fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium
//           ${messageType === "success" ? "bg-green-600" : "bg-red-600"}`}
//           >
//             {message}
//           </div>
//         )}

//         <div className="sm:mx-auto sm:w-full sm:max-w-md">
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             PDF OCR Extractor
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Upload your document to extract text instantly
//           </p>
//         </div>

//         <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
//           <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200 sm:rounded-xl sm:px-10 border border-gray-100">
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Upload Document
//                 </label>
//                 <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 hover:bg-gray-50 transition-colors duration-200 relative group cursor-pointer">
//                   <div className="space-y-1 text-center">
//                     <div className="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-500 transition-colors">
//                       <svg
//                         stroke="currentColor"
//                         fill="none"
//                         viewBox="0 0 48 48"
//                         aria-hidden="true"
//                       >
//                         <path
//                           d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                       </svg>
//                     </div>

//                     <div className="flex text-sm text-gray-600 justify-center">
//                       <label
//                         htmlFor="file-upload"
//                         className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
//                       >
//                         <span>Upload a PDF</span>
//                         <input
//                           id="file-upload"
//                           name="file-upload"
//                           type="file"
//                           accept="application/pdf"
//                           className="sr-only"
//                           ref={fileInputRef}
//                           onChange={(event) => {
//                             const file = event.target.files[0];
//                             if (!file) return;

//                             if (file.type !== "application/pdf") {
//                               showMessage(
//                                 "Only PDF files are allowed",
//                                 "error",
//                               );
//                               return;
//                             }

//                             if (file.size > MAX_FILE_SIZE) {
//                               showMessage(
//                                 "File too large. Max size is 10MB.",
//                                 "error",
//                               );
//                               return;
//                             }

//                             setSelectedFile(file);
//                             // Clear previous results on new file select if desired
//                             // handleReset(); // Optional: keeps UI clean
//                             event.target.value = "";
//                           }}
//                         />
//                       </label>
//                       <p className="pl-1">or drag and drop</p>
//                     </div>
//                     <p className="text-xs text-gray-500">PDF up to 10MB</p>
//                   </div>
//                 </div>
//               </div>

//               {selectedFile && (
//                 <div className="flex items-center p-3 bg-indigo-50 text-indigo-700 rounded-lg text-sm animate-fade-in">
//                   <svg
//                     className="w-5 h-5 mr-2"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                     ></path>
//                   </svg>
//                   <span className="truncate font-medium">
//                     {selectedFile.name}
//                   </span>
//                 </div>
//               )}

//               <button
//                 onClick={HandleUpdate}
//                 disabled={isUploading}
//                 className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:cursor-pointer ${
//                   isUploading ? "opacity-75 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {isUploading ? (
//                   <>
//                     <svg
//                       className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Processing...
//                   </>
//                 ) : (
//                   "Extract Text"
//                 )}
//               </button>

//               {selectedFile && (
//                 <div className="mt-3 text-sm text-gray-700">
//                   <div className="font-medium">File : {selectedFile.name}</div>
//                   <div className="text-gray-500">
//                     Size: {formatFileSize(selectedFile.size)}
//                   </div>
//                 </div>
//               )}

//               {/* --- ACTION BUTTONS ROW --- */}
//               <div className="flex gap-4 mt-4">
//                 <button
//                   onClick={handleReset}
//                   className="flex-1 px-4 py-2 rounded-xl border hover:bg-gray-50 hover:cursor-pointer transition"
//                 >
//                   Reset
//                 </button>

//                 {/* --- NEW BUTTON: View Details (Only shows after success) --- */}
//                 {resultId && (
//                   <Link
//                     to={`/results/${resultId}`}
//                     className="flex-1 flex items-center justify-center px-4 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition shadow-sm"
//                   >
//                     View Analysis ➡
//                   </Link>
//                 )}
//               </div>
//             </div>

//             <div style={{ marginTop: "20px" }}>
//               <Link
//                 to="/history"
//                 style={{
//                   padding: "10px 14px",
//                   borderRadius: "10px",
//                   backgroundColor: "#2563eb",
//                   color: "white",
//                   textDecoration: "none",
//                   marginTop: "10px",
//                   display: "inline-block",
//                 }}
//               >
//                 📜 View OCR History
//               </Link>
//             </div>

//             <div className="mt-10">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                 Key Loan Details
//               </h3>
//               {/* ... (Rest of your Key Loan Details UI remains same) ... */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div className="bg-white shadow rounded-lg p-4 border">
//                   <p className="text-sm text-gray-500">Loan Amount</p>
//                   <p className="text-xl font-bold">
//                     {extractedFields.loanAmount
//                       ? "₹" + extractedFields.loanAmount
//                       : "—"}

//                     {confidence !== null && (
//                       <div
//                         style={{
//                           marginTop: "18px",
//                           padding: "14px 16px",
//                           borderRadius: "12px",
//                           backgroundColor: "#f8fafc",
//                           boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
//                           border: "1px solid #e5e7eb",
//                         }}
//                       >
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             marginBottom: "8px",
//                           }}
//                         >
//                           <span
//                             style={{ fontSize: "20px", marginRight: "8px" }}
//                           >
//                             📊
//                           </span>
//                           <strong style={{ fontSize: "15px" }}>
//                             Confidence Score
//                           </strong>
//                         </div>
//                         <div
//                           style={{
//                             fontSize: "26px",
//                             fontWeight: "bold",
//                             color:
//                               confidence >= 0.7
//                                 ? "#16a34a"
//                                 : confidence >= 0.4
//                                   ? "#ca8a04"
//                                   : "#dc2626",
//                           }}
//                         >
//                           {(confidence * 100).toFixed(1)}%
//                         </div>
//                       </div>
//                     )}

//                     {notes.length > 0 && (
//                       <div
//                         style={{
//                           marginTop: "18px",
//                           padding: "14px 16px",
//                           borderRadius: "12px",
//                           backgroundColor: "#f9f9ff",
//                           boxShadow: "0 2px 6px rgba(0,0,150,0.08)",
//                           border: "1px solid #e0e7ff",
//                         }}
//                       >
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             marginBottom: "10px",
//                           }}
//                         >
//                           <span
//                             style={{ fontSize: "20px", marginRight: "8px" }}
//                           >
//                             🧠
//                           </span>
//                           <strong style={{ fontSize: "15px" }}>
//                             AI Reasoning Notes
//                           </strong>
//                         </div>
//                         {notes.map((note, index) => (
//                           <div
//                             key={index}
//                             style={{
//                               padding: "8px 10px",
//                               borderRadius: "8px",
//                               marginBottom: "6px",
//                               backgroundColor: "#eef2ff",
//                               color: "#4338ca",
//                               fontSize: "14px",
//                               lineHeight: "1.5",
//                               display: "flex",
//                             }}
//                           >
//                             <span style={{ marginRight: "8px" }}>✔️</span>
//                             <span>{note}</span>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </p>
//                 </div>
//                 <div className="bg-white shadow rounded-lg p-4 border">
//                   <p className="text-sm text-gray-500">Interest Rate</p>
//                   <p className="text-xl font-bold">
//                     {extractedFields.interestRate
//                       ? extractedFields.interestRate + "%"
//                       : "—"}
//                   </p>
//                 </div>
//                 <div className="bg-white shadow rounded-lg p-4 border">
//                   <p className="text-sm text-gray-500">Tenure</p>
//                   <p className="text-xl font-bold">
//                     {extractedFields.tenure || "—"}
//                   </p>
//                 </div>

//                 <div className="bg-white shadow rounded-lg p-4 border">
//                   <p className="text-sm text-gray-500">Monthly EMI</p>
//                   <p className="text-xl font-bold">
//                     {extractedFields.emi ? "₹" + extractedFields.emi : "—"}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-10">
//               <div className="flex justify-center gap-6 text-sm">
//                 <span
//                   className={
//                     uploadStatus === "idle"
//                       ? "font-semibold text-blue-600"
//                       : "text-gray-400"
//                   }
//                 >
//                   Ready
//                 </span>
//                 <span className="text-gray-400">→</span>
//                 <span
//                   className={
//                     uploadStatus === "processing"
//                       ? "font-semibold text-orange-600"
//                       : "text-gray-400"
//                   }
//                 >
//                   Processing
//                 </span>
//                 <span className="text-gray-400">→</span>
//                 <span
//                   className={
//                     uploadStatus === "success"
//                       ? "font-semibold text-green-600"
//                       : uploadStatus === "error"
//                         ? "font-semibold text-red-600"
//                         : "text-gray-400"
//                   }
//                 >
//                   Result
//                 </span>
//               </div>
//             </div>

//             {ocrText && (
//               <div className="mt-8">
//                 <div className="flex items-center justify-between mb-2">
//                   <button
//                     onClick={copyToClipboard}
//                     disabled={isLoading || isUploading}
//                     className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-md shadow hover:bg-indigo-700 transition"
//                   >
//                     Copy Text
//                   </button>

//                   <h3 className="text-sm font-medium text-gray-900">
//                     OCR Result
//                   </h3>

//                   {uploadStatus === "processing" && (
//                     <span className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-full font-medium">
//                       Processing...
//                     </span>
//                   )}
//                   {uploadStatus === "success" && (
//                     <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full font-medium">
//                       Success
//                     </span>
//                   )}
//                   {uploadStatus === "error" && (
//                     <span className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded-full font-medium">
//                       Failed
//                     </span>
//                   )}
//                   {uploadStatus === "idle" && (
//                     <span className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded-full font-medium">
//                       Ready
//                     </span>
//                   )}
//                 </div>
//                 <div className="relative group">
//                   <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
//                   <div className="relative bg-gray-900 rounded-lg p-4 max-h-96 overflow-auto custom-scrollbar">
//                     <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
//                       {ocrText}
//                     </pre>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UploadPage;

// import React, { useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import ManualVinLookup from "../components/ManualVinLookup";
// const UploadPage = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [ocrText, setOcrText] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("");
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastType, setToastType] = useState("");

//   const [resultId, setResultId] = useState(null);

//   const [extractedFields, setExtractedFields] = useState({
//     loanAmount: "",
//     interestRate: "",
//     tenure: "",
//     emi: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const MAX_FILE_SIZE = 10 * 1024 * 1024;
//   const [uploadStatus, setUploadStatus] = useState("idle");
//   const fileInputRef = useRef(null);
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Initialize as null to hide UI on load/reset
//   const [confidence, setConfidence] = useState(null);
//   const [notes, setNotes] = useState([]);

//   const formatFileSize = (bytes) => {
//     if (bytes >= 1024 * 1024) {
//       return (bytes / (1024 * 1024)).toFixed(1) + " MB";
//     }
//     return (bytes / 1024).toFixed(0) + " KB";
//   };

//   const copyToClipboard = async () => {
//     try {
//       if (!ocrText) {
//         showMessage("No OCR text to copy", "error");
//         return;
//       }
//       await navigator.clipboard.writeText(ocrText);
//       showMessage("OCR text copied!", "success");
//     } catch (error) {
//       showMessage("Copy failed. Please try manually.", "error");
//     }
//   };

//   const showMessage = (text, type) => {
//     setMessage(text);
//     setMessageType(type);
//     setTimeout(() => {
//       setMessage("");
//       setMessageType("");
//     }, 3000);
//   };

//   const cleanOcrText = (text) => {
//     if (!text) return "";
//     return text
//       .replace(/\r/g, "")
//       .replace(/[ \t]+/g, " ")
//       .replace(/\n\s+/g, "\n")
//       .replace(/\s+\n/g, "\n")
//       .trim();
//   };

//   const HandleUpdate = () => {
//     if (!selectedFile) {
//       showMessage("Please select a PDF first", "error");
//       return;
//     }
//     setIsUploading(true);
//     setIsLoading(true);
//     setIsProcessing(true);
//     setUploadStatus("processing");

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     fetch("http://localhost:3000/api/upload", {
//       method: "POST",
//       body: formData,
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (!data.success) {
//           showMessage("OCR failed on server", "error");
//           setUploadStatus("error");
//           return;
//         }

//         setOcrText(cleanOcrText(data.rawText));
//         setIsProcessing(false);
//         toast.success("OCR extracted successfully!");
//         setUploadStatus("success");

//         if (data.savedId) {
//           setResultId(data.savedId);
//         }

//         setExtractedFields({
//           loanAmount: data.extracted?.fields?.loan_amount ?? "",
//           interestRate: data.extracted?.fields?.interest_rate ?? "",
//           tenure: data.extracted?.fields?.tenure_months
//             ? data.extracted.fields.tenure_months + " months"
//             : "",
//           emi: data.extracted?.fields?.emi ?? "",
//         });

//         // Set confidence and notes
//         setConfidence(data.extracted?.confidence ?? null);
//         setNotes(data.extracted?.notes ?? []);

//         setIsProcessing(false);
//         setIsUploading(false);
//         setIsLoading(false);
//       })
//       .catch((error) => {
//         console.error("Upload error:", error);
//         toast.error("Upload failed. Please try again.");
//         setUploadStatus("error");
//         setIsLoading(false);
//         setIsUploading(false);
//         setIsProcessing(false);
//       });
//   };

//   const handleReset = () => {
//     setSelectedFile(null);
//     setOcrText("");
//     setExtractedFields({
//       loanAmount: "",
//       interestRate: "",
//       tenure: "",
//       emi: "",
//     });

//     setUploadStatus("idle");
//     setIsUploading(false);
//     setIsProcessing(false);
//     setIsLoading(false);

//     setMessage("");
//     setMessageType("");
//     setToastMessage("");
//     setToastType("");

//     // Fix: Set to null to hide the UI block completely
//     setConfidence(null);
//     setNotes([]);
//     setResultId(null);

//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   return (
//     <>
//       {toastMessage && (
//         <div
//           className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white
//     ${toastType === "success" ? "bg-green-600" : "bg-red-600"}`}
//         >
//           {toastMessage}
//         </div>
//       )}

//       <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
//         {message && (
//           <div
//             className={`fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium
//           ${messageType === "success" ? "bg-green-600" : "bg-red-600"}`}
//           >
//             {message}
//           </div>
//         )}

//         <div className="sm:mx-auto sm:w-full sm:max-w-md">
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             PDF OCR Extractor
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Upload your document to extract text instantly
//           </p>
//         </div>

//         <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
//           <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200 sm:rounded-xl sm:px-10 border border-gray-100">
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Upload Document
//                 </label>
//                 <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 hover:bg-gray-50 transition-colors duration-200 relative group cursor-pointer">
//                   <div className="space-y-1 text-center">
//                     <div className="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-500 transition-colors">
//                       <svg
//                         stroke="currentColor"
//                         fill="none"
//                         viewBox="0 0 48 48"
//                         aria-hidden="true"
//                       >
//                         <path
//                           d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                       </svg>
//                     </div>
//                     <div className="flex text-sm text-gray-600 justify-center">
//                       <label
//                         htmlFor="file-upload"
//                         className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
//                       >
//                         <span>Upload a PDF</span>
//                         <input
//                           id="file-upload"
//                           name="file-upload"
//                           type="file"
//                           accept="application/pdf"
//                           className="sr-only"
//                           ref={fileInputRef}
//                           onChange={(event) => {
//                             const file = event.target.files[0];
//                             if (!file) return;
//                             if (file.type !== "application/pdf") {
//                               showMessage(
//                                 "Only PDF files are allowed",
//                                 "error",
//                               );
//                               return;
//                             }
//                             if (file.size > MAX_FILE_SIZE) {
//                               showMessage(
//                                 "File too large. Max size is 10MB.",
//                                 "error",
//                               );
//                               return;
//                             }
//                             setSelectedFile(file);
//                             event.target.value = "";
//                           }}
//                         />
//                       </label>
//                       <p className="pl-1">or drag and drop</p>
//                     </div>
//                     <p className="text-xs text-gray-500">PDF up to 10MB</p>
//                   </div>
//                 </div>
//               </div>

//               {selectedFile && (
//                 <div className="flex items-center p-3 bg-indigo-50 text-indigo-700 rounded-lg text-sm animate-fade-in">
//                   <svg
//                     className="w-5 h-5 mr-2"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                     ></path>
//                   </svg>
//                   <span className="truncate font-medium">
//                     {selectedFile.name}
//                   </span>
//                 </div>
//               )}

//               <button
//                 onClick={HandleUpdate}
//                 disabled={isUploading}
//                 className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:cursor-pointer ${
//                   isUploading ? "opacity-75 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {isUploading ? <>Processing...</> : "Extract Text"}
//               </button>

//               {selectedFile && (
//                 <div className="mt-3 text-sm text-gray-700">
//                   <div className="font-medium">File : {selectedFile.name}</div>
//                   <div className="text-gray-500">
//                     Size: {formatFileSize(selectedFile.size)}
//                   </div>
//                 </div>
//               )}

//               <div className="flex gap-4 mt-4">
//                 <button
//                   onClick={handleReset}
//                   className="flex-1 px-4 py-2 rounded-xl border hover:bg-gray-50 hover:cursor-pointer transition"
//                 >
//                   Reset
//                 </button>
//                 {resultId && (
//                   <Link
//                     to={`/results/${resultId}`}
//                     className="flex-1 flex items-center justify-center px-4 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition shadow-sm"
//                   >
//                     View Analysis ➡
//                   </Link>
//                 )}
//               </div>
//             </div>

//             <div style={{ marginTop: "20px" }}>
//               <Link
//                 to="/history"
//                 style={{
//                   padding: "10px 14px",
//                   borderRadius: "10px",
//                   backgroundColor: "#2563eb",
//                   color: "white",
//                   textDecoration: "none",
//                   marginTop: "10px",
//                   display: "inline-block",
//                 }}
//               >
//                 📜 View OCR History
//               </Link>
//             </div>

//             <ManualVinLookup />

//             {/* --- KEY LOAN DETAILS GRID --- */}
//             <div className="mt-10">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                 Key Loan Details
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div className="bg-white shadow rounded-lg p-4 border">
//                   <p className="text-sm text-gray-500">Loan Amount</p>
//                   <p className="text-xl font-bold">
//                     {extractedFields.loanAmount
//                       ? "₹" + extractedFields.loanAmount
//                       : "—"}
//                   </p>
//                 </div>
//                 <div className="bg-white shadow rounded-lg p-4 border">
//                   <p className="text-sm text-gray-500">Interest Rate</p>
//                   <p className="text-xl font-bold">
//                     {extractedFields.interestRate
//                       ? extractedFields.interestRate + "%"
//                       : "—"}
//                   </p>
//                 </div>
//                 <div className="bg-white shadow rounded-lg p-4 border">
//                   <p className="text-sm text-gray-500">Tenure</p>
//                   <p className="text-xl font-bold">
//                     {extractedFields.tenure || "—"}
//                   </p>
//                 </div>
//                 <div className="bg-white shadow rounded-lg p-4 border">
//                   <p className="text-sm text-gray-500">Monthly EMI</p>
//                   <p className="text-xl font-bold">
//                     {extractedFields.emi ? "₹" + extractedFields.emi : "—"}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* --- SEPARATE SECTION FOR CONFIDENCE & NOTES --- */}
//             {/* Only shows if confidence is not null (Hidden on reset) */}
//             {confidence !== null && (
//               <div className="mt-6 grid grid-cols-1 gap-4">
//                 {/* Confidence Card */}
//                 <div
//                   style={{
//                     padding: "14px 16px",
//                     borderRadius: "12px",
//                     backgroundColor: "#f8fafc",
//                     boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
//                     border: "1px solid #e5e7eb",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "8px",
//                     }}
//                   >
//                     <span style={{ fontSize: "20px", marginRight: "8px" }}>
//                       📊
//                     </span>
//                     <strong style={{ fontSize: "15px" }}>
//                       Confidence Score
//                     </strong>
//                   </div>
//                   <div
//                     style={{
//                       fontSize: "26px",
//                       fontWeight: "bold",
//                       color:
//                         confidence >= 0.7
//                           ? "#16a34a"
//                           : confidence >= 0.4
//                             ? "#ca8a04"
//                             : "#dc2626",
//                     }}
//                   >
//                     {(confidence * 100).toFixed(1)}%
//                   </div>
//                 </div>

//                 {/* AI Notes Card */}
//                 {notes.length > 0 && (
//                   <div
//                     style={{
//                       padding: "14px 16px",
//                       borderRadius: "12px",
//                       backgroundColor: "#f9f9ff",
//                       boxShadow: "0 2px 6px rgba(0,0,150,0.08)",
//                       border: "1px solid #e0e7ff",
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         marginBottom: "10px",
//                       }}
//                     >
//                       <span style={{ fontSize: "20px", marginRight: "8px" }}>
//                         🧠
//                       </span>
//                       <strong style={{ fontSize: "15px" }}>
//                         AI Reasoning Notes
//                       </strong>
//                     </div>
//                     {notes.map((note, index) => (
//                       <div
//                         key={index}
//                         style={{
//                           padding: "8px 10px",
//                           borderRadius: "8px",
//                           marginBottom: "6px",
//                           backgroundColor: "#eef2ff",
//                           color: "#4338ca",
//                           fontSize: "14px",
//                           lineHeight: "1.5",
//                           display: "flex",
//                         }}
//                       >
//                         <span style={{ marginRight: "8px" }}>✔️</span>
//                         <span>{note}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             <div className="mt-10">
//               <div className="flex justify-center gap-6 text-sm">
//                 <span
//                   className={
//                     uploadStatus === "idle"
//                       ? "font-semibold text-blue-600"
//                       : "text-gray-400"
//                   }
//                 >
//                   Ready
//                 </span>
//                 <span className="text-gray-400">→</span>
//                 <span
//                   className={
//                     uploadStatus === "processing"
//                       ? "font-semibold text-orange-600"
//                       : "text-gray-400"
//                   }
//                 >
//                   Processing
//                 </span>
//                 <span className="text-gray-400">→</span>
//                 <span
//                   className={
//                     uploadStatus === "success"
//                       ? "font-semibold text-green-600"
//                       : uploadStatus === "error"
//                         ? "font-semibold text-red-600"
//                         : "text-gray-400"
//                   }
//                 >
//                   Result
//                 </span>
//               </div>
//             </div>

//             {ocrText && (
//               <div className="mt-8">
//                 <div className="flex items-center justify-between mb-2">
//                   <button
//                     onClick={copyToClipboard}
//                     disabled={isLoading || isUploading}
//                     className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-md shadow hover:bg-indigo-700 transition"
//                   >
//                     Copy Text
//                   </button>
//                   <h3 className="text-sm font-medium text-gray-900">
//                     OCR Result
//                   </h3>
//                   {uploadStatus === "processing" && (
//                     <span className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-full font-medium">
//                       Processing...
//                     </span>
//                   )}
//                   {uploadStatus === "success" && (
//                     <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full font-medium">
//                       Success
//                     </span>
//                   )}
//                   {uploadStatus === "error" && (
//                     <span className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded-full font-medium">
//                       Failed
//                     </span>
//                   )}
//                   {uploadStatus === "idle" && (
//                     <span className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded-full font-medium">
//                       Ready
//                     </span>
//                   )}
//                 </div>
//                 <div className="relative group">
//                   <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
//                   <div className="relative bg-gray-900 rounded-lg p-4 max-h-96 overflow-auto custom-scrollbar">
//                     <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
//                       {ocrText}
//                     </pre>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UploadPage;

/*****************Stable versionnnnn */

// import React, { useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";

// const UploadPage = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [ocrText, setOcrText] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const [resultId, setResultId] = useState(null);

//   // Data State
//   const [extractedFields, setExtractedFields] = useState({});
//   const [confidence, setConfidence] = useState(null);
//   const [notes, setNotes] = useState([]);

//   const fileInputRef = useRef(null);

//   const handleUpload = () => {
//     if (!selectedFile) {
//       toast.error("Please select a file first");
//       return;
//     }
//     setIsUploading(true);

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     fetch("http://localhost:3000/api/upload", {
//       method: "POST",
//       body: formData,
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (!data.success) {
//           toast.error("Upload failed: " + data.message);
//           setIsUploading(false);
//           return;
//         }

//         toast.success("Extraction Complete!");

//         // 1. Store ID for "View Analysis"
//         setResultId(data.savedId);

//         // 2. Set Raw Text
//         setOcrText(data.rawText);

//         // 3. Set Key Fields
//         setExtractedFields(data.extracted?.fields || {});

//         // 4. Set AI Notes & Confidence (Fixing your missing notes)
//         setNotes(data.extracted?.notes || []);
//         setConfidence(data.extracted?.confidence || 0);

//         setIsUploading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         toast.error("Server Error");
//         setIsUploading(false);
//       });
//   };

//   const handleReset = () => {
//     setSelectedFile(null);
//     setOcrText("");
//     setExtractedFields({});
//     setNotes([]);
//     setConfidence(null);
//     setResultId(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 font-sans">
//       <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md border border-gray-200">
//         <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
//           📄 Upload Contract
//         </h2>

//         {/* FILE INPUT */}
//         <div className="mb-6">
//           <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition">
//             <input
//               type="file"
//               accept="application/pdf"
//               className="hidden"
//               ref={fileInputRef}
//               onChange={(e) => setSelectedFile(e.target.files[0])}
//             />
//             <span className="text-gray-600 font-medium">
//               {selectedFile ? selectedFile.name : "Click to select PDF"}
//             </span>
//           </label>
//         </div>

//         {/* BUTTONS */}
//         <button
//           onClick={handleUpload}
//           disabled={isUploading}
//           className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
//         >
//           {isUploading ? "Processing..." : "Extract Data"}
//         </button>

//         {resultId && (
//           <div className="flex gap-4 mt-4">
//             <button
//               onClick={handleReset}
//               className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold"
//             >
//               Reset
//             </button>
//             <Link
//               to={`/results/${resultId}`}
//               className="flex-1 bg-green-600 text-center text-white py-3 rounded-lg font-bold hover:bg-green-700"
//             >
//               View Full Analysis ➡
//             </Link>
//           </div>
//         )}

//         {/* KEY LOAN DETAILS GRID */}
//         {extractedFields.loan_amount && (
//           <div className="mt-8">
//             <h3 className="text-lg font-bold text-gray-700 mb-3">
//               Key Loan Details
//             </h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-gray-50 p-3 rounded border">
//                 <div className="text-xs text-gray-500 uppercase">
//                   Loan Amount
//                 </div>
//                 <div className="text-lg font-bold">
//                   ₹{extractedFields.loan_amount?.toLocaleString()}
//                 </div>
//               </div>
//               <div className="bg-gray-50 p-3 rounded border">
//                 <div className="text-xs text-gray-500 uppercase">
//                   Interest Rate
//                 </div>
//                 <div className="text-lg font-bold">
//                   {extractedFields.interest_rate}%
//                 </div>
//               </div>
//               <div className="bg-gray-50 p-3 rounded border">
//                 <div className="text-xs text-gray-500 uppercase">Tenure</div>
//                 <div className="text-lg font-bold">
//                   {extractedFields.tenure_months} months
//                 </div>
//               </div>
//               <div className="bg-gray-50 p-3 rounded border">
//                 <div className="text-xs text-gray-500 uppercase">EMI</div>
//                 <div className="text-lg font-bold">
//                   ₹{extractedFields.emi?.toLocaleString()}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* AI REASONING NOTES (Restored) */}
//         {notes.length > 0 && (
//           <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
//             <h3 className="text-sm font-bold text-blue-800 uppercase mb-2">
//               🧠 AI Reasoning Notes
//             </h3>
//             <ul className="list-disc pl-5 text-sm text-blue-900 space-y-1">
//               {notes.map((note, index) => (
//                 <li key={index}>{note}</li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UploadPage;

///MOST STABLE ONE

// import React, { useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import ManualVinLookup from "../components/ManualVinLookup";
// const UploadPage = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [ocrText, setOcrText] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const [resultId, setResultId] = useState(null);

//   // Data State
//   const [extractedFields, setExtractedFields] = useState({
//     loanAmount: "",
//     interestRate: "",
//     tenure: "",
//     emi: "",
//   });
//   const [confidence, setConfidence] = useState(null);
//   const [notes, setNotes] = useState([]);

//   const fileInputRef = useRef(null);

//   const formatFileSize = (bytes) => {
//     if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
//     return (bytes / 1024).toFixed(0) + " KB";
//   };

//   const handleUpload = () => {
//     if (!selectedFile) {
//       toast.error("Please select a file first");
//       return;
//     }
//     setIsUploading(true);

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     fetch("http://localhost:3000/api/upload", {
//       method: "POST",
//       body: formData,
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (!data.success) {
//           toast.error("Upload failed: " + data.message);
//           setIsUploading(false);
//           return;
//         }

//         toast.success("Extraction Complete!");

//         // 1. Store ID
//         setResultId(data.savedId);

//         // 2. Set Raw Text
//         setOcrText(data.rawText);

//         // 3. Map Fields Correctly
//         const fields = data.extracted?.fields || data.fields || {};

//         setExtractedFields({
//           loanAmount: fields.loan_amount || "",
//           interestRate: fields.interest_rate || "",
//           tenure: fields.tenure_months ? fields.tenure_months + " months" : "",
//           emi: fields.emi || "",
//         });

//         // 4. Set Notes & Confidence
//         setNotes(data.extracted?.notes || []);
//         setConfidence(data.extracted?.confidence || 0);

//         setIsUploading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         toast.error("Server Error");
//         setIsUploading(false);
//       });
//   };

//   const handleReset = () => {
//     setSelectedFile(null);
//     setOcrText("");
//     setExtractedFields({
//       loanAmount: "",
//       interestRate: "",
//       tenure: "",
//       emi: "",
//     });
//     setNotes([]);
//     setConfidence(null);
//     setResultId(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           PDF OCR Extractor
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Upload your contract to extract data instantly
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
//         <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200 sm:rounded-xl sm:px-10 border border-gray-100">
//           {/* UPLOAD AREA */}
//           <div className="space-y-6">
//             <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 hover:bg-gray-50 transition-colors cursor-pointer">
//               <div className="space-y-1 text-center">
//                 <label
//                   htmlFor="file-upload"
//                   className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 hover:text-indigo-500"
//                 >
//                   <span className="block mb-2 text-lg">
//                     📄 Click to Upload PDF
//                   </span>
//                   <input
//                     id="file-upload"
//                     name="file-upload"
//                     type="file"
//                     accept="application/pdf"
//                     className="sr-only"
//                     ref={fileInputRef}
//                     onChange={(e) => {
//                       const file = e.target.files[0];
//                       if (file) setSelectedFile(file);
//                     }}
//                   />
//                 </label>
//                 <p className="text-xs text-gray-500">Supported format: PDF</p>
//               </div>
//             </div>

//             {selectedFile && (
//               <div className="flex items-center p-3 bg-indigo-50 text-indigo-700 rounded-lg text-sm">
//                 <span className="truncate font-medium">
//                   {selectedFile.name}
//                 </span>
//                 <span className="ml-2 text-gray-500">
//                   ({formatFileSize(selectedFile.size)})
//                 </span>
//               </div>
//             )}

//             <button
//               onClick={handleUpload}
//               disabled={isUploading}
//               className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 ${isUploading ? "opacity-75 cursor-not-allowed" : ""}`}
//             >
//               {isUploading ? "Processing..." : "Extract Data"}
//             </button>

//             {/* ACTION BUTTONS */}
//             <div className="flex gap-4 mt-4">
//               <button
//                 onClick={handleReset}
//                 className="flex-1 px-4 py-2 rounded-xl border hover:bg-gray-50 text-gray-700 font-medium"
//               >
//                 Reset
//               </button>
//               {resultId && (
//                 <Link
//                   to={`/results/${resultId}`}
//                   className="flex-1 flex items-center justify-center px-4 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition shadow-sm"
//                 >
//                   View Analysis ➡
//                 </Link>
//               )}
//             </div>

//             {/* HISTORY LINK */}
//             <div className="mt-4 text-center border-t pt-4">
//               <Link
//                 to="/history"
//                 className="text-indigo-600 font-medium hover:underline flex items-center justify-center gap-2"
//               >
//                 <span>📜</span> View OCR History
//               </Link>
//             </div>
//           </div>

//           <ManualVinLookup />

//           {/* KEY LOAN DETAILS GRID (Always Visible Now) */}
//           <div className="mt-10 animate-fade-in">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">
//               Key Loan Details
//             </h3>
//             <div className="grid grid-cols-2 gap-4">
//               {/* Loan Amount */}
//               <div className="bg-white shadow-sm rounded-lg p-3 border border-gray-200">
//                 <p className="text-xs text-gray-500 uppercase tracking-wide">
//                   Loan Amount
//                 </p>
//                 <p
//                   className={`text-lg font-bold ${extractedFields.loanAmount ? "text-gray-900" : "text-gray-400"}`}
//                 >
//                   {extractedFields.loanAmount
//                     ? `₹${extractedFields.loanAmount.toLocaleString()}`
//                     : "—"}
//                 </p>
//               </div>

//               {/* Interest Rate */}
//               <div className="bg-white shadow-sm rounded-lg p-3 border border-gray-200">
//                 <p className="text-xs text-gray-500 uppercase tracking-wide">
//                   Interest Rate
//                 </p>
//                 <p
//                   className={`text-lg font-bold ${extractedFields.interestRate ? "text-gray-900" : "text-gray-400"}`}
//                 >
//                   {extractedFields.interestRate
//                     ? `${extractedFields.interestRate}%`
//                     : "—"}
//                 </p>
//               </div>

//               {/* Tenure */}
//               <div className="bg-white shadow-sm rounded-lg p-3 border border-gray-200">
//                 <p className="text-xs text-gray-500 uppercase tracking-wide">
//                   Tenure
//                 </p>
//                 <p
//                   className={`text-lg font-bold ${extractedFields.tenure ? "text-gray-900" : "text-gray-400"}`}
//                 >
//                   {extractedFields.tenure || "—"}
//                 </p>
//               </div>

//               {/* EMI */}
//               <div className="bg-white shadow-sm rounded-lg p-3 border border-gray-200">
//                 <p className="text-xs text-gray-500 uppercase tracking-wide">
//                   EMI
//                 </p>
//                 <p
//                   className={`text-lg font-bold ${extractedFields.emi ? "text-gray-900" : "text-gray-400"}`}
//                 >
//                   {extractedFields.emi
//                     ? `₹${extractedFields.emi.toLocaleString()}`
//                     : "—"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* CONFIDENCE & NOTES */}
//           {(confidence !== null || notes.length > 0) && (
//             <div className="mt-6 grid grid-cols-1 gap-4">
//               {/* Confidence */}
//               {confidence !== null && (
//                 <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
//                   <strong className="text-sm text-gray-600">
//                     AI Confidence Score
//                   </strong>
//                   <div
//                     className={`text-xl font-bold ${confidence >= 0.7 ? "text-green-600" : "text-yellow-600"}`}
//                   >
//                     {(confidence * 100).toFixed(1)}%
//                   </div>
//                 </div>
//               )}

//               {notes.length > 0 && (
//                 <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
//                   <strong className="text-sm text-blue-900 block mb-2">
//                     🧠 AI Reasoning Notes
//                   </strong>
//                   <ul className="text-sm text-blue-800 list-disc pl-5 space-y-1">
//                     {notes.map((n, i) => (
//                       <li key={i}>{n}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadPage;

/*****MOST STABLE ONE USE THIS  */

// import React, { useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import ManualVinLookup from "../components/ManualVinLookup";

// // --- UPDATED STEPPER COMPONENT ---
// const ProgressStepper = ({ currentStep }) => {
//   const steps = [
//     { id: 1, name: "Upload PDF" },
//     { id: 2, name: "Processing AI" },
//     { id: 3, name: "Analysis Ready" },
//   ];

//   return (
//     <div className="w-full py-6">
//       <div className="flex items-center justify-center space-x-4">
//         {steps.map((step, index) => {
//           // Logic: It is "completed" only if we have moved PAST this step
//           const isCompleted = currentStep > step.id;
//           const isCurrent = currentStep === step.id;
//           const isPending = currentStep < step.id;

//           return (
//             <div key={step.id} className="flex items-center">
//               {/* Line Connector */}
//               {index > 0 && (
//                 <div
//                   className={`h-1 w-8 sm:w-16 mx-2 rounded transition-colors duration-300 ${
//                     currentStep >= step.id ? "bg-indigo-600" : "bg-gray-200"
//                   }`}
//                 />
//               )}

//               {/* Circle & Label */}
//               <div className="flex flex-col items-center relative">
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2
//                     ${
//                       isCompleted
//                         ? "bg-indigo-600 text-white border-indigo-600" // Completed (Checkmark)
//                         : isCurrent
//                           ? "bg-white text-indigo-600 border-indigo-600 ring-2 ring-indigo-100 scale-110" // Current (Active Number)
//                           : "bg-white text-gray-300 border-gray-200" // Pending (Gray)
//                     }`}
//                 >
//                   {isCompleted ? "✓" : step.id}
//                 </div>
//                 <span
//                   className={`absolute -bottom-6 w-32 text-center text-xs font-semibold transition-colors duration-300 ${
//                     isCurrent || isCompleted
//                       ? "text-indigo-700"
//                       : "text-gray-400"
//                   }`}
//                 >
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

// const UploadPage = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [ocrText, setOcrText] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const [resultId, setResultId] = useState(null);

//   // Data State
//   const [extractedFields, setExtractedFields] = useState({
//     loanAmount: "",
//     interestRate: "",
//     tenure: "",
//     emi: "",
//   });
//   const [confidence, setConfidence] = useState(null);
//   const [notes, setNotes] = useState([]);

//   const fileInputRef = useRef(null);

//   // --- LOGIC FOR ACTIVE STEP ---
//   let activeStep = 1;
//   if (isUploading) activeStep = 2; // Move to Step 2 (Processing)
//   if (resultId) activeStep = 3; // Move to Step 3 (Done)

//   const formatFileSize = (bytes) => {
//     if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
//     return (bytes / 1024).toFixed(0) + " KB";
//   };

//   const handleUpload = () => {
//     if (!selectedFile) {
//       toast.error("Please select a file first");
//       return;
//     }
//     setIsUploading(true);
//     setResultId(null);

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     fetch("http://localhost:3000/api/upload", {
//       method: "POST",
//       body: formData,
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (!data.success) {
//           toast.error("Upload failed: " + data.message);
//           setIsUploading(false);
//           return;
//         }

//         toast.success("Extraction Complete!");

//         setResultId(data.savedId);
//         setOcrText(data.rawText || "");

//         const fields = data.extracted?.fields || data.fields || {};
//         setExtractedFields({
//           loanAmount: fields.loan_amount || "",
//           interestRate: fields.interest_rate || "",
//           tenure: fields.tenure_months ? fields.tenure_months + " months" : "",
//           emi: fields.emi || "",
//         });

//         setNotes(data.extracted?.notes || []);
//         setConfidence(data.extracted?.confidence || 0);

//         setIsUploading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         toast.error("Server Error");
//         setIsUploading(false);
//       });
//   };

//   const handleReset = () => {
//     setSelectedFile(null);
//     setOcrText("");
//     setExtractedFields({
//       loanAmount: "",
//       interestRate: "",
//       tenure: "",
//       emi: "",
//     });
//     setNotes([]);
//     setConfidence(null);
//     setResultId(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
//         <h2 className="text-3xl font-extrabold text-gray-900">
//           PDF OCR Extractor
//         </h2>
//         <p className="mt-2 text-sm text-gray-600">
//           AI-Powered Contract Analysis
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
//         <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200 sm:rounded-xl sm:px-10 border border-gray-100">
//           {/* STEPPER */}
//           <ProgressStepper currentStep={activeStep} />
//           <div className="mb-8 border-b border-gray-100"></div>

//           {/* UPLOAD AREA */}
//           <div className="space-y-6">
//             <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 hover:bg-gray-50 transition-colors cursor-pointer group">
//               <div className="space-y-1 text-center">
//                 <label
//                   htmlFor="file-upload"
//                   className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 hover:text-indigo-500"
//                 >
//                   <span className="block mb-2 text-lg group-hover:scale-105 transition-transform">
//                     📄 Click to Upload PDF
//                   </span>
//                   <input
//                     id="file-upload"
//                     name="file-upload"
//                     type="file"
//                     accept="application/pdf"
//                     className="sr-only"
//                     ref={fileInputRef}
//                     onChange={(e) => {
//                       const file = e.target.files[0];
//                       if (file) setSelectedFile(file);
//                     }}
//                   />
//                 </label>
//                 <p className="text-xs text-gray-500">
//                   Supported format: PDF (Max 10MB)
//                 </p>
//               </div>
//             </div>

//             {selectedFile && (
//               <div className="flex items-center p-3 bg-indigo-50 text-indigo-700 rounded-lg text-sm border border-indigo-100">
//                 <span className="truncate font-medium">
//                   {selectedFile.name}
//                 </span>
//                 <span className="ml-2 text-gray-500">
//                   ({formatFileSize(selectedFile.size)})
//                 </span>
//               </div>
//             )}

//             <button
//               onClick={handleUpload}
//               disabled={isUploading}
//               className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white uppercase tracking-wider transition-all ${isUploading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"}`}
//             >
//               {isUploading ? "Processing..." : "Extract Data"}
//             </button>

//             {/* ACTION BUTTONS */}
//             <div className="flex gap-4 mt-4">
//               <button
//                 onClick={handleReset}
//                 className="flex-1 px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition"
//               >
//                 Reset
//               </button>
//               {resultId && (
//                 <Link
//                   to={`/results/${resultId}`}
//                   className="flex-1 flex items-center justify-center px-4 py-2 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition shadow-md hover:shadow-lg animate-pulse-once"
//                 >
//                   View Analysis ➡
//                 </Link>
//               )}
//             </div>

//             <div className="mt-4 text-center border-t border-gray-100 pt-4">
//               <Link
//                 to="/history"
//                 className="text-indigo-600 font-medium hover:underline flex items-center justify-center gap-2 text-sm"
//               >
//                 <span>📜</span> View Past History
//               </Link>
//             </div>
//           </div>

//           {/* KEY LOAN DETAILS GRID (Always Visible) */}
//           <div className="mt-12">
//             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
//               Live Extraction Preview
//             </h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//                 <p className="text-[10px] font-bold text-gray-400 uppercase">
//                   Loan Amount
//                 </p>
//                 <p
//                   className={`text-lg font-bold ${extractedFields.loanAmount ? "text-indigo-600" : "text-gray-300"}`}
//                 >
//                   {extractedFields.loanAmount
//                     ? `₹${extractedFields.loanAmount.toLocaleString()}`
//                     : "—"}
//                 </p>
//               </div>
//               <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//                 <p className="text-[10px] font-bold text-gray-400 uppercase">
//                   Interest Rate
//                 </p>
//                 <p
//                   className={`text-lg font-bold ${extractedFields.interestRate ? "text-indigo-600" : "text-gray-300"}`}
//                 >
//                   {extractedFields.interestRate
//                     ? `${extractedFields.interestRate}%`
//                     : "—"}
//                 </p>
//               </div>
//               <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//                 <p className="text-[10px] font-bold text-gray-400 uppercase">
//                   Tenure
//                 </p>
//                 <p
//                   className={`text-lg font-bold ${extractedFields.tenure ? "text-indigo-600" : "text-gray-300"}`}
//                 >
//                   {extractedFields.tenure || "—"}
//                 </p>
//               </div>
//               <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//                 <p className="text-[10px] font-bold text-gray-400 uppercase">
//                   EMI
//                 </p>
//                 <p
//                   className={`text-lg font-bold ${extractedFields.emi ? "text-indigo-600" : "text-gray-300"}`}
//                 >
//                   {extractedFields.emi
//                     ? `₹${extractedFields.emi.toLocaleString()}`
//                     : "—"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* CONFIDENCE & NOTES */}
//           {(confidence !== null || notes.length > 0) && (
//             <div className="mt-6 grid grid-cols-1 gap-4 animate-fade-in-up">
//               {confidence !== null && (
//                 <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
//                   <strong className="text-sm text-gray-600">
//                     AI Confidence Score
//                   </strong>
//                   <div
//                     className={`text-xl font-bold ${confidence >= 0.7 ? "text-green-600" : "text-yellow-600"}`}
//                   >
//                     {(confidence * 100).toFixed(1)}%
//                   </div>
//                 </div>
//               )}
//               {notes.length > 0 && (
//                 <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
//                   <strong className="text-sm text-indigo-900 block mb-2">
//                     🧠 AI Extraction Notes
//                   </strong>
//                   <ul className="text-sm text-indigo-800 list-disc pl-5 space-y-1">
//                     {notes.map((n, i) => (
//                       <li key={i}>{n}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* RAW OCR TEXT */}
//           {ocrText && (
//             <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
//                 <h3 className="text-xs font-bold text-gray-500 uppercase">
//                   Raw OCR Data
//                 </h3>
//               </div>
//               <div className="p-4 max-h-40 overflow-y-auto bg-gray-50/50">
//                 <pre className="text-[10px] text-gray-500 whitespace-pre-wrap font-mono leading-relaxed">
//                   {ocrText}
//                 </pre>
//               </div>
//             </div>
//           )}

//           <ManualVinLookup />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadPage;

/****STABLE ONE    PREVIOUSSS */

// import React, { useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import ManualVinLookup from "../components/ManualVinLookup";
// // 👇 CHANGED: Import the new Contract Generator
// import ContractGenerator from "../components/ContractGenerator";

// // ... (Keep ProgressStepper code same as before) ...
// const ProgressStepper = ({ currentStep }) => {
//   const steps = [
//     { id: 1, name: "Upload PDF" },
//     { id: 2, name: "Processing AI" },
//     { id: 3, name: "Analysis Ready" },
//   ];

//   return (
//     <div className="w-full py-6">
//       <div className="flex items-center justify-center space-x-4">
//         {steps.map((step, index) => {
//           const isCompleted = currentStep > step.id;
//           const isCurrent = currentStep === step.id;
//           return (
//             <div key={step.id} className="flex items-center">
//               {index > 0 && (
//                 <div
//                   className={`h-1 w-8 sm:w-16 mx-2 rounded transition-colors duration-300 ${
//                     currentStep >= step.id ? "bg-indigo-600" : "bg-gray-200"
//                   }`}
//                 />
//               )}
//               <div className="flex flex-col items-center relative">
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${isCompleted ? "bg-indigo-600 text-white border-indigo-600" : isCurrent ? "bg-white text-indigo-600 border-indigo-600 ring-2 ring-indigo-100 scale-110" : "bg-white text-gray-300 border-gray-200"}`}
//                 >
//                   {isCompleted ? "✓" : step.id}
//                 </div>
//                 <span
//                   className={`absolute -bottom-6 w-32 text-center text-xs font-semibold ${isCurrent || isCompleted ? "text-indigo-700" : "text-gray-400"}`}
//                 >
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

// const UploadPage = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [resultId, setResultId] = useState(null);
//   const [ocrText, setOcrText] = useState("");

//   // ✅ NEW: State to hold ALL extracted fields
//   const [data, setData] = useState(null);
//   const [confidence, setConfidence] = useState(null);

//   const fileInputRef = useRef(null);
//   let activeStep = 1;
//   if (isUploading) activeStep = 2;
//   if (resultId) activeStep = 3;

//   const formatFileSize = (bytes) => {
//     if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
//     return (bytes / 1024).toFixed(0) + " KB";
//   };

//   const handleUpload = () => {
//     if (!selectedFile) return toast.error("Please select a file first");

//     setIsUploading(true);
//     setResultId(null);
//     setData(null);

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     fetch("http://localhost:3000/api/upload", {
//       method: "POST",
//       body: formData,
//     })
//       .then((res) => res.json())
//       .then((resData) => {
//         if (!resData.success) {
//           toast.error("Upload failed: " + resData.message);
//           setIsUploading(false);
//           return;
//         }

//         toast.success("AI Extraction Complete!");

//         setResultId(resData.savedId);
//         setOcrText(resData.rawText || "");

//         // ✅ SAVE ALL FIELDS TO STATE
//         setData(resData.extracted?.fields || resData.fields || {});
//         setConfidence(resData.extracted?.confidence || 0);

//         setIsUploading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         toast.error("Server Error");
//         setIsUploading(false);
//       });
//   };

//   const handleReset = () => {
//     setSelectedFile(null);
//     setOcrText("");
//     setData(null);
//     setResultId(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   // Helper to render a field card
//   const InfoCard = ({ label, value, highlight = false }) => (
//     <div
//       className={`p-3 rounded-lg border ${highlight ? "bg-indigo-50 border-indigo-200" : "bg-gray-50 border-gray-200"}`}
//     >
//       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
//         {label}
//       </p>
//       <p
//         className={`text-sm font-bold truncate ${highlight ? "text-indigo-700" : "text-gray-800"}`}
//       >
//         {value || "—"}
//       </p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
//         <h2 className="text-3xl font-extrabold text-gray-900">
//           PDF OCR Extractor
//         </h2>
//         <p className="mt-2 text-sm text-gray-600">
//           AI-Powered Contract Analysis
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
//         <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
//           <ProgressStepper currentStep={activeStep} />
//           <div className="mb-8 border-b border-gray-100"></div>

//           {/* UPLOAD AREA */}
//           <div className="space-y-6">
//             {!resultId && (
//               <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 hover:bg-gray-50 transition-colors cursor-pointer group">
//                 <div className="space-y-1 text-center">
//                   <label
//                     htmlFor="file-upload"
//                     className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 hover:text-indigo-500"
//                   >
//                     <span className="block mb-2 text-lg group-hover:scale-105 transition-transform">
//                       📄 Click to Upload PDF
//                     </span>
//                     <input
//                       id="file-upload"
//                       name="file-upload"
//                       type="file"
//                       accept="application/pdf"
//                       className="sr-only"
//                       ref={fileInputRef}
//                       onChange={(e) => {
//                         const file = e.target.files[0];
//                         if (file) setSelectedFile(file);
//                       }}
//                     />
//                   </label>
//                   <p className="text-xs text-gray-500">
//                     Supported format: PDF (Max 10MB)
//                   </p>
//                 </div>
//               </div>
//             )}

//             {selectedFile && !resultId && (
//               <div className="flex items-center p-3 bg-indigo-50 text-indigo-700 rounded-lg text-sm border border-indigo-100">
//                 <span className="truncate font-medium">
//                   {selectedFile.name}
//                 </span>
//                 <span className="ml-2 text-gray-500">
//                   ({formatFileSize(selectedFile.size)})
//                 </span>
//               </div>
//             )}

//             {!resultId && (
//               <button
//                 onClick={handleUpload}
//                 disabled={isUploading}
//                 className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white uppercase tracking-wider transition-all ${isUploading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
//               >
//                 {isUploading ? "AI is Analyzing..." : "Extract Data"}
//               </button>
//             )}

//             {/* 👇 UPDATED: SHOW CONTRACT GENERATOR IF NO FILE SELECTED */}
//             {!selectedFile && !resultId && <ContractGenerator />}

//             {/* ACTION BUTTONS (AFTER UPLOAD) */}
//             {resultId && (
//               <div className="flex gap-4 mt-4">
//                 <button
//                   onClick={handleReset}
//                   className="flex-1 px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition"
//                 >
//                   Upload Another
//                 </button>
//                 <Link
//                   to={`/results/${resultId}`}
//                   className="flex-1 flex items-center justify-center px-4 py-2 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition shadow-md"
//                 >
//                   View Full Analysis ➡
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* ✅ DYNAMIC DATA DISPLAY GRID (Only shows after upload) */}
//           {data && (
//             <div className="mt-10 animate-fade-in-up">
//               {/* SECTION 1: FINANCIALS */}
//               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 border-b pb-1">
//                 💰 Financial Details
//               </h3>
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
//                 <InfoCard
//                   label="Loan Amount"
//                   value={
//                     data.loan_amount
//                       ? `₹${data.loan_amount.toLocaleString()}`
//                       : null
//                   }
//                   highlight
//                 />
//                 <InfoCard
//                   label="EMI / Month"
//                   value={
//                     data.monthly_payment || data.emi
//                       ? `₹${(data.monthly_payment || data.emi).toLocaleString()}`
//                       : null
//                   }
//                   highlight
//                 />
//                 <InfoCard
//                   label="Interest Rate"
//                   value={data.interest_rate ? `${data.interest_rate}%` : null}
//                 />
//                 <InfoCard
//                   label="Down Payment"
//                   value={
//                     data.down_payment
//                       ? `₹${data.down_payment.toLocaleString()}`
//                       : null
//                   }
//                 />
//               </div>

//               {/* SECTION 2: LEASE TERMS */}
//               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 border-b pb-1">
//                 📜 Contract Terms
//               </h3>
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
//                 <InfoCard
//                   label="Tenure"
//                   value={
//                     data.tenure_months ? `${data.tenure_months} Months` : null
//                   }
//                 />
//                 <InfoCard
//                   label="Residual Value"
//                   value={
//                     data.residual_value
//                       ? `₹${data.residual_value.toLocaleString()}`
//                       : null
//                   }
//                 />
//                 <InfoCard
//                   label="Buyout Price"
//                   value={
//                     data.purchase_option_price
//                       ? `₹${data.purchase_option_price}`
//                       : null
//                   }
//                 />
//               </div>

//               {/* SECTION 3: COVERAGE & FEES */}
//               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 border-b pb-1">
//                 🛡️ Coverage & Penalties
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
//                 <InfoCard label="Warranty" value={data.warranty_coverage} />
//                 <InfoCard
//                   label="Mileage Limit"
//                   value={data.mileage_allowance}
//                 />
//                 <InfoCard
//                   label="Early Termination"
//                   value={data.early_termination_fee}
//                 />
//                 <InfoCard
//                   label="Late Penalty"
//                   value={data.late_payment_penalty}
//                 />
//               </div>

//               {/* SECTION 4: MAINTENANCE */}
//               <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
//                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
//                   🔧 Maintenance Responsibilities
//                 </p>
//                 <p className="text-xs text-gray-700">
//                   {data.maintenance_responsibilities ||
//                     "Not specified in extract."}
//                 </p>
//               </div>
//             </div>
//           )}

//           <ManualVinLookup />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadPage;

import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ManualVinLookup from "../components/ManualVinLookup";
// 👇 CHANGED: Import the new Contract Generator
import ContractGenerator from "../components/ContractGenerator";

// ... (Keep ProgressStepper code same as before) ...
const ProgressStepper = ({ currentStep }) => {
  const steps = [
    { id: 1, name: "Upload PDF" },
    { id: 2, name: "Processing AI" },
    { id: 3, name: "Analysis Ready" },
  ];

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-center space-x-4">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          return (
            <div key={step.id} className="flex items-center">
              {index > 0 && (
                <div
                  className={`h-1 w-8 sm:w-16 mx-2 rounded transition-colors duration-300 ${
                    currentStep >= step.id ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                />
              )}
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${isCompleted ? "bg-indigo-600 text-white border-indigo-600" : isCurrent ? "bg-white text-indigo-600 border-indigo-600 ring-2 ring-indigo-100 scale-110" : "bg-white text-gray-300 border-gray-200"}`}
                >
                  {isCompleted ? "✓" : step.id}
                </div>
                <span
                  className={`absolute -bottom-6 w-32 text-center text-xs font-semibold ${isCurrent || isCompleted ? "text-indigo-700" : "text-gray-400"}`}
                >
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

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [resultId, setResultId] = useState(null);
  const [ocrText, setOcrText] = useState("");

  // ✅ NEW: State to hold ALL extracted fields
  const [data, setData] = useState(null);
  const [confidence, setConfidence] = useState(null);

  const fileInputRef = useRef(null);
  let activeStep = 1;
  if (isUploading) activeStep = 2;
  if (resultId) activeStep = 3;

  const formatFileSize = (bytes) => {
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / 1024).toFixed(0) + " KB";
  };

  const handleUpload = () => {
    if (!selectedFile) return toast.error("Please select a file first");

    setIsUploading(true);
    setResultId(null);
    setData(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    fetch("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((resData) => {
        if (!resData.success) {
          toast.error("Upload failed: " + resData.message);
          setIsUploading(false);
          return;
        }

        toast.success("AI Extraction Complete!");

        setResultId(resData.savedId);
        setOcrText(resData.rawText || "");

        // ✅ SAVE ALL FIELDS TO STATE
        setData(resData.extracted?.fields || resData.fields || {});
        setConfidence(resData.extracted?.confidence || 0);

        setIsUploading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Server Error");
        setIsUploading(false);
      });
  };

  const handleReset = () => {
    setSelectedFile(null);
    setOcrText("");
    setData(null);
    setResultId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Helper to render a field card
  const InfoCard = ({ label, value, highlight = false }) => (
    <div
      className={`p-3 rounded-lg border ${highlight ? "bg-indigo-50 border-indigo-200" : "bg-gray-50 border-gray-200"}`}
    >
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      <p
        className={`text-sm font-bold truncate ${highlight ? "text-indigo-700" : "text-gray-800"}`}
      >
        {/* 👇 CHANGED: Display value directly (it is already a formatted string from backend) */}
        {value || "—"}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          PDF OCR Extractor
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          AI-Powered Contract Analysis
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
          <ProgressStepper currentStep={activeStep} />
          <div className="mb-8 border-b border-gray-100"></div>

          {/* UPLOAD AREA */}
          <div className="space-y-6">
            {!resultId && (
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="space-y-1 text-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    <span className="block mb-2 text-lg group-hover:scale-105 transition-transform">
                      📄 Click to Upload PDF
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="application/pdf"
                      className="sr-only"
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) setSelectedFile(file);
                      }}
                    />
                  </label>
                  <p className="text-xs text-gray-500">
                    Supported format: PDF (Max 10MB)
                  </p>
                </div>
              </div>
            )}

            {selectedFile && !resultId && (
              <div className="flex items-center p-3 bg-indigo-50 text-indigo-700 rounded-lg text-sm border border-indigo-100">
                <span className="truncate font-medium">
                  {selectedFile.name}
                </span>
                <span className="ml-2 text-gray-500">
                  ({formatFileSize(selectedFile.size)})
                </span>
              </div>
            )}

            {!resultId && (
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white uppercase tracking-wider transition-all ${isUploading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
              >
                {isUploading ? "AI is Analyzing..." : "Extract Data"}
              </button>
            )}

            {/* 👇 UPDATED: SHOW CONTRACT GENERATOR IF NO FILE SELECTED */}
            {!selectedFile && !resultId && <ContractGenerator />}

            {/* ACTION BUTTONS (AFTER UPLOAD) */}
            {resultId && (
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition"
                >
                  Upload Another
                </button>
                <Link
                  to={`/results/${resultId}`}
                  className="flex-1 flex items-center justify-center px-4 py-2 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition shadow-md"
                >
                  View Full Analysis ➡
                </Link>
              </div>
            )}
          </div>

          {/* ✅ DYNAMIC DATA DISPLAY GRID (Only shows after upload) */}
          {data && (
            <div className="mt-10 animate-fade-in-up">
              {/* SECTION 1: FINANCIALS */}
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 border-b pb-1">
                💰 Financial Details
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <InfoCard
                  label="Loan Amount"
                  value={data.loan_amount}
                  highlight
                />
                <InfoCard
                  label="EMI / Month"
                  value={data.monthly_payment || data.emi}
                  highlight
                />
                <InfoCard label="Interest Rate" value={data.interest_rate} />
                <InfoCard label="Down Payment" value={data.down_payment} />
              </div>

              {/* SECTION 2: LEASE TERMS */}
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 border-b pb-1">
                📜 Contract Terms
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                <InfoCard label="Tenure" value={data.tenure_months} />
                <InfoCard label="Residual Value" value={data.residual_value} />
                <InfoCard
                  label="Buyout Price"
                  value={data.purchase_option_price}
                />
              </div>

              {/* SECTION 3: COVERAGE & FEES */}
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 border-b pb-1">
                🛡️ Coverage & Penalties
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <InfoCard label="Warranty" value={data.warranty_coverage} />
                <InfoCard
                  label="Mileage Limit"
                  value={data.mileage_allowance}
                />
                <InfoCard
                  label="Early Termination"
                  value={data.early_termination_fee}
                />
                <InfoCard
                  label="Late Penalty"
                  value={data.late_payment_penalty}
                />
              </div>

              {/* SECTION 4: MAINTENANCE */}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  🔧 Maintenance Responsibilities
                </p>
                <p className="text-xs text-gray-700">
                  {data.maintenance_responsibilities ||
                    "Not specified in extract."}
                </p>
              </div>
            </div>
          )}

          <ManualVinLookup />
        </div>
      </div>
    </div>
  );
};

export default UploadPage;