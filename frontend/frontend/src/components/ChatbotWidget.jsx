import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm your Negotiation Coach. Ask me about your contract!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getContextId = () => {
    // Only send ID if we are on a results page
    if (location.pathname.includes("/results/")) {
      return location.pathname.split("/").pop();
    }
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

      const res = await fetch("https://car-lease-loan-ai-assistant.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          contextData: contractId ? { id: contractId } : null,
        }),
        // Note: Backend ai.service currently expects 'contextData' object or handles ID lookup
        // We simplified backend to handle raw message mostly, but let's send standard JSON
      });

      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
      } else {
        throw new Error(data.message);
      }
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
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 h-[500px] rounded-2xl shadow-2xl border flex flex-col mb-4 overflow-hidden">
          <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
            <h3 className="font-bold">🤖 Coach AI</h3>
            <button onClick={() => setIsOpen(false)} className="text-xl">
              ×
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === "user" ? "bg-indigo-600 text-white" : "bg-white border text-gray-800"}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-xs text-gray-500 ml-2">Thinking...</div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 bg-white border-t">
            <div className="flex gap-2">
              <input
                className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Type here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center text-3xl transition transform hover:scale-105"
      >
        {isOpen ? "×" : "💬"}
      </button>
    </div>
  );
};

export default ChatbotWidget;
