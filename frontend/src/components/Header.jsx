import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown, PanelRight } from 'lucide-react';
import './Header.css';

const Header = ({ 
  user, 
  onLogout, 
  activeContract, 
  onToggleSummary, 
  isSummaryOpen, 
  view 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Logic to determine if we are in an active chat session
  const isChatActive = view === "chat" && activeContract && activeContract.chatHistory?.length > 0;

  // Logic for the border: Hide border on welcome screen
  const showBorder = isChatActive;

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={`global-header ${showBorder ? "" : "no-border"}`}>
      <div className="header-left">
        {/* Chat Title: Slides in only when chat is active */}
        {isChatActive && (
          <div className="header-titles animate-fade-in">
            <h3>{activeContract.carName || "New Conversation"}</h3>
            <span className="file-subtitle">
              {activeContract.fileName || "General Inquiry"}
            </span>
          </div>
        )}
      </div>
      
      <div className="header-right" ref={dropdownRef}>
        {/* Summary Toggle: Placed beside the profile */}
        {isChatActive && onToggleSummary && (
          <button
            className={`summary-toggle-btn ${isSummaryOpen ? "active" : ""}`}
            onClick={onToggleSummary}
            disabled={!activeContract || !activeContract.serverFilename}
          >
            <PanelRight size={20} />
          </button>
        )}

        {/* Circular Profile Trigger */}
        <div className="user-profile-dropdown">
          <button className="profile-trigger" onClick={() => setIsOpen(!isOpen)}>
            <div className="avatar user-profile">
              {user?.name ? user.name[0].toUpperCase() : <User size={16} />}
            </div>
            <span className="user-firstname">{user?.name?.split(' ')[0] || "Amit"}</span>
            <ChevronDown size={14} className={isOpen ? 'rotate' : ''} />
          </button>

          {isOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-info">
                <p className="user-label">Logged in as</p>
                <strong>{user?.name || "Amit Verma"}</strong>
                <span>{user?.email || "amit@example.com"}</span>
              </div>
              <hr className="dropdown-divider" />
              <button className="logout-item" onClick={onLogout}>
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;