import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

function Upload() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const navigate = useNavigate();

  const handleCompare = () => {
    if (!file1 || !file2) {
      alert("Please upload BOTH contracts to start the comparison!");
      return;
    }
    // We will pass these files to the next page (Comparison Page)
    console.log("Comparing:", file1.name, "vs", file2.name);
    navigate('/compare'); // We will build this page next!
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h1>⚖️ Contract Comparison Tool</h1>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', marginTop: '30px' }}>
          {/* Upload Box 1 */}
          <div style={styles.uploadBox}>
            <h3>Contract A</h3>
            <p>Upload the first offer</p>
            <input type="file" onChange={(e) => setFile1(e.target.files[0])} />
            {file1 && <p style={{color: 'green'}}>✅ {file1.name}</p>}
          </div>

          {/* Upload Box 2 */}
          <div style={styles.uploadBox}>
            <h3>Contract B</h3>
            <p>Upload the second offer</p>
            <input type="file" onChange={(e) => setFile2(e.target.files[0])} />
            {file2 && <p style={{color: 'green'}}>✅ {file2.name}</p>}
          </div>
        </div>

        <button onClick={handleCompare} style={styles.button}>
          Run Fairness Analysis 🚀
        </button>
      </div>
    </div>
  );
}

const styles = {
  uploadBox: {
    border: '2px dashed #ccc',
    padding: '30px',
    borderRadius: '10px',
    width: '300px',
    backgroundColor: '#f9f9f9'
  },
  button: {
    marginTop: '40px',
    padding: '15px 30px',
    fontSize: '18px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  }
};

export default Upload;