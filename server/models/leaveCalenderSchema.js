const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaveCalendarSchema = new Schema({
    leaveRequests: [{ type: Schema.Types.ObjectId, ref: 'leaveRequest' }],
    year: { type: Number, required: true },
    month: { type: Number, required: true }
  });
  
  // Create the Leave Calendar Model
  const LeaveCalendar = mongoose.model('leaveCalendar', leaveCalendarSchema);
  
  module.exports = LeaveCalendar;