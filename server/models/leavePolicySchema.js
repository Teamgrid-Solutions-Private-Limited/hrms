const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leavePolicySchema = new Schema({
    leaveType: { type: Schema.Types.ObjectId, ref: 'leaveType', required: true },
    accrualRate: Number, // Rate at which leave accrues (e.g., per month)
    maxBalance: Number, // Maximum leave balance allowed
    carryForward: { type: Boolean, default: false }, // Allow carry forward of unused leave
    carryForwardLimit: Number // Limit on carry forward days
  });
  
  // Create the Leave Policy Model
  const LeavePolicy = mongoose.model('leavePolicy', leavePolicySchema);
  
  module.exports = LeavePolicy;