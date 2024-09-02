const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProfessionalInfoSchema = new Schema(
  {
    userProfileId: {
      type: Schema.Types.ObjectId,
      ref: "UserProfile",
      required: true,
    },
    professionalSummary: { type: String },
    skills: [{ type: String }],
    certifications: [{ type: String }],
    education: [
      {
        institution: { type: String },
        degree: { type: String },
        year: { type: Number },
      },
    ], // Array of educational qualifications
    previousExperience: [
      {
        role: { type: String }, // Role at the company
        duration: { type: String }, // Duration of employment
      },
    ], // Array of previous job experiences
    linkedinProfile: { type: String },
    githubProfile: { type: String },
    languages: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("professionalinfo", ProfessionalInfoSchema);
