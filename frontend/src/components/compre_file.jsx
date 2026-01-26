
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function CompareContracts() {
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

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
      const res = await fetch(
        "http://localhost:8000/compare-from-files",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Failed to compare contracts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

        {/* Sidebar */}
        <Sidebar />

        {/* Main */}
        <div className="flex-1">
          {/* Header */}
          <header className="flex justify-between items-center px-8 py-4 bg-white dark:bg-gray-800 shadow">
            <h1 className="text-xl font-bold">
              Contract Fairness Comparator
            </h1>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </header>

          {/* Content */}
          <main className="p-10">
            {/* Upload Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 max-w-4xl mx-auto">

              <h2 className="text-2xl font-bold mb-8 text-center">
                📄 Compare Two Contracts
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col gap-2">
                  <label className="font-medium">Contract A</label>
                  <input
                    type="file"
                    onChange={(e) => setFileA(e.target.files[0])}
                    className="border dark:border-gray-600 p-3 rounded-lg dark:bg-gray-700"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-medium">Contract B</label>
                  <input
                    type="file"
                    onChange={(e) => setFileB(e.target.files[0])}
                    className="border dark:border-gray-600 p-3 rounded-lg dark:bg-gray-700"
                  />
                </div>
              </div>

              <button
                onClick={handleCompare}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Compare Contracts"}
              </button>

              {error && (
                <p className="mt-4 text-red-500 text-center font-medium">
                  {error}
                </p>
              )}
            </div>

            {/* Results */}
            {result && (
              <div className="max-w-5xl mx-auto mt-12">

                <h2 className="text-2xl font-bold text-center mb-6">
                  🏆 Winner:{" "}
                  <span className="text-green-600">
                    {result.comparison.winner}
                  </span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

                <div className="text-center">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="mt-8 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                  >
                    ← Back to Dashboard
                  </button>
                </div>

              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Result Card ---------------- */
function ResultCard({ title, data, score }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="mb-4 font-semibold">
        Fairness Score: {score}/10
      </p>

      <ul className="space-y-1 text-sm">
        <li>APR: {data.apr ?? "N/A"}</li>
        <li>Termination Fee: {data.termination_fee ?? "N/A"}</li>
        <li>Mileage Limit: {data.mileage_limit ?? "N/A"}</li>
        <li>Price: {data.price ?? "N/A"}</li>
      </ul>
    </div>
  );
}
