const mongoose = require("mongoose");
const { Schema } = mongoose;

const PageElementSchema = new Schema(
  {
    elementName: { type: String, required: true },
    pageId: { type: Schema.Types.ObjectId, ref: "Pages", required: true }, // Reference to the Pages collection
  },
  { timestamps: true }
);

module.exports = mongoose.model("pageelement", PageElementSchema);
