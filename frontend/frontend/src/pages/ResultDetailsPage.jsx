import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";

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

  const generateAnalysisPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("AI Contract Analysis Report", 20, 20);

    doc.setFontSize(12);

    // --- SAFE VIN & VEHICLE SECTION ---
    const vinText = record.vin || "Not Detected";
    doc.text(`VIN: ${vinText}`, 20, 35);

    if (record.vehicleDetails) {
      doc.text(
        `Vehicle: ${record.vehicleDetails.year} ${record.vehicleDetails.make} ${record.vehicleDetails.model}`,
        20,
        45,
      );
    } else {
      doc.text("Vehicle: Details not available", 20, 45);
    }

    // --- SAFE PRICING SECTION ---
    if (record.pricingAnalysis) {
      doc.text(
        `Contract Price: ${record.pricingAnalysis.contractPrice ? "Rs. " + record.pricingAnalysis.contractPrice : "N/A"}`,
        20,
        60,
      );
      doc.text(
        `Market Fair Price: ${record.pricingAnalysis.marketFairPrice ? "Rs. " + record.pricingAnalysis.marketFairPrice : "N/A"}`,
        20,
        70,
      );
      doc.text(`Verdict: ${record.pricingAnalysis.verdict || "N/A"}`, 20, 80);

      doc.text("Recommendation:", 20, 100);

      // Handle long recommendation text by splitting it
      const recommendation =
        record.pricingAnalysis.recommendation ||
        (record.pricingAnalysis.verdict === "Overpriced"
          ? "Negotiate or consider alternative vehicles."
          : "Proceed with the deal.");

      const splitText = doc.splitTextToSize(recommendation, 170); // Wrap text at 170 units
      doc.text(splitText, 20, 110);
    } else {
      doc.text("Pricing Analysis: Not available", 20, 60);
    }

    doc.save("contract_analysis_report.pdf");
  };

  return (
    <div style={{ padding: "20px" }}>
      <a href="/">⬅ Back to Upload</a> |{" "}
      <a href="/history">📜 Back to History</a>
      <h2 style={{ marginTop: "10px" }}>📄 OCR Result Details</h2>
      {isLoading && <p>⏳ Loading...</p>}
      {error && <p style={{ color: "red" }}>❌ {error}</p>}
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

          {record.vehicleDetails && (
            <div
              style={{
                padding: "16px",
                borderRadius: "12px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e5e7eb",
                marginBottom: "15px",
              }}
            >
              <h3> Vehicle Details</h3>

              <p>
                <strong>VIN:</strong> {record.vin}
              </p>
              <p>
                <strong>Year:</strong> {record.vehicleDetails.year}
              </p>
              <p>
                <strong>Make:</strong> {record.vehicleDetails.make}
              </p>
              <p>
                <strong>Model:</strong> {record.vehicleDetails.model}
              </p>
              <p>
                <strong>Trim:</strong> {record.vehicleDetails.trim}
              </p>
              <p>
                <strong>Body Type:</strong> {record.vehicleDetails.bodyClass}
              </p>
            </div>
          )}

          {record.pricingAnalysis &&
            record.pricingAnalysis.contractPrice != null && (
              <div
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  backgroundColor: "#ecfeff",
                  border: "1px solid #67e8f9",
                  marginBottom: "15px",
                }}
              >
                <h3>💰 Market Fair Price Analysis</h3>

                <p>
                  <strong>Contract Price:</strong> ₹
                  {record.pricingAnalysis.contractPrice.toLocaleString()}
                </p>

                <p>
                  <strong>Market Fair Price:</strong> ₹
                  {record.pricingAnalysis.marketFairPrice?.toLocaleString() ??
                    "N/A"}
                </p>

                <p>
                  <strong>Difference:</strong> ₹
                  {record.pricingAnalysis.difference?.toLocaleString() ?? "N/A"}
                </p>

                <p>
                  <strong>Verdict:</strong>{" "}
                  <span
                    style={{
                      color:
                        record.pricingAnalysis.verdict === "Overpriced"
                          ? "red"
                          : "green",
                      fontWeight: "bold",
                    }}
                  >
                    {record.pricingAnalysis.verdict}
                  </span>
                </p>

                <p>
                  <strong>Confidence:</strong>{" "}
                  {record.pricingAnalysis.confidence ?? "N/A"}
                </p>
              </div>
            )}

          {/* {record.pricingAnalysis && (
            <div
              style={{
                padding: "16px",
                borderRadius: "12px",
                backgroundColor: "#f0fdf4",
                border: "1px solid #86efac",
                marginBottom: "15px",
              }}
            >
              <h3>✅ Recommendation</h3>

              {record.pricingAnalysis.verdict === "Overpriced" ? (
                <p>
                  ⚠️ The vehicle appears overpriced compared to market value.
                  Consider negotiating or exploring similar alternatives.
                </p>
              ) : (
                <p>
                  ✅ The pricing appears fair based on market analysis. You may
                  proceed or negotiate minor terms.
                </p>
              )}
            </div>
          )} */}

          {record.pricingAnalysis?.recommendation && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold mb-1">✅ Recommendation</h3>
              <p className="text-sm text-gray-700">
                {record.pricingAnalysis.recommendation}
              </p>
            </div>
          )}

          <button
            onClick={generateAnalysisPDF}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            📄 Download Analysis Report (PDF)
          </button>

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
