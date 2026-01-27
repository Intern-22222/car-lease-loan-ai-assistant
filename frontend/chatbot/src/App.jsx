import React, { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import {
  uploadContract,
  runOCR,
  analyzeContract,
  getAnalysis,
} from "./api/client";

function App() {
  const [fileId, setFileId] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatusMessage("");
    setUploading(true);
    try {
      setStatusMessage("Uploading contract...");
      const uploadRes = await uploadContract(file);
      const newFileId = uploadRes.file_id;
      setFileId(newFileId);

      setStatusMessage("Running OCR on contract...");
      await runOCR(newFileId);

      setStatusMessage("Analyzing fairness and hidden fees...");
      const analysisRes = await analyzeContract(newFileId);
      setAnalysis(analysisRes);
      setStatusMessage("Analysis complete. You can now chat with the assistant.");
    } catch (err) {
      console.error(err);
      setStatusMessage(
        "Error during upload/OCR/analysis. Please check backend and API key."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyzeById = async () => {
    if (!fileId.trim()) return;
    setAnalyzing(true);
    setStatusMessage("");
    try {
      const data = await analyzeContract(fileId.trim());
      setAnalysis(data);
      setStatusMessage("Analysis refreshed from LLM.");
    } catch (err) {
      console.error(err);
      try {
        const existing = await getAnalysis(fileId.trim());
        setAnalysis(existing);
        setStatusMessage("Loaded existing analysis from database.");
      } catch (inner) {
        console.error("getAnalysis error:", inner);
        alert("Frontend error: " + (inner.message || "check console"));
      }

    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #020617 0, #020617 40%, #000 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 12px",
        color: "#f9fafb",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Main centered card */}
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          background: "rgba(15,23,42,0.97)",
          borderRadius: "18px",
          border: "1px solid rgba(148,163,184,0.45)",
          boxShadow:
            "0 18px 45px rgba(15,23,42,0.8), 0 0 0 1px rgba(15,23,42,0.9)",
          padding: "20px 22px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Card header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(55,65,81,0.8)",
            paddingBottom: "10px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "1.05rem",
                fontWeight: 600,
                letterSpacing: 0.4,
              }}
            >
              Car Lease / Loan Contract Assistant
            </div>
            <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: 2 }}>
              Upload a contract, get a fairness score, detect hidden fees, and
              generate negotiation emails.
            </div>
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              padding: "4px 10px",
              borderRadius: "999px",
              border: "1px solid rgba(148,163,184,0.7)",
              color: "#e5e7eb",
              background:
                "linear-gradient(135deg, rgba(37,99,235,0.2), rgba(56,189,248,0.15))",
            }}
          >
            Milestone 4 · Fairness & Negotiation
          </div>
        </div>

        {/* Upload + ID row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1.3fr",
            gap: "12px",
          }}
        >
          {/* Upload */}
          <div
            style={{
              background: "rgba(15,23,42,0.98)",
              borderRadius: "12px",
              padding: "10px 12px",
              border: "1px solid rgba(75,85,99,0.9)",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 500,
                marginBottom: "6px",
              }}
            >
              Upload contract (PDF / image)
            </div>
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "999px",
                border: "1px solid rgba(37,99,235,0.9)",
                background:
                  "linear-gradient(135deg, rgba(37,99,235,0.95), rgba(59,130,246,0.95))",
                color: "#f9fafb",
                fontSize: "0.82rem",
                cursor: uploading ? "not-allowed" : "pointer",
                opacity: uploading ? 0.7 : 1,
                boxShadow: "0 16px 34px rgba(37,99,235,0.5)",
              }}
            >
              <span style={{ fontWeight: 600 }}>Select file</span>
              <span style={{ fontSize: "0.78rem", opacity: 0.95 }}>
                {uploading ? "Processing..." : "Upload · OCR · Analyze"}
              </span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.tiff,.bmp"
                style={{ display: "none" }}
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
            {statusMessage && (
              <p
                style={{
                  fontSize: "0.78rem",
                  marginTop: "6px",
                  color: "#9ca3af",
                }}
              >
                {statusMessage}
              </p>
            )}
          </div>

          {/* Existing file_id */}
          <div
            style={{
              background: "rgba(15,23,42,0.98)",
              borderRadius: "12px",
              padding: "10px 12px",
              border: "1px solid rgba(75,85,99,0.9)",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 500,
                marginBottom: "6px",
              }}
            >
              Or load by existing file_id
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="Paste file_id from backend"
                value={fileId}
                onChange={(e) => setFileId(e.target.value)}
                style={{
                  flex: 1,
                  fontSize: "0.8rem",
                  padding: "7px 10px",
                  borderRadius: "999px",
                  border: "1px solid rgba(148,163,184,0.7)",
                  backgroundColor: "#020617",
                  color: "#e5e7eb",
                  outline: "none",
                }}
              />
              <button
                onClick={handleAnalyzeById}
                disabled={!fileId.trim() || analyzing}
                style={{
                  padding: "7px 14px",
                  borderRadius: "999px",
                  border: "none",
                  background:
                    "linear-gradient(135deg, rgba(56,189,248,0.95), rgba(59,130,246,0.9))",
                  color: "#020617",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor:
                    !fileId.trim() || analyzing ? "not-allowed" : "pointer",
                  opacity: !fileId.trim() || analyzing ? 0.6 : 1,
                  boxShadow: "0 12px 30px rgba(56,189,248,0.5)",
                }}
              >
                {analyzing ? "Analyzing..." : "Analyze"}
              </button>
            </div>
            <p
              style={{
                fontSize: "0.74rem",
                marginTop: "4px",
                color: "#6b7280",
              }}
            >
              Active file_id:{" "}
              <span style={{ color: "#e5e7eb", fontFamily: "monospace" }}>
                {fileId || "—"}
              </span>
            </p>
          </div>
        </div>

        {/* Chat + summary area inside card */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2.1fr)",
            gap: "14px",
          }}
        >
          <ChatWindow fileId={fileId} analysis={analysis} />
        </div>
      </div>
    </div>
  );
}

export default App;
