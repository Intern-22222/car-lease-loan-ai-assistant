import React, { useState } from "react";

const ManualVinLookup = () => {
  const [vin, setVin] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!vin || vin.length !== 17)
      return setError("Enter a valid 17-char VIN.");
    setLoading(true);
    setError("");
    setVehicleDetails(null);

    try {
      // Ensure backend index.js has: app.use("/api/v1/vin", vinRoutes);
      const response = await fetch("http://localhost:3000/api/v1/vin/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vin }),
      });
      const data = await response.json();
      if (data.vehicleDetails) setVehicleDetails(data.vehicleDetails);
      else setError("Could not decode VIN.");
    } catch (err) {
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-6 border border-gray-100 mt-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        🔍 Manual VIN Check
      </h3>
      <div className="flex gap-3">
        <input
          value={vin}
          onChange={(e) => setVin(e.target.value.toUpperCase())}
          placeholder="Enter VIN..."
          className="flex-1 border p-2 rounded"
          maxLength={17}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {vehicleDetails && (
        <div className="mt-4 p-4 bg-indigo-50 rounded border border-indigo-100">
          <p>
            <strong>Make:</strong> {vehicleDetails.make}
          </p>
          <p>
            <strong>Model:</strong> {vehicleDetails.model}
          </p>
          <p>
            <strong>Year:</strong> {vehicleDetails.year}
          </p>
        </div>
      )}
    </div>
  );
};

export default ManualVinLookup;
