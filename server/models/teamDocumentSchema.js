const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamDocumentSchema = new Schema({
  title: { type: String, required: true },               // Document title
  description: { type: String },                         // Optional description
  filePath: { type: String, required: true },            // File path
  categoryId: { type: Schema.Types.ObjectId, ref: "documentcategories" }, // Category

  uploadedBy: { type: Schema.Types.ObjectId, ref: "users", required: true }, // Uploader user ID

  organizationId: {
    type: Schema.Types.ObjectId,
    ref: "organizations",
    required: true,
  }, // Uploader's org

  team: {
    type: String,
    required: true,
  }, // Team name to target users

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

  isTemplate: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("teamdocuments", teamDocumentSchema);
