// const express = require("express");
// const router = express.Router();
// const nodemailer = require("nodemailer"); // Make sure to npm install nodemailer
// const OcrResult = require("../models/OcrResult");
// const { generateNegotiationEmail } = require("../services/ai.service");
// require("dotenv").config();
// // 1. GENERATE DRAFT
// router.post("/generate", async (req, res) => {
//   try {
//     const { contractId, recipientName, userName } = req.body;
//     const contract = await OcrResult.findById(contractId);

//     if (!contract)
//       return res
//         .status(404)
//         .json({ success: false, message: "Contract not found" });

//     const draft = await generateNegotiationEmail(
//       contract,
//       recipientName,
//       userName,
//     );

//     res.json({ success: true, draft });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // 2. SEND EMAIL
// router.post("/send", async (req, res) => {
//   try {
//     const { to, subject, body } = req.body;

//     // --- CONFIGURE YOUR EMAIL TRANSPORTER ---
//     // For a real project, use SendGrid, Gmail, etc.
//     // For this demo, we create a 'Test Account' via Ethereal if no env vars exist.

//     let transporter;

//     if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
//       // Use Real Gmail/Outlook
//       transporter = nodemailer.createTransport({
//         service: "gmail", // or 'outlook', 'hotmail'
//         auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASS,
//         },
//       });
//     } else {
//       // MOCK MODE (Logs to console)
//       console.log("⚠️ No Email Credentials found. Mocking email send.");
//       console.log(`To: ${to}`);
//       console.log(`Subject: ${subject}`);
//       console.log(`Body: \n${body}`);

//       // Return success immediately for demo purposes
//       return res.json({
//         success: true,
//         message: "Email simulation successful (Check Server Logs)",
//       });
//     }

//     await transporter.sendMail({
//       from: '"AutoLoan AI" <noreply@autoloanai.com>',
//       to: to,
//       subject: subject,
//       text: body,
//     });

//     res.json({ success: true, message: "Email sent successfully!" });
//   } catch (error) {
//     console.error("Email Send Error:", error);
//     res.status(500).json({ success: false, message: "Failed to send email." });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const OcrResult = require("../models/OcrResult");
const { generateNegotiationEmail } = require("../services/ai.service");
require("dotenv").config();

// 1. GENERATE DRAFT
router.post("/generate", async (req, res) => {
  try {
    // Frontend sends 'resultId' or 'contractId'
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

// 2. SEND EMAIL
router.post("/send", async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    let transporter;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use `true` for port 465, `false` for port 587
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      console.log("⚠️ No Email Credentials. Mocking send.");
      console.log(`To: ${to}, Subject: ${subject}`);
      return res.json({
        success: true,
        message: "Email simulation successful",
      });
    }

    await transporter.sendMail({
      from: '"AutoLoan AI" <noreply@autoloanai.com>',
      to: to,
      subject: subject,
      text: body,
    });

    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email Send Error:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
});

module.exports = router;