


import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Added useNavigate
import API_BASE from "../config/api"; // Added API_BASE

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm your Negotiation Coach. Ask me about your contract or use the quick links below!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate(); 
  const btnRef = useRef(null);

  useEffect(() => {
    if (isOpen) return;
    const iv = setInterval(() => {
      btnRef.current?.classList.add('chat-nudge');
      setTimeout(() => btnRef.current?.classList.remove('chat-nudge'), 700);
    }, 8000);
    return () => clearInterval(iv);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getContextId = () => {
    if (location.pathname.includes("/results/"))
      return location.pathname.split("/").pop();
    return null;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);
    try {
      const contractId = getContextId();
      const res = await fetch(
        `${API_BASE}/api/chat`, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem("token")}` 
          },
          body: JSON.stringify({
            message: userMsg,
            contextData: contractId ? { id: contractId } : null,
          }),
        }
      );
      const data = await res.json();
      if (data.success)
        setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
      else throw new Error(data.message);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "⚠️ I'm having trouble connecting to the server.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleSend();
  };

 
  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false); 
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .cw-root { position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;font-family:'Sora',sans-serif; }

        /* FAB */
        .cw-fab {
          width:56px;height:56px;border-radius:50%;
          background:linear-gradient(135deg,#6c63ff,#4f46e5);
          border:none;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 8px 28px rgba(108,99,255,0.5),0 2px 8px rgba(0,0,0,0.3);
          transition:transform 0.22s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.2s;
          position:relative;
        }
        .cw-fab:hover { transform:scale(1.1);box-shadow:0 12px 36px rgba(108,99,255,0.65); }
        .cw-fab-pulse {
          position:absolute;inset:-4px;border-radius:50%;
          border:2px solid rgba(108,99,255,0.4);
          animation:cw-ring 2.5s ease-out infinite;
        }
        @keyframes cw-ring { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.5);opacity:0} }

        /* Chat window */
        .cw-window {
          position:absolute;bottom:68px;right:0;
          width:340px;
          background:rgba(8,6,28,0.92);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:22px;
          overflow:hidden;
          backdrop-filter:blur(32px);
          -webkit-backdrop-filter:blur(32px);
          box-shadow:0 32px 80px rgba(0,0,0,0.6),0 0 0 1px rgba(255,255,255,0.04) inset,0 0 40px rgba(108,99,255,0.1);
          display:flex;flex-direction:column;
          animation:cw-slideUp 0.28s cubic-bezier(0.22,1,0.36,1) both;
          max-height:520px;
        }
        @keyframes cw-slideUp { from{opacity:0;transform:translateY(16px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        .cw-window::before { content:'';position:absolute;top:0;left:10%;right:10%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent); }

        /* Header */
        .cw-header {
          padding:14px 16px;
          background:rgba(108,99,255,0.12);
          border-bottom:1px solid rgba(255,255,255,0.07);
          display:flex;align-items:center;justify-content:space-between;
          flex-shrink:0;
        }
        .cw-header-left { display:flex;align-items:center;gap:10px; }
        .cw-avatar { width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#6c63ff,#4f46e5);display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 4px 12px rgba(108,99,255,0.35); }
        .cw-header-title { font-size:0.875rem;font-weight:700;color:#fff;letter-spacing:-0.01em; }
        .cw-header-sub { font-family:'DM Sans',sans-serif;font-size:11px;color:rgba(255,255,255,0.4);display:flex;align-items:center;gap:4px; }
        .cw-online-dot { width:5px;height:5px;border-radius:50%;background:#34d399;box-shadow:0 0 5px #34d399; }
        .cw-close-btn { width:28px;height:28px;border-radius:8px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);cursor:pointer;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.5);transition:background 0.18s,color 0.18s; }
        .cw-close-btn:hover { background:rgba(255,255,255,0.12);color:#fff; }

        /* Messages */
        .cw-messages { flex:1;overflow-y:auto;padding:14px 14px 10px;display:flex;flex-direction:column;gap:10px;min-height:0; }
        .cw-messages::-webkit-scrollbar { width:3px; }
        .cw-messages::-webkit-scrollbar-thumb { background:rgba(108,99,255,0.3);border-radius:99px; }

        .cw-msg-row-bot { display:flex;justify-content:flex-start;align-items:flex-end;gap:7px; }
        .cw-msg-row-user { display:flex;justify-content:flex-end; }

        .cw-bot-icon { width:26px;height:26px;border-radius:8px;background:rgba(108,99,255,0.2);border:1px solid rgba(108,99,255,0.3);display:flex;align-items:center;justify-content:center;color:#a5b4fc;flex-shrink:0;margin-bottom:2px; }

        .cw-bubble-bot {
          max-width:82%;padding:10px 13px;
          background:rgba(255,255,255,0.07);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:16px 16px 16px 4px;
          font-family:'DM Sans',sans-serif;font-size:0.82rem;color:rgba(255,255,255,0.82);line-height:1.55;
        }
        .cw-bubble-user {
          max-width:82%;padding:10px 13px;
          background:linear-gradient(135deg,#6c63ff,#4f46e5);
          border-radius:16px 16px 4px 16px;
          font-family:'DM Sans',sans-serif;font-size:0.82rem;color:#fff;line-height:1.55;
          box-shadow:0 4px 14px rgba(108,99,255,0.3);
        }

        /* Typing indicator */
        .cw-typing { display:flex;align-items:center;gap:4px;padding:10px 13px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.09);border-radius:16px 16px 16px 4px;width:fit-content; }
        .cw-typing-dot { width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,0.4);animation:cw-typing 1.2s ease-in-out infinite; }
        .cw-typing-dot:nth-child(2) { animation-delay:.2s; }
        .cw-typing-dot:nth-child(3) { animation-delay:.4s; }
        @keyframes cw-typing { 0%,80%,100%{transform:scale(0.7);opacity:.4} 40%{transform:scale(1);opacity:1} }

        /* Quick Actions Navigation */
        .cw-quick-actions { display:flex; gap:8px; padding: 0 14px 10px; overflow-x:auto; }
        .cw-quick-actions::-webkit-scrollbar { display:none; }
        .cw-quick-btn {
          background: rgba(108,99,255,0.12); border: 1px solid rgba(108,99,255,0.3);
          color: #a5b4fc; border-radius: 999px; padding: 6px 12px;
          font-size: 0.75rem; font-weight: 600; cursor: pointer; white-space: nowrap;
          transition: all 0.2s;
        }
        .cw-quick-btn:hover { background: rgba(108,99,255,0.25); color: #fff; }

        /* Input area */
        .cw-input-area {
          padding:12px 14px;
          border-top:1px solid rgba(255,255,255,0.07);
          background:rgba(255,255,255,0.03);
          display:flex;align-items:center;gap:8px;
          flex-shrink:0;
        }
        .cw-input {
          flex:1;padding:9px 13px;
          background:rgba(255,255,255,0.07);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:12px;color:#fff;
          font-family:'DM Sans',sans-serif;font-size:0.82rem;
          outline:none;transition:border-color 0.2s,background 0.2s,box-shadow 0.2s;
        }
        .cw-input::placeholder { color:rgba(255,255,255,0.25); }
        .cw-input:focus { border-color:rgba(108,99,255,0.6);background:rgba(108,99,255,0.08);box-shadow:0 0 0 2px rgba(108,99,255,0.12); }

        .cw-send-btn {
          width:36px;height:36px;border-radius:10px;
          background:linear-gradient(135deg,#6c63ff,#4f46e5);
          border:none;cursor:pointer;color:#fff;
          display:flex;align-items:center;justify-content:center;
          transition:transform 0.18s,box-shadow 0.18s,opacity 0.18s;
          box-shadow:0 4px 12px rgba(108,99,255,0.35);
          flex-shrink:0;
        }
        .cw-send-btn:hover:not(:disabled) { transform:scale(1.08);box-shadow:0 6px 18px rgba(108,99,255,0.5); }
        .cw-send-btn:disabled { opacity:0.45;cursor:not-allowed; }
      `}</style>

      <div className="cw-root">
        {isOpen && (
          <div className="cw-window">
            {/* Header */}
            <div className="cw-header">
              <div className="cw-header-left">
                <div className="cw-avatar">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2a10 10 0 1 0 10 10" />
                    <path d="M12 8v4l3 3" />
                    <circle
                      cx="19"
                      cy="5"
                      r="3"
                      fill="currentColor"
                      opacity="0.6"
                      stroke="none"
                    />
                  </svg>
                </div>
                <div>
                  <div className="cw-header-title">Coach AI</div>
                  <div className="cw-header-sub">
                    <span className="cw-online-dot" />
                    Online
                  </div>
                </div>
              </div>
              <button className="cw-close-btn" onClick={() => setIsOpen(false)}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

           
            <div className="cw-messages">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={
                    msg.role === "user" ? "cw-msg-row-user" : "cw-msg-row-bot"
                  }
                >
                  {msg.role === "bot" && (
                    <div className="cw-bot-icon">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    </div>
                  )}
                  <div
                    className={
                      msg.role === "user" ? "cw-bubble-user" : "cw-bubble-bot"
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="cw-msg-row-bot">
                  <div className="cw-bot-icon">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <div className="cw-typing">
                    <div className="cw-typing-dot" />
                    <div className="cw-typing-dot" />
                    <div className="cw-typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

           
            {!isLoading && (
              <div className="cw-quick-actions">
                <button onClick={() => handleNavigate('/upload')} className="cw-quick-btn">⬆️ New Upload</button>
                <button onClick={() => handleNavigate('/compare')} className="cw-quick-btn">📊 Compare Deals</button>
                <button onClick={() => handleNavigate('/email')} className="cw-quick-btn">📧 Draft Email</button>
                <button onClick={() => handleNavigate('/history')} className="cw-quick-btn">📂 History</button>
              </div>
            )}

            <div className="cw-input-area">
              <input
                className="cw-input"
                placeholder="Ask about your contract…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button
                className="cw-send-btn"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        )}

      
        <button
          ref={btnRef}
          className="cw-fab"
          onClick={() => setIsOpen(!isOpen)}
        >
          {!isOpen && <div className="cw-fab-pulse" />}
          {isOpen ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
};

export default ChatbotWidget;
