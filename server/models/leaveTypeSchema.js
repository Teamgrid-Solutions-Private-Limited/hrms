const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 
const leaveTypeSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  accrualPolicy: { type: String, required: true } // Description of accrual rules
});

 
const LeaveType = mongoose.model('leaveType', leaveTypeSchema);

module.exports = LeaveType;