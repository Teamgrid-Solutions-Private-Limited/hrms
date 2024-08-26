const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaveBalanceSchema = new Schema({
    employee: { type: Schema.Types.ObjectId, ref: 'employee', required: true },
    leaveType: { type: Schema.Types.ObjectId, ref: 'leaveType', required: true },
    balance: { type: Number, default: 0 }, // Current leave balance
    accrued: { type: Number, default: 0 }, // Total accrued leave
    used: { type: Number, default: 0 } // Total used leave
  });
  
  
  const LeaveBalance = mongoose.model('leaveBalance', leaveBalanceSchema);
  
  module.exports = LeaveBalance;