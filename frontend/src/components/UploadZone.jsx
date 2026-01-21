import React, { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react'; // Added Loader2 for loading state
import './UploadZone.css';

const UploadZone = ({ onUploadSuccess }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleContainerClick = () => {
    if (isUploading) return; // Prevent clicks while uploading
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Start loading state
    setIsUploading(true);

    // Prepare the form data for the backend
    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("Uploading to backend...");
      
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      console.log("Backend response:", result);

      // result should contain the filename and status from your Python code
      // We pass the file object and the backend result to App.jsx
      onUploadSuccess(file, result); 
      
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload and analyze contract. Please check if the backend is running.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-text">
        <h1>Understand Your Car Lease</h1>
        <p>Upload your contract and get instant, plain-language explanations</p>
      </div>
      
      <div 
        className={`drop-zone ${isUploading ? 'uploading' : ''}`} 
        onClick={handleContainerClick}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".pdf" 
          style={{ display: 'none' }} 
        />

        <div className="icon-circle">
          {isUploading ? (
            <Loader2 size={30} color="#21CAB9" className="animate-spin" />
          ) : (
            <Upload size={30} color="#8b949e" />
          )}
        </div>

        {isUploading ? (
          <>
            <h4>Analyzing Contract...</h4>
            <p>Our AI is reading the fine print for you.</p>
          </>
        ) : (
          <>
            <h4>Drop your lease contract here</h4>
            <p>or click to browse • PDF files supported</p>
          </>
        )}
      </div>

      <div className="tags">
        <span className="tag"><i className="dot green"></i> Instant analysis</span>
        <span className="tag"><i className="dot blue"></i> Plain language</span>
        <span className="tag"><i className="dot orange"></i> Risk warnings</span>
      </div>
    </div>
  );
};

export default UploadZone;