const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shiftRequestSchema = new Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    currentRequestType: { type: String, required: true },
    newRequestType: {
        type: String,
        enum: ['regular', 'day', 'night'],
        default: 'regular',
        required: true
    },
    requestDate: { type: Date, default: Date.now },
    requestTillDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    description: { type: String, required: true },
    managerComments: String,
    hrComments: String
});

// Create the ShiftRequest Model
const ShiftRequest = mongoose.model('shiftRequest', shiftRequestSchema);

module.exports = ShiftRequest;


const model = mongoose.model("shift", shiftRequestSchema);

module.exports = model;