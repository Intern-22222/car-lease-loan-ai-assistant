import React from 'react';

const Loader = ({ text = "Processing document..." }) => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontSize: '0.9rem' }}>{text}</p>
      <style>{`
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(56, 189, 248, 0.1);
          border-top: 3px solid var(--accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;