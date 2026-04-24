
const express = require("express");
const router = express.Router();
const { Resend } = require("resend");
const OcrResult = require("../models/OcrResult");
const { generateNegotiationEmail } = require("../services/ai.service");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/generate", async (req, res) => {
  try {
  
    const { resultId, contractId, recipientName, userName } = req.body;
    const idToUse = resultId || contractId;

    const contract = await OcrResult.findById(idToUse);

    if (!contract) {
      return res
        .status(404)
        .json({ success: false, message: "Contract not found" });
    }

    const draft = await generateNegotiationEmail(
      contract,
      recipientName || "Dealer",
      userName || "Buyer",
    );

    res.json({ success: true, draft });
  } catch (error) {
    console.error("Email Gen Route Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


router.post("/send", async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    if (!process.env.RESEND_API_KEY) {
      console.log("⚠️ No RESEND_API_KEY. Mocking send.");
      console.log(`To: ${to}, Subject: ${subject}`);
      return res.json({
        success: true,
        message: "Email simulation successful",
      });
    }

    
    const { data, error } = await resend.emails.send({
      from: 'AutoLoan AI <onboarding@resend.dev>', // Resend's free testing domain
      to: [to],
      subject: subject,
      text: body,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }

    res.json({ success: true, message: "Email sent successfully!", data });
  } catch (error) {
    console.error("Email Send Server Error:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
});

module.exports = router;