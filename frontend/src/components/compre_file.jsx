import { useState } from "react";

import { useNavigate } from "react-router-dom";
export default function CompareContracts() {
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleCompare = async () => {
    if (!fileA || !fileB) {
      setError("Please upload both contracts");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("contract_a", fileA);
    formData.append("contract_b", fileB);

    try {
      const res = await fetch("http://localhost:8000/compare-from-files", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Failed to compare contracts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>📄 Contract Fairness Comparator</h1>

        <div style={styles.uploadRow}>
          <div style={styles.uploadBox}>
            <label>Contract A</label>
            <input type="file" onChange={(e) => setFileA(e.target.files[0])} />
          </div>

          <div style={styles.uploadBox}>
            <label>Contract B</label>
            <input type="file" onChange={(e) => setFileB(e.target.files[0])} />
          </div>
        </div>

        <button style={styles.button} onClick={handleCompare} disabled={loading}>
          {loading ? "Analyzing..." : "Compare Contracts"}
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </div>

      {result && (
        <div style={styles.result}>
          <h2>🏆 Winner: {result.comparison.winner}</h2>

          <div style={styles.resultsGrid}>
            <ResultCard
              title="Contract A"
              data={result.contract_a_extracted}
              score={result.comparison.contract_a_score}
            />
            <ResultCard
              title="Contract B"
              data={result.contract_b_extracted}
              score={result.comparison.contract_b_score}
            />
          </div>

          <button onClick={() => navigate("/dashboard")}
      className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg">
              Go to Dashboard
    </button>
        </div>
      )}
    </div>
  );
}

function ResultCard({ title, data, score }) {
  return (
    <div style={styles.resultCard}>
      <h3>{title}</h3>
      <p><b>Fairness Score:</b> {score}/10</p>
      <ul>
        <li>APR: {data.apr ?? "N/A"}</li>
        <li>Termination Fee: {data.termination_fee ?? "N/A"}</li>
        <li>Mileage Limit: {data.mileage_limit ?? "N/A"}</li>
        <li>Price: {data.price ?? "N/A"}</li>
      </ul>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f8",
    padding: "40px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    maxWidth: "800px",
    margin: "0 auto",
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
  },
  uploadRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },
  uploadBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  error: {
    marginTop: "15px",
    color: "red",
    textAlign: "center",
  },
  result: {
    maxWidth: "900px",
    margin: "40px auto",
  },
  resultsGrid: {
    display: "flex",
    gap: "20px",
  },
  resultCard: {
    flex: 1,
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
  },
};
