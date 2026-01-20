import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { calculateFairnessScore, checkSimilarity } from '../utils/fairnessLogic';

function Comparison() {
  // MOCK DATA (Since we don't have the backend connected yet)
  const contractA = {
    id: 1, vehicle: "Toyota Camry 2024", price: 450, apr: 4.5, terminationFee: 350
  };
  const contractB = {
    id: 2, vehicle: "Toyota Camry 2024", price: 420, apr: 3.9, terminationFee: 300
  };

  const isSimilar = checkSimilarity(contractA, contractB);
  const scoreA = calculateFairnessScore(contractA);
  const scoreB = calculateFairnessScore(contractB);

  // Email Modal State
  const [showEmailModal, setShowEmailModal] = useState(false);

  return (
    <div>
      <Navbar />
      <div style={{ padding: '40px' }}>
        <h1>📊 Contract Analysis & Comparison</h1>

        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          
          {/* CONTRACT A CARD */}
          <div style={styles.card}>
            <h2>Contract A</h2>
            <h3>Score: <span style={{ color: scoreA >= 8.5 ? 'green' : 'orange' }}>{scoreA}/10</span></h3>
            <p>Vehicle: {contractA.vehicle}</p>
            <p>APR: {contractA.apr}%</p>
            <p>Monthly: ${contractA.price}</p>
          </div>

          {/* VS BADGE */}
          <div style={{ alignSelf: 'center', fontSize: '30px', fontWeight: 'bold' }}>VS</div>

          {/* CONTRACT B CARD */}
          <div style={styles.card}>
            <h2>Contract B</h2>
            <h3>Score: <span style={{ color: scoreB >= 8.5 ? 'green' : 'orange' }}>{scoreB}/10</span></h3>
            <p>Vehicle: {contractB.vehicle}</p>
            <p>APR: {contractB.apr}%</p>
            <p>Monthly: ${contractB.price}</p>
          </div>
        </div>

        {/* LOGIC: SIMILARITY CHECK */}
        <div style={styles.insightBox}>
          <h3>💡 AI Insight</h3>
          {isSimilar ? (
            <p>
              These contracts are for the <strong>same vehicle</strong>. 
              <strong> Contract B</strong> is the better deal because it saves you 
              <strong> ${contractA.price - contractB.price}/month</strong>.
            </p>
          ) : (
            <p>
              These are <strong>different vehicles</strong>. Compare the features closely 
              rather than just the price.
            </p>
          )}
        </div>

        {/* NEGOTIATE BUTTON */}
        <button onClick={() => setShowEmailModal(true)} style={styles.negotiateBtn}>
          📧 Negotiate with Dealer (Auto-Draft)
        </button>

        {/* HIDDEN EMAIL MODAL */}
        {showEmailModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h3>Draft Email to Dealer</h3>
              <p>We generated this based on the Fairness Score.</p>
              <textarea 
                rows="6" 
                style={{ width: '100%', marginBottom: '10px' }}
                defaultValue={`Hello,\n\nI noticed Contract B has a Fairness Score of ${scoreB}, which is higher than yours (${scoreA}). Can you match their APR of ${contractB.apr}%?\n\nBest, Client`}
              />
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowEmailModal(false)}>Cancel</button>
                <button style={{ backgroundColor: '#28a745', color: 'white' }} onClick={() => alert("Email Sent via Backend!")}>
                  Send Secretly 🚀
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  card: { border: '1px solid #ddd', padding: '20px', borderRadius: '10px', width: '40%', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
  insightBox: { marginTop: '30px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', borderLeft: '5px solid #2196f3' },
  negotiateBtn: { marginTop: '20px', padding: '15px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '500px' }
};

export default Comparison;