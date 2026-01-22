import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import SummaryPanel from "./components/SummaryPanel";
import VinPriceCheck from "./components/VinPriceCheck";
import { dummyContracts } from "./data/dummyData";
import "./App.css";

function App() {
  // --- 1. State Management ---
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("app_history");
    return saved ? JSON.parse(saved) : dummyContracts;
  });

  const [activeContract, setActiveContract] = useState(() => {
    const savedId = localStorage.getItem("active_id");
    if (savedId) {
      const savedHistory = JSON.parse(
        localStorage.getItem("app_history") || "[]",
      );
      return savedHistory?.find((c) => c.id.toString() === savedId) || null;
    }
    return null;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Controls the middle section: 'chat', 'vin', 'comparison', 'negotiation'
  const [view, setView] = useState("chat");

  // --- 2. Persistence Effect ---
  useEffect(() => {
    localStorage.setItem("app_history", JSON.stringify(history));
    if (activeContract) {
      localStorage.setItem("active_id", activeContract.id.toString());
    } else {
      localStorage.removeItem("active_id");
    }
  }, [history, activeContract]);

  // --- 3. Filtered Sidebar History ---
  const filteredHistory = history.filter(
    (item) =>
      item.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fileName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // --- 4. Handlers ---
  const handleVinCheck = async (vin, price) => {
    try {
      const response = await fetch(
        `http://localhost:8000/market-info/${vin}?contract_price=${price}`,
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to decode VIN");
      }
      const data = await response.json();

      // Return the data so the VinPriceCheck component can display it locally
      return data;
    } catch (error) {
      console.error("VIN Check Error:", error);
      throw error;
    }
  };

  const handleUploadSuccess = async (
    file,
    backendResult,
    isFollowUp = false,
    userMessage = "",
  ) => {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // 1. Create the file message
    const fileMsg = {
      sender: "user",
      type: "file",
      fileName: file.name,
      text: userMessage, // Attach the user's text directly to the file message
      time: currentTime,
    };

    // 2. Create the AI response message
    const aiMsg = {
      sender: "ai",
      text: `I've analyzed **${file.name}**. I've updated the Intelligence Panel.`,
      time: currentTime,
    };

    if (isFollowUp && activeContract) {
      const updatedHistory = history.map((c) =>
        c.id === activeContract.id
          ? {
              ...c,
              // ONLY change title if it's currently a generic default
              carName:
                c.carName === "New Analysis" ||
                c.fileName === "General Inquiry" ||
                c.carName.includes("...")
                  ? file.name.split(".")[0]
                  : c.carName,
              chatHistory: [...c.chatHistory, fileMsg, aiMsg],
              summary: backendResult?.summary || c.summary || {},
              analysis: backendResult?.analysis || c.analysis || {},
            }
          : c,
      );
      setHistory(updatedHistory);
      setActiveContract(updatedHistory.find((c) => c.id === activeContract.id));
    } else {
      // New Entry Logic
      const newEntry = {
        id: Date.now(),
        carName: file.name.replace(/\.[^/.]+$/, ""),
        fileName: file.name,
        date: new Date().toLocaleDateString(),
        summary: backendResult?.summary || {},
        analysis: backendResult?.analysis || {},
        chatHistory: [fileMsg, aiMsg],
      };
      setHistory([newEntry, ...history]);
      setActiveContract(newEntry);
    }

    // Ensure UI states are correct
    setView("chat");
    setIsSummaryOpen(true);
  };

  const sendMessage = async (text) => {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userMsg = { sender: "user", text, time: currentTime };
    let currentActiveId;

    if (!activeContract) {
      const newChat = {
        id: Date.now(),
        carName: text.length > 20 ? text.substring(0, 20) + "..." : text,
        fileName: "General Inquiry",
        date: new Date().toLocaleDateString(),
        summary: {},
        chatHistory: [userMsg],
      };
      setHistory([newChat, ...history]);
      setActiveContract(newChat);
      currentActiveId = newChat.id;
    } else {
      currentActiveId = activeContract.id;
      const updated = history.map((c) =>
        c.id === currentActiveId
          ? { ...c, chatHistory: [...c.chatHistory, userMsg] }
          : c,
      );
      setHistory(updated);
      setActiveContract(updated.find((c) => c.id === currentActiveId));
    }

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, contract_id: currentActiveId }),
      });
      const data = await res.json();
      const aiMsg = {
        sender: "ai",
        text: data.reply,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setHistory((prev) => {
        const updated = prev.map((c) =>
          c.id === currentActiveId
            ? { ...c, chatHistory: [...c.chatHistory, aiMsg] }
            : c,
        );
        const active = updated.find((c) => c.id === currentActiveId);
        if (active) setActiveContract(active);
        return updated;
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="app-container">
      <div
        className={`main-layout-wrapper ${isSidebarOpen ? "sidebar-open" : ""}`}
      >
        <div className="sidebar-container">
          <Sidebar
            history={filteredHistory}
            activeId={activeContract?.id}
            onSelect={(c) => {
              setActiveContract(c);
              setView("chat");
              setIsSidebarOpen(false);
            }}
            onDelete={(e, id) => {
              e.stopPropagation();
              setHistory((h) => h.filter((i) => i.id !== id));
              if (activeContract?.id === id) setActiveContract(null);
            }}
            onNewChat={() => {
              setActiveContract(null);
              setView("chat");
              setIsSummaryOpen(false);
            }}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            view={view} // <--- ADD THIS LINE
            setView={setView}
          />
          Why th
        </div>

        <main className="main-content">
          {/* UPDATED: Multi-view routing logic */}
          {view === "chat" && (
            <ChatWindow
              contract={activeContract}
              onSendMessage={sendMessage}
              onUploadSuccess={handleUploadSuccess}
              onToggleSummary={() => setIsSummaryOpen(!isSummaryOpen)}
              isSummaryOpen={isSummaryOpen}
            />
          )}

          {view === "vin" && (
            <VinPriceCheck
              onCheck={handleVinCheck}
              onBack={() => setView("chat")}
            />
          )}

          {view === "comparison" && (
            <div className="placeholder-view">
              <h2>Comparison Page</h2>
              <p>Compare multiple lease offers side-by-side.</p>
              <button className="back-btn" onClick={() => setView("chat")}>
                Back to Chat
              </button>
            </div>
          )}

          {view === "negotiation" && (
            <div className="placeholder-view">
              <h2>Negotiation Assistant</h2>
              <p>AI-powered scripts to help you get a better deal.</p>
              <button className="back-btn" onClick={() => setView("chat")}>
                Back to Chat
              </button>
            </div>
          )}
        </main>
      </div>

      {isSummaryOpen && activeContract && (
        <SummaryPanel
          summary={activeContract.summary}
          analysis={activeContract.analysis}
          carName={activeContract.carName}
          onClose={() => setIsSummaryOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
