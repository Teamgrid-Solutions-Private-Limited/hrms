const workTypeRequestSchema = new Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: 'employee', required: true },
    currentWorkType: { type: String, required: true },
    newWorkType: { type: String, required: true },
    requestDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    managerComments: String,
    hrComments: String
});

// Create the WorkTypeRequest Model
const WorkTypeRequest = mongoose.model('workTypeRequest', workTypeRequestSchema);

module.exports = WorkTypeRequest;