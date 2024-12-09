const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const documentCategorySchema = new Schema({
  name: { type: String, required: true, unique: true }, // Category name (e.g., Public, Private)
  description: { type: String }, // Optional description
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("documentcategories", documentCategorySchema);
