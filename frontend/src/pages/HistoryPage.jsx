import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetching the real data from your FastAPI server
    fetch("http://127.0.0.1:8000/api/results")
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setHistory(data.records); // Setting the real list
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("History fetch error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1>Contract History</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Real records retrieved from your FastAPI backend.
      </p>

      {loading ? (
        <p>Loading your history...</p>
      ) : history.length === 0 ? (
        <p>No contracts uploaded yet. Go to the Upload page to start!</p>
      ) : (
        history.map((item) => (
          <Card key={item.id} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ color: 'var(--accent)' }}>{item.fileName}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Uploaded on: {item.uploadedAt}
                </p>
              </div>
              <Badge 
                type={item.confidence > 0.8 ? "success" : "warning"} 
                text={`Confidence: ${(item.confidence * 100).toFixed(0)}%`} 
              />
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default HistoryPage;