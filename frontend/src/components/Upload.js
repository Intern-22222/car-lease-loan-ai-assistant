import React, { useState } from "react";
import "../App.css";

function Upload() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Choose PDF File");
  const [extractedText, setExtractedText] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [loading, setLoading] = useState(false);

  const charCount = extractedText.length;

  const uploadAndExtract = async () => {
    if (!file) {
      setStatus("Please select a PDF file first");
      setStatusType("error");
      return;
    }

    setLoading(true);
    setStatus("");
    setExtractedText("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Upload PDF
      const uploadRes = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      const uploadedFileName = uploadData.file_name;

      if (!uploadedFileName) {
        throw new Error("file_name not returned from backend");
      }

      // Fetch extracted text
      const textRes = await fetch(
        `http://127.0.0.1:5000/contracts/${uploadedFileName}`
      );
      const textData = await textRes.json();

      setExtractedText(textData.extracted_text || "No text found.");
      setStatus("✓ Text extracted successfully!");
      setStatusType("success");
    } catch (err) {
      console.error(err);
      setStatus("Error extracting text");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  const copyText = async () => {
    if (!extractedText) return;
    await navigator.clipboard.writeText(extractedText);
    setStatus("✓ Copied to clipboard");
    setStatusType("success");
  };

  const clearText = () => {
    if (!window.confirm("Clear extracted text?")) return;
    setExtractedText("");
    setFile(null);
    setFileName("Choose PDF File");
    setStatus("");
  };

  return (
  <div className="app">
    {/* Header */}
    <header className="app-header">
      <h1>CAR-LEASE-LOAN-AI-ASSISTANT</h1>
      <p>Extract text from uploaded PDF</p>
    </header>

    {/* Upload Card */}
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

      {status && <p className={`status ${statusType}`}>{status}</p>}
    </div>

    {/* Extracted Text */}
    <div className="card">
      <div className="card-header">
        <h2>Extracted Text</h2>
        <div>
          <button onClick={copyText} className="secondary-btn">Copy</button>
          <button onClick={clearText} className="secondary-btn">Clear</button>
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

    <footer className="footer">
      OCR powered by pdfplumber
    </footer>
  </div>
);

}

export default Upload;
