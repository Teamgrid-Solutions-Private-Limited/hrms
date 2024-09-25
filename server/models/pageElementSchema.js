const mongoose = require("mongoose");
 

const pageElementSchema = new mongoose.Schema({
  pageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "pages",
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ["input", "button", "text"], // Restricting types to specific options
  },
 
  disabledForRoles: [{
    type: String,
    enum: ["admin", "hr", "employee", "manager"], 
  }],
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }
}, { timestamps: true });

const PageElement = mongoose.model("pageelements", pageElementSchema);
module.exports = PageElement;
