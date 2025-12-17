const AppError = require("../utils/AppError");

const validateHealthRequest = (req, res, next) => {
  try {
    if (req.body && Object.keys(req.body).length > 0) {
      throw new AppError("Health check does not accept request body", 400);
    }
    next();
  } catch (error) {}
};
