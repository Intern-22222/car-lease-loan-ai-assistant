const express=require("express");
const {decodeVin} = require("../services/vin_decode.service.js");

const router = express.Router();

router.post("/decode", async (req, res) => {
  const { vin } = req.body;

  if (!vin) {
    return res.status(400).json({ error: "VIN is required" });
  }

  const vehicleDetails = await decodeVin(vin);

  return res.json({
    vin,
    vehicleDetails,
  });
});

module.exports = router;
