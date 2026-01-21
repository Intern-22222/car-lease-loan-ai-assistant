import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Chatbot from '../components/Chatbot'; // <--- IT IS BACK!

// Logic Helpers
const calculateFairnessScore = (contract) => {
  let score = 10;
  if (parseFloat(contract.apr) > 5.0) score -= 2;
  if (parseInt(contract.terminationFee) > 400) score -= 1.5;
  return Math.max(0, score).toFixed(1);
};

const checkSimilarity = (c1, c2) => c1?.vehicle === c2?.vehicle;

function Comparison() {
  const location = useLocation();
  const apiData = location.state?.data || {};
  const contractA = apiData.contract_a;
  const contractB = apiData.contract_b;

  const scoreA = contractA ? calculateFairnessScore(contractA) : 0;
  const scoreB = contractB ? calculateFairnessScore(contractB) : 0;
  const isDualMode = contractA && contractB;

  // Email State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailStatus, setEmailStatus] = useState("");

  const targetScore = isDualMode ? (scoreA > scoreB ? scoreA : scoreB) : (scoreA || scoreB);

  const handleSendEmail = async (emailBody) => {
    setEmailStatus("sending");
    try {
      await axios.post("http://127.0.0.1:8000/send-email", { body: emailBody });
      setEmailStatus("sent");
      setTimeout(() => { setShowEmailModal(false); setEmailStatus(""); }, 2000);
    } catch (error) {
      console.error(error);
      setEmailStatus("error");
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8.5) return "#28a745"; 
    if (score >= 5.0) return "#ffc107"; 
    return "#dc3545"; 
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '40px', paddingBottom: '100px' }}>
        <h1 style={{ textAlign: 'center' }}>
          {isDualMode ? "📊 Contract Comparison" : "📄 Single Contract Analysis"}
        </h1>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', marginTop: '30px' }}>
          
          {/* CONTRACT A CARD */}
          {contractA && (
            <div style={styles.card}>
              <h2>Contract A</h2>
              <div style={{ width: '150px', margin: '20px auto' }}>
                <CircularProgressbar 
                  value={scoreA} 
                  maxValue={10} 
                  text={`${scoreA}/10`} 
                  styles={buildStyles({
                    pathColor: getScoreColor(scoreA),
                    textColor: '#333',
                    trailColor: '#d6d6d6',
                    textSize: '16px'
                  })}
                />
              </div>
              <p>Vehicle: <strong>{contractA.vehicle}</strong></p>
              <p>Monthly: ${contractA.price}</p>
            </div>
          )}

          {isDualMode && <div style={{ alignSelf: 'center', fontSize: '30px', fontWeight: 'bold' }}>VS</div>}

          {/* CONTRACT B CARD */}
          {contractB && (
            <div style={styles.card}>
              <h2>Contract B</h2>
              <div style={{ width: '150px', margin: '20px auto' }}>
                <CircularProgressbar 
                  value={scoreB} 
                  maxValue={10} 
                  text={`${scoreB}/10`} 
                  styles={buildStyles({
                    pathColor: getScoreColor(scoreB),
                    textColor: '#333',
                    trailColor: '#d6d6d6',
                    textSize: '16px'
                  })}
                />
              </div>
              <p>Vehicle: <strong>{contractB.vehicle}</strong></p>
              <p>Monthly: ${contractB.price}</p>
            </div>
          )}
        </div>

        {/* INSIGHT BOX */}
        <div style={styles.insightBox}>
          <h3>💡 AI Insight</h3>
          {isDualMode ? (
            <p>
              Comparing two offers... Contract <strong>{scoreA > scoreB ? "A" : "B"}</strong> has the better Fairness Score.
            </p>
          ) : (
            <p>Fairness Score: <strong>{targetScore}/10</strong>. {targetScore < 8.5 ? "Consider negotiating the APR." : "Terms look fair!"}</p>
          )}
        </div>

        {/* NEGOTIATE BUTTON */}
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => setShowEmailModal(true)} style={styles.negotiateBtn}>
            📧 Open Negotiation Generator
          </button>
        </div>

        {/* EMAIL MODAL */}
        {showEmailModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h3>📩 Auto-Draft Negotiation Email</h3>
              <textarea 
                id="email-text"
                rows="8" 
                style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
                defaultValue={`Subject: Question about Lease APR\n\nHello,\n\nI analyzed the lease contract for the ${contractA?.vehicle || 'Car'}. The Fairness Score is ${targetScore}/10.\n\nCan we discuss the APR?\n\nBest,\n[Your Name]`}
              />
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowEmailModal(false)}>Cancel</button>
                <button 
                  style={{ backgroundColor: emailStatus === "sent" ? 'grey' : '#28a745', color: 'white' }} 
                  onClick={() => handleSendEmail(document.getElementById('email-text').value)}
                  disabled={emailStatus === "sent"}
                >
                  {emailStatus === "sending" ? "Sending..." : "Send Secretly 🚀"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- THE CHATBOT IS HERE --- */}
        <Chatbot />

      </div>
    </div>
  );
}

const styles = {
  card: { border: '1px solid #ddd', padding: '20px', borderRadius: '10px', width: '300px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', textAlign: 'center', backgroundColor: '#fff' },
  insightBox: { marginTop: '30px', marginBottom: '20px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', borderLeft: '5px solid #2196f3' },
  negotiateBtn: { padding: '15px 30px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }
};

export default Comparison;