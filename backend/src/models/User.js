const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Will be hashed
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);


