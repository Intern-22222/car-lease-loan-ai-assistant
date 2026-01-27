// // Core imports
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");

// // Route + Middleware imports
// const healthRoutes = require("./src/routes/health.routes");
// const uploadRoutes = require("./src/routes/upload.route");
// const errorHandler = require("./src/middlewares/error.middleware");
// const testHandler = require("./src/routes/ocr.routes");
// const resultRoute = require("./src/routes/result.routes");
// const vinRoutes = require("./src/routes/vin.routes");
// const comparisonRoute = require("./src/routes/comparison.route");
// const historyRoute = require("./src/routes/history.route");
// const emailRoute = require("./src/routes/email.route");
// const chatRoute = require("./src/routes/chat.route");
// const authRoute = require("./src/routes/auth.routes");
// // Utilities
// const logger = require("./src/utils/logger");
// const dotenv = require("dotenv").config();
// const connectToDB = require("./src/config/db");

// // Express app
// const app = express();
// app.use(cors());
// app.use(express.json());

// const PORT = process.env.PORT || 3000;

// async function gracefulShutdown() {
//   logger.warn("Starting graceful shutdown...");

//   // Close Mongo connection if active
//   if (mongoose.connection.readyState === 1) {
//     await mongoose.connection.close();
//     logger.info("MongoDB connection closed.");
//   }

//   // Close HTTP server
//   if (global.server) {
//     global.server.close(() => {
//       logger.info("HTTP server closed. Exiting...");
//       process.exit(0);
//     });
//   } else {
//     process.exit(0);
//   }
// }

// //Global crash handlers
// process.on("uncaughtException", (err) => {
//   logger.error(`Uncaught Exception: ${err.message}`);
//   gracefulShutdown();
// });

// process.on("unhandledRejection", (reason) => {
//   logger.error(`Unhandled Rejection: ${reason}`);
//   gracefulShutdown();
// });

// //routes
// app.get("/", (req, res) => {
//   res.send("Backend API is running");
// });

// app.get("/health", (req, res) => {
//   res.json({ status: "ok" });
// });

// app.use("/api", healthRoutes);
// app.use("/api/upload", uploadRoutes);
// app.use("/api", testHandler);
// app.use("/api", resultRoute);
// app.use("/api/v1/vin",vinRoutes);
// app.use("/api/comparison",comparisonRoute);
// app.use("/api/history",historyRoute);
// app.use("/api/email",emailRoute);
// app.use("/api/chat",chatRoute);
// app.use("/api/auth",authRoute);

// // Global error middleware
// app.use(errorHandler);

// async function startServer() {
//   try {
//     await connectToDB();
//     logger.info("Database connected. Starting HTTP server...");

//     // Start HTTP server only AFTER DB is ok
//     global.server = app.listen(PORT);
//     logger.info(`Server running on port http://localhost:${PORT}`);
//   } catch (err) {
//     logger.error(`Startup failed: ${err.message}`);
//     process.exit(1); // Fail fast → Docker restarts container
//   }
// }

// startServer();

// //signal handlers
// process.on("SIGTERM", gracefulShutdown);
// process.on("SIGINT", gracefulShutdown);

// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// require("dotenv").config();

// // 👇 IMPORT ONLY THE UPLOAD ROUTE
// const uploadRoutes = require("./src/routes/upload.route");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Debug Log: Check if the route is actually loading
// console.log("Loading Upload Route:", typeof uploadRoutes);
// // Should print: "Loading Upload Route: function"

// // 👇 MOUNT ONLY THE UPLOAD ROUTE
// app.use("/api/upload", uploadRoutes);

// const PORT = process.env.PORT || 3000;

// // Database Connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB Connected");
//     app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//   })
//   .catch((err) => console.log("❌ DB Error:", err));

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Route Imports
const uploadRoutes = require("./src/routes/upload.route");
const chatRoute = require("./src/routes/chat.route");
const comparisonRoute = require("./src/routes/comparison.route");
const emailRoute = require("./src/routes/email.route");
const historyRoute = require("./src/routes/history.route");
const resultRoute = require("./src/routes/result.routes");
const authRoute = require("./src/routes/auth.routes");
const healthRoutes = require("./src/routes/health.routes");
const vinRoutes = require("./src/routes/vin.routes"); // Assuming this exists

// Middleware
const errorHandler = require("./src/middlewares/error.middleware");
const logger = require("./src/utils/logger");
const connectToDB = require("./src/config/db");

const app = express();
app.use(cors());
app.use(express.json());

// Mount Routes
app.use("/api/health", healthRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoute);
app.use("/api/comparison", comparisonRoute);
app.use("/api/email", emailRoute);
app.use("/api/history", historyRoute);
app.use("/api", resultRoute); // Usually mounted at root /api for /api/results/:id
app.use("/api/auth", authRoute);
app.use("/api/v1/vin", vinRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectToDB();
    logger.info("✅ Database connected.");
    app.listen(PORT, () => logger.info(`🚀 Server running on  http://localhost:${PORT}`));
  } catch (err) {
    logger.error(`Startup failed: ${err.message}`);
    process.exit(1);
  }
}

startServer();