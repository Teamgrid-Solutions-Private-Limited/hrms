const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

// Nested schemas
const AddressSchema = new Schema({
  addressLine: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  zipCode: { type: String, required: true },
});

const EmergencyContactSchema = new Schema({
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  priority: { type: Number, default: 1, required: true },
  phone: { type: String, required: true },
});

const DocumentSchema = new Schema({
  documentType: { type: String, required: true },
  documentUrl: { type: String, required: true },
  expirationDate: { type: Date },
});

// Main employee schema
const employeeSchema = new Schema(
  {
    // Personal Information
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    nationality: { type: String, required: true },
    maritalStatus: {
      type: String,
      enum: ["single", "married", "divorced", "widowed"],
      required: true,
    },
    qualification: { type: String, required: true },
    adharId: { type: String, required: true },
    address: { type: AddressSchema, required: true },

    // Bank Information
    bank: { type: String, required: true },
    accountDetails: { type: String, required: true },
    branch: { type: String, required: true },
    ifsc: { type: String, required: true },
    bankAddress: { type: AddressSchema, required: true },

    // Employment Details
    department: { type: String, required: true },
    jobPosition: { type: String, required: true },
    jobRole: { type: String, required: true },
    shiftInformation: { type: String },
    workType: {
      type: String,
      enum: ["full-time", "part-time"],
      required: true,
    },
    employeeType: { type: String, required: true },
    companyType: { type: String, required: true },
    workLocation: { type: String },
    joiningDate: { type: Date, required: true },
    contractEndDate: { type: Date },
    baseSalary: { type: Number, required: true },

   

    // Emergency Contacts
    emergencyContacts: { type: [EmergencyContactSchema], required: true },

    // Documents
    documents: { type: [DocumentSchema], required: true },

    // Authentication Details
    username: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    lastLogin: { type: Date, index: { sparse: true } },

    // Organization Reference
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },

    // Metadata
    status: {
      type: String,
      enum: ["active", "inactive", "terminated"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Indexes
employeeSchema.index({ email: 1 });
employeeSchema.index({ username: 1 });

// Virtuals
employeeSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Methods
employeeSchema.methods.getPublicProfile = function () {
  const { firstName, lastName, email, department, jobPosition, workLocation } =
    this;
  return { firstName, lastName, email, department, jobPosition, workLocation };
};

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

employeeSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
console.log("Employee schema is ready to use");
