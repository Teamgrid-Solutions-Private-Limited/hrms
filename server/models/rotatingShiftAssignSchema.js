const rotatingShiftSchema = new Schema({
    shiftName: String,
    shiftPattern: [{
        day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
        shiftType: String
    }],
    startDate: { type: Date, required: true },
    rotationFrequency: Number // In days
});

// Create the Rotating Shift Model
const RotatingShift = mongoose.model('rotatingShift', rotatingShiftSchema);

module.exports = RotatingShift;