
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();


const uploadRoutes = require("./src/routes/upload.route");
const chatRoute = require("./src/routes/chat.route");
const comparisonRoute = require("./src/routes/comparison.route");
const emailRoute = require("./src/routes/email.route");
const historyRoute = require("./src/routes/history.route");
const resultRoute = require("./src/routes/result.routes");
const authRoute = require("./src/routes/auth.routes");
const healthRoutes = require("./src/routes/health.routes");
const vinRoutes = require("./src/routes/vin.routes"); 
const negotiateRoute = require('./src/routes/negotiate.route');
const statsRoute = require('./src/routes/stats.route');
const summarizeRoute = require('./src/routes/summarize.route'); 
const analyticsRoute = require('./src/routes/analytics.route'); 

const explainRoute = require('./src/routes/explain.route'); 
const diffRoute = require('./src/routes/diff.route'); 
const contactRoute = require("./src/routes/contact.route");

const errorHandler = require("./src/middlewares/error.middleware");
const logger = require("./src/utils/logger");
const connectToDB = require("./src/config/db");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoute);
app.use("/api/comparison", comparisonRoute);
app.use("/api/email", emailRoute);
app.use("/api/history", historyRoute);
app.use("/api", resultRoute); 
app.use("/api/auth", authRoute);
app.use("/api/v1/vin", vinRoutes);
app.use('/api/negotiate', negotiateRoute);
app.use('/api/user/stats', statsRoute);
app.use('/api/summarize', summarizeRoute);
app.use('/api/analytics', analyticsRoute); 
app.use('/api/explain', explainRoute); 
app.use('/api/diff', diffRoute); 
app.use("/api/contact",contactRoute);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectToDB();
    logger.info("✅ Database connected.");
    
    
    app.listen(PORT, "0.0.0.0", () => {
      logger.info(`🚀 Server running and listening on 0.0.0.0:${PORT}`);
    });
  } catch (err) {
    logger.error(`Startup failed: ${err.message}`);
    process.exit(1);
  }
}

startServer();