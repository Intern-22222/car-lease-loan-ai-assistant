import React, { useState, useEffect } from "react";
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
      return savedHistory?.find((c) => c.id.toString() === savedId) || null;
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

  /**
   * MILESTONE 4 INTEGRATED: Upload + Market Intelligence
   */
  const handleUploadSuccess = async (file, backendResult) => {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Step 1: Prepare potential VIN and Price for Market Analysis
    // In Milestone 5, these will be extracted from the PDF result
    const simulatedVin = "5YJ3E1EB7NF211111"; // Example Tesla VIN
    const simulatedPrice = 38000;

    let marketAnalysis = null;

    try {
      // Step 2: Fetch Market Intelligence (Task 3 & 4 of Milestone 4)
      const marketRes = await fetch(
        `http://localhost:8000/market-info/${simulatedVin}?contract_price=${simulatedPrice}`
      );
      if (marketRes.ok) {
        const marketData = await marketRes.json();
        marketAnalysis = marketData.analysis;
      }
    } catch (error) {
      console.error("Market Intelligence Fetch Failed:", error);
    }

    // Step 3: Create the final entry
    const newEntry = {
      id: Date.now(),
      carName: file.name.replace(/\.[^/.]+$/, ""),
      fileName: file.name,
      date: new Date().toLocaleDateString(),
      summary: {
        monthly: backendResult?.monthly || "$450.00",
        duration: backendResult?.duration || "36 months",
        apr: backendResult?.apr || "N/A",
        mileage: backendResult?.mileage || "12,000/yr",
        deposit: backendResult?.deposit || "N/A",
        excessMileage: backendResult?.excessMileage || "N/A",
      },
      analysis: marketAnalysis, // NEW: Milestone 4 Deal Rating
      chatHistory: [
        { 
          sender: "ai", 
          text: `I've finished analyzing **${file.name}**. I've also performed a market check—take a look at the summary panel for the deal rating!`, 
          time: currentTime 
        },
      ],
    };

    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    setActiveContract(newEntry);
    setView("chat");
    setIsSummaryOpen(true);
  };

  const sendMessage = async (text) => {
    if (!activeContract) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { sender: "user", text: text, time: currentTime };

    const historyWithUser = history.map((c) =>
      c.id === activeContract.id ? { ...c, chatHistory: [...c.chatHistory, userMsg] } : c
    );
    setHistory(historyWithUser);
    setActiveContract(historyWithUser.find((c) => c.id === activeContract.id));

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: text,
          contract_id: activeContract.id 
        })
      });

      if (!response.ok) throw new Error("Server error");
      const data = await response.json();

      const aiMsg = {
        sender: "ai",
        text: data.reply, 
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setHistory((prev) => {
        const finalHistory = prev.map((c) =>
          c.id === activeContract.id ? { ...c, chatHistory: [...c.chatHistory, aiMsg] } : c
        );
        const updatedActive = finalHistory.find((c) => c.id === activeContract.id);
        setActiveContract(updatedActive);
        return finalHistory;
      });

    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg = {
        sender: "ai",
        text: "I'm having trouble connecting to my brain (the server). Please check your connection.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setHistory((prev) => prev.map((c) =>
        c.id === activeContract.id ? { ...c, chatHistory: [...c.chatHistory, errorMsg] } : c
      ));
    }
  };

  return (
    <div className="app-container">
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

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
            analysis={activeContract.analysis} // Pass the deal rating here
            carName={activeContract.carName}
            onClose={() => setIsSummaryOpen(false)}
          />
        </>
      )}
    </div>
  );
}

export default App;