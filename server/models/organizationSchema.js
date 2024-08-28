const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  addressLine: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  zipCode: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("organizations", organizationSchema);
