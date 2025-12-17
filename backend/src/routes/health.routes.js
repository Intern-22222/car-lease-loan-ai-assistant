const express = require("express");
const router = express.Router();
const {healthCheck} = require("../controllers/health.controller")

// router.get("/health",(req,res)=>{
//     res.status(200).json({
//       status: "OK",
//       message: "Backend is healthy",
//     });
// })

router.get("/health",healthCheck);



module.exports = router;