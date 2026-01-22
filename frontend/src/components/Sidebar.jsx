import React from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  LayoutDashboard, 
  FileText, 
  MailQuestion, 
  ShieldCheck 
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ 
  history, 
  searchTerm, 
  setSearchTerm, 
  onSelect, 
  onDelete, 
  onNewChat, 
  activeId,
  view, // IMPORTANT: Ensure this is received
  setView 
}) => {
  return (
    <aside className="sidebar">
      {/* 1. Header with LeaseIQ Branding */}
      <div className="sidebar-header">
        <div className="logo">
          <ShieldCheck size={32} className="logo-icon text-indigo-500" /> 
          <span className="logo-text">LeaseIQ</span>
        </div>
        <button className="new-chat-btn" onClick={() => { onNewChat(); setView('chat'); }}>
          <Plus size={18} /> New Chat
        </button>
      </div>

      {/* 2. Search Container */}
      <div className="search-container">
        <Search size={16} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search history..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 3. The Toolbox Section */}
      <div className="toolbox">
        <p className="section-title">Analysis Tools</p>
        
        {/* Check if view matches to apply active class */}
        <button 
          className={`tool-btn ${view === 'comparison' ? 'active' : ''}`} 
          onClick={() => setView('comparison')}
        >
          <LayoutDashboard size={18} />
          <span>Comparison Page</span>
        </button>
        
        <button 
          className={`tool-btn ${view === 'negotiation' ? 'active' : ''}`} 
          onClick={() => setView('negotiation')}
        >
          <MailQuestion size={18} />
          <span>Negotiation Assistant</span>
        </button>
        
        <button 
          className={`tool-btn ${view === 'vin' ? 'active' : ''}`} 
          onClick={() => setView('vin')}
        >
          <ShieldCheck size={18} />
          <span>VIN & Price Check</span>
        </button>
      </div>

      {/* 4. Chat History Section */}
      <div className="history-list">
        <p className="section-title">Recent Conversations</p>
        {history.length > 0 ? (
          history.map((item) => {
            // FIX: Only active if view is 'chat' AND the ID matches
            const isItemActive = view === 'chat' && activeId === item.id;

            return (
              <div 
                key={item.id} 
                className={`history-item ${isItemActive ? 'active' : ''}`}
                onClick={() => { onSelect(item); setView('chat'); }}
              >
                <div className="item-info">
                  <p className="item-car">
                    <FileText size={14} className="inline mr-1" />
                    {item.carName}
                  </p>
                  <p className="item-date">{item.date}</p>
                </div>
                <button 
                  className="delete-btn" 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    onDelete(e, item.id);
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })
        ) : (
          <div className="no-results">No recent chats</div>
        )}
      </div>

      {/* 5. Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="footer-stats">
          {history.length} Analysis Records
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;