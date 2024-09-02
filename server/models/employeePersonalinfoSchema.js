const mongoose = require("mongoose");
const { Schema } = mongoose;

const EmployeePersonalInfoSchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "userProfile",
      required: true,
    }, // Reference to UserProfile collection
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    emergencyContactName: { type: String, required: true },
    emergencyContactRelationship: { type: String, required: true },
    emergencyContactNumber: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "employeepersonalinfo",
  EmployeePersonalInfoSchema
);
