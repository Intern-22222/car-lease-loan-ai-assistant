import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import SummaryPanel from "./components/SummaryPanel";
import VinPriceCheck from "./components/VinPriceCheck";
import Login from "./components/Login"; // Add this back
import Header from "./components/Header"; 
import { api } from "./services/api";
import "./App.css";

function App() {
  // --- 1. Authentication State ---
  // Change this to check localStorage so it can actually be null
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user_session");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // --- 2. History & Session State ---
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("app_history");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeContract, setActiveContract] = useState(() => {
    const savedId = localStorage.getItem("active_id");
    if (savedId) {
      const savedHistory = JSON.parse(localStorage.getItem("app_history") || "[]");
      return savedHistory?.find((c) => c.id.toString() === savedId) || null;
    }
    return null;
  });

  const [view, setView] = useState(() => localStorage.getItem("app_view") || "chat");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  // --- 3. Persistence Sync ---
  useEffect(() => {
    localStorage.setItem("app_history", JSON.stringify(history));
    localStorage.setItem("app_view", view);
    
    // Logic to persist or remove user session
    if (user) {
      localStorage.setItem("user_session", JSON.stringify(user));
    } else {
      localStorage.removeItem("user_session");
    }

    if (activeContract) {
      localStorage.setItem("active_id", activeContract.id.toString());
    } else {
      localStorage.removeItem("active_id");
    }
  }, [history, activeContract, view, user]);

  // --- 4. Helper Functions ---
  // Add this back to handle the "Sign In" button click
  const handleLoginSuccess = (token, userData) => {
    setUser(userData);
  };

  // Update this to actually clear the state
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user_session");
    setView("chat");
  };

  const addMessageToHistory = (contractId, message) => {
    setHistory((prev) =>
      prev.map((c) =>
        c.id === contractId ? { ...c, chatHistory: [...c.chatHistory, message] } : c
      )
    );
    setActiveContract((prev) => {
      if (prev && prev.id === contractId) {
        return { ...prev, chatHistory: [...prev.chatHistory, message] };
      }
      return prev;
    });
  };

  // --- 5. Core Chat Logic ---
  const sendMessage = async (input, targetContract = null) => {
    const isObject = typeof input === 'object';
    const text = isObject ? input.text : input;
    if (!text?.trim() && !isObject) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = isObject ? input : { sender: "user", text: text.trim(), time: currentTime };
    
    let currentContract = targetContract || activeContract;
    let contractId;
    let fileContext = null;

    if (!currentContract) {
      contractId = Date.now();
      const newChat = {
        id: contractId,
        carName: isObject ? "Analyzing..." : "New Conversation", 
        fileName: isObject ? input.fileName : "General Inquiry",
        serverFilename: null,
        date: new Date().toLocaleDateString(),
        summary: {},
        chatHistory: [userMsg],
      };
      setHistory((prev) => [newChat, ...prev]);
      setActiveContract(newChat);
    } else {
      contractId = currentContract.id;
      fileContext = currentContract.serverFilename;
      addMessageToHistory(contractId, userMsg);
    }

    if (!isObject) {
      try {
        const res = await api.sendChatMessage(text, fileContext);
        const aiMsg = {
          sender: "ai",
          text: res.data.reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        addMessageToHistory(contractId, aiMsg);
      } catch (e) {
        console.error("Chat Error:", e);
      }
    }
  };

  const handleUploadSuccess = async (file, backendResult, isExisting, messageText) => {
    const extractionData = backendResult.data;
    const vehicleTitle = extractionData?.make && extractionData?.model 
      ? `${extractionData.make} ${extractionData.model}` 
      : (extractionData?.model || extractionData?.vin || file.name.split(".")[0]);

    const principalAmount = extractionData?.loan_amount || extractionData?.principal;

    const updateData = {
      carName: vehicleTitle, 
      serverFilename: backendResult.filename,
      summary: { ...extractionData, principal: principalAmount },
    };

    setHistory((prev) => prev.map((c) => (c.id === activeContract?.id ? { ...c, ...updateData } : c)));
    setActiveContract((prev) => ({ ...prev, ...updateData }));
    setIsSummaryOpen(true);

    try {
      const res = await api.sendChatMessage("Provide a summary of this document.", backendResult.filename);
      addMessageToHistory(activeContract.id, {
        sender: "ai",
        text: res.data.reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    } catch (err) {
      console.error("AI summary error:", err);
    }
  };

  const handleVinCheck = async (vin, price) => {
    const response = await api.getMarketAnalysis(vin, price);
    return response.data;
  };

  // --- 6. Render Logic ---
  // ADD THIS BACK: If no user, show Login screen
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      <Sidebar
        history={history.filter((i) => i.carName.toLowerCase().includes(searchTerm.toLowerCase()))}
        activeId={activeContract?.id}
        onSelect={(c) => {
          setActiveContract(c);
          setView("chat");
          setIsSummaryOpen(false);
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
        view={view}
        setView={setView}
      />

      <div className="content-area-wrapper">
        <Header 
          user={user} 
          onLogout={handleLogout} // Link to the clear state function
          activeContract={activeContract} 
          onToggleSummary={() => setIsSummaryOpen(!isSummaryOpen)}
          isSummaryOpen={isSummaryOpen}
          view={view}
        />
        
        <main className="main-view-container">
          {view === "chat" && (
            <ChatWindow
              contract={activeContract}
              onSendMessage={sendMessage}
              onUploadSuccess={handleUploadSuccess}
            />
          )}

          {view === "vin" && (
            <VinPriceCheck
              key={activeContract?.id || "empty"}
              onCheck={handleVinCheck}
              onBack={() => setView("chat")}
            />
          )}
        </main>
      </div>

      {isSummaryOpen && activeContract && (
        <SummaryPanel
          summary={activeContract.summary}
          carName={activeContract.carName}
          onClose={() => setIsSummaryOpen(false)}
        />
      )}
    </div>
  );
}

export default App;