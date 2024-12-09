const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Document Submission Schema
const documentSubmissionSchema = new Schema({
  documentRequestId: {
    type: Schema.Types.ObjectId,
    ref: "documentrequests",
    required: true,
  }, // Associated document request
  submittedBy: { type: Schema.Types.ObjectId, ref: "users", required: true }, // Employee who submits
  filePath: { type: String, required: true }, // Path to the uploaded document
  status: {
    type: String,
    enum: ["pending", "reviewed", "approved", "rejected"],
    default: "pending", // Status of the submission
  },
  feedback: { type: String }, // Optional feedback for rejection/approval
  reviewedAt: { type: Date }, // When the submission was reviewed
  reviewedBy: { type: Schema.Types.ObjectId, ref: "users" }, // HR/Admin who reviewed
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  "documentsubmissions",
  documentSubmissionSchema
);
