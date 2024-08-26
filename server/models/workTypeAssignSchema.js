const workTypeAssignmentSchema = new Schema({
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    currentWorkType: String,
    newWorkType: String,
    changeDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
  });
  
 
  const WorkTypeAssignment = mongoose.model('workTypeAssignment', workTypeAssignmentSchema);
  
  module.exports = WorkTypeAssignment;