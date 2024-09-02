const mongoose = require("mongoose");
const { Schema } = mongoose;

const PagesSchema = new Schema({
  pageName: { type: String, required: true },
  url: { type: String, required: true },
  pageGroupId: {
    type: Schema.Types.ObjectId,
    ref: "PageGroup",
    required: true,
  }, // Reference to PageGroup
  icon: { type: String },
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
  accessRoles: [{ type: Schema.Types.ObjectId, ref: "Role" }], // Array of Role references
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("pages", PagesSchema);
