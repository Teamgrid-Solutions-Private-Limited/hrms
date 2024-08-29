const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    documentType: { type: String, required: true },
    documentUrl: { type: String, required: true },
    expirationDate: { type: Date },
  },
  { timestamps: true }
);
const documents = mongoose.model("documents", documentSchema);
module.exports = documents;
