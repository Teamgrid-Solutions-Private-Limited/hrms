// models/documentModel.js
const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User ID is required"],
    },
    documentType: {
      type: String,
      enum: ["ID", "adhaar", "Passport", "Certificate", "Contract", "Other"],
      required: [true, "Document type is required"],
    },
    documentUrl: {
      type: String,
      required: [true, "Document URL is required"],
    },
    expirationDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "expired", "revoked"],
      default: "active",
    },
    uploaderName: {
      type: String,
      required: [true, "Uploader name is required"],
    },
    notes: {
      type: String,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
      default: "",
    },
    metadata: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model("documents", documentSchema);

module.exports = Document;
