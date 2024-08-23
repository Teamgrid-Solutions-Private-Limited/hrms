const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  personalInfo: {
    photo: String,
    adharId: { type: String, required: true },
    maritalStatus: {
      type: String,
      enum: ["single", "married", "divorced", "widowed"],
      required: true,
    },
    nationality: { type: String, required: true },
  },
  employmentDetails: {
    contractType: {
      type: String,
      enum: ["fixed-term", "permanent"],
      required: true,
    },
    probationPeriod: { type: Date },
    status: { type: String, enum: ["full-time", "part-time"], required: true },
  },
  professionalBackground: [
    {
      certification: String,
      license: String,
      trainingCourse: String,
      expiryDate: Date,
    },
  ],
  emergencyContacts: [
    {
      name: String,
      relationship: String,
      priority: Number,
      phone: String,
    },
  ],
  documents: [
    {
      documentType: String,
      documentUrl: String,
      expirationDate: Date,
    },
  ],

  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  lastLogin: Date,

  organization: { type: Schema.Types.ObjectId, ref: "Organization" },
});

// Hash the password before saving the employee document
employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

employeeSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password); // Compare provided password with stored hash
  } catch (error) {
    throw error;
  }
};

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
console.log("employee schema is ready to use");
