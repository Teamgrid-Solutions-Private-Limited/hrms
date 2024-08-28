const mongoose = require("mongoose");

const personalInfoSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  photo: { type: String },
  adharId: { type: String },
  maritalStatus: {
    type: String,
    enum: ["Single", "Married", "Divorced", "Widowed"],
    required: true,
  },
  nationality: { type: String, required: true },
  dob: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("personal_info", personalInfoSchema);
