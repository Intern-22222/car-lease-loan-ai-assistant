import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Trigger file selection dialog
  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Milestone 2 & 3: Upload logic connecting to your FastAPI backend
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a PDF or image first.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Calling your FastAPI endpoint defined in main.py
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status === "success") {
        // Navigate to results page after successful upload
        navigate("/results", { state: { filename: data.filename } });
      } else {
        alert("Upload failed: " + data.message);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Server error. Ensure your FastAPI server is running on port 8000.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "4rem auto", textAlign: "center" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Upload Contract</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
        AI-powered analysis for lease and loan agreements.
      </p>

      <Card>
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept=".pdf,image/*"
        />

        <div
          onClick={handleBoxClick}
          style={{
            border: "2px dashed var(--border)",
            padding: "4rem 2rem",
            borderRadius: "var(--radius)",
            marginBottom: "1.5rem",
            cursor: "pointer",
            backgroundColor: selectedFile ? "rgba(56, 189, 248, 0.05)" : "transparent",
          }}
        >
          {selectedFile ? (
            <p style={{ color: "var(--accent)", fontWeight: "bold" }}>
              ✓ {selectedFile.name}
            </p>
          ) : (
            <p style={{ color: "var(--text-muted)" }}>
              Drag and drop or <span style={{ color: "var(--accent)" }}>click to browse</span>
            </p>
          )}
        </div>

        <Button 
          fullWidth 
          onClick={handleUpload} 
          loading={isUploading}
          disabled={!selectedFile}
        >
          {isUploading ? "Analyzing..." : "Analyze Contract"}
        </Button>
      </Card>

      {/* Show the loader component during the API call */}
      {isUploading && <Loader text="AI is scanning your document..." />}
    </div>
  );
};

// CRITICAL: This default export fixes the 'SyntaxError' you saw in App.jsx
export default UploadPage;