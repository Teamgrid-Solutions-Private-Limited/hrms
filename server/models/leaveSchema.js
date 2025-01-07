const mongoose = require("mongoose");
const leaveSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  leaveTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "leave_types",
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  leaveDuration: {
    type: String,
    enum: ["half_day", "full_day", "multiple_days"],
    default: "full_day", // Default to a full-day leave
  },
  leaveUnits: {
    type: Number, // Calculated as 0.5 (half-day), 1 (full-day), or more for multiple days
    required: true,
    default: 1, // Default to 1 day if not specified
  },
  half:{
    type:String,
    enum: ["first_half","second_half"],
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "allocated", "cancelled"],
    default: "pending",
  },

  managerComments: { type: String },
  hrComments: { type: String },
  reason: { type: String },
  supportingDocuments: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("leaves", leaveSchema);
