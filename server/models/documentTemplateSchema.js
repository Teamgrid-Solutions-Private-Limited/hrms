const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const documentTemplateSchema = new Schema({
  name: { type: String, required: true }, // Template name
  description: { type: String }, // Description of the template
  filePath: { type: String, required: true }, // Path to the template file
  createdBy: { type: Schema.Types.ObjectId, ref: "users" }, // HR/Admin who created the template
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("documenttemplates", documentTemplateSchema);
