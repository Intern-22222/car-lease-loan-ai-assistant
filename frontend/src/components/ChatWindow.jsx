import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import {
  Send,
  FileText,
  User,
  Loader2,
  Paperclip,
  Sparkles,
  X,
} from "lucide-react";
import { api } from "../services/api";
import "./ChatWindow.css";

const ChatWindow = ({
  contract,
  onSendMessage,
  onUploadSuccess,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [stagedFile, setStagedFile] = useState(null);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [contract?.chatHistory, isUploading]);

  const handleSend = async () => {
    const hasText = inputValue.trim() !== "";
    const hasFile = stagedFile !== null;
    if ((!hasText && !hasFile) || isUploading) return;

    const currentMessage = inputValue.trim();
    const currentFile = stagedFile;
    setInputValue("");
    setStagedFile(null);

    if (hasFile) {
      const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const optimisticMsg = {
        sender: "user",
        type: "file",
        fileName: currentFile.name,
        text: currentMessage || `Uploaded: ${currentFile.name}`,
        time: currentTime,
      };
      onSendMessage(optimisticMsg); 
      await uploadFile(currentFile);
    } else {
      onSendMessage(currentMessage);
    }
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    try {
      const response = await api.uploadLease(file);
      onUploadSuccess(file, response.data, !!contract, null); 
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("AI analysis failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setStagedFile(file);
    } else if (file) {
      alert("Please upload a PDF file.");
    }
    event.target.value = null;
  };

  const triggerUpload = (e) => {
    e.preventDefault();
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const showWelcome = !contract || !contract.chatHistory || contract.chatHistory.length === 0;

  return (
    <div className={`chat-window ${showWelcome ? "is-welcome" : "is-active"}`}>
      {/* INTERNAL HEADER REMOVED: 
          The header is now handled globally in App.jsx to prevent layout shifting.
      */}

      <div className="chat-container">
        <div className="chat-content-wrapper" ref={scrollRef}>
          {showWelcome ? (
            <div className="welcome-container">
              <div className="welcome-content">
                <div className="logo-badge">
                  <Sparkles size={40} className="text-teal-400" />
                </div>
                <h1>How can LeaseIQ help today?</h1>
                <p>Attach a contract or just say hello to get started.</p>
              </div>
            </div>
          ) : (
            <div className="chat-messages">
              {contract.chatHistory.map((msg, i) => (
                <div key={i} className={`message ${msg.sender}`}>
                  <div className="avatar-header">
                    <div className={`avatar ${msg.sender === "ai" ? "ai-icon" : "user-icon"}`}>
                      {msg.sender === "ai" ? "L" : <User size={12} />}
                    </div>
                    <span className="sender-name">
                      {msg.sender === "ai" ? "LeaseIQ" : "You"}
                    </span>
                    <span className="timestamp">{msg.time}</span>
                  </div>
                  <div className="msg-bubble">
                    {msg.type === "file" ? (
                      <div className="file-container">
                        <div className="file-attachment-bubble">
                          <FileText size={18} className="text-teal-500" />
                          <div className="file-details">
                            <span className="file-name-text">{msg.fileName}</span>
                            <span className="file-meta">AI Analysis Complete</span>
                          </div>
                        </div>
                        {msg.text && (
                          <div className="msg-content mt-2 markdown-body">
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="msg-content markdown-body">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isUploading && (
                <div className="message ai">
                  <div className="msg-bubble typing-indicator">
                    <Loader2 size={14} className="animate-spin" />
                    <span>Analyzing your document...</span>
                  </div>
                </div>
              )}
              <div className="scroll-bottom-spacer" />
            </div>
          )}
        </div>

        <div className="chat-input-area">
          <div className="input-wrapper-container">
            {stagedFile && (
              <div className="staged-file-preview">
                <FileText size={14} />
                <span className="staged-name">{stagedFile.name}</span>
                <button className="remove-staged-btn" onClick={() => setStagedFile(null)}>
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="input-wrapper">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                style={{ display: "none" }}
              />
              <button
                type="button"
                className={`attach-btn ${stagedFile ? "has-file" : ""}`}
                onClick={triggerUpload}
                disabled={isUploading}
              >
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                placeholder={stagedFile ? "Add a message..." : "Ask LeaseIQ or attach a contract..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                className="send-btn"
                onClick={handleSend}
                disabled={(!inputValue.trim() && !stagedFile) || isUploading}
              >
                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
            <p className="disclaimer">
              LeaseIQ insights are powered by AI. Please verify financial details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
















// import React, { useState, useEffect, useRef } from "react";
// import ReactMarkdown from "react-markdown"; // ADDED THIS
// import {
//   Send,
//   FileText,
//   User,
//   PanelRight,
//   Loader2,
//   Paperclip,
//   Sparkles,
//   X,
// } from "lucide-react";
// import { api } from "../services/api";
// import "./ChatWindow.css";

// const ChatWindow = ({
//   contract,
//   onSendMessage,
//   onToggleSummary,
//   isSummaryOpen,
//   onUploadSuccess,
// }) => {
//   const [inputValue, setInputValue] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const [stagedFile, setStagedFile] = useState(null);
//   const scrollRef = useRef(null);
//   const fileInputRef = useRef(null);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [contract?.chatHistory, isUploading]);

//   /**
//    * UPDATED: Handle Send logic for immediate UI feedback (Optimistic Update)
//    */
//   const handleSend = async () => {
//     const hasText = inputValue.trim() !== "";
//     const hasFile = stagedFile !== null;

//     if ((!hasText && !hasFile) || isUploading) return;

//     const currentMessage = inputValue.trim();
//     const currentFile = stagedFile;

//     setInputValue("");
//     setStagedFile(null);

//     if (hasFile) {
//       const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//       const optimisticMsg = {
//         sender: "user",
//         type: "file",
//         fileName: currentFile.name,
//         text: currentMessage || `Uploaded: ${currentFile.name}`,
//         time: currentTime,
//       };
      
//       onSendMessage(optimisticMsg); 
//       await uploadFile(currentFile);
//     } else {
//       onSendMessage(currentMessage);
//     }
//   };

//   /**
//    * UPDATED: Upload Logic
//    */
//   const uploadFile = async (file) => {
//     setIsUploading(true);
//     try {
//       const response = await api.uploadLease(file);
//       onUploadSuccess(file, response.data, !!contract, null); 
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       alert("AI analysis failed. Please check your backend connection.");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       if (file.type !== "application/pdf") {
//         alert("Please upload a PDF file.");
//         return;
//       }
//       setStagedFile(file);
//     }
//     event.target.value = null;
//   };

//   const triggerUpload = (e) => {
//     e.preventDefault();
//     if (fileInputRef.current) fileInputRef.current.click();
//   };

//   const showWelcome = !contract || !contract.chatHistory || contract.chatHistory.length === 0;

//   return (
//     <div className={`chat-window ${showWelcome ? "is-welcome" : "is-active"}`}>
//       {!showWelcome && (
//         <header className="chat-header">
//           <div className="header-titles">
//             <h3>{contract.carName || "Contract Analysis"}</h3>
//             <span className="file-subtitle">
//               {contract.fileName || "Active Session"}
//             </span>
//           </div>
//           {onToggleSummary && (
//             <button
//               className={`summary-toggle-btn ${isSummaryOpen ? "active" : ""}`}
//               onClick={onToggleSummary}
//               disabled={!contract || !contract.serverFilename}
//             >
//               <PanelRight size={20} />
//             </button>
//           )}
//         </header>
//       )}

//       <div className="chat-container">
//         <div className="chat-content-wrapper" ref={scrollRef}>
//           {showWelcome ? (
//             <div className="welcome-container">
//               <div className="welcome-content">
//                 <div className="logo-badge">
//                   <Sparkles size={40} className="text-teal-400" />
//                 </div>
//                 <h1>How can LeaseIQ help today?</h1>
//                 <p>Attach a contract or just say hello to get started.</p>
//               </div>
//             </div>
//           ) : (
//             <div className="chat-messages">
//               {contract.chatHistory.map((msg, i) => (
//                 <div key={i} className={`message ${msg.sender}`}>
//                   <div className="avatar-header">
//                     <div className={`avatar ${msg.sender === "ai" ? "ai-icon" : "user-icon"}`}>
//                       {msg.sender === "ai" ? "L" : <User size={12} />}
//                     </div>
//                     <span className="sender-name">
//                       {msg.sender === "ai" ? "LeaseIQ" : "You"}
//                     </span>
//                     <span className="timestamp">{msg.time}</span>
//                   </div>
//                   <div className="msg-bubble">
//                     {msg.type === "file" ? (
//                       <div className="file-container">
//                         <div className="file-attachment-bubble">
//                           <FileText size={18} className="text-teal-500" />
//                           <div className="file-details">
//                             <span className="file-name-text">{msg.fileName}</span>
//                             <span className="file-meta">AI Analysis Complete</span>
//                           </div>
//                         </div>
//                         {msg.text && (
//                           <div className="msg-content mt-2 markdown-body">
//                             {/* UPDATED: User messages with files also use Markdown */}
//                             <ReactMarkdown>{msg.text}</ReactMarkdown>
//                           </div>
//                         )}
//                       </div>
//                     ) : (
//                       <div className="msg-content markdown-body">
//                         {/* UPDATED: Standard AI/User text uses Markdown */}
//                         <ReactMarkdown>{msg.text}</ReactMarkdown>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}

//               {isUploading && (
//                 <div className="message ai">
//                   <div className="msg-bubble typing-indicator">
//                     <Loader2 size={14} className="animate-spin" />
//                     <span>Analyzing your document...</span>
//                   </div>
//                 </div>
//               )}
//               <div className="scroll-bottom-spacer" />
//             </div>
//           )}
//         </div>

//         <div className="chat-input-area">
//           <div className="input-wrapper-container">
//             {stagedFile && (
//               <div className="staged-file-preview">
//                 <FileText size={14} />
//                 <span className="staged-name">{stagedFile.name}</span>
//                 <button className="remove-staged-btn" onClick={() => setStagedFile(null)}>
//                   <X size={14} />
//                 </button>
//               </div>
//             )}

//             <div className="input-wrapper">
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleFileChange}
//                 accept=".pdf"
//                 style={{ display: "none" }}
//               />

//               <button
//                 type="button"
//                 className={`attach-btn ${stagedFile ? "has-file" : ""}`}
//                 onClick={triggerUpload}
//                 disabled={isUploading}
//               >
//                 <Paperclip size={20} />
//               </button>

//               <input
//                 type="text"
//                 placeholder={stagedFile ? "Add a message about this file..." : "Ask LeaseIQ or attach a contract..."}
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSend()}
//               />

//               <button
//                 className="send-btn"
//                 onClick={handleSend}
//                 disabled={(!inputValue.trim() && !stagedFile) || isUploading}
//               >
//                 {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
//               </button>
//             </div>
//             <p className="disclaimer">
//               LeaseIQ insights are powered by AI. Please verify financial details.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;

