const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const documentRequest = new Schema({
  title: { type: String, required: true }, // Title of the document request
  description: { type: String, required: true }, // Detailed description
  categoryId: { type: Schema.Types.ObjectId, ref: "documentcategories" }, // New: Category for better classification
  requestedBy: { type: Schema.Types.ObjectId, ref: "users" }, // HR/Admin who requested
  employee: {
    type: Schema.Types.ObjectId,
    ref: "userprofiles",
    required: true,
  }, // Employee expected to submit
  format: { type: String, required: true }, // File format (e.g., PDF)
  maxSize: { type: Number, required: true }, // Max size in MB
  dueDate: { type: Date, required: true }, // Deadline for submission
  status: {
    type: String,
    enum: ["pending", "submitted", "approved", "rejected"],
    default: "pending", // Status of the request
  },
  templateId: { type: Schema.Types.ObjectId, ref: "documenttemplates" }, // New: Link to a template if used
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("documentrequests", documentRequest);
