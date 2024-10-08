// models/shiftRequestModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shiftRequestSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  currentRequestType: { type: String, required: true },
  newRequestType: {
    type: String,
    enum: ["regular", "day", "night"],
    default: "regular",
    required: true,
  },
  requestDate: { type: Date, default: Date.now },
  requestTillDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  description: { type: String, required: true },
  managerComments: String,
  hrComments: String,
});

const ShiftRequest = mongoose.model("shiftRequests", shiftRequestSchema);

module.exports = ShiftRequest;
