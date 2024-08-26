const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaveAllocationSchema = new Schema({
    employee: { type: Schema.Types.ObjectId, ref: 'employee', required: true },
    leaveType: { type: Schema.Types.ObjectId, ref: 'leaveType', required: true },
    additionalDaysRequested: { type: Number, required: true },
    reason: String,
    supportingDocuments: [String], // Array of URLs or file paths
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    managerComments: String,
    hrComments: String
  });
  
  // Create the Leave Allocation Request Model
  const LeaveAllocationRequest = mongoose.model('leaveAllocation', leaveAllocationSchema);
  
  module.exports = LeaveAllocationRequest;