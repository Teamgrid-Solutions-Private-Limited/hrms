const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rotatingShiftSchema = new Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    currentShift: String,
    newShift: String,
    changeDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

    // Rotating shift fields
    rotatingShiftType: {
        type: String,
        enum: ['day', 'night'],
        default: 'day'
    },
    startDate: { type: Date },
    rotationFrequency: {
        type: String,
        enum: ['after', 'monthly', 'weekly'],
        default: 'after'
    },
    rotateAfterDays: { type: Number, min: 1 }, // Used if rotationFrequency is 'after'
    rotateAfterMonth: {
        type: Schema.Types.Mixed, // Can be a number (1-31) or 'last'
        validate: {
            validator: function(v) {
                // Accepts either a number between 1 and 31 or 'last'
                return (Number.isInteger(v) && v >= 1 && v <= 31) || v === 'last';
            },
            message: 'rotateAfterMonth must be a number between 1 and 31 or "last"'
        }
    },
    rotateAfterWeekday: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }
});

const RotatingShift = mongoose.model('rotatingShift', rotatingShiftSchema);

module.exports = RotatingShift;
