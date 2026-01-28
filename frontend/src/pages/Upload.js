import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadContract = () => {
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!fileA) {
      alert("Please upload at least Contract A");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file1", fileA);
    if (fileB) formData.append("file2", fileB);

    try {
      const response = await fetch("http://localhost:8000/compare", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Failed to analyze contracts.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>⚖️ Contract Analysis & Comparison</h2>
        <p style={{ color: '#666' }}>Upload one contract for a <b>Fairness Check</b>, or two contracts for a <b>Comparison</b>.</p>
      </div>

      {/* UPLOAD SECTION */}
      <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', marginBottom: '30px' }}>
        
        {/* Card A */}
        <div style={styles.uploadCard}>
          <h3>📄 Contract A</h3>
          <p style={{ fontSize: '14px', color: '#555' }}>Primary Offer</p>
          <input type="file" onChange={(e) => handleFileChange(e, setFileA)} style={{ marginTop: '10px' }} />
        </div>

        {/* VS Badge */}
        <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: '#ccc' }}>VS <br/>(Optional)</div>

        {/* Card B */}
        <div style={styles.uploadCard}>
          <h3>📄 Contract B</h3>
          <p style={{ fontSize: '14px', color: '#555' }}>Comparison Offer (Optional)</p>
          <input type="file" onChange={(e) => handleFileChange(e, setFileB)} style={{ marginTop: '10px' }} />
        </div>
      </div>

      {/* ACTION BUTTON */}
      <div style={{ textAlign: 'center' }}>
        <button onClick={handleUpload} style={styles.analyzeBtn} disabled={loading}>
          {loading ? "Analyzing..." : "Run AI Analysis"}
        </button>
      </div>

      {/* RESULTS SECTION */}
      {result && (
        <div style={{ marginTop: '50px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '15px' }}>
          
          {/* WINNER BANNER (Only if B exists) */}
          {result.contract_b && (
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h3 style={{ color: '#28a745', fontSize: '24px' }}>🏆 Winner: {result.winner}</h3>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
            
            {/* RESULT A */}
            <div style={styles.resultCard}>
              <h4>Contract A</h4>
              <div style={styles.scoreCircle(result.contract_a.score)}>
                {result.contract_a.score}/10
              </div>
              <ul style={{ textAlign: 'left', marginTop: '20px', color: '#555' }}>
                {result.contract_a.details.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>

            {/* RESULT B (Only if it exists) */}
            {result.contract_b && (
              <div style={styles.resultCard}>
                <h4>Contract B</h4>
                <div style={styles.scoreCircle(result.contract_b.score)}>
                  {result.contract_b.score}/10
                </div>
                <ul style={{ textAlign: 'left', marginTop: '20px', color: '#555' }}>
                  {result.contract_b.details.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  uploadCard: {
    padding: '30px', border: '2px dashed #ccc', borderRadius: '12px',
    textAlign: 'center', width: '300px', backgroundColor: 'white'
  },
  analyzeBtn: {
    padding: '15px 40px', backgroundColor: '#007bff', color: 'white', border: 'none',
    borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0,123,255,0.3)'
  },
  resultCard: {
    padding: '30px', backgroundColor: 'white', borderRadius: '15px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.1)', width: '300px', textAlign: 'center'
  },
  scoreCircle: (score) => ({
    width: '80px', height: '80px', borderRadius: '50%',
    backgroundColor: score > 7 ? '#d4edda' : score > 4 ? '#fff3cd' : '#f8d7da',
    color: score > 7 ? '#155724' : score > 4 ? '#856404' : '#721c24',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '24px', fontWeight: 'bold', margin: '0 auto'
  })
};

export default UploadContract;