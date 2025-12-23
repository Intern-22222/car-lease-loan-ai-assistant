const express = require("express");
const router = express.Router();
const { uploadContract } = require("../controllers/upload.controller");
router.post("/upload", uploadContract);

module.exports = router;
