import React, { useState, useEffect } from "react";

const HistoryPage = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
const [searchQuery, setSearchQuery] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const pageSize = 5;


  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/results");
        const data = await response.json();

        if (!data.success) {
          setError("Failed to load records");
        } else {
          setResults(data.records || []);
        }
      } catch (err) {
        setError("Server error — could not fetch records");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, []);

  const filteredResults = results.filter((item) => {
    const text = searchQuery.toLowerCase();

    return (
      (item.fileName || "").toLowerCase().includes(text) ||
      (item.fields?.loan_amount + "").includes(text) ||
      (item.fields?.interest_rate + "").includes(text) ||
      (item.fields?.tenure_months + "").includes(text)
    );
  });

  const totalPages = Math.ceil(filteredResults.length / pageSize);

  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "15px" }}>📜 OCR History</h2>
      <div style={{ marginTop: "10px", marginBottom: "12px" }}>
        <input
          type="text"
          placeholder="Search by file name, loan amount, interest rate..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: "10px",
            width: "100%",
            maxWidth: "420px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
          }}
        />
      </div>

      {isLoading && <p>⏳ Loading records…</p>}

      {error && <p style={{ color: "red" }}>❌ {error}</p>}

      {!isLoading && !error && results.length === 0 && (
        <p>📭 No OCR records found yet.</p>
      )}

      {!isLoading &&
        !error &&
        results.length > 0 &&
        filteredResults.length === 0 && <p>🔍 No results match your search.</p>}

      {results.length > 0 && (
        <div>
          <p>
            Total Records: <strong>{results.length}</strong>
          </p>

          {paginatedResults.map((item) => (
            <div
              key={item._id}
              style={{
                marginTop: "14px",
                padding: "16px",
                borderRadius: "12px",
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              }}
            >
              {/* HEADER ROW */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <strong style={{ fontSize: "16px" }}>
                    📄 {item.fileName || "Untitled File"}
                  </strong>

                  <div style={{ color: "#6b7280", fontSize: "13px" }}>
                    Uploaded: {new Date(item.uploadedAt).toLocaleString()}
                  </div>
                </div>

                <div
                  style={{
                    fontWeight: "bold",
                    color:
                      item.confidence >= 0.7
                        ? "#16a34a"
                        : item.confidence >= 0.4
                        ? "#ca8a04"
                        : "#dc2626",
                  }}
                >
                  {(item.confidence * 100).toFixed(1)}%
                </div>
              </div>

              {/* DETAILS GRID */}
              <div
                style={{
                  marginTop: "10px",
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "8px",
                }}
              >
                <div>
                  <strong>Loan Amount:</strong>{" "}
                  {item.fields?.loan_amount
                    ? "₹" + item.fields.loan_amount
                    : "N/A"}
                </div>

                <div>
                  <strong>Interest Rate:</strong>{" "}
                  {item.fields?.interest_rate
                    ? item.fields.interest_rate + "%"
                    : "N/A"}
                </div>

                <div>
                  <strong>Tenure:</strong>{" "}
                  {item.fields?.tenure_months
                    ? item.fields.tenure_months + " months"
                    : "N/A"}
                </div>

                <div>
                  <strong>EMI:</strong>{" "}
                  {item.fields?.emi ? "₹" + item.fields.emi : "N/A"}
                </div>
              </div>
              <div style={{ marginTop: "10px" }}>
                <a
                  href={`/history/${item._id}`}
                  style={{
                    textDecoration: "none",
                    padding: "8px 12px",
                    backgroundColor: "#2563eb",
                    color: "white",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                >
                  🔍 View Details
                </a>
              </div>
            </div>
          ))}
          {filteredResults.length > 0 && (
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  backgroundColor: currentPage === 1 ? "#e5e7eb" : "#2563eb",
                  color: currentPage === 1 ? "#6b7280" : "white",
                  border: "none",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                ⬅ Previous
              </button>

              <span>
                Page <strong>{currentPage}</strong> of{" "}
                <strong>{totalPages}</strong>
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  backgroundColor:
                    currentPage === totalPages ? "#e5e7eb" : "#2563eb",
                  color: currentPage === totalPages ? "#6b7280" : "white",
                  border: "none",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                }}
              >
                Next ➡
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );}

export default HistoryPage;
