const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    permissions: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.length > 0; // Ensure that the permissions array is not empty
        },
        message: "A role must have at least one permission.",
      },
    },
  },
  {
    timestamps: true,
  }
);

const role = mongoose.model("roles", roleSchema);

module.exports = role;
