const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "Users", required: true }, // Reference to the Users collection
  firstName: { type: String, required: true }, // First name of the user
  lastName: { type: String, required: true }, // Last name of the user
  dob: { type: Date, required: true }, // Date of birth
  contactNumber: { type: String, required: true }, // Contact number
  createdAt: { type: Date, default: Date.now }, // Timestamp for creation
  updatedAt: { type: Date, default: Date.now }, // Timestamp for the last update
});

module.exports = mongoose.model("userprofile", UserProfileSchema);
