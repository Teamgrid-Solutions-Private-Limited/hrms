const User = require("../models/userSchema");
const UserProfile = require("../models/userProfileSchema");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const path = require("path");

const BASE_URL = process.env.BASE_URL;
UPLOAD_URL = `${BASE_URL}images/`;

console.log(BASE_URL);
console.log(UPLOAD_URL);
class EmployeeController {
  static validationRules() {
    return [
      body("username").notEmpty().withMessage("Username is required"),
      body("email").isEmail().withMessage("Valid email is required"),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
      body("roleId").isMongoId().withMessage("Valid role ID is required"),
      body("organizationId")
        .isMongoId()
        .withMessage("Valid organization ID is required"),
      body("firstName").notEmpty().withMessage("First name is required"),
      body("lastName").notEmpty().withMessage("Last name is required"),
      body("dob").isDate().withMessage("Valid date of birth is required"),
      body("contactNumber")
        .notEmpty()
        .withMessage("Contact number is required"),
    ];
  }

  static async addEmployee(req, res) {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      username,
      email,
      password,
      roleId,
      organizationId,
      firstName,
      lastName,
      dob,
      contactNumber,
    } = req.body;
    const profilePhoto = req.file ? `${UPLOAD_URL}${req.file.filename}` : null; // Get the file path from the request

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
      }

      // Create new user
      const newUser = new User({
        username,
        email,
        password, // Password will be hashed by middleware
        roleId,
        organizationId,
        profilePhoto, // Save the profile photo path
        lastLogin: new Date(),
        status: "active",
      });

      // Save user to the database
      const savedUser = await newUser.save();

      // Create user profile
      const userProfile = new UserProfile({
        userId: savedUser._id,
        firstName,
        lastName,
        dob,
        contactNumber,
      });

      // Save user profile to the database
      await userProfile.save();

      res.status(201).json({
        success: true,
        message: "Employee added successfully",
        output: userProfile,
      });
    } catch (error) {
      console.error("Error adding employee:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // Existing methods...

  static async login(req, res) {
    const { email, password } = req.body;

    try {
      // Find user and populate the role name using the roleId
      const user = await User.findOne({ email }).populate("roleId", "roleName");

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid email or password" });
      }

      // Assuming the password comparison is done in the schema, no need to manually compare here
      if (!user.isValidPassword(password)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid email or password" });
      }

      // Extract role name from populated role information
      const roleName = user.roleId.roleName;

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          roleName: roleName, // Include role name in the token
          organizationId: user.organizationId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // Token will expire in 1 hour
      );

      // Send response with token
      res.status(200).json({
        success: true,
        message: "Login successful",
        token: token,
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

module.exports = EmployeeController;
