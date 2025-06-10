const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const educationSchema = new mongoose.Schema({
  instituteName: { type: String, required: true },
  degree: { type: String, required: true },
  specialization: { type: String, required: true },
  completionDate: { type: Date, required: true },
});

const workExperienceSchema = new mongoose.Schema(
  // Define the schema for work experience
  {
    companyName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date },
    jobDescription: { type: String },
    relevant: { type: Boolean, default: false },
  }
);

const userSchema = new mongoose.Schema(
  {
    // username: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "roles",
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organizations",
      required: true,
    },
    verificationToken: { type: String },
    isVerified: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["active", "inactive", "terminated"],
      default: "active",
    },
    team: {
      type: String,
    },
    department: {
      type: String,
    },
    inviteToken: { type: String },
    educationDetails: [educationSchema], // 👈 Embedded education array
    workExperience: [workExperienceSchema], // 👈 Embedded work experience array
  },

  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("users", userSchema);
