const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaveAssignSchema = new Schema({
    employee: { type: Schema.Types.ObjectId, ref: 'employee', required: true },
    leaveType: { type: Schema.Types.ObjectId, ref: 'leaveType', required: true },
    allocatedLeaves: { type: Number, required: true },
    carryForwardDays: { type: Number, default: 0 },
 
     
     
  });
  
  const LeaveAssign = mongoose.model('leaveAssign', leaveAssignSchema);
  
  module.exports = LeaveAssign;
  