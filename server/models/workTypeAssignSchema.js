const mongoose = require("mongoose");

const workTypeAssignmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  currentWorkType: { type: String, required: true },
  newWorkType: { type: String, required: true },
  changeDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  rotatingWorkType: { type: Boolean, default: false },
  startDate: { type: Date },
  rotationFrequency: {
    type: String,
    enum: ["after", "monthly", "weekly"],
    default: "after",
  },
  rotateAfterDays: { type: Number },
  rotateAfterMonth: { type: String },
  rotateAfterWeekday: {
    type: String,
    enum: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
  },
});

module.exports = mongoose.model(
  "work_type_assignments",
  workTypeAssignmentSchema
);
