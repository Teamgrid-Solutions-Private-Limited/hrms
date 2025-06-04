const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orgDocumentSchema = new Schema({
  title: { type: String, required: true },               // Document title
  description: { type: String },                         // Optional description
  filePath: { type: String, required: true },            // File path
  categoryId: { type: Schema.Types.ObjectId, ref: "documentcategories" }, // Category
  uploadedBy: { type: Schema.Types.ObjectId, ref: "users", required: true }, // Uploader
  organizationId: { type: Schema.Types.ObjectId, ref: "organizations", required: true }, // Org of uploader

  recipients: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "users" },
      status: {
        type: String,
        enum: ["pending", "viewed", "acknowledged"],
        default: "pending",
      },
    },
  ],
  isTemplate: { type: Boolean, default: false },         // Optional template flag
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("orgdocuments", orgDocumentSchema);
