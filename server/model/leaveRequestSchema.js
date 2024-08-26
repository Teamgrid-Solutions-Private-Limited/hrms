const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaveRequestSchema = new Schema({
    employee: { type: Schema.Types.ObjectId, ref: 'employee', required: true },
    leaveType: { type: Schema.Types.ObjectId, ref: 'leaveType', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    approvalLevel: { type: Number, default: 1 }, // Track approval stages
    managerComments: String,
    hrComments: String
  });
  
 
  const LeaveRequest = mongoose.model('leaveRequest', leaveRequestSchema);
  
  module.exports = LeaveRequest;