const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logo: { type: String },
    email: { type: String },
    phone: { type: String },
    description: { type: String },
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("organizations", organizationSchema);
