const mongoose = require("mongoose");
const multer = require("multer");
const User = require("../models/userSchema");
const upload = require("../middlewares/fileUpload");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const BASE_URL = process.env.BASE_URL;
const UPLOAD_URL = `${BASE_URL}images/`;

class UserController {
  static addUser = async (req, res) => {
    upload.single("profilePhoto")(req, res, async (err) => {
      try {
        if (err instanceof multer.MulterError) {
          console.log(err);

          return res
            .status(400)
            .json({ error: "File upload error", details: err.message });
        } else if (err) {
          return res.status(400).json({ error: "Invalid file type" });
        }

        const { username, email, password, roleId, organizationId } = req.body;

        // Validate required fields
        if (!username || !email || !password || !roleId || !organizationId) {
          return res.status(400).json({ error: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res
            .status(400)
            .json({ error: "User already exists with this email" });
        }

        // Create a new user object
        const user = new User({
          username,
          email,
          password,
          roleId,
          organizationId,
          profilePhoto: req.file
            ? `${UPLOAD_URL}${req.file.filename}`
            : undefined,
        });

        // Save the user to the database
        await user.save();
        res.status(201).json({ message: "User created successfully", user });
      } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
      }
    });
  };

  static login = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate email and password
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      // Find the user by email
      const user = await User.findOne({ email }).populate("roleId");
      if (!user) {
        return res.status(400).json({
          error: "USER_NOT_FOUND",
          message:
            "No account found with this email address. Please check your email or sign up.",
        });
      }

      // Compare the provided password with the stored hash
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res
          .status(400)
          .json({
            error: "INVALID_PASSWORD",
            message:
              "Incorrect password. Please try again or reset your password.",
          });
      }

      // Fetch the role name from the roleId
      const roleName = user.roleId.name; // Assuming the role model has a 'name' field

      // Generate a JWT token
      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
          email: user.email,
          role: roleName, // Passing the role name instead of roleId
          organizationId: user.organizationId,
        },
        JWT_SECRET,
        { expiresIn: "30d" } // Token expiration set to 1 month (30 days)
      );

      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  };
}

module.exports = UserController;
