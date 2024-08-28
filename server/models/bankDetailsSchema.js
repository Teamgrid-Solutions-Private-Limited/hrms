const mongoose = require("mongoose");

const bankDetailsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  branch: { type: String, required: true },
  ifsc: { type: String, required: true },
  bankAddressLine: { type: String, required: true },
  bankCity: { type: String, required: true },
  bankState: { type: String, required: true },
  bankCountry: { type: String, required: true },
  bankZipCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("bank_details", bankDetailsSchema);
