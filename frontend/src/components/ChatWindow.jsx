import React, { useState, useEffect, useRef } from 'react';
import { Send, FileText, User, PanelRight, Loader2, Paperclip, Sparkles, X } from 'lucide-react'; 
import './ChatWindow.css';

const ChatWindow = ({ contract, onSendMessage, onToggleSummary, isSummaryOpen, onUploadSuccess }) => {
  const [inputValue, setInputValue] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [stagedFile, setStagedFile] = useState(null); 
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [contract?.chatHistory, isUploading]);

  const handleSend = async () => {
    const hasText = inputValue.trim() !== '';
    const hasFile = stagedFile !== null;

    if ((!hasText && !hasFile) || isUploading) return;

    if (hasFile) {
      // Upload file and pass the text along to be included in the same message
      await uploadFile(stagedFile, inputValue);
    } else {
      // Normal text message
      onSendMessage(inputValue);
    }

    setInputValue('');
    setStagedFile(null);
  };

  const uploadFile = async (file, messageText) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    // Assuming backend might need the text, but we definitely need it for handleUploadSuccess
    if (messageText) formData.append("message", messageText);

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      const result = await response.json();
      
      // Pass messageText to App.jsx to ensure it renders inside the file bubble
      onUploadSuccess(file, result, !!contract, messageText); 
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to analyze contract.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setStagedFile(file);
    }
    event.target.value = null; 
  };

  const triggerUpload = (e) => {
    e.preventDefault();
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const showWelcome = !contract || (contract.chatHistory && contract.chatHistory.length === 0);

  return (
    <div className={`chat-window ${showWelcome ? 'is-welcome' : 'is-active'}`}>
      {!showWelcome && (
        <header className="chat-header">
          <div className="header-titles">
            <h3>{contract.carName || "New Analysis"}</h3>
            <span className="file-subtitle">{contract.fileName || "General Inquiry"}</span>
          </div>
          {onToggleSummary && (
            <button className={`summary-toggle-btn ${isSummaryOpen ? 'active' : ''}`} onClick={onToggleSummary}>
              <PanelRight size={20} />
            </button>
          )}
        </header>
      )}

      <div className="chat-container">
        <div className="chat-content-wrapper" ref={scrollRef}>
          {showWelcome ? (
            <div className="welcome-container">
              <div className="welcome-content">
                <div className="logo-badge"><Sparkles size={40} className="text-teal-400" /></div>
                <h1>How can LeaseIQ help today?</h1>
                <p>Attach a contract and add a message to get started.</p>
              </div>
            </div>
          ) : (
            <div className="chat-messages">
              {contract.chatHistory.map((msg, i) => (
                <div key={i} className={`message ${msg.sender}`}>
                  <div className="avatar-header">
                    <div className={`avatar ${msg.sender === 'ai' ? 'ai-icon' : 'user-icon'}`}>
                      {msg.sender === 'ai' ? 'L' : <User size={12} />}
                    </div>
                    <span className="sender-name">{msg.sender === 'ai' ? 'LeaseIQ' : 'You'}</span>
                    <span className="timestamp">{msg.time}</span>
                  </div>
                  <div className="msg-bubble">
                    {msg.type === 'file' ? (
                      <div className="file-container">
                        <div className="file-attachment-bubble">
                          <FileText size={18} className="text-teal-500" />
                          <div className="file-details">
                            <span className="file-name-text">{msg.fileName}</span>
                            <span className="file-meta">PDF Processed</span>
                          </div>
                        </div>
                        {/* Render accompanying text within the same file bubble */}
                        {msg.text && <div className="msg-content mt-2">{msg.text}</div>}
                      </div>
                    ) : (
                      <div className="msg-content">{msg.text}</div>
                    )}
                  </div>
                </div>
              ))}
              {isUploading && (
                 <div className="message ai">
                   <div className="msg-bubble typing-indicator">
                     <Loader2 size={14} className="animate-spin" />
                     <span>Analyzing document...</span>
                   </div>
                 </div>
              )}
              <div className="scroll-bottom-spacer" />
            </div>
          )}
        </div>

        <div className="chat-input-area">
          <div className="input-wrapper-container">
            {/* STAGED FILE PREVIEW BOX */}
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
                style={{ display: 'none' }} 
              />
              
              <button 
                type="button"
                className={`attach-btn ${stagedFile ? 'has-file' : ''}`} 
                onClick={triggerUpload} 
                disabled={isUploading}
              >
                <Paperclip size={20} />
              </button>

              <input 
                type="text" 
                placeholder={stagedFile ? "Add a message about this file..." : "Ask LeaseIQ or attach a contract..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              
              <button className="send-btn" onClick={handleSend} disabled={(!inputValue.trim() && !stagedFile) || isUploading}>
                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
            <p className="disclaimer">LeaseIQ provides financial insights. Please verify legal terms independently.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;