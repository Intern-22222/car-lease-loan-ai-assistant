import React, { useState } from 'react';

const PricePredictor = () => {
  const [vin, setVin] = useState('');
  const [mileage, setMileage] = useState(12000);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    if (!vin) {
      alert("Please enter a VIN Number");
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch("http://localhost:8000/predict-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vin, mileage: parseInt(mileage) }),
      });

      const data = await response.json();

      if (data.success) {
        setPrediction(data);
      } else {
        setError(data.error || "Failed to get prediction.");
      }
    } catch (err) {
      setError("Server error. Is the backend running?");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '32px', color: '#333' }}>🔮 AI Price Predictor</h2>
        <p style={{ color: '#666' }}>Enter a VIN to get a real-time market valuation.</p>
      </div>

      {/* Input Section */}
      <div style={styles.inputCard}>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'flex-end' }}>
          
          <div>
            <label style={styles.label}>VIN Number</label>
            <input 
              type="text" 
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              placeholder="e.g. 4T1B11HK4KU..." 
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.label}>Mileage (Approx)</label>
            <input 
              type="number" 
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              style={styles.input}
            />
          </div>

          <button onClick={handlePredict} style={styles.button} disabled={loading}>
            {loading ? "Analyzing..." : "Get Price"}
          </button>
        </div>
        
        {error && <p style={{ color: 'red', marginTop: '15px', textAlign: 'center' }}>❌ {error}</p>}
      </div>

      {/* Results Section */}
      {prediction && (
        <div style={styles.resultContainer}>
          
          {/* Main Price Card */}
          <div style={styles.priceCard}>
            <h3 style={{ margin: 0, color: '#555' }}>Estimated Market Value</h3>
            <h1 style={{ fontSize: '48px', color: '#28a745', margin: '10px 0' }}>
              ${prediction.market_value.price?.toLocaleString()}
            </h1>
            <p style={{ color: '#888' }}>Confidence Range: ${prediction.market_value.fair_price_range?.low.toLocaleString()} - ${prediction.market_value.fair_price_range?.high.toLocaleString()}</p>
          </div>

          {/* Details Grid */}
          <div style={styles.detailsGrid}>
            <div style={styles.detailBox}>
              <strong>Vehicle:</strong> {prediction.vehicle_details.year} {prediction.vehicle_details.make} {prediction.vehicle_details.model}
            </div>
            <div style={styles.detailBox}>
              <strong>Engine:</strong> {prediction.engine_specs.cylinders} Cyl / {prediction.engine_specs.horsepower} HP
            </div>
            <div style={styles.detailBox}>
              <strong>Transmission:</strong> {prediction.drivetrain.transmission}
            </div>
            <div style={styles.detailBox}>
              <strong>Fuel Type:</strong> {prediction.engine_specs.fuel_type}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

const styles = {
  inputCard: {
    backgroundColor: 'white', padding: '30px', borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '30px'
  },
  label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' },
  input: {
    padding: '12px', borderRadius: '8px', border: '1px solid #ddd',
    fontSize: '16px', width: '250px'
  },
  button: {
    padding: '12px 30px', backgroundColor: '#007bff', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold',
    cursor: 'pointer', height: '45px'
  },
  resultContainer: { animation: 'fadeIn 0.5s ease-in' },
  priceCard: {
    textAlign: 'center', padding: '40px', backgroundColor: 'white',
    borderRadius: '15px', boxShadow: '0 10px 30px rgba(40, 167, 69, 0.2)',
    border: '2px solid #28a745', marginBottom: '30px'
  },
  detailsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  detailBox: {
    backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px',
    textAlign: 'center', fontSize: '16px', color: '#333'
  }
};

export default PricePredictor;