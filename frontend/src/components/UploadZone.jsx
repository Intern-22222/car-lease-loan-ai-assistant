import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import './UploadZone.css';

const UploadZone = ({ onUploadSuccess }) => {
  // Use a ref to target the hidden file input
  const fileInputRef = useRef(null);

  const handleContainerClick = () => {
    // Trigger the file browser when the dashed box is clicked
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file.name);
      // For now, we simulate success by calling your redirect function
      onUploadSuccess(file); 
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-text">
        <h1>Understand Your Car Lease</h1>
        <p>Upload your contract and get instant, plain-language explanations</p>
      </div>
      
      {/* Clicking this div now triggers the hidden input */}
      <div className="drop-zone" onClick={handleContainerClick}>
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".pdf" 
          style={{ display: 'none' }} 
        />

        <div className="icon-circle">
          <Upload size={30} color="#8b949e" />
        </div>
        <h4>Drop your lease contract here</h4>
        <p>or click to browse • PDF files supported</p>
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