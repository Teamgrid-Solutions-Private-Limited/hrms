const leaveAssignSchema = new Schema({
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    leaveType: { type: Schema.Types.ObjectId, ref: 'LeaveType', required: true },
    allocatedLeaves: { type: Number, required: true },
 
     
     
  });
  
  const LeaveAssign = mongoose.model('LeaveAssign', leaveAssignSchema);
  
  module.exports = LeaveAssign;
  