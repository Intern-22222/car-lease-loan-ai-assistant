import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"; // npm install react-toastify if missing

const ComparisonPage = () => {
  const [history, setHistory] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  // 1. Fetch History
  useEffect(() => {
    fetch("http://localhost:3000/api/history")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          // Check for data.data (standardized)
          setHistory(data.data); // data.data is the array from history.route.js
        } else if (data.success && Array.isArray(data.history)) {
          setHistory(data.history); // Fallback if route returns 'history'
        }
      })
      .catch((err) => console.error("History fetch error:", err))
      .finally(() => setHistoryLoading(false));
  }, []);

  const toggleSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      if (selectedIds.length >= 3) {
        toast.warning("Select max 3 contracts.");
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const runComparison = async () => {
    if (selectedIds.length < 2) {
      toast.info("Select at least 2 contracts.");
      return;
    }
    setLoading(true);
    setComparisonData([]);

    try {
      // 👇 This endpoint now exists in the backend file I provided above
      const res = await fetch("http://localhost:3000/api/comparison/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      const data = await res.json();

      if (data.success) {
        setComparisonData(data.data);
        toast.success("Comparison Complete!");
      } else {
        toast.error(data.message || "Comparison failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            ⚖️ Compare Contracts
          </h1>
          <Link to="/" className="text-indigo-600 font-bold hover:underline">
            ⬅ Home
          </Link>
        </div>

        {/* SELECTION GRID */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">
            Select Contracts (Max 3)
          </h3>

          {historyLoading ? (
            <div className="text-gray-500">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No contracts found. Upload some files first!
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {history.map((rec) => (
                <div
                  key={rec._id}
                  onClick={() => toggleSelection(rec._id)}
                  className={`flex-shrink-0 w-64 p-4 rounded-lg border-2 cursor-pointer transition ${
                    selectedIds.includes(rec._id)
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-bold truncate">{rec.fileName}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(rec.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={runComparison}
            disabled={loading || selectedIds.length < 2}
            className={`mt-6 px-6 py-3 rounded-lg font-bold text-white transition ${
              loading || selectedIds.length < 2
                ? "bg-gray-400"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading
              ? "Analyzing..."
              : `Compare ${selectedIds.length} Contracts`}
          </button>
        </div>

        {/* RESULTS GRID */}
        {comparisonData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparisonData.map((contract) => (
              <div
                key={contract._id}
                className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden"
              >
                <div className="bg-gray-800 text-white p-4">
                  <h3 className="font-bold truncate">{contract.fileName}</h3>
                </div>
                <div className="p-6 space-y-4">
                  <Row
                    label="Loan Amount"
                    value={contract.fields?.loan_amount}
                  />
                  <Row
                    label="Interest Rate"
                    value={contract.fields?.interest_rate}
                    highlight
                  />
                  <Row
                    label="Monthly EMI"
                    value={contract.fields?.monthly_payment}
                  />
                  <Row label="Tenure" value={contract.fields?.tenure_months} />

                  {/* Hidden Fees */}
                  <div className="bg-red-50 p-4 rounded mt-4">
                    <h4 className="text-xs font-bold text-red-600 uppercase mb-2">
                      Hidden Fees
                    </h4>
                    {contract.hiddenFees?.fees?.length > 0 ? (
                      <ul className="text-sm space-y-1">
                        {contract.hiddenFees.fees.map((f, i) => (
                          <li key={i} className="flex justify-between">
                            <span>{f.name}</span>
                            <span className="font-bold text-red-600">
                              {f.amount || "?"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-sm text-green-600">
                        No junk fees found.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Row = ({ label, value, highlight }) => (
  <div className="flex justify-between border-b border-gray-100 pb-2">
    <span className="text-gray-500 text-sm">{label}</span>
    <span
      className={`font-bold ${highlight ? "text-indigo-600" : "text-gray-900"}`}
    >
      {value || "--"}
    </span>
  </div>
);

export default ComparisonPage;
