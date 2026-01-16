import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const NegotiationChatPage = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello Priyanka! I can guide you on negotiating your car contract. Ask me about APR or hidden fees.' }
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (error) {
      console.error("Chat error:", error);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px' }}>AI Negotiation Assistant</h2>
      <div style={{ height: '400px', overflowY: 'auto', marginBottom: '20px', border: '1px solid var(--border)', padding: '20px', borderRadius: '12px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.role === 'user' ? 'right' : 'left', marginBottom: '15px' }}>
            <Card style={{ display: 'inline-block', backgroundColor: m.role === 'user' ? 'var(--accent)' : 'var(--bg-card)', color: m.role === 'user' ? '#000' : '#fff' }}>
              {m.text}
            </Card>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#111827', border: '1px solid #1E293B', color: '#fff' }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
};

export default NegotiationChatPage; // CRITICAL: Fixes the import error