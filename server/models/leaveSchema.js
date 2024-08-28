const mongoose = require("mongoose");
const leaveSchema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  leaveTypeId: {
    type: Schema.Types.ObjectId,
    ref: "leave_types",
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "allocated", "cancelled"],
    default: "pending",
  },
  allocatedLeaves: { type: Number },
  carryForwardDays: { type: Number, default: 0 },
  additionalDaysRequested: { type: Number },
  approvalLevel: { type: Number, default: 1 },
  managerComments: { type: String },
  hrComments: { type: String },
  reason: { type: String },
  supportingDocuments: { type: String },
});

module.exports = mongoose.model("leaves", leaveSchema);
