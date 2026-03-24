// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";

// const EmailGeneratorPage = () => {
//   const [history, setHistory] = useState([]);
//   const [selectedContractId, setSelectedContractId] = useState("");

//   // Form State
//   const [recipientName, setRecipientName] = useState("");
//   const [recipientEmail, setRecipientEmail] = useState("");
//   const [userName, setUserName] = useState("");

//   // Email State
//   const [generatedSubject, setGeneratedSubject] = useState("");
//   const [generatedBody, setGeneratedBody] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isSending, setIsSending] = useState(false);

//   // Load Contracts
//   useEffect(() => {
//     fetch("https://car-lease-loan-ai-assistant.onrender.com/api/history")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) setHistory(data.data);
//       });
//   }, []);

//   const handleGenerate = async () => {
//     if (!selectedContractId || !recipientName || !userName) {
//       toast.warning(
//         "Please fill in all fields (Contract, Recipient Name, Your Name)",
//       );
//       return;
//     }

//     setIsGenerating(true);
//     try {
//       const res = await fetch("https://car-lease-loan-ai-assistant.onrender.com/api/email/generate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contractId: selectedContractId,
//           recipientName,
//           userName,
//         }),
//       });

//       const data = await res.json();
//       if (data.success) {
//         // Naive parsing of Subject/Body from AI text
//         const text = data.draft;
//         const subjectMatch = text.match(/Subject: (.*)/);
//         const subject = subjectMatch
//           ? subjectMatch[1]
//           : "Counter Offer regarding Vehicle Loan";
//         const body = text.replace(/Subject: .*/, "").trim();

