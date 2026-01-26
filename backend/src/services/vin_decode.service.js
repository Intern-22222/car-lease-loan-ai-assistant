const axios = require("axios");

const decodeVin = async (vin) => {
  if (!vin || typeof vin !== "string") {
    return null;
  }

  try {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`;

    const response = await axios.get(url);
    const results = response.data?.Results || [];

    const getValue = (key) =>
      results.find((r) => r.Variable === key)?.Value || null;

    return {
      year: getValue("Model Year"),
      make: getValue("Make"),
      model: getValue("Model"),
      trim: getValue("Trim"),
      bodyClass: getValue("Body Class"),
    };
  } catch (error) {
    console.error("VIN decode failed:", error.message);
    return null;
  }
};

module.exports = { decodeVin };
