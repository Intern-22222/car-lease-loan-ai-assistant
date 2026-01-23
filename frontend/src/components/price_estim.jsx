import { useState } from "react";

import { useNavigate } from "react-router-dom";
const PriceEstimator = () => {
  const [vin, setVin] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (vin.length !== 17) {
      setError("VIN must be exactly 17 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:8000/price_estimate?vin=${vin}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to fetch price");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">VIN Price Estimator</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter 17-character VIN"
          value={vin}
          onChange={(e) => setVin(e.target.value.toUpperCase())}
          className="w-full border p-2 rounded"
          maxLength={17}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Estimating..." : "Estimate Price"}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-red-600 font-medium">{error}</p>
      )}

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <p><strong>VIN:</strong> {result.vin}</p>
          <p><strong>Make:</strong> {result.vehicle?.make}</p>
          <p><strong>Model:</strong> {result.vehicle?.model || result.vehicle?.series}</p>
          <p><strong>Year:</strong> {result.vehicle?.year}</p>

          <p className="mt-3 text-lg font-bold text-green-700">
            Market Fair Price: ${result.market_fair_price}
          </p>
        </div>
      )}

      <button
              onClick={() => navigate("/dashboard")}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Go to Dashboard
            </button>
    </div>
  );
};

export default PriceEstimator;
