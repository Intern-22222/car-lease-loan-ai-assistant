import React, { useState, useEffect } from "react";
import { Menu, X as CloseIcon } from "lucide-react"; 
import Sidebar from "./components/Sidebar";
import UploadZone from "./components/UploadZone";
import ChatWindow from "./components/ChatWindow";
import SummaryPanel from "./components/SummaryPanel";
import { dummyContracts } from "./data/dummyData";
import "./App.css";

function App() {
  // --- Persistent State Initialization ---
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("app_history");
    return saved ? JSON.parse(saved) : dummyContracts;
  });

  const [activeContract, setActiveContract] = useState(() => {
    const savedId = localStorage.getItem("active_id");
    if (savedId) {
      const savedHistory = JSON.parse(localStorage.getItem("app_history"));
      return savedHistory?.find(c => c.id.toString() === savedId) || null;
    }
    return null;
  });

  const [view, setView] = useState(() => localStorage.getItem("app_view") || "upload");
  const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem("search_term") || "");
  const [isSummaryOpen, setIsSummaryOpen] = useState(() => localStorage.getItem("summary_open") === "true");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- Persistence Effect ---
  useEffect(() => {
    localStorage.setItem("app_history", JSON.stringify(history));
    localStorage.setItem("app_view", view);
    localStorage.setItem("search_term", searchTerm);
    localStorage.setItem("summary_open", isSummaryOpen);
    
    if (activeContract) {
      localStorage.setItem("active_id", activeContract.id.toString());
    } else {
      localStorage.removeItem("active_id");
    }
  }, [history, activeContract, view, searchTerm, isSummaryOpen]);

  // --- Handlers ---
  const filteredHistory = history.filter(
    (item) =>
      item.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fileName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const startNewChat = () => {
    setView("upload");
    setActiveContract(null);
    setSearchTerm("");
    setIsSummaryOpen(false);
    setIsSidebarOpen(false);
  };

  const handleSelectContract = (contract) => {
    setActiveContract(contract);
    setView("chat");
    setIsSidebarOpen(false); 
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    const updatedHistory = history.filter((item) => item.id !== id);
    setHistory(updatedHistory);
    if (activeContract?.id === id) startNewChat();
  };

  const handleUploadSuccess = (file) => {
    const newEntry = {
      id: Date.now(),
      carName: file.name.replace(/\.[^/.]+$/, ""),
      fileName: file.name,
      date: new Date().toLocaleDateString(),
      summary: {
        monthly: "$489/month",
        duration: "36 months",
        apr: "4.9%",
        mileage: "12,000/yr",
        deposit: "$500",
        earlyTermination: "$2,500 penalty",
        excessMileage: "$0.25/mile",
      },
      chatHistory: [{ sender: "ai", text: `Analysis complete for **${file.name}**.` }],
    };
    setHistory([newEntry, ...history]);
    setActiveContract(newEntry);
    setView("chat");
    setIsSummaryOpen(true);
  };

  const sendMessage = (text) => {
    if (!activeContract) return;
    const userMsg = { sender: "user", text };
    const updated = history.map(c => c.id === activeContract.id ? { ...c, chatHistory: [...c.chatHistory, userMsg] } : c);
    setHistory(updated);
    setActiveContract(updated.find(c => c.id === activeContract.id));

    setTimeout(() => {
      const aiMsg = { sender: "ai", text: "I've analyzed that specific clause for you." };
      setHistory(prev => prev.map(c => c.id === activeContract.id ? { ...c, chatHistory: [...c.chatHistory, aiMsg] } : c));
    }, 1000);
  };

  return (
    <div className="app-container">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

      <div className={`main-layout-wrapper ${isSummaryOpen ? "blur-active" : ""} ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-container">
          <Sidebar
            history={filteredHistory}
            activeId={activeContract?.id}
            onSelect={handleSelectContract}
            onDelete={handleDelete}
            onNewChat={startNewChat}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        <main className="main-content">
          {view === "upload" ? (
            <UploadZone onUploadSuccess={handleUploadSuccess} />
          ) : (
            <div className="chat-layout">
              <ChatWindow
                contract={activeContract}
                onSendMessage={sendMessage}
                onToggleSummary={() => setIsSummaryOpen(true)}
                isSummaryOpen={isSummaryOpen}
                // Pass the sidebar trigger here
                onOpenSidebar={() => setIsSidebarOpen(true)} 
              />
            </div>
          )}
        </main>
      </div>

      {isSummaryOpen && activeContract && (
        <>
          <div className="summary-backdrop" onClick={() => setIsSummaryOpen(false)} />
          <SummaryPanel
            summary={activeContract.summary}
            carName={activeContract.carName}
            onClose={() => setIsSummaryOpen(false)}
          />
        </>
      )}
    </div>
  );
}

export default App;