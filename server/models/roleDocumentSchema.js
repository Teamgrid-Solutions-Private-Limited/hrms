const mongoose = require("mongoose");
const { Schema } = mongoose;

const roleDocumentSchema = new mongoose.Schema({
 title: { type: String, required: true }, // Document title
  description: { type: String }, // Optional description
  filePath: { type: String, required: true }, // File path
  categoryId: { type: Schema.Types.ObjectId, ref: "documentcategories" }, // Document category (Public, Private)
  uploadedBy: { type: Schema.Types.ObjectId, ref: "users" }, // Who uploaded the document
  recipients: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "users" },
      status: {
        type: String,
        enum: ["pending", "viewed", "acknowledged"],
        default: "pending",
      },
    },
  ], // Track recipients and their acknowledgment status
  isTemplate: { type: Boolean, default: false }, // If this document is a template
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("RoleDocuments", roleDocumentSchema);