//         setGeneratedSubject(subject);
//         setGeneratedBody(body);
//         toast.success("Draft Generated!");
//       }
//     } catch (err) {
//       toast.error("Failed to generate draft");
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleSend = async () => {
//     if (!recipientEmail || !generatedBody) {
//       toast.warning("Please enter recipient email and generate a body first.");
//       return;
//     }

//     setIsSending(true);
//     try {
//       const res = await fetch("https://car-lease-loan-ai-assistant.onrender.com/api/email/send", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           to: recipientEmail,
//           subject: generatedSubject,
//           body: generatedBody,
//         }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         toast.success("Email sent successfully!");
//         // Optional: Clear form
//       } else {
//         toast.error("Failed to send: " + data.message);
//       }
//     } catch (err) {
//       toast.error("Network error sending email");
//     } finally {
//       setIsSending(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 font-sans">
//       <div className="max-w-4xl mx-auto">
//         {/* HEADER */}
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-extrabold text-gray-900">
//             ✉️ AI Email Generator
//           </h1>
//           <Link to="/" className="text-indigo-600 font-bold hover:underline">
//             ⬅ Back Home
//           </Link>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* LEFT: CONFIGURATION */}
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//             <h3 className="text-lg font-bold text-gray-800 mb-6">
//               1. Configuration
//             </h3>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Select Contract
//                 </label>
//                 <select
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                   value={selectedContractId}
//                   onChange={(e) => setSelectedContractId(e.target.value)}
//                 >
//                   <option value="">-- Choose a Contract --</option>
//                   {history.map((rec) => (
//                     <option key={rec._id} value={rec._id}>
//                       {rec.fileName} ({rec.vehicleDetails?.make || "Unknown"})
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Recipient Name (Dealer/Bank)
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                   placeholder="e.g. Mr. John Smith"
//                   value={recipientName}
//                   onChange={(e) => setRecipientName(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Recipient Email
//                 </label>
//                 <input
//                   type="email"
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                   placeholder="dealer@bank.com"
//                   value={recipientEmail}
//                   onChange={(e) => setRecipientEmail(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Your Name
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                   placeholder="e.g. Rahul"
//                   value={userName}
//                   onChange={(e) => setUserName(e.target.value)}
//                 />
//               </div>

//               <button
//                 onClick={handleGenerate}
//                 disabled={isGenerating}
//                 className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 mt-4"
//               >
//                 {isGenerating ? "🤖 AI Writing..." : "✨ Generate Draft"}
//               </button>
//             </div>
//           </div>

//           {/* RIGHT: PREVIEW & SEND */}
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
//             <h3 className="text-lg font-bold text-gray-800 mb-6">
//               2. Review & Send
//             </h3>

//             <div className="flex-1 space-y-4">
//               <div>
//                 <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
//                   Subject
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full border border-gray-300 rounded p-2 text-sm font-medium"
//                   value={generatedSubject}
//                   onChange={(e) => setGeneratedSubject(e.target.value)}
//                 />
//               </div>

//               <div className="h-full">
//                 <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
//                   Email Body
//                 </label>
//                 <textarea
//                   className="w-full h-64 border border-gray-300 rounded p-3 text-sm leading-relaxed resize-none"
//                   value={generatedBody}
//                   onChange={(e) => setGeneratedBody(e.target.value)}
//                   placeholder="AI generated content will appear here..."
//                 ></textarea>
//               </div>
//             </div>

//             <button
//               onClick={handleSend}
//               disabled={isSending || !generatedBody}
//               className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 mt-4 flex justify-center items-center gap-2"
//             >
//               {isSending ? "Sending..." : "🚀 Send Email"}
//             </button>

//             {!process.env.EMAIL_USER && (
//               <p className="text-xs text-center text-gray-400 mt-2 italic">
//                 (Simulation Mode: Check Server Console for output)
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmailGeneratorPage;

/*********STABLE VERSION */

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";

// const EmailGeneratorPage = () => {
//   const [history, setHistory] = useState([]);
//   const [selectedContractId, setSelectedContractId] = useState("");

//   // Form State
//   const [recipientName, setRecipientName] = useState("");
//   const [recipientEmail, setRecipientEmail] = useState("");
//   const [userName, setUserName] = useState("");

//   // Email State
//   const [generatedSubject, setGeneratedSubject] = useState("");
//   const [generatedBody, setGeneratedBody] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isSending, setIsSending] = useState(false);

//   // Load Contracts
//   useEffect(() => {
//     fetch("https://car-lease-loan-ai-assistant.onrender.com/api/history")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) setHistory(data.data);
//       });
//   }, []);

//   const handleGenerate = async () => {
//     if (!selectedContractId || !recipientName || !userName) {
//       toast.warning(
//         "Please fill in all fields (Contract, Recipient Name, Your Name)",
//       );
//       return;
//     }

//     setIsGenerating(true);
//     try {
//       const res = await fetch("https://car-lease-loan-ai-assistant.onrender.com/api/email/generate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contractId: selectedContractId,
//           recipientName,
//           userName,
//         }),
//       });

//       const data = await res.json();
//       if (data.success) {
//         const text = data.draft;
//         const subjectMatch = text.match(/Subject: (.*)/);
//         const subject = subjectMatch
//           ? subjectMatch[1]
//           : "Counter Offer regarding Vehicle Loan";
//         const body = text.replace(/Subject: .*/, "").trim();

//         setGeneratedSubject(subject);
//         setGeneratedBody(body);
//         toast.success("Draft Generated!");
//       }
//     } catch (err) {
//       toast.error("Failed to generate draft");
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleSend = async () => {
//     if (!recipientEmail || !generatedBody) {
//       toast.warning("Please enter recipient email and generate a body first.");
//       return;
//     }

//     setIsSending(true);
//     try {
//       const res = await fetch("https://car-lease-loan-ai-assistant.onrender.com/api/email/send", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           to: recipientEmail,
//           subject: generatedSubject,
//           body: generatedBody,
//         }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         toast.success("Email sent successfully!");
//       } else {
//         toast.error("Failed to send: " + data.message);
//       }
//     } catch (err) {
//       toast.error("Network error sending email");
//     } finally {
//       setIsSending(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 font-sans">
//       <div className="max-w-4xl mx-auto">
//         {/* HEADER */}
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-extrabold text-gray-900">
//             ✉️ AI Email Generator
//           </h1>
//           <Link to="/" className="text-indigo-600 font-bold hover:underline">
//             ⬅ Back Home
//           </Link>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* LEFT: CONFIGURATION */}
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//             <h3 className="text-lg font-bold text-gray-800 mb-6">
//               1. Configuration
//             </h3>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Select Contract
//                 </label>
//                 <select
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                   value={selectedContractId}
//                   onChange={(e) => setSelectedContractId(e.target.value)}
//                 >
//                   <option value="">-- Choose a Contract --</option>
//                   {history.map((rec) => (
//                     <option key={rec._id} value={rec._id}>
//                       {rec.fileName} ({rec.vehicleDetails?.make || "Unknown"})
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Recipient Name (Dealer/Bank)
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                   placeholder="e.g. Mr. John Smith"
//                   value={recipientName}
//                   onChange={(e) => setRecipientName(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Recipient Email
//                 </label>
//                 <input
//                   type="email"
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                   placeholder="dealer@bank.com"
//                   value={recipientEmail}
//                   onChange={(e) => setRecipientEmail(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Your Name
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                   placeholder="e.g. Rahul"
//                   value={userName}
//                   onChange={(e) => setUserName(e.target.value)}
//                 />
//               </div>

//               <button
//                 onClick={handleGenerate}
//                 disabled={isGenerating}
//                 className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 mt-4"
//               >
//                 {isGenerating ? "🤖 AI Writing..." : "✨ Generate Draft"}
//               </button>
//             </div>
//           </div>

//           {/* RIGHT: PREVIEW & SEND */}
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
//             <h3 className="text-lg font-bold text-gray-800 mb-6">
//               2. Review & Send
//             </h3>

//             <div className="flex-1 space-y-4">
//               <div>
//                 <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
//                   Subject
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full border border-gray-300 rounded p-2 text-sm font-medium"
//                   value={generatedSubject}
//                   onChange={(e) => setGeneratedSubject(e.target.value)}
//                 />
//               </div>

//               <div className="h-full">
//                 <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
//                   Email Body
//                 </label>
//                 <textarea
//                   className="w-full h-64 border border-gray-300 rounded p-3 text-sm leading-relaxed resize-none"
//                   value={generatedBody}
//                   onChange={(e) => setGeneratedBody(e.target.value)}
//                   placeholder="AI generated content will appear here..."
//                 ></textarea>
//               </div>
//             </div>

//             <button
//               onClick={handleSend}
//               disabled={isSending || !generatedBody}
//               className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 mt-4 flex justify-center items-center gap-2"
//             >
//               {isSending ? "Sending..." : "🚀 Send Email"}
//             </button>

//             <p className="text-xs text-center text-gray-400 mt-2 italic">
//               Note: Configure email settings in backend .env file to send real
//               emails.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmailGeneratorPage;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";

// const EmailGeneratorPage = () => {
//   const [history, setHistory] = useState([]);
//   const [selectedContractId, setSelectedContractId] = useState("");

//   // Form State
//   const [recipientName, setRecipientName] = useState("");
//   const [recipientEmail, setRecipientEmail] = useState("");
//   const [userName, setUserName] = useState("");

//   // Email State
//   const [generatedSubject, setGeneratedSubject] = useState("");
//   const [generatedBody, setGeneratedBody] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isSending, setIsSending] = useState(false);

//   // Load Contracts
//   useEffect(() => {
//     fetch("https://car-lease-loan-ai-assistant.onrender.com/api/history")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) setHistory(data.data);
//       });
//   }, []);

//   const handleGenerate = async () => {
//     if (!selectedContractId || !recipientName || !userName) {
//       toast.warning(
//         "Please fill in all fields (Contract, Recipient Name, Your Name)",
//       );
//       return;
//     }

//     setIsGenerating(true);
//     try {
//       const res = await fetch("https://car-lease-loan-ai-assistant.onrender.com/api/email/generate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contractId: selectedContractId,
//           recipientName,
//           userName,
//         }),
//       });

//       const data = await res.json();
//       if (data.success) {
//         const text = data.draft;
//         const subjectMatch = text.match(/Subject: (.*)/);
//         const subject = subjectMatch
//           ? subjectMatch[1]
//           : "Counter Offer regarding Vehicle Loan";
//         const body = text.replace(/Subject: .*/, "").trim();

//         setGeneratedSubject(subject);
//         setGeneratedBody(body);
//         toast.success("Draft Generated!");
//       }
//     } catch (err) {
//       toast.error("Failed to generate draft");
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleSend = async () => {
//     if (!recipientEmail || !generatedBody) {
//       toast.warning("Please enter recipient email and generate a body first.");
//       return;
//     }

//     setIsSending(true);
//     try {
//       const res = await fetch("https://car-lease-loan-ai-assistant.onrender.com/api/email/send", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           to: recipientEmail,
//           subject: generatedSubject,
//           body: generatedBody,
//         }),
//       });
//       const data = await res.json();

//       if (data.success) {
//         toast.success("Email sent successfully!");

//         // 👇 CLEAR THE FORM STATE HERE
//         setGeneratedSubject("");
//         setGeneratedBody("");
//         // Optional: Keep recipient details if they want to send another,
//         // or clear everything: setRecipientName(""); setRecipientEmail("");
//       } else {
//         toast.error("Failed to send: " + data.message);
//       }
//     } catch (err) {
//       toast.error("Network error sending email");
//     } finally {
//       setIsSending(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 font-sans">
//       <div className="max-w-4xl mx-auto">
//         {/* HEADER */}
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-extrabold text-gray-900">
//             ✉️ AI Email Generator
//           </h1>
//           <Link to="/" className="text-indigo-600 font-bold hover:underline">
//             ⬅ Back Home
//           </Link>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* LEFT: CONFIGURATION */}
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//             <h3 className="text-lg font-bold text-gray-800 mb-6">
//               1. Configuration
//             </h3>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Select Contract
//                 </label>
//                 <select
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                   value={selectedContractId}
//                   onChange={(e) => setSelectedContractId(e.target.value)}
//                 >
//                   <option value="">-- Choose a Contract --</option>
//                   {history.map((rec) => (
//                     <option key={rec._id} value={rec._id}>
//                       {rec.fileName} ({rec.vehicleDetails?.make || "Unknown"})
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Recipient Name (Dealer/Bank)
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                   placeholder="e.g. Mr. John Smith"
//                   value={recipientName}
//                   onChange={(e) => setRecipientName(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Recipient Email
//                 </label>
//                 <input
//                   type="email"
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                   placeholder="dealer@bank.com"
//                   value={recipientEmail}
//                   onChange={(e) => setRecipientEmail(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Your Name
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                   placeholder="e.g. Rahul"
//                   value={userName}
//                   onChange={(e) => setUserName(e.target.value)}
//                 />
//               </div>

//               <button
//                 onClick={handleGenerate}
//                 disabled={isGenerating}
//                 className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 mt-4"
//               >
//                 {isGenerating ? "🤖 AI Writing..." : "✨ Generate Draft"}
//               </button>
//             </div>
//           </div>

//           {/* RIGHT: PREVIEW & SEND */}
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
//             <h3 className="text-lg font-bold text-gray-800 mb-6">
//               2. Review & Send
//             </h3>

//             <div className="flex-1 space-y-4">
//               <div>
//                 <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
//                   Subject
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full border border-gray-300 rounded p-2 text-sm font-medium"
//                   value={generatedSubject}
//                   onChange={(e) => setGeneratedSubject(e.target.value)}
//                   placeholder="Generated subject will appear here..."
//                 />
//               </div>

//               <div className="h-full">
//                 <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
//                   Email Body
//                 </label>
//                 <textarea
//                   className="w-full h-64 border border-gray-300 rounded p-3 text-sm leading-relaxed resize-none"
//                   value={generatedBody}
//                   onChange={(e) => setGeneratedBody(e.target.value)}
//                   placeholder="AI generated content will appear here..."
//                 ></textarea>
//               </div>
//             </div>

//             <button
//               onClick={handleSend}
//               disabled={isSending || !generatedBody}
//               className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 mt-4 flex justify-center items-center gap-2"
//             >
//               {isSending ? "Sending..." : "🚀 Send Email"}
//             </button>

//             <p className="text-xs text-center text-gray-400 mt-2 italic">
//               Note: Configure email settings in backend .env file to send real
//               emails.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmailGeneratorPage;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";

// const EmailGeneratorPage = () => {
//   const [history, setHistory] = useState([]);
//   const [selectedContractId, setSelectedContractId] = useState("");
//   const [recipientName, setRecipientName] = useState("");
//   const [recipientEmail, setRecipientEmail] = useState("");
//   const [userName, setUserName] = useState("");
//   const [generatedSubject, setGeneratedSubject] = useState("");
//   const [generatedBody, setGeneratedBody] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isSending, setIsSending] = useState(false);

//   useEffect(() => {
//     fetch("https://car-lease-loan-ai-assistant.onrender.com/api/history")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success && Array.isArray(data.data)) setHistory(data.data);
//         else if (data.success && Array.isArray(data.history))
//           setHistory(data.history);
//       });
//   }, []);

//   const handleGenerate = async () => {
//     if (!selectedContractId || !recipientName || !userName) {
//       toast.warning("Please fill all fields.");
//       return;
//     }
//     setIsGenerating(true);
//     try {
//       const res = await fetch("https://car-lease-loan-ai-assistant.onrender.com/api/email/generate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contractId: selectedContractId,
//           recipientName,
//           userName,
//         }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         // Simple heuristic to split subject/body
//         const lines = data.draft.split("\n");
//         const subjectLine =
//           lines.find((l) => l.startsWith("Subject:")) ||
//           "Subject: Negotiation regarding Car Loan";
//         const bodyText = lines
//           .filter((l) => !l.startsWith("Subject:"))
//           .join("\n")
//           .trim();

//         setGeneratedSubject(subjectLine.replace("Subject:", "").trim());
//         setGeneratedBody(bodyText);
//         toast.success("Draft Generated!");
//       } else {
//         toast.error(data.message || "Failed to generate");
//       }
//     } catch (err) {
//       toast.error("Network Error");
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleSend = async () => {
//     if (!recipientEmail || !generatedBody)
//       return toast.warning("Missing email or body");
//     setIsSending(true);
//     try {
//       const res = await fetch("https://car-lease-loan-ai-assistant.onrender.com/api/email/send", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           to: recipientEmail,
//           subject: generatedSubject,
//           body: generatedBody,
//         }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         toast.success("Email Sent!");
//         setGeneratedSubject("");
//         setGeneratedBody("");
//         setRecipientEmail("");
//         setRecipientName("");
//       } else {
//         toast.error(data.message);
//       }
//     } catch (err) {
//       toast.error("Failed to send email");
//     } finally {
//       setIsSending(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 font-sans">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-extrabold text-gray-900">
//             ✉️ Email Generator
//           </h1>
//           <Link to="/" className="text-indigo-600 font-bold hover:underline">
//             ⬅ Home
//           </Link>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* LEFT COLUMN: INPUTS */}
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
//             <h3 className="font-bold text-gray-800">1. Setup</h3>
//             <select
//               className="w-full border p-2 rounded"
//               value={selectedContractId}
//               onChange={(e) => setSelectedContractId(e.target.value)}
//             >
//               <option value="">-- Select Contract --</option>
//               {history.map((rec) => (
//                 <option key={rec._id} value={rec._id}>
//                   {rec.fileName}
//                 </option>
//               ))}
//             </select>
//             <input
//               className="w-full border p-2 rounded"
//               placeholder="Recipient Name"
//               value={recipientName}
//               onChange={(e) => setRecipientName(e.target.value)}
//             />
//             <input
//               className="w-full border p-2 rounded"
//               placeholder="Recipient Email"
//               value={recipientEmail}
//               onChange={(e) => setRecipientEmail(e.target.value)}
//             />
//             <input
//               className="w-full border p-2 rounded"
//               placeholder="Your Name"
//               value={userName}
//               onChange={(e) => setUserName(e.target.value)}
//             />
//             <button
//               onClick={handleGenerate}
//               disabled={isGenerating}
//               className="w-full bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-700 disabled:opacity-50"
//             >
//               {isGenerating ? "Generating..." : "Generate Draft"}
//             </button>
//           </div>

//           {/* RIGHT COLUMN: PREVIEW */}
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col space-y-4">
//             <h3 className="font-bold text-gray-800">2. Preview</h3>
//             <input
//               className="w-full border p-2 rounded"
//               placeholder="Subject"
//               value={generatedSubject}
//               onChange={(e) => setGeneratedSubject(e.target.value)}
//             />
//             <textarea
//               className="w-full border p-2 rounded h-40"
//               placeholder="Body..."
//               value={generatedBody}
//               onChange={(e) => setGeneratedBody(e.target.value)}
//             />
//             <button
//               onClick={handleSend}
//               disabled={isSending}
//               className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 disabled:opacity-50"
//             >
//               {isSending ? "Sending..." : "Send Email"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmailGeneratorPage;




// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";

// const EmailGeneratorPage = () => {
//   const [history, setHistory] = useState([]);
//   const [selectedContractId, setSelectedContractId] = useState("");
//   const [recipientName, setRecipientName] = useState("");
//   const [recipientEmail, setRecipientEmail] = useState("");
//   const [userName, setUserName] = useState("");
//   const [generatedSubject, setGeneratedSubject] = useState("");
//   const [generatedBody, setGeneratedBody] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isSending, setIsSending] = useState(false);
//   const [focused, setFocused] = useState({});

//   useEffect(() => {
//     fetch("https://car-lease-loan-ai-assistant.onrender.com/api/history")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success && Array.isArray(data.data)) setHistory(data.data);
//         else if (data.success && Array.isArray(data.history))
//           setHistory(data.history);
//       });
//   }, []);

//   const handleGenerate = async () => {
//     if (!selectedContractId || !recipientName || !userName) {
//       toast.warning("Please fill all fields.");
//       return;
//     }
//     setIsGenerating(true);
//     try {
//       const res = await fetch(
//         "https://car-lease-loan-ai-assistant.onrender.com/api/email/generate",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             contractId: selectedContractId,
//             recipientName,
//             userName,
//           }),
//         },
//       );
//       const data = await res.json();
//       if (data.success) {
//         const lines = data.draft.split("\n");
//         const subjectLine =
//           lines.find((l) => l.startsWith("Subject:")) ||
//           "Subject: Negotiation regarding Car Loan";
//         const bodyText = lines
//           .filter((l) => !l.startsWith("Subject:"))
//           .join("\n")
//           .trim();
//         setGeneratedSubject(subjectLine.replace("Subject:", "").trim());
//         setGeneratedBody(bodyText);
//         toast.success("Draft Generated!");
//       } else {
//         toast.error(data.message || "Failed to generate");
//       }
//     } catch (err) {
//       toast.error("Network Error");
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleSend = async () => {
//     if (!recipientEmail || !generatedBody)
//       return toast.warning("Missing email or body");
//     setIsSending(true);
//     try {
//       const res = await fetch(
//         "https://car-lease-loan-ai-assistant.onrender.com/api/email/send",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             to: recipientEmail,
//             subject: generatedSubject,
//             body: generatedBody,
//           }),
//         },
//       );
//       const data = await res.json();
//       if (data.success) {
//         toast.success("Email Sent!");
//         setGeneratedSubject("");
//         setGeneratedBody("");
//         setRecipientEmail("");
//         setRecipientName("");
//       } else {
//         toast.error(data.message);
//       }
//     } catch (err) {
//       toast.error("Failed to send email");
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const fo = (k) => ({
//     onFocus: () => setFocused((f) => ({ ...f, [k]: true })),
//     onBlur: () => setFocused((f) => ({ ...f, [k]: false })),
//   });

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
//         *, *::before, *::after { box-sizing: border-box; }

//         .em-root {
//           font-family: 'Sora', sans-serif;
//           min-height: 100vh;
//           background: #050816;
//           position: relative;
//           overflow-x: hidden;
//           padding: 2.5rem 1.25rem 5rem;
//         }
//         .em-orb { position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0;animation:em-drift 14s ease-in-out infinite alternate; }
//         .em-orb-1 { width:520px;height:520px;background:radial-gradient(circle,#4f46e5,#1e1b4b);top:-160px;left:-160px;opacity:0.3;animation-delay:0s; }
//         .em-orb-2 { width:460px;height:460px;background:radial-gradient(circle,#10b981,#065f46);bottom:-150px;right:-130px;opacity:0.22;animation-delay:-7s; }
//         .em-orb-3 { width:280px;height:280px;background:radial-gradient(circle,#8b5cf6,#6d28d9);top:35%;left:58%;opacity:0.18;animation-delay:-11s; }
//         @keyframes em-drift { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(28px,22px) scale(1.06)} }
//         .em-grid { position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);background-size:48px 48px; }

//         .em-wrap { position:relative;z-index:1;max-width:980px;margin:0 auto; }

//         /* Header */
//         .em-header { display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:2.5rem;gap:1rem;flex-wrap:wrap; }
//         .em-header-left {}
//         .em-badge { display:inline-flex;align-items:center;gap:6px;background:rgba(108,99,255,0.14);border:1px solid rgba(108,99,255,0.3);border-radius:999px;padding:4px 14px;font-size:10px;font-weight:600;letter-spacing:0.08em;color:#a5b4fc;text-transform:uppercase;margin-bottom:0.75rem; }
//         .em-badge-dot { width:6px;height:6px;border-radius:50%;background:#6c63ff;box-shadow:0 0 6px #6c63ff;animation:em-pulse 2s ease-in-out infinite; }
//         @keyframes em-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
//         .em-title { font-size:clamp(1.6rem,4vw,2.2rem);font-weight:800;color:#fff;letter-spacing:-0.04em;line-height:1.1;margin:0 0 0.3rem; }
//         .em-sub { font-family:'DM Sans',sans-serif;font-size:0.875rem;color:rgba(255,255,255,0.38); }
//         .em-back { display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:11px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.55);font-family:'Sora',sans-serif;font-size:0.8rem;font-weight:600;text-decoration:none;transition:background 0.2s,border-color 0.2s,transform 0.15s;white-space:nowrap;align-self:flex-start; }
//         .em-back:hover { background:rgba(255,255,255,0.09);border-color:rgba(255,255,255,0.2);transform:translateY(-1px); }

//         /* Grid */
//         .em-grid-cols { display:grid;grid-template-columns:1fr;gap:1.25rem; }
//         @media(min-width:700px) { .em-grid-cols { grid-template-columns:1fr 1fr; } }

//         /* Panel card */
//         .em-panel {
//           background:rgba(255,255,255,0.04);
//           border:1px solid rgba(255,255,255,0.09);
//           border-radius:24px;
//           padding:2rem;
//           backdrop-filter:blur(24px);
//           -webkit-backdrop-filter:blur(24px);
//           box-shadow:0 24px 60px rgba(0,0,0,0.4),0 0 0 1px rgba(255,255,255,0.03) inset;
//           position:relative;
//           animation:em-cardIn 0.6s cubic-bezier(0.22,1,0.36,1) both;
//         }
//         .em-panel:nth-child(2) { animation-delay:0.1s; }
//         @keyframes em-cardIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
//         .em-panel::before { content:'';position:absolute;top:0;left:10%;right:10%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent); }

//         .em-panel-header { display:flex;align-items:center;gap:10px;margin-bottom:1.5rem; }
//         .em-panel-num { width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,#6c63ff,#4f46e5);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;flex-shrink:0; }
//         .em-panel-title { font-size:0.95rem;font-weight:700;color:#fff;letter-spacing:-0.01em; }

//         /* Input */
//         .em-field-group { margin-bottom:0.9rem; }
//         .em-label { display:block;font-size:9px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;margin-bottom:6px;transition:color 0.2s; }
//         .em-label.active { color:#a5b4fc; }
//         .em-label:not(.active) { color:rgba(255,255,255,0.35); }

//         .em-input-wrap { position:relative; }
//         .em-input-icon { position:absolute;left:13px;top:50%;transform:translateY(-50%);pointer-events:none;display:flex;align-items:center;color:rgba(255,255,255,0.22);transition:color 0.2s; }
//         .em-input-icon.active { color:#6c63ff; }

//         .em-field {
//           width:100%;padding:11px 13px 11px 40px;
//           background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);
//           border-radius:12px;color:#fff;
//           font-family:'DM Sans',sans-serif;font-size:0.875rem;
//           outline:none;transition:border-color 0.25s,background 0.25s,box-shadow 0.25s;
//           -webkit-text-fill-color:#fff;
//         }
//         .em-field::placeholder { color:rgba(255,255,255,0.2); }
//         .em-field:focus { border-color:rgba(108,99,255,0.65);background:rgba(108,99,255,0.07);box-shadow:0 0 0 3px rgba(108,99,255,0.13); }
//         .em-field:-webkit-autofill, .em-field:-webkit-autofill:focus {
//           -webkit-box-shadow:0 0 0 1000px rgba(20,16,50,0.98) inset;
//           -webkit-text-fill-color:#fff !important;caret-color:#fff;
//         }

//         /* Select */
//         .em-select {
//           width:100%;padding:11px 13px 11px 40px;
//           background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);
//           border-radius:12px;color:#fff;
//           font-family:'DM Sans',sans-serif;font-size:0.875rem;
//           outline:none;transition:border-color 0.25s,background 0.25s,box-shadow 0.25s;
//           appearance:none;cursor:pointer;
//         }
//         .em-select:focus { border-color:rgba(108,99,255,0.65);background:rgba(108,99,255,0.07);box-shadow:0 0 0 3px rgba(108,99,255,0.13); }
//         .em-select option { background:#0f0c29;color:#fff; }
//         .em-select-caret { position:absolute;right:13px;top:50%;transform:translateY(-50%);pointer-events:none;color:rgba(255,255,255,0.3); }

//         /* Textarea */
//         .em-textarea {
//           width:100%;padding:11px 13px;
//           background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);
//           border-radius:12px;color:#fff;
//           font-family:'DM Sans',sans-serif;font-size:0.875rem;line-height:1.65;
//           outline:none;transition:border-color 0.25s,background 0.25s,box-shadow 0.25s;
//           resize:vertical;min-height:180px;
//         }
//         .em-textarea::placeholder { color:rgba(255,255,255,0.2); }
//         .em-textarea:focus { border-color:rgba(108,99,255,0.65);background:rgba(108,99,255,0.07);box-shadow:0 0 0 3px rgba(108,99,255,0.13); }

//         /* Divider */
//         .em-divider { height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);margin:1.25rem 0; }

//         /* Buttons */
//         .em-btn-primary {
//           width:100%;padding:13px;border-radius:13px;border:none;cursor:pointer;
//           font-family:'Sora',sans-serif;font-size:0.9rem;font-weight:600;color:#fff;
//           background:linear-gradient(135deg,#6c63ff,#4f46e5,#3b2fd6);
//           display:flex;align-items:center;justify-content:center;gap:8px;
//           position:relative;overflow:hidden;
//           transition:transform 0.18s,box-shadow 0.18s,opacity 0.2s;
//           box-shadow:0 4px 22px rgba(108,99,255,0.35);
//         }
//         .em-btn-primary::before { content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);transition:left 0.5s; }
//         .em-btn-primary:hover:not(:disabled)::before { left:100%; }
//         .em-btn-primary:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 8px 28px rgba(108,99,255,0.5); }
//         .em-btn-primary:disabled { opacity:0.55;cursor:not-allowed; }

//         .em-btn-green {
//           width:100%;padding:13px;border-radius:13px;border:none;cursor:pointer;
//           font-family:'Sora',sans-serif;font-size:0.9rem;font-weight:600;color:#fff;
//           background:linear-gradient(135deg,#10b981,#059669);
//           display:flex;align-items:center;justify-content:center;gap:8px;
//           position:relative;overflow:hidden;
//           transition:transform 0.18s,box-shadow 0.18s,opacity 0.2s;
//           box-shadow:0 4px 22px rgba(16,185,129,0.3);
//         }
//         .em-btn-green::before { content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);transition:left 0.5s; }
//         .em-btn-green:hover:not(:disabled)::before { left:100%; }
//         .em-btn-green:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 8px 28px rgba(16,185,129,0.42); }
//         .em-btn-green:disabled { opacity:0.55;cursor:not-allowed; }

//         /* Spinner */
//         .em-spin { animation:spin 0.8s linear infinite; }
//         @keyframes spin { to{transform:rotate(360deg)} }

//         /* Empty preview state */
//         .em-empty { display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2.5rem 1rem;text-align:center;flex:1; }
//         .em-empty-icon { width:52px;height:52px;border-radius:14px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.2);margin-bottom:1rem; }
//         .em-empty-text { font-family:'DM Sans',sans-serif;font-size:0.85rem;color:rgba(255,255,255,0.28);line-height:1.6; }
//       `}</style>

//       <div className="em-root">
//         <div className="em-orb em-orb-1" />
//         <div className="em-orb em-orb-2" />
//         <div className="em-orb em-orb-3" />
//         <div className="em-grid" />

//         <div className="em-wrap">
//           {/* Header */}
//           <div className="em-header">
//             <div className="em-header-left">
//               <div>
//                 <span className="em-badge">
//                   <span className="em-badge-dot" />
//                   AI Negotiator
//                 </span>
//               </div>
//               <h1 className="em-title">Email Generator</h1>
//               <p className="em-sub">
//                 Generate AI counter-offer emails from your contracts
//               </p>
//             </div>
//             <Link to="/" className="em-back">
//               <svg
//                 width="14"
//                 height="14"
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

//           {/* Two columns */}
//           <div className="em-grid-cols">
//             {/* LEFT — Setup */}
//             <div className="em-panel">
//               <div className="em-panel-header">
//                 <div className="em-panel-num">1</div>
//                 <span className="em-panel-title">Setup</span>
//               </div>

//               {/* Contract select */}
//               <div className="em-field-group">
//                 <label
//                   className={`em-label${focused.contract ? " active" : ""}`}
//                 >
//                   Select Contract
//                 </label>
//                 <div className="em-input-wrap">
//                   <span
//                     className={`em-input-icon${focused.contract ? " active" : ""}`}
//                   >
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//                       <polyline points="14 2 14 8 20 8" />
//                     </svg>
//                   </span>
//                   <select
//                     className="em-select"
//                     value={selectedContractId}
//                     onChange={(e) => setSelectedContractId(e.target.value)}
//                     {...fo("contract")}
//                   >
//                     <option value="">— Select Contract —</option>
//                     {history.map((rec) => (
//                       <option key={rec._id} value={rec._id}>
//                         {rec.fileName}
//                       </option>
//                     ))}
//                   </select>
//                   <span className="em-select-caret">
//                     <svg
//                       width="12"
//                       height="12"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2.5"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <polyline points="6 9 12 15 18 9" />
//                     </svg>
//                   </span>
//                 </div>
//               </div>

//               <div className="em-divider" />

//               {/* Recipient name */}
//               <div className="em-field-group">
//                 <label className={`em-label${focused.rname ? " active" : ""}`}>
//                   Recipient Name
//                 </label>
//                 <div className="em-input-wrap">
//                   <span
//                     className={`em-input-icon${focused.rname ? " active" : ""}`}
//                   >
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//                       <circle cx="12" cy="7" r="4" />
//                     </svg>
//                   </span>
//                   <input
//                     className="em-field"
//                     placeholder="e.g. John Smith"
//                     value={recipientName}
//                     onChange={(e) => setRecipientName(e.target.value)}
//                     {...fo("rname")}
//                   />
//                 </div>
//               </div>

//               {/* Recipient email */}
//               <div className="em-field-group">
//                 <label className={`em-label${focused.remail ? " active" : ""}`}>
//                   Recipient Email
//                 </label>
//                 <div className="em-input-wrap">
//                   <span
//                     className={`em-input-icon${focused.remail ? " active" : ""}`}
//                   >
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <rect x="2" y="4" width="20" height="16" rx="3" />
//                       <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
//                     </svg>
//                   </span>
//                   <input
//                     type="email"
//                     className="em-field"
//                     placeholder="dealer@example.com"
//                     value={recipientEmail}
//                     onChange={(e) => setRecipientEmail(e.target.value)}
//                     {...fo("remail")}
//                   />
//                 </div>
//               </div>

//               {/* Your name */}
//               <div className="em-field-group">
//                 <label className={`em-label${focused.uname ? " active" : ""}`}>
//                   Your Name
//                 </label>
//                 <div className="em-input-wrap">
//                   <span
//                     className={`em-input-icon${focused.uname ? " active" : ""}`}
//                   >
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//                       <circle cx="12" cy="7" r="4" />
//                     </svg>
//                   </span>
//                   <input
//                     className="em-field"
//                     placeholder="Your full name"
//                     value={userName}
//                     onChange={(e) => setUserName(e.target.value)}
//                     {...fo("uname")}
//                   />
//                 </div>
//               </div>

//               <div style={{ marginTop: "1.25rem" }}>
//                 <button
//                   onClick={handleGenerate}
//                   disabled={isGenerating}
//                   className="em-btn-primary"
//                 >
//                   {isGenerating ? (
//                     <>
//                       <svg
//                         className="em-spin"
//                         width="16"
//                         height="16"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2.5"
//                       >
//                         <path
//                           d="M21 12a9 9 0 1 1-6.219-8.56"
//                           strokeLinecap="round"
//                         />
//                       </svg>
//                       Generating…
//                     </>
//                   ) : (
//                     <>
//                       Generate Draft
//                       <svg
//                         width="14"
//                         height="14"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2.5"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       >
//                         <path d="M5 12h14M12 5l7 7-7 7" />
//                       </svg>
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* RIGHT — Preview */}
//             <div
//               className="em-panel"
//               style={{ display: "flex", flexDirection: "column" }}
//             >
//               <div className="em-panel-header">
//                 <div
//                   className="em-panel-num"
//                   style={{
//                     background: "linear-gradient(135deg,#10b981,#059669)",
//                   }}
//                 >
//                   2
//                 </div>
//                 <span className="em-panel-title">Preview & Send</span>
//               </div>

//               {!generatedSubject && !generatedBody ? (
//                 <div className="em-empty">
//                   <div className="em-empty-icon">
//                     <svg
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="1.6"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
//                       <polyline points="22,6 12,13 2,6" />
//                     </svg>
//                   </div>
//                   <p className="em-empty-text">
//                     Fill in the setup form and click
//                     <br />
//                     <strong style={{ color: "rgba(255,255,255,0.4)" }}>
//                       Generate Draft
//                     </strong>{" "}
//                     to see your email here
//                   </p>
//                 </div>
//               ) : (
//                 <>
//                   {/* Subject */}
//                   <div className="em-field-group">
//                     <label
//                       className={`em-label${focused.subject ? " active" : ""}`}
//                     >
//                       Subject Line
//                     </label>
//                     <div className="em-input-wrap">
//                       <span
//                         className={`em-input-icon${focused.subject ? " active" : ""}`}
//                       >
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
//                           <line x1="4" y1="6" x2="20" y2="6" />
//                           <line x1="4" y1="12" x2="14" y2="12" />
//                         </svg>
//                       </span>
//                       <input
//                         className="em-field"
//                         placeholder="Subject"
//                         value={generatedSubject}
//                         onChange={(e) => setGeneratedSubject(e.target.value)}
//                         {...fo("subject")}
//                       />
//                     </div>
//                   </div>

//                   {/* Body */}
//                   <div
//                     className="em-field-group"
//                     style={{
//                       flex: 1,
//                       display: "flex",
//                       flexDirection: "column",
//                     }}
//                   >
//                     <label
//                       className={`em-label${focused.body ? " active" : ""}`}
//                     >
//                       Email Body
//                     </label>
//                     <textarea
//                       className="em-textarea"
//                       style={{ flex: 1, minHeight: "200px" }}
//                       placeholder="Your email body will appear here…"
//                       value={generatedBody}
//                       onChange={(e) => setGeneratedBody(e.target.value)}
//                       {...fo("body")}
//                     />
//                   </div>
//                 </>
//               )}

//               <div style={{ marginTop: "auto", paddingTop: "1.25rem" }}>
//                 <button
//                   onClick={handleSend}
//                   disabled={isSending || !generatedBody}
//                   className="em-btn-green"
//                 >
//                   {isSending ? (
//                     <>
//                       <svg
//                         className="em-spin"
//                         width="16"
//                         height="16"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2.5"
//                       >
//                         <path
//                           d="M21 12a9 9 0 1 1-6.219-8.56"
//                           strokeLinecap="round"
//                         />
//                       </svg>
//                       Sending…
//                     </>
//                   ) : (
//                     <>
//                       <svg
//                         width="15"
//                         height="15"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2.5"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       >
//                         <line x1="22" y1="2" x2="11" y2="13" />
//                         <polygon points="22 2 15 22 11 13 2 9 22 2" />
//                       </svg>
//                       Send Email
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default EmailGeneratorPage;




import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const EmailGeneratorPage = () => {
  const [history, setHistory] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [generatedSubject, setGeneratedSubject] = useState("");
  const [generatedBody, setGeneratedBody] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [focused, setFocused] = useState({});

  // Added missing state variables for the Reminder section
  const [dealerName, setDealerName] = useState("");
  const [reminderDate, setReminderDate] = useState("");

  useEffect(() => {
    fetch("https://car-lease-loan-ai-assistant.onrender.com/api/history")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) setHistory(data.data);
        else if (data.success && Array.isArray(data.history))
          setHistory(data.history);
      });
  }, []);

  const handleGenerate = async () => {
    if (!selectedContractId || !recipientName || !userName) {
      toast.warning("Please fill all fields.");
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch(
        "https://car-lease-loan-ai-assistant.onrender.com/api/email/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contractId: selectedContractId,
            recipientName,
            userName,
          }),
        },
      );
      const data = await res.json();
      if (data.success) {
        const lines = data.draft.split("\n");
        const subjectLine =
          lines.find((l) => l.startsWith("Subject:")) ||
          "Subject: Negotiation regarding Car Loan";
        const bodyText = lines
          .filter((l) => !l.startsWith("Subject:"))
          .join("\n")
          .trim();
        setGeneratedSubject(subjectLine.replace("Subject:", "").trim());
        setGeneratedBody(bodyText);
        toast.success("Draft Generated!");
      } else {
        toast.error(data.message || "Failed to generate");
      }
    } catch (err) {
      toast.error("Network Error");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveReminder = () => {
    if (!reminderDate) return;
    const existing = JSON.parse(localStorage.getItem('autoReminders') || '[]');
    existing.push({ dealerName: dealerName || 'Dealer', reminderDate, createdAt: new Date().toISOString() });
    localStorage.setItem('autoReminders', JSON.stringify(existing));
    alert("Reminder saved! You'll see it on your Dashboard.");
  };

  const handleSend = async () => {
    if (!recipientEmail || !generatedBody)
      return toast.warning("Missing email or body");
    setIsSending(true);
    try {
      const res = await fetch(
        "https://car-lease-loan-ai-assistant.onrender.com/api/email/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: recipientEmail,
            subject: generatedSubject,
            body: generatedBody,
          }),
        },
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Email Sent!");
        setGeneratedSubject("");
        setGeneratedBody("");
        setRecipientEmail("");
        setRecipientName("");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  const fo = (k) => ({
    onFocus: () => setFocused((f) => ({ ...f, [k]: true })),
    onBlur: () => setFocused((f) => ({ ...f, [k]: false })),
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .em-root {
          font-family: 'Sora', sans-serif;
          min-height: 100vh;
          background: #282E38;
          position: relative;
          overflow-x: hidden;
          padding: 2.5rem 1.25rem 5rem;
        }
        .em-orb { position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0;animation:em-drift 14s ease-in-out infinite alternate; }
        .em-orb-1 { width:520px;height:520px;background:radial-gradient(circle,#4f46e5,#1e1b4b);top:-160px;left:-160px;opacity:0.3;animation-delay:0s; }
        .em-orb-2 { width:460px;height:460px;background:radial-gradient(circle,#10b981,#065f46);bottom:-150px;right:-130px;opacity:0.22;animation-delay:-7s; }
        .em-orb-3 { width:280px;height:280px;background:radial-gradient(circle,#8b5cf6,#6d28d9);top:35%;left:58%;opacity:0.18;animation-delay:-11s; }
        @keyframes em-drift { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(28px,22px) scale(1.06)} }
        .em-grid { position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);background-size:48px 48px; }

        .em-wrap { position:relative;z-index:1;max-width:980px;margin:0 auto; }

        /* Header */
        .em-header { display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:2.5rem;gap:1rem;flex-wrap:wrap; }
        .em-header-left {}
        .em-badge { display:inline-flex;align-items:center;gap:6px;background:rgba(108,99,255,0.14);border:1px solid rgba(108,99,255,0.3);border-radius:999px;padding:4px 14px;font-size:10px;font-weight:600;letter-spacing:0.08em;color:#a5b4fc;text-transform:uppercase;margin-bottom:0.75rem; }
        .em-badge-dot { width:6px;height:6px;border-radius:50%;background:#6c63ff;box-shadow:0 0 6px #6c63ff;animation:em-pulse 2s ease-in-out infinite; }
        @keyframes em-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
        .em-title { font-size:clamp(1.6rem,4vw,2.2rem);font-weight:800;color:#fff;letter-spacing:-0.04em;line-height:1.1;margin:0 0 0.3rem; }
        .em-sub { font-family:'DM Sans',sans-serif;font-size:0.875rem;color:rgba(255,255,255,0.38); }
        .em-back { display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:11px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.55);font-family:'Sora',sans-serif;font-size:0.8rem;font-weight:600;text-decoration:none;transition:background 0.2s,border-color 0.2s,transform 0.15s;white-space:nowrap;align-self:flex-start; }
        .em-back:hover { background:rgba(255,255,255,0.09);border-color:rgba(255,255,255,0.2);transform:translateY(-1px); }

        /* Grid */
        .em-grid-cols { display:grid;grid-template-columns:1fr;gap:1.25rem; }
        @media(min-width:700px) { .em-grid-cols { grid-template-columns:1fr 1fr; } }

        /* Panel card */
        .em-panel {
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.09);
          border-radius:24px;
          padding:2rem;
          backdrop-filter:blur(24px);
          -webkit-backdrop-filter:blur(24px);
          box-shadow:0 24px 60px rgba(0,0,0,0.4),0 0 0 1px rgba(255,255,255,0.03) inset;
          position:relative;
          animation:em-cardIn 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        .em-panel:nth-child(2) { animation-delay:0.1s; }
        @keyframes em-cardIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .em-panel::before { content:'';position:absolute;top:0;left:10%;right:10%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent); }

        .em-panel-header { display:flex;align-items:center;gap:10px;margin-bottom:1.5rem; }
        .em-panel-num { width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,#6c63ff,#4f46e5);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;flex-shrink:0; }
        .em-panel-title { font-size:0.95rem;font-weight:700;color:#fff;letter-spacing:-0.01em; }

        /* Input */
        .em-field-group { margin-bottom:0.9rem; }
        .em-label { display:block;font-size:9px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;margin-bottom:6px;transition:color 0.2s; }
        .em-label.active { color:#a5b4fc; }
        .em-label:not(.active) { color:rgba(255,255,255,0.35); }

        .em-input-wrap { position:relative; }
        .em-input-icon { position:absolute;left:13px;top:50%;transform:translateY(-50%);pointer-events:none;display:flex;align-items:center;color:rgba(255,255,255,0.22);transition:color 0.2s; }
        .em-input-icon.active { color:#6c63ff; }

        .em-field {
          width:100%;padding:11px 13px 11px 40px;
          background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);
          border-radius:12px;color:#fff;
          font-family:'DM Sans',sans-serif;font-size:0.875rem;
          outline:none;transition:border-color 0.25s,background 0.25s,box-shadow 0.25s;
          -webkit-text-fill-color:#fff;
        }
        .em-field::placeholder { color:rgba(255,255,255,0.2); }
        .em-field:focus { border-color:rgba(108,99,255,0.65);background:rgba(108,99,255,0.07);box-shadow:0 0 0 3px rgba(108,99,255,0.13); }
        .em-field:-webkit-autofill, .em-field:-webkit-autofill:focus {
          -webkit-box-shadow:0 0 0 1000px rgba(20,16,50,0.98) inset;
          -webkit-text-fill-color:#fff !important;caret-color:#fff;
        }

        /* Select */
        .em-select {
          width:100%;padding:11px 13px 11px 40px;
          background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);
          border-radius:12px;color:#fff;
          font-family:'DM Sans',sans-serif;font-size:0.875rem;
          outline:none;transition:border-color 0.25s,background 0.25s,box-shadow 0.25s;
          appearance:none;cursor:pointer;
        }
        .em-select:focus { border-color:rgba(108,99,255,0.65);background:rgba(108,99,255,0.07);box-shadow:0 0 0 3px rgba(108,99,255,0.13); }
        .em-select option { background:#0f0c29;color:#fff; }
        .em-select-caret { position:absolute;right:13px;top:50%;transform:translateY(-50%);pointer-events:none;color:rgba(255,255,255,0.3); }

        /* Textarea */
        .em-textarea {
          width:100%;padding:11px 13px;
          background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);
          border-radius:12px;color:#fff;
          font-family:'DM Sans',sans-serif;font-size:0.875rem;line-height:1.65;
          outline:none;transition:border-color 0.25s,background 0.25s,box-shadow 0.25s;
          resize:vertical;min-height:180px;
        }
        .em-textarea::placeholder { color:rgba(255,255,255,0.2); }
        .em-textarea:focus { border-color:rgba(108,99,255,0.65);background:rgba(108,99,255,0.07);box-shadow:0 0 0 3px rgba(108,99,255,0.13); }

        /* Divider */
        .em-divider { height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);margin:1.25rem 0; }

        /* Buttons */
        .em-btn-primary {
          width:100%;padding:13px;border-radius:13px;border:none;cursor:pointer;
          font-family:'Sora',sans-serif;font-size:0.9rem;font-weight:600;color:#fff;
          background:linear-gradient(135deg,#6c63ff,#4f46e5,#3b2fd6);
          display:flex;align-items:center;justify-content:center;gap:8px;
          position:relative;overflow:hidden;
          transition:transform 0.18s,box-shadow 0.18s,opacity 0.2s;
          box-shadow:0 4px 22px rgba(108,99,255,0.35);
        }
        .em-btn-primary::before { content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);transition:left 0.5s; }
        .em-btn-primary:hover:not(:disabled)::before { left:100%; }
        .em-btn-primary:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 8px 28px rgba(108,99,255,0.5); }
        .em-btn-primary:disabled { opacity:0.55;cursor:not-allowed; }

        .em-btn-green {
          width:100%;padding:13px;border-radius:13px;border:none;cursor:pointer;
          font-family:'Sora',sans-serif;font-size:0.9rem;font-weight:600;color:#fff;
          background:linear-gradient(135deg,#10b981,#059669);
          display:flex;align-items:center;justify-content:center;gap:8px;
          position:relative;overflow:hidden;
          transition:transform 0.18s,box-shadow 0.18s,opacity 0.2s;
          box-shadow:0 4px 22px rgba(16,185,129,0.3);
        }
        .em-btn-green::before { content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);transition:left 0.5s; }
        .em-btn-green:hover:not(:disabled)::before { left:100%; }
        .em-btn-green:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 8px 28px rgba(16,185,129,0.42); }
        .em-btn-green:disabled { opacity:0.55;cursor:not-allowed; }

        /* Spinner */
        .em-spin { animation:spin 0.8s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }

        /* Empty preview state */
        .em-empty { display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2.5rem 1rem;text-align:center;flex:1; }
        .em-empty-icon { width:52px;height:52px;border-radius:14px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.2);margin-bottom:1rem; }
        .em-empty-text { font-family:'DM Sans',sans-serif;font-size:0.85rem;color:rgba(255,255,255,0.28);line-height:1.6; }
      `}</style>

      <div className="em-root">
        <div className="em-orb em-orb-1" />
        <div className="em-orb em-orb-2" />
        <div className="em-orb em-orb-3" />
        <div className="em-grid" />

        <div className="em-wrap">
          {/* Header */}
          <div className="em-header">
            <div className="em-header-left">
              <div>
                <span className="em-badge">
                  <span className="em-badge-dot" />
                  AI Negotiator
                </span>
              </div>
              <h1 className="em-title">Email Generator</h1>
              <p className="em-sub">
                Generate AI counter-offer emails from your contracts
              </p>
            </div>
            <Link to="/" className="em-back">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Home
            </Link>
          </div>

          {/* Two columns */}
          <div className="em-grid-cols">
            {/* LEFT — Setup */}
            <div className="em-panel">
              <div className="em-panel-header">
                <div className="em-panel-num">1</div>
                <span className="em-panel-title">Setup</span>
              </div>

              {/* Contract select */}
              <div className="em-field-group">
                <label
                  className={`em-label${focused.contract ? " active" : ""}`}
                >
                  Select Contract
                </label>
                <div className="em-input-wrap">
                  <span
                    className={`em-input-icon${focused.contract ? " active" : ""}`}
                  >
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
                    </svg>
                  </span>
                  <select
                    className="em-select"
                    value={selectedContractId}
                    onChange={(e) => setSelectedContractId(e.target.value)}
                    {...fo("contract")}
                  >
                    <option value="">— Select Contract —</option>
                    {history.map((rec) => (
                      <option key={rec._id} value={rec._id}>
                        {rec.fileName}
                      </option>
                    ))}
                  </select>
                  <span className="em-select-caret">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="em-divider" />

              {/* Recipient name */}
              <div className="em-field-group">
                <label className={`em-label${focused.rname ? " active" : ""}`}>
                  Recipient Name
                </label>
                <div className="em-input-wrap">
                  <span
                    className={`em-input-icon${focused.rname ? " active" : ""}`}
                  >
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
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    className="em-field"
                    placeholder="e.g. John Smith"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    {...fo("rname")}
                  />
                </div>
              </div>

              {/* Recipient email */}
              <div className="em-field-group">
                <label className={`em-label${focused.remail ? " active" : ""}`}>
                  Recipient Email
                </label>
                <div className="em-input-wrap">
                  <span
                    className={`em-input-icon${focused.remail ? " active" : ""}`}
                  >
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
                      <rect x="2" y="4" width="20" height="16" rx="3" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    className="em-field"
                    placeholder="dealer@example.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    {...fo("remail")}
                  />
                </div>
              </div>

              {/* Your name */}
              <div className="em-field-group">
                <label className={`em-label${focused.uname ? " active" : ""}`}>
                  Your Name
                </label>
                <div className="em-input-wrap">
                  <span
                    className={`em-input-icon${focused.uname ? " active" : ""}`}
                  >
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
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    className="em-field"
                    placeholder="Your full name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    {...fo("uname")}
                  />
                </div>
              </div>

              <div style={{ marginTop: "1.25rem" }}>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="em-btn-primary"
                >
                  {isGenerating ? (
                    <>
                      <svg
                        className="em-spin"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path
                          d="M21 12a9 9 0 1 1-6.219-8.56"
                          strokeLinecap="round"
                        />
                      </svg>
                      Generating…
                    </>
                  ) : (
                    <>
                      Generate Draft
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* RIGHT — Preview & Reminder Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div
                className="em-panel"
                style={{ display: "flex", flexDirection: "column", flex: 1 }}
              >
                <div className="em-panel-header">
                  <div
                    className="em-panel-num"
                    style={{
                      background: "linear-gradient(135deg,#10b981,#059669)",
                    }}
                  >
                    2
                  </div>
                  <span className="em-panel-title">Preview & Send</span>
                </div>

                {!generatedSubject && !generatedBody ? (
                  <div className="em-empty">
                    <div className="em-empty-icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <p className="em-empty-text">
                      Fill in the setup form and click
                      <br />
                      <strong style={{ color: "rgba(255,255,255,0.4)" }}>
                        Generate Draft
                      </strong>{" "}
                      to see your email here
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Subject */}
                    <div className="em-field-group">
                      <label
                        className={`em-label${focused.subject ? " active" : ""}`}
                      >
                        Subject Line
                      </label>
                      <div className="em-input-wrap">
                        <span
                          className={`em-input-icon${focused.subject ? " active" : ""}`}
                        >
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
                            <line x1="4" y1="6" x2="20" y2="6" />
                            <line x1="4" y1="12" x2="14" y2="12" />
                          </svg>
                        </span>
                        <input
                          className="em-field"
                          placeholder="Subject"
                          value={generatedSubject}
                          onChange={(e) => setGeneratedSubject(e.target.value)}
                          {...fo("subject")}
                        />
                      </div>
                    </div>

                    {/* Body */}
                    <div
                      className="em-field-group"
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <label
                        className={`em-label${focused.body ? " active" : ""}`}
                      >
                        Email Body
                      </label>
                      <textarea
                        className="em-textarea"
                        style={{ flex: 1, minHeight: "200px" }}
                        placeholder="Your email body will appear here…"
                        value={generatedBody}
                        onChange={(e) => setGeneratedBody(e.target.value)}
                        {...fo("body")}
                      />
                    </div>
                  </>
                )}

                <div style={{ marginTop: "auto", paddingTop: "1.25rem" }}>
                  <button
                    onClick={handleSend}
                    disabled={isSending || !generatedBody}
                    className="em-btn-green"
                  >
                    {isSending ? (
                      <>
                        <svg
                          className="em-spin"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            d="M21 12a9 9 0 1 1-6.219-8.56"
                            strokeLinecap="round"
                          />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                        Send Email
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Reminder Section (Moved out of the panel so it stacks below it) */}
              <div style={{ padding: '1.25rem', background: '#1E2640', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                <p style={{ color: '#C8A850', fontWeight: 600, marginTop: 0, fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ⏰ Set Follow-Up Reminder
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <input type="text" placeholder="Dealer name (optional)" value={dealerName} onChange={e => setDealerName(e.target.value)} className="em-field" style={{ padding: '10px' }} />
                  <input type="date" value={reminderDate} onChange={e => setReminderDate(e.target.value)} className="em-field" style={{ padding: '10px' }} />
                </div>
                <button onClick={saveReminder} className="em-btn-primary" style={{ padding: '10px', width: '100%', background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}>Save Reminder</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailGeneratorPage;
