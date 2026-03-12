import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
        const response = await fetch("https://car-lease-loan-ai-assistant.onrender.com/api/results");
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
    currentPage * pageSize,
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;

    try {
      const res = await fetch(`https://car-lease-loan-ai-assistant.onrender.com/api/history/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        // 👇 FIX: Use 'setResults' and 'results' instead of setHistory/history
        setResults(results.filter((item) => item._id !== id));
        // If you don't have toast installed, alert is fine
        alert("Deleted successfully!");
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    //     <div style={{ padding: "20px" }}>

    //       <div style={{ marginBottom: "20px" }}>
    //         <Link
    //           to="/"
    //           style={{
    //             display: "inline-flex",
    //             alignItems: "center",
    //             textDecoration: "none",
    //             color: "#4b5563",
    //             fontWeight: "500",
    //             fontSize: "14px",
    //           }}
    //         >
    //           <span style={{ marginRight: "5px" }}>⬅</span> Back to Upload
    //         </Link>
    //       </div>

    //       <h2 style={{ marginBottom: "15px" }}>📜 OCR History</h2>
    //       <div style={{ marginTop: "10px", marginBottom: "12px" }}>
    //         <input
    //           type="text"
    //           placeholder="Search by file name, loan amount, interest rate..."
    //           value={searchQuery}
    //           onChange={(e) => {
    //             setSearchQuery(e.target.value);
    //             setCurrentPage(1);
    //           }}
    //           style={{
    //             padding: "10px",
    //             width: "100%",
    //             maxWidth: "420px",
    //             borderRadius: "8px",
    //             border: "1px solid #d1d5db",
    //           }}
    //         />
    //       </div>

    //       {isLoading && <p>⏳ Loading records…</p>}

    //       {error && <p style={{ color: "red" }}>❌ {error}</p>}

    //       {!isLoading && !error && results.length === 0 && (
    //         <p>📭 No OCR records found yet.</p>
    //       )}

    //       {!isLoading &&
    //         !error &&
    //         results.length > 0 &&
    //         filteredResults.length === 0 && <p>🔍 No results match your search.</p>}

    //       {results.length > 0 && (
    //         <div>
    //           <p>
    //             Total Records: <strong>{results.length}</strong>
    //           </p>

    //           {paginatedResults.map((item) => (
    //             <div
    //               key={item._id}
    //               style={{
    //                 marginTop: "14px",
    //                 padding: "16px",
    //                 borderRadius: "12px",
    //                 backgroundColor: "white",
    //                 border: "1px solid #e5e7eb",
    //                 boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
    //               }}
    //             >
    //               {/* HEADER ROW */}
    //               <div style={{ display: "flex", justifyContent: "space-between" }}>
    //                 <div>
    //                   <strong style={{ fontSize: "16px" }}>
    //                     📄 {item.fileName || "Untitled File"}
    //                   </strong>

    //                   <div style={{ color: "#6b7280", fontSize: "13px" }}>
    //                     Uploaded: {new Date(item.uploadedAt).toLocaleString()}
    //                   </div>
    //                 </div>

    //                 <div
    //                   style={{
    //                     fontWeight: "bold",
    //                     color:
    //                       item.confidence >= 0.7
    //                         ? "#16a34a"
    //                         : item.confidence >= 0.4
    //                           ? "#ca8a04"
    //                           : "#dc2626",
    //                   }}
    //                 >
    //                   {(item.confidence * 100).toFixed(1)}%
    //                 </div>
    //               </div>

    //               {/* DETAILS GRID */}
    //               <div
    //                 style={{
    //                   marginTop: "10px",
    //                   display: "grid",
    //                   gridTemplateColumns: "repeat(2, 1fr)",
    //                   gap: "8px",
    //                 }}
    //               >
    //                 <div>
    //                   <strong>Loan Amount:</strong>{" "}
    //                   {item.fields?.loan_amount
    //                     ? "₹" + item.fields.loan_amount
    //                     : "N/A"}
    //                 </div>

    //                 <div>
    //                   <strong>Interest Rate:</strong>{" "}
    //                   {item.fields?.interest_rate
    //                     ? item.fields.interest_rate + "%"
    //                     : "N/A"}
    //                 </div>

    //                 <div>
    //                   <strong>Tenure:</strong>{" "}
    //                   {item.fields?.tenure_months
    //                     ? item.fields.tenure_months + " months"
    //                     : "N/A"}
    //                 </div>

    //                 <div>
    //                   <strong>EMI:</strong>{" "}
    //                   {item.fields?.emi ? "₹" + item.fields.emi : "N/A"}
    //                 </div>
    //               </div>

    //               {/* <div style={{ marginTop: "10px" }}>
    //                 <a
    //                   href={`/history/${item._id}`}
    //                   style={{
    //                     textDecoration: "none",
    //                     padding: "8px 12px",
    //                     backgroundColor: "#2563eb",
    //                     color: "white",
    //                     borderRadius: "8px",
    //                     fontSize: "13px",
    //                   }}
    //                 >
    //                   🔍 View Details
    //                 </a>
    //               </div>
    //             </div> */}

    //             <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    //   <Link
    //     to={`/results/${item._id}`} // Changed to Link for faster navigation
    //     style={{
    //       textDecoration: "none",
    //       padding: "8px 12px",
    //       backgroundColor: "#2563eb",
    //       color: "white",
    //       borderRadius: "8px",
    //       fontSize: "13px",
    //       fontWeight: "500"
    //     }}
    //   >
    //     🔍 View Details
    //   </Link>

    //   <button
    //     onClick={() => handleDelete(item._id)}
    //     style={{
    //       padding: "8px 12px",
    //       backgroundColor: "#fee2e2", // Light red background
    //       color: "#dc2626",           // Dark red text
    //       border: "1px solid #fca5a5",
    //       borderRadius: "8px",
    //       fontSize: "13px",
    //       fontWeight: "bold",
    //       cursor: "pointer"
    //     }}
    //   >
    //     🗑️ Delete
    //   </button>
    // </div>

    // )}

    //           {filteredResults.length > 0 && (
    //             <div
    //               style={{
    //                 marginTop: "16px",
    //                 display: "flex",
    //                 justifyContent: "space-between",
    //                 alignItems: "center",
    //               }}
    //             >
    //               <button
    //                 disabled={currentPage === 1}
    //                 onClick={() => setCurrentPage((p) => p - 1)}
    //                 style={{
    //                   padding: "8px 12px",
    //                   borderRadius: "8px",
    //                   backgroundColor: currentPage === 1 ? "#e5e7eb" : "#2563eb",
    //                   color: currentPage === 1 ? "#6b7280" : "white",
    //                   border: "none",
    //                   cursor: currentPage === 1 ? "not-allowed" : "pointer",
    //                 }}
    //               >
    //                 ⬅ Previous
    //               </button>

    //               <span>
    //                 Page <strong>{currentPage}</strong> of{" "}
    //                 <strong>{totalPages}</strong>
    //               </span>

    //               <button
    //                 disabled={currentPage === totalPages}
    //                 onClick={() => setCurrentPage((p) => p + 1)}
    //                 style={{
    //                   padding: "8px 12px",
    //                   borderRadius: "8px",
    //                   backgroundColor:
    //                     currentPage === totalPages ? "#e5e7eb" : "#2563eb",
    //                   color: currentPage === totalPages ? "#6b7280" : "white",
    //                   border: "none",
    //                   cursor:
    //                     currentPage === totalPages ? "not-allowed" : "pointer",
    //                 }}
    //               >
    //                 Next ➡
    //               </button>
    //             </div>
    //           )}
    //         </div>
    //       )}
    //     </div>
    //)

    <div className="dynamic-bg font-sans"
      style={{
        padding: "24px",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Back Button */}
      <div style={{ marginBottom: "24px" }}>
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            textDecoration: "none",
            color: "#6b7280",
            fontWeight: "500",
            fontSize: "14px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#111827")}
          onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
        >
          <span style={{ marginRight: "8px" }}>←</span> Back to Upload
        </Link>
      </div>

      {/* Header */}
      <h2 className="text-gray-900 dark:text-white drop-shadow-sm"
        style={{
          marginBottom: "24px",
          fontSize: "28px",
          fontWeight: "700",
        }}
      >
        📜 OCR History
      </h2>

      {/* Search Bar */}
      <div style={{ marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="Search by file name, loan amount, interest rate..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: "12px 16px",
            width: "100%",
            maxWidth: "500px",
            fontSize: "14px",
          }}
          className="glass-input"
          onFocus={(e) => {
            e.target.style.borderColor = "#2563eb";
            e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#d1d5db";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
          <p style={{ fontSize: "16px" }}>⏳ Loading records…</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "10px",
            color: "#dc2626",
            marginBottom: "16px",
          }}
        >
          ❌ {error}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && results.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#6b7280",
          }}
        >
          <p style={{ fontSize: "18px" }}>📭 No OCR records found yet.</p>
        </div>
      )}

      {/* No Search Results */}
      {!isLoading &&
        !error &&
        results.length > 0 &&
        filteredResults.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#6b7280",
            }}
          >
            <p style={{ fontSize: "18px" }}>🔍 No results match your search.</p>
          </div>
        )}

      {/* Results */}
      {results.length > 0 && filteredResults.length > 0 && (
        <div>
          {/* Total Count */}
          <p
            style={{ marginBottom: "16px", color: "#6b7280", fontSize: "14px" }}
          >
            Total Records:{" "}
            <strong style={{ color: "#111827" }}>{results.length}</strong>
          </p>

          {/* Results List */}
          {paginatedResults.map((item) => (
            <div
              key={item._id}
              className="glass-card text-gray-900 dark:text-gray-100"
              style={{
                marginBottom: "16px",
                padding: "20px",
              }}
            >
              {/* Header Row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <strong className="text-gray-900 dark:text-white"
                    style={{
                      fontSize: "18px",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    📄 {item.fileName || "Untitled File"}
                  </strong>
                  <div style={{ color: "#9ca3af", fontSize: "13px" }}>
                    {new Date(item.uploadedAt).toLocaleString()}
                  </div>
                </div>
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "16px",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    backgroundColor:
                      item.confidence >= 0.7
                        ? "#dcfce7"
                        : item.confidence >= 0.4
                          ? "#fef3c7"
                          : "#fee2e2",
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

              {/* Details Grid */}
              <div
                className="bg-white/20 dark:bg-gray-800/40"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "12px",
                  marginBottom: "16px",
                  padding: "16px",
                  borderRadius: "8px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginBottom: "4px",
                    }}
                  >
                    Loan Amount
                  </div>
                  <strong style={{ fontSize: "15px", color: "#111827" }}>
                    {item.fields?.loan_amount
                      ? "₹" + item.fields.loan_amount
                      : "N/A"}
                  </strong>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginBottom: "4px",
                    }}
                  >
                    Interest Rate
                  </div>
                  <strong style={{ fontSize: "15px", color: "#111827" }}>
                    {item.fields?.interest_rate
                      ? item.fields.interest_rate + "%"
                      : "N/A"}
                  </strong>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginBottom: "4px",
                    }}
                  >
                    Tenure
                  </div>
                  <strong style={{ fontSize: "15px", color: "#111827" }}>
                    {item.fields?.tenure_months
                      ? item.fields.tenure_months + " months"
                      : "N/A"}
                  </strong>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginBottom: "4px",
                    }}
                  >
                    EMI
                  </div>
                  <strong style={{ fontSize: "15px", color: "#111827" }}>
                    {item.fields?.emi ? "₹" + item.fields.emi : "N/A"}
                  </strong>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <Link
                  to={`/results/${item._id}`}
                  className="glass-button w-full text-center"
                  style={{
                    flex: 1,
                    textDecoration: "none",
                    fontWeight: "600",
                  }}
                >
                  🔍 View Details
                </Link>
                <button
                  onClick={() => handleDelete(item._id)}
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "#fef2f2",
                    color: "#dc2626",
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "background-color 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#fee2e2";
                    e.target.style.borderColor = "#fca5a5";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#fef2f2";
                    e.target.style.borderColor = "#fecaca";
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {filteredResults.length > 0 && (
            <div className="glass-card border-none"
              style={{
                marginTop: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
              }}
            >
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={currentPage === 1 ? "opacity-50 cursor-not-allowed text-gray-500" : "glass-button"}
                style={{
                  padding: "10px 20px",
                  fontSize: "14px",
                }}
              >
                ← Previous
              </button>
              <span style={{ color: "#6b7280", fontSize: "14px" }}>
                Page <strong style={{ color: "#111827" }}>{currentPage}</strong>{" "}
                of <strong style={{ color: "#111827" }}>{totalPages}</strong>
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className={currentPage === totalPages ? "opacity-50 cursor-not-allowed text-gray-500" : "glass-button"}
                style={{
                  padding: "10px 20px",
                  fontSize: "14px",
                }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default HistoryPage;
