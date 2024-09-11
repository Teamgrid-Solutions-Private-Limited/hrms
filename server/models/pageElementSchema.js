const mongoose = require("mongoose");
const { Schema } = mongoose;

const PageElementSchema = new Schema(
  {
    elementName: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    pageId: { type: Schema.Types.ObjectId, ref: "pages", required: true }, // Reference to the Pages collection
  },
  { timestamps: true }
);

module.exports = mongoose.model("pageelements", PageElementSchema);
