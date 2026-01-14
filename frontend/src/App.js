import React, { useState } from "react";
import Login from "./components/Login";
import "./App.css";

function App() {
  // 🔐 Login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 📄 Existing states
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Choose PDF File");
  const [extractedText, setExtractedText] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState("");
  const [loading, setLoading] = useState(false);

  const charCount = extractedText.length;

  // 🚀 Upload & Extract
  const uploadAndExtract = async () => {
    if (!file) {
      setStatusMsg("Please select a PDF file first");
      setStatusType("error");
      return;
    }

    setLoading(true);
    setExtractedText("");
    setStatusMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadRes = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      const textRes = await fetch(
        `http://127.0.0.1:5000/contracts/${uploadData.file_name}`
      );

      const textData = await textRes.json();

      setExtractedText(textData.extracted_text || "No text found.");
      setStatusMsg("✓ Text extracted successfully");
      setStatusType("success");
    } catch (err) {
      setStatusMsg("Error extracting text");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  const copyText = async () => {
    if (!extractedText) return;
    await navigator.clipboard.writeText(extractedText);
    setStatusMsg("✓ Copied to clipboard");
    setStatusType("success");
  };

  const clearText = () => {
    if (!window.confirm("Clear extracted text?")) return;
    setExtractedText("");
    setFile(null);
    setFileName("Choose PDF File");
    setStatusMsg("");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    clearText();
  };

  // 🔁 Login check
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>CAR-LEASE-LOAN-AI-ASSISTANT</h1>

        
      </header>

      <div className="card">
        <h2>Upload Your PDF</h2>

        <input
          type="file"
          id="pdfFile"
          accept=".pdf"
          hidden
          onChange={(e) => {
            setFile(e.target.files[0]);
            setFileName(e.target.files[0]?.name || "Choose PDF File");
          }}
        />

        <label htmlFor="pdfFile" className="file-picker">
          {fileName}
        </label>

        <button
          className="primary-btn"
          onClick={uploadAndExtract}
          disabled={loading}
        >
          {loading ? "Processing..." : "Upload & Extract"}
        </button>

        {statusMsg && (
          <p className={`status ${statusType}`}>{statusMsg}</p>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Extracted Text</h2>
          <div>
            <button onClick={copyText} className="secondary-btn">
              Copy
            </button>
            <button onClick={clearText} className="secondary-btn">
              Clear
            </button>
          </div>
        </div>

        <textarea
          value={extractedText}
          readOnly
          placeholder="Extracted text will appear here..."
          rows="16"
        />

        <p className="char-count">{charCount} characters</p>
      </div>
      <div className="logout-container">
  <button className="logout-btn" onClick={handleLogout}>
    Logout
  </button>
</div>


      <footer className="footer">
        OCR powered by pdfplumber
      </footer>
    </div>
  );
}

export default App;
