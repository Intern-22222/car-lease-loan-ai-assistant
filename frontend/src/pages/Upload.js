import React, { useState } from 'react';

function Upload() {
  const [file, setFile] = useState(null);

  // This function runs when you pick a file
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // This function runs when you click "Upload"
  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }
    console.log("Uploading file:", file.name);
    alert(`Ready to upload: ${file.name}`);
    // In the next step, we will connect this to your Python Backend!
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Document Upload Dashboard</h1>
      
      <div style={{ border: '2px dashed #ccc', padding: '40px', marginTop: '20px', borderRadius: '10px' }}>
        <h3>Select a Contract (PDF) to Analyze</h3>
        
        {/* The File Input */}
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={handleFileChange} 
          style={{ margin: '20px 0' }}
        />
        
        <br />

        {/* The Upload Button */}
        <button 
          onClick={handleUpload}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Upload Contract
        </button>
      </div>

      {file && <p style={{ marginTop: '20px', color: '#555' }}>Selected: <strong>{file.name}</strong></p>}
    </div>
  );
}

export default Upload;