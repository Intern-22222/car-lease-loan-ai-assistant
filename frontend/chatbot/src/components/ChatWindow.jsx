import React, { useState } from "react";
import MessageBubble from "./MessageBubble";
import { sendChat } from "../api/client";

export default function ChatWindow({ fileId, analysis }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailDraft, setEmailDraft] = useState("");

  const handleSend = async (intent = "chat") => {
    if (!input.trim() || !fileId) return;
    const userMessage = { role: "user", content: input };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setLoading(true);
    try {
      const res = await sendChat(fileId, input, newHistory, intent);
      const assistantMsg = {
        role: "assistant",
        content: res.assistant_message,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      if (res.counter_email_draft) {
        setEmailDraft(res.counter_email_draft);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error talking to server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat panel */}
      <div
        style={{
          background: "rgba(15,23,42,0.98)",
          borderRadius: "12px",
          border: "1px solid rgba(55,65,81,0.9)",
          padding: "10px 12px",
          display: "flex",
          flexDirection: "column",
          height: "420px",
        }}
      >
        <div
          style={{
            marginBottom: "6px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>
            Negotiation Assistant
          </div>
          <div
            style={{
              fontSize: "0.72rem",
              padding: "2px 8px",
              borderRadius: "999px",
              border: "1px solid rgba(75,85,99,0.9)",
              color: "#9ca3af",
            }}
          >
            Uses LLM + fairness score
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            marginBottom: "8px",
            padding: "6px 4px",
            background: "#020617",
            borderRadius: "8px",
            border: "1px solid rgba(31,41,55,0.9)",
          }}
        >
          {messages.length === 0 && (
            <p
              style={{
                fontSize: "0.8rem",
                color: "#6b7280",
                padding: "4px 2px",
              }}
            >
              Ask about penalties, interest rate risk, hidden fees, or request a
              negotiation email draft.
            </p>
          )}
          {messages.map((m, idx) => (
            <MessageBubble key={idx} role={m.role} content={m.content} />
          ))}
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <textarea
            style={{
              flex: 1,
              resize: "none",
              height: "58px",
              fontSize: "0.82rem",
              padding: "6px 8px",
              borderRadius: "8px",
              border: "1px solid rgba(75,85,99,0.9)",
              backgroundColor: "#020617",
              color: "#e5e7eb",
              outline: "none",
            }}
            placeholder={
              fileId
                ? "Type a question or ask for a counter email..."
                : "Upload a contract or enter file_id first."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!fileId}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              width: "130px",
            }}
          >
            <button
              onClick={() => handleSend("chat")}
              disabled={loading || !fileId}
              style={{
                padding: "6px 10px",
                borderRadius: "8px",
                border: "none",
                fontSize: "0.8rem",
                fontWeight: 600,
                background:
                  "linear-gradient(135deg, rgba(59,130,246,1), rgba(37,99,235,1))",
                color: "#f9fafb",
                cursor: loading || !fileId ? "not-allowed" : "pointer",
                opacity: loading || !fileId ? 0.6 : 1,
              }}
            >
              {loading ? "Sending..." : "Send"}
            </button>
            <button
              onClick={() => handleSend("email")}
              disabled={loading || !fileId}
              style={{
                padding: "6px 10px",
                borderRadius: "8px",
                border: "none",
                fontSize: "0.8rem",
                fontWeight: 600,
                background:
                  "linear-gradient(135deg, rgba(56,189,248,1), rgba(45,212,191,1))",
                color: "#020617",
                cursor: loading || !fileId ? "not-allowed" : "pointer",
                opacity: loading || !fileId ? 0.6 : 1,
              }}
            >
              {loading ? "Generating..." : "Generate Email"}
            </button>
          </div>
        </div>
      </div>

      {/* Summary panel */}
      <div
        style={{
          background: "rgba(15,23,42,0.98)",
          borderRadius: "12px",
          border: "1px solid rgba(55,65,81,0.9)",
          padding: "10px 12px",
          fontSize: "0.82rem",
          height: "420px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: "6px" }}>
          Fairness Summary
        </div>
        {analysis ? (
          <>
            <div
              style={{
                padding: "8px",
                borderRadius: "10px",
                background:
                  analysis.fairness.rating === "Fair"
                    ? "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(22,163,74,0.2))"
                    : analysis.fairness.rating === "Moderate"
                    ? "linear-gradient(135deg, rgba(234,179,8,0.2), rgba(251,191,36,0.2))"
                    : "linear-gradient(135deg, rgba(248,113,113,0.25), rgba(239,68,68,0.25))",
                border: "1px solid rgba(75,85,99,0.8)",
                marginBottom: "8px",
              }}
            >
              <div style={{ fontSize: "0.86rem", fontWeight: 600 }}>
                Score: {analysis.fairness.score} ({analysis.fairness.rating})
              </div>
              <div style={{ fontSize: "0.78rem", marginTop: "2px" }}>
                {analysis.fairness.explanation}
              </div>
            </div>
            <div style={{ marginBottom: "6px" }}>
              <div>
                <strong>Hidden fees:</strong> {analysis.hidden_fees.length}
              </div>
              <div>
                <strong>Risk factors:</strong> {analysis.risk_factors.length}
              </div>
            </div>
            <div
              style={{
                marginTop: "6px",
                fontSize: "0.78rem",
                color: "#9ca3af",
                overflowY: "auto",
              }}
            >
              <strong>Top risks:</strong>
              <ul style={{ paddingLeft: "18px", marginTop: "2px" }}>
                {analysis.risk_factors.slice(0, 3).map((r, idx) => (
                  <li key={idx}>
                    {r.name} (severity {r.severity})
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>
            No analysis loaded yet. Upload a contract or analyze by file_id to
            view fairness score and hidden fees.
          </p>
        )}
      </div>
    </>
  );
}
