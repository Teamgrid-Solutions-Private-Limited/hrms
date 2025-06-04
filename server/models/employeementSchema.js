const mongoose = require("mongoose");
const { Schema } = mongoose;

const employeementSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users", // Reference to the User model
      required: true,
      unique:true
    },
    employmentStatus: {
      type: String,
      enum: ["active", "inactive", "terminated", "on leave"],
       
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
    reportingmanager: {
      type: Schema.Types.ObjectId,
      ref: "users", // Reference to the User model
    },
    reportingtimeoff: {
      type: Schema.Types.ObjectId,
      ref: "users", // Reference to the TimeOffRequests model
    },
    emptype: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("employmentinfos", employeementSchema);
