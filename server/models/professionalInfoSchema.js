const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProfessionalInfoSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    professionalSummary: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    skills: [{ type: String, trim: true }],
    certifications: [
      {
        name: { type: String, trim: true },
        authority: { type: String, trim: true }, // Issuing organization
        year: { type: Number }, // Year of certification
      },
    ],
    education: [
      {
        institution: { type: String, trim: true },
        degree: { type: String, trim: true },
        fieldOfStudy: { type: String, trim: true },
        startYear: { type: Number },
        endYear: { type: Number },
      },
    ], // Array of educational qualifications
    previousExperience: [
      {
        companyName: { type: String, trim: true },
        role: { type: String, trim: true },
        startDate: { type: Date },
        endDate: { type: Date },
        description: { type: String, trim: true },
      },
    ], // Array of previous job experiences
    linkedinProfile: {
      type: String,
      trim: true,
      match: [/^https?:\/\/(www\.)?linkedin\.com\/.*$/, "Invalid LinkedIn URL"], // Validating LinkedIn URL
    },
    githubProfile: {
      type: String,
      trim: true,
      match: [/^https?:\/\/(www\.)?github\.com\/.*$/, "Invalid GitHub URL"], // Validating GitHub URL
    },
    languages: [
      {
        language: { type: String, trim: true }, // Language name
        proficiency: {
          type: String,
          enum: ["Basic", "Conversational", "Fluent", "Native"], // Added proficiency level
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("professionalinfos", ProfessionalInfoSchema);
