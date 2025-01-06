const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaveTypeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  accrualPolicy: { type: String }, // Description of accrual rules
  supportsHalfDay: { type: Boolean, default: true }, // New field
});

const LeaveType = mongoose.model("leave_types", leaveTypeSchema);

module.exports = LeaveType;
