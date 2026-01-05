// Core imports
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Route + Middleware imports
const healthRoutes = require("./src/routes/health.routes");
const uploadRoutes = require("./src/routes/upload.route");
const errorHandler = require("./src/middlewares/error.middleware");
const testHandler = require("./src/routes/ocr.routes");
const resultRoute = require("./src/routes/result.routes");
// Utilities
const logger = require("./src/utils/logger");
const dotenv = require("dotenv").config();
const connectToDB = require("./src/config/db");

// Express app
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

async function gracefulShutdown() {
  logger.warn("Starting graceful shutdown...");

  // Close Mongo connection if active
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed.");
  }

  // Close HTTP server
  if (global.server) {
    global.server.close(() => {
      logger.info("HTTP server closed. Exiting...");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}


//Global crash handlers
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  gracefulShutdown();
});

process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
  gracefulShutdown();
});

//routes
app.get("/", (req, res) => {
  res.send("Backend API is running");
});

app.use("/api", healthRoutes);
app.use("/api", uploadRoutes);
app.use("/api", testHandler);
app.use("/api",resultRoute);
// Global error middleware
app.use(errorHandler);



async function startServer() {
  try {
    await connectToDB();
    logger.info("Database connected. Starting HTTP server...");

    // Start HTTP server only AFTER DB is ok
    global.server = app.listen(PORT);
    logger.info(`Server running on port http://localhost:${PORT}`);

  } catch (err) {
    logger.error(`Startup failed: ${err.message}`);
    process.exit(1); // Fail fast → Docker restarts container
  }
}

startServer();

//signal handlers
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
