const mongoose = require("mongoose");

const rotatingShiftAssignSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  currentShiftType: { type: String, required: true },
  newShiftType: { type: String, required: true },
  changeDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  rotatingShiftType: { type: Boolean, default: false },
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
  "rotating_shift_assigns",
  rotatingShiftAssignSchema
);
