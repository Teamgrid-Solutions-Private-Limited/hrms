const mongoose = require("mongoose");
const { Schema } = mongoose;

const employmentInfoSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users", // Reference to the User model
      required: true,
      unique:true
    },
    employmentStatus: {
      type: String,
      enum: ["active", "inactive", "terminated", "on_leave"],
       
    },
    jobTitle: {
      type: String,
      maxlength: 255,
    },
    department: {
      type: String,
      maxlength: 255,
    },
    hireDate: {
      type: Date,
    },
    probationPeriod: {
      type: Number,
    },
    confirmationDate: {
      type: Date,
    },
    employmentType: {
      type: String,
      enum: ["full_time", "part_time", "contract", "intern"],
       
    },
    salary: {
      type: Schema.Types.Decimal128,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("employmentinfos", employmentInfoSchema);
