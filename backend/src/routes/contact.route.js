const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

   
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    const adminEmail = process.env.ADMIN_EMAIL;

    await transporter.sendMail({
      from: `"${name} (AutoLease AI)" <${process.env.EMAIL_USER}>`,
      replyTo: email, 
      to: adminEmail,
      subject: `[AutoLease AI Contact] ${subject}`,
      text: `You have received a new message from the AutoLease AI Contact Form.\n\nName: ${name}\nEmail: ${email}\nTopic: ${subject}\n\nMessage:\n${message}`,
    });

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('[ERROR] Contact Route:', error.message);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
});

module.exports = router;