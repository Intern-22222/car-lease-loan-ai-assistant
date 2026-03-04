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
      const res = await fetch("https://car-lease-loan-ai-assistant.onrender.com/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId: selectedContractId,
          recipientName,
          userName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Simple heuristic to split subject/body
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

  const handleSend = async () => {
    if (!recipientEmail || !generatedBody)
      return toast.warning("Missing email or body");
    setIsSending(true);
    try {
      const res = await fetch("https://car-lease-loan-ai-assistant.onrender.com/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipientEmail,
          subject: generatedSubject,
          body: generatedBody,
        }),
      });
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

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            ✉️ Email Generator
          </h1>
          <Link to="/" className="text-indigo-600 font-bold hover:underline">
            ⬅ Home
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT COLUMN: INPUTS */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-800">1. Setup</h3>
            <select
              className="w-full border p-2 rounded"
              value={selectedContractId}
              onChange={(e) => setSelectedContractId(e.target.value)}
            >
              <option value="">-- Select Contract --</option>
              {history.map((rec) => (
                <option key={rec._id} value={rec._id}>
                  {rec.fileName}
                </option>
              ))}
            </select>
            <input
              className="w-full border p-2 rounded"
              placeholder="Recipient Name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Recipient Email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-700 disabled:opacity-50"
            >
              {isGenerating ? "Generating..." : "Generate Draft"}
            </button>
          </div>

          {/* RIGHT COLUMN: PREVIEW */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col space-y-4">
            <h3 className="font-bold text-gray-800">2. Preview</h3>
            <input
              className="w-full border p-2 rounded"
              placeholder="Subject"
              value={generatedSubject}
              onChange={(e) => setGeneratedSubject(e.target.value)}
            />
            <textarea
              className="w-full border p-2 rounded h-40"
              placeholder="Body..."
              value={generatedBody}
              onChange={(e) => setGeneratedBody(e.target.value)}
            />
            <button
              onClick={handleSend}
              disabled={isSending}
              className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 disabled:opacity-50"
            >
              {isSending ? "Sending..." : "Send Email"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailGeneratorPage;