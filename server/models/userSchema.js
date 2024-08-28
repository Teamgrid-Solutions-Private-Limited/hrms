const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["super_admin", "admin", "hr", "employee"],
    required: true,
  },
  last_login: { type: Date },
  status: {
    type: String,
    enum: ["active", "inactive", "terminated"],
    default: "active",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("users", userSchema);
