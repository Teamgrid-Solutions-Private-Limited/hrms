const mongoose = require("mongoose");

const workTypeRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  currentWorkType: { type: String, required: true },
  newWorkType: { type: String, required: true },
  requestDate: { type: Date, default: Date.now },
  requestTillDate: { type: Date },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  description: { type: String },
  managerComments: { type: String },
  hrComments: { type: String },
});

module.exports = mongoose.model("work_type_requests", workTypeRequestSchema);
