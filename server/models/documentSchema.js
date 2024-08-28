const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  documentType: { type: String, required: true },
  documentUrl: { type: String, required: true },
  expirationDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const documents = mongoose.model("documents", documentSchema);
module.exports = documents;
