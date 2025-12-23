const express = require("express");
const cors = require("cors");
const app = express();
// const healthRoutes = require("./src/routes/health.routes");

const uploadRoutes = require("./src/routes/upload.route");

const errorHandler = require("./src/middlewares/error.middleware");
app.use(cors());
app.use(express.json());
const dotenv = require("dotenv").config();
const connectToDB = require("./src/config/db");
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Backend API is running");
});

// app.use("/api", healthRoutes);
app.use("/api",uploadRoutes);
app.use(errorHandler);

connectToDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
