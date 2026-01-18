import React, { useState, useEffect, useRef } from 'react';
import { Send, FileText, User, PanelRight, Menu } from 'lucide-react'; 
import './ChatWindow.css';

const ChatWindow = ({ contract, onSendMessage, onToggleSummary, isSummaryOpen, onOpenSidebar }) => {
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef(null);

  // Auto-scroll logic for new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [contract.chatHistory]);

  const handleSend = () => {
    if (inputValue.trim() === '') return;
    onSendMessage(inputValue); 
    setInputValue('');
  };

  return (
    <div className="chat-window">
      {/* Header Section */}
      <div className="chat-header">
        <div className="header-left">
          {/* Mobile Menu Trigger - Beside the Car Name */}
          <button className="mobile-sidebar-btn" onClick={onOpenSidebar}>
            <Menu size={22} />
          </button>

          <div className="header-titles">
            <h3>{contract.carName}</h3>
            <span className="file-subtitle">{contract.fileName}</span>
          </div>
        </div>
        
        <button 
          className={`summary-toggle-btn ${isSummaryOpen ? 'active' : ''}`} 
          onClick={onToggleSummary}
          title="Toggle Summary"
        >
          <PanelRight size={22} />
        </button>
      </div>

      {/* Main Message Area */}
      <div className="chat-messages" ref={scrollRef}>
        
        {/* PDF Attachment (Top of Chat) */}
        <div className="message user attachment">
          <div className="avatar-header">
             <div className="avatar user-icon"><User size={14} /></div>
             <span className="sender-name">You</span>
             <span className="timestamp">Uploaded</span>
          </div>
          <div className="file-bubble">
            <FileText size={20} className="file-icon" />
            <div className="file-info">
              <span className="file-name">{contract.fileName}</span>
              <span className="file-type">PDF Document</span>
            </div>
          </div>
        </div>

        {/* Dynamic Chat History mapping */}
        {contract.chatHistory.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <div className="avatar-header">
              <div className={`avatar ${msg.sender === 'ai' ? 'ai-icon' : 'user-icon'}`}>
                {msg.sender === 'ai' ? '🤖' : <User size={14} />}
              </div>
              <span className="sender-name">{msg.sender === 'ai' ? 'Velo AI' : 'You'}</span>
              <span className="timestamp">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div className="msg-bubble">
              <div className="msg-content">{msg.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="chat-input-area">
        <div className="input-wrapper">
          <input 
            type="text" 
            placeholder={`Ask about ${contract.carName}...`} 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="send-btn" onClick={handleSend} disabled={!inputValue.trim()}>
            <Send size={18} />
          </button>
        </div>
        <p className="disclaimer">
          AI-generated analysis. Please verify legal terms independently.
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;