const mongoose = require("mongoose");

// Define the schema
const personalInfoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    photo: { type: String },
    adharId: { type: String },
    maritalStatus: {
      type: String,
      enum: ["single", "married", "divorced", "widowed"],
      required: true,
    },
    nationality: { type: String, required: true },
    dob: { type: Date, required: true },
  },
  { timestamps: true }
);

// Create the model
const PersonalInfo = mongoose.model("personalinfo", personalInfoSchema);

module.exports = PersonalInfo;
