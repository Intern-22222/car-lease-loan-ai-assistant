const express = require("express");
const cors = require("cors");
const app = express();
const healthRoutes = require("./src/routes/health.routes");
const errorHandler = require("./src/middlewares/error.middleware");
app.use(cors());
app.use(express.json());
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Backend API is running");
});

app.use("/api",healthRoutes);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
