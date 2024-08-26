const mongoose = require("mongoose");

const shiftRequestSchema = new mongoose.schema({
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'employee',
        required: true,
    },
    currentShift: String,
    requestedShift: String,
    requestDate: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected']
    }

});

const model = mongoose.model("shift", shiftRequestSchema);

module.exports = model;