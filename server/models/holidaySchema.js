const mongoose = require("mongoose");

const holidaySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "organizations",
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("holidays", holidaySchema); 