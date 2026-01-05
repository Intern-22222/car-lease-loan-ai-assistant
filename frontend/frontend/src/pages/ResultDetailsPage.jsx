import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ResultDetailsPage = () => {
  const { id } = useParams();

  const [record, setRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/results/${id}`);
        const data = await response.json();

        if (!data.success) {
          setError("Record not found");
        } else {
          setRecord(data.record);
        }
      } catch (err) {
        setError("Server error while fetching record");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  return (
    <div style={{ padding: "20px" }}>
      <a href="/">⬅ Back to Upload</a> |{" "}
      <a href="/history">📜 Back to History</a>
      <h2 style={{ marginTop: "10px" }}>📄 OCR Result Details</h2>
      {isLoading && <p>⏳ Loading...</p>}
      {error && <p style={{ color: "red" }}>❌ {error}</p>}
      {/* {record && (
        <div style={{ marginTop: "10px" }}>
          <p>
            <strong>File:</strong> {record.fileName || "Untitled"}
          </p>
          <p>
            <strong>Uploaded:</strong>{" "}
            {new Date(record.uploadedAt).toLocaleString()}
          </p>

          <p>
            <strong>Confidence:</strong> {(record.confidence * 100).toFixed(1)}%
          </p>

          <h3>Extracted Fields</h3>
          <pre>{JSON.stringify(record.fields, null, 2)}</pre>

          <h3>Raw OCR Text</h3>
          <pre
            style={{
              background: "#f1f5f9",
              padding: "10px",
              borderRadius: "6px",
            }}
          >
            {record.rawText}
          </pre>

          <h3>AI Notes</h3>
          <ul>
            {record.notes?.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )} */}
      {record && (
        <div style={{ marginTop: "15px" }}>
          {/* SUMMARY CARD */}
          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              marginBottom: "15px",
            }}
          >
            <h3 style={{ marginBottom: "8px" }}>📄 File Summary</h3>

            <p>
              <strong>File:</strong> {record.fileName || "Untitled"}
            </p>
            <p>
              <strong>Uploaded:</strong>{" "}
              {new Date(record.uploadedAt).toLocaleString()}
            </p>

            <p>
              <strong>Confidence:</strong>{" "}
              <span
                style={{
                  color:
                    record.confidence >= 0.7
                      ? "#16a34a"
                      : record.confidence >= 0.4
                      ? "#ca8a04"
                      : "#dc2626",
                }}
              >
                {(record.confidence * 100).toFixed(1)}%
              </span>
            </p>
          </div>

          {/* EXTRACTED FIELDS CARD */}
          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              marginBottom: "15px",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>📊 Extracted Fields</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "10px",
              }}
            >
              <div>
                <strong>Loan Amount:</strong>
                <br />
                {record.fields?.loan_amount
                  ? "₹" + record.fields.loan_amount
                  : "N/A"}
              </div>

              <div>
                <strong>Interest Rate:</strong>
                <br />
                {record.fields?.interest_rate
                  ? record.fields.interest_rate + "%"
                  : "N/A"}
              </div>

              <div>
                <strong>Tenure:</strong>
                <br />
                {record.fields?.tenure_months
                  ? record.fields.tenure_months + " months"
                  : "N/A"}
              </div>

              <div>
                <strong>EMI:</strong>
                <br />
                {record.fields?.emi ? "₹" + record.fields.emi : "N/A"}
              </div>
            </div>
          </div>

          {/* RAW TEXT CARD */}
          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              marginBottom: "15px",
            }}
          >
            <h3 style={{ marginBottom: "8px" }}>📝 Raw OCR Text</h3>

            <pre
              style={{
                background: "#f1f5f9",
                padding: "12px",
                borderRadius: "8px",
                overflowX: "auto",
              }}
            >
              {record.rawText}
            </pre>
          </div>

          {/* NOTES CARD */}
          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
            }}
          >
            <h3 style={{ marginBottom: "8px" }}>🧠 AI Reasoning Notes</h3>

            {record.notes?.length > 0 ? (
              <ul>
                {record.notes.map((n, i) => (
                  <li key={i} style={{ marginBottom: "6px" }}>
                    {n}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No notes available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDetailsPage;
