import React from 'react';
import { Plus, Search, Trash2, FileText } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ history, searchTerm, setSearchTerm, onSelect, onDelete, onNewChat, activeId }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <FileText size={35} className="logo-icon" /> <span>LeaseIQ</span>
        </div>
        <button className="new-chat-btn" onClick={onNewChat}>
          <Plus size={18} /> New Contract
        </button>
      </div>

      <div className="search-container">
        <Search size={16} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search contracts..." 
          value={searchTerm} // Controlled input
          onChange={(e) => setSearchTerm(e.target.value)} // Updates search term in App.jsx
        />
      </div>

      <div className="history-list">
        {history.length > 0 ? (
          history.map((item) => (
            <div 
              key={item.id} 
              className={`history-item ${activeId === item.id ? 'active' : ''}`}
              onClick={() => onSelect(item)}
            >
              <div className="item-info">
                <p className="item-car">{item.carName}</p>
                <p className="item-file">{item.fileName}</p>
                <p className="item-date">{item.date}</p>
              </div>
              <button className="delete-btn" onClick={(e) => onDelete(e, item.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="no-results">No results found</div>
        )}
      </div>

      <div className="sidebar-footer">
        {history.length} contracts analyzed
      </div>
    </aside>
  );
};

export default Sidebar;