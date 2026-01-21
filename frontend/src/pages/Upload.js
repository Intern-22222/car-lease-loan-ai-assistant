import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Upload() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCompare = async () => {
    // 1. Validation: At least one file is required
    if (!file1 && !file2) {
      alert("Please upload at least one contract to start!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    if (file1) formData.append("file1", file1);
    if (file2) formData.append("file2", file2);

    try {
      console.log("Sending files to backend...");
      const response = await axios.post("http://127.0.0.1:8000/compare", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate('/compare', { state: { data: response.data } });

    } catch (error) {
      console.error("Connection Failed:", error);
      alert("Could not connect to the backend. Is uvicorn running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h1>⚖️ Contract Analysis & Comparison</h1>
        <p style={{ color: '#666', marginBottom: '40px' }}>
          Upload one contract for a <strong>Fairness Check</strong>, or two contracts for a <strong>Comparison</strong>.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', marginTop: '30px' }}>
          {/* Upload Box 1 - Primary */}
          <div style={styles.uploadBox}>
            <h3>📄 Contract A</h3>
            <p style={{ fontWeight: 'bold' }}>Primary Offer</p>
            <input type="file" onChange={(e) => setFile1(e.target.files[0])} />
            {file1 && <p style={{color: 'green', marginTop: '10px'}}>✅ {file1.name}</p>}
          </div>

          {/* OR Divider */}
          <div style={{ alignSelf: 'center', fontWeight: 'bold', color: '#aaa' }}>
            VS<br/>(Optional)
          </div>

          {/* Upload Box 2 - Optional */}
          <div style={{ ...styles.uploadBox, borderStyle: 'dotted' }}>
            <h3>📄 Contract B</h3>
            <p style={{ fontStyle: 'italic', color: '#888' }}>Comparison Offer (Optional)</p>
            <input type="file" onChange={(e) => setFile2(e.target.files[0])} />
            {file2 && <p style={{color: 'green', marginTop: '10px'}}>✅ {file2.name}</p>}
          </div>
        </div>

        <button onClick={handleCompare} disabled={loading} style={{
            ...styles.button, 
            backgroundColor: loading ? '#ccc' : '#007bff',
            cursor: loading ? 'not-allowed' : 'pointer'
        }}>
          {loading ? "Analyzing..." : file2 ? "Compare Contracts 🚀" : "Analyze Single Contract 🔍"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  uploadBox: { 
    border: '2px dashed #007bff', 
    padding: '30px', 
    borderRadius: '10px', 
    width: '300px', 
    backgroundColor: '#f9f9f9',
    transition: '0.3s'
  },
  button: { 
    marginTop: '40px', 
    padding: '15px 30px', 
    fontSize: '18px', 
    color: 'white', 
    border: 'none', 
    borderRadius: '8px' 
  }
};

export default Upload;