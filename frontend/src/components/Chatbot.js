import React, { useState } from 'react';
import axios from 'axios';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am your Lease Assistant. Ask me anything about these contracts!' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // 1. Add User Message
    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // 2. Send to Backend
      const response = await axios.post("http://127.0.0.1:8000/chat", { question: input });
      
      // 3. Add Bot Response
      setMessages([...newMessages, { sender: 'bot', text: response.data.answer }]);
    } catch (error) {
      setMessages([...newMessages, { sender: 'bot', text: "Sorry, I can't connect to the server right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.chatbotContainer}>
      {/* Chat Window */}
      {isOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.header}>
            <span>🤖 AI Negotiator</span>
            <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>X</button>
          </div>
          
          <div style={styles.messageList}>
            {messages.map((msg, index) => (
              <div key={index} style={msg.sender === 'user' ? styles.userMsg : styles.botMsg}>
                {msg.text}
              </div>
            ))}
            {loading && <div style={styles.botMsg}>Typing...</div>}
          </div>

          <div style={styles.inputArea}>
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask a question..."
              style={styles.input}
            />
            <button onClick={sendMessage} style={styles.sendBtn}>Send</button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} style={styles.floatingBtn}>
          💬 Chat with AI
        </button>
      )}
    </div>
  );
}

const styles = {
  chatbotContainer: { position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 },
  
  floatingBtn: { 
    backgroundColor: '#4B0082', 
    color: 'white', 
    border: 'none', 
    borderRadius: '50px', 
    padding: '15px 25px', 
    fontSize: '16px', 
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)', 
    cursor: 'pointer' 
  },
  
  chatWindow: { 
    width: '350px', 
    height: '450px', 
    backgroundColor: 'white', 
    borderRadius: '10px', 
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)', 
    display: 'flex', 
    flexDirection: 'column', 
    overflow: 'hidden' 
  },
  
  header: { 
    backgroundColor: '#4B0082', 
    color: 'white', 
    padding: '15px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    fontWeight: 'bold' 
  },
  
  closeBtn: { background: 'none', border: 'none', color: 'white', fontSize: '16px', cursor: 'pointer' },
  
  messageList: { flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' },
  
  userMsg: { alignSelf: 'flex-end', backgroundColor: '#e3f2fd', padding: '10px', borderRadius: '10px 10px 0 10px' },
  
  botMsg: { alignSelf: 'flex-start', backgroundColor: '#f1f1f1', padding: '10px', borderRadius: '10px 10px 10px 0' },
  
  inputArea: { padding: '10px', borderTop: '1px solid #ddd', display: 'flex', gap: '10px' },
  
  input: { flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ddd' },
  
  sendBtn: { padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};
  

export default Chatbot;