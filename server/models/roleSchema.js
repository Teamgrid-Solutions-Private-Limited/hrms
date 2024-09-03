const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["super_admin", "admin", "hr", "employee"], // Enum-like validation
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const role = mongoose.model("roles", roleSchema);

module.exports = role;
