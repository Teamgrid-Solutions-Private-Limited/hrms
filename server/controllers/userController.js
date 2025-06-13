const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "jwt-token";
const crypto = require("crypto");

class UserController {
  static addUser = async (req, res) => {
    try {
      const {
        email,
        password,
        roleId,
        organizationId,
        firstName,
        lastName,
        team,
        department,
      } = req.body;
      // if (status) user.status = status;

      if (!firstName || !lastName) {
        return res
          .status(400)
          .json({ msg: "First and last name are required" });
      }

      if (email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res
            .status(400)
            .json({ error: "User already exists with this email" });
        }
      }

      let hashedPassword;
      let inviteToken;

      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      } else {
        // Generate invite token
        inviteToken = jwt.sign({ email }, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });

        // Generate random password and hash it
        const randomPassword = crypto.randomBytes(10).toString("hex"); // 20-char random string
        hashedPassword = await bcrypt.hash(randomPassword, 10);
      }

      const user = new User({
        email,
        password: hashedPassword,
        roleId,
        organizationId,
        firstName,
        lastName,
        team,
        inviteToken,
        department,

      });

      await user.save();

      if (!password && email) {
        await UserController.sendInvitationEmail(user);
      }

      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  };
 

  static sendInvitationEmail = async (user) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "thesufian0@gmail.com",
          pass: "qbos snac aakc ogwz",
        },
      });

      const link = `http://localhost:5173/set-password/${user._id}?token=${user.inviteToken}`;

      const mailOptions = {
        from: '"HR Team" <donotreplyteamgrid@gmail.com>',
        to: user.email,
        subject: "You're Invited! Set Your Password",
        html: `
          <p>Hello ${user.firstName},</p>
          <p>You've been added to our system. Click below to set your password:</p>
          <a href="${link}" style="padding:10px 20px; background:#007bff; color:white; text-decoration:none;">Set Your Password</a>
          <p>This link is valid for 24 hours.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Invitation email sent to ${user.email}`);
    } catch (err) {
      console.error("Failed to send invitation email:", err.message);
    }
  };

  static loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate email and password
      if (!email || !password) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Email and password are required.",
        });
      }

      const user = await User.findOne({ email }).populate("roleId");
      if (!user) {
        return res.status(404).json({
          error: "USER_NOT_FOUND",
          message:
            "No account found with this email address. Please check your email or sign up.",
        });
      }

      // Compare the provided password with the stored hash
      const isMatch = await bcrypt.compare(password, user.password);

      // If the password does not match
      if (!isMatch) {
        // Optionally, rehash the password if using a different bcrypt version or settings
        const hashedPassword = await bcrypt.hash(password, 10);

        return res.status(400).json({
          error: "INVALID_PASSWORD",
          message:
            "Incorrect password. Please try again or reset your password.",
        });
      }

      // Ensure roleId exists and fetch the role name
      const roleName = user.roleId ? user.roleId.name : "Unknown";

      // Generate a JWT token
      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: roleName,
          organizationId: user.organizationId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      // Send a success response with the token
      return res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
      console.error("Error during login:", error.message);
      return res.status(500).json({
        error: "SERVER_ERROR",
        message: "An error occurred during login. Please try again later.",
      });
    }
  };

  // static updateUser = async (req, res) => {
  //   try {
  //     const { username, email, password, roleId ,firstName, lastName} = req.body;
  //     const userId = req.params.id; // Assuming user ID is passed as a parameter

  //     // Validate that at least one field to update is provided
  //     if (!username && !email && !password && !roleId && firstName && lastName) {
  //       return res.status(400).json({ error: "No fields to update" });
  //     }

  //     // Find the user by ID
  //     const user = await User.findById(userId);
  //     if (!user) {
  //       return res.status(404).json({ error: "User not found" });
  //     }

  //     if (email && email !== user.email) {
  //       const existingUser = await User.findOne({ email });
  //       if (existingUser) {
  //         return res.status(400).json({ error: "Email already in use" });
  //       }
  //     }

  //     // Update user fields if provided
  //     if (username) user.username = username;
  //     if (email) user.email = email;
  //     if (password) user.password = password; // Password hashing is handled in the schema
  //     if (roleId) user.roleId = roleId;
  //     if (firstName) user.firstName = firstName;
  //     if (lastName) user.lastName = lastName;

  //     // Update profile photo if a new one is uploaded

  //     // Save the updated user to the database
  //     await user.save(); // password will be hashed if updated
  //     res.status(200).json({ message: "User updated successfully", user });
  //   } catch (error) {
  //     res.status(500).json({ error: "Server error", details: error.message });
  //   }
  // };

  //setPasswordWithToken

  static setPasswordWithToken = async (req, res) => {
    const { userId, token, password } = req.body;

    if (!userId || !token || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET);

      if (decoded.email) {
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        if (user.password) {
          return res.status(400).json({ message: "Password already set" });
        }

        // Match token with stored token
        if (user.inviteToken !== token) {
          return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Set password and clear token
        user.password = await bcrypt.hash(password, 10);
        user.inviteToken = undefined;

        await user.save();

        return res.status(200).json({ message: "Password set successfully" });
      } else {
        return res.status(400).json({ message: "Invalid token data" });
      }
    } catch (error) {
      console.error("Error setting password:", error.message);
      return res
        .status(400)
        .json({ message: "Invalid or expired token", error: error.message });
    }
  };


  static updateUser = async (req, res) => {
    try {
      const {
        username,
        email,
        password,
        newPassword,
        roleId,
        firstName,
        lastName,
        team,
        department,
        organizationId,
        status,
      } = req.body;

      const userId = req.params.id;

      // Ensure at least one field is provided for update
      if (
        !username &&
        !email &&
        !password &&
        !newPassword &&
        !roleId &&
        !firstName &&
        !lastName &&
        !team &&
        !department &&
        !organizationId &&
        !status
      ) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "At least one field must be provided to update.",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: "USER_NOT_FOUND",
          message: "User not found.",
        });
      }

      // 🔐 Handle password update
      if (password && newPassword) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({
            error: "INVALID_PASSWORD",
            message: "Current password is incorrect.",
          });
        }
        user.password = await bcrypt.hash(newPassword, 10);
      } else if (!password && newPassword) {
        // Password setup from invite/reset
        user.password = await bcrypt.hash(newPassword, 10);
        user.inviteToken = undefined; // 🔄 Invalidate token after use
      }

      // ✉️ Email update check
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({
            error: "EMAIL_IN_USE",
            message: "Email already in use.",
          });
        }
        user.email = email;
      }

      // ✅ Update other fields
      if (username) user.username = username;
      if (roleId) user.roleId = roleId;
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (team) user.team = team;
      if (department) user.department = department;
      if (organizationId) user.organizationId = organizationId;
      if (status) user.status = status;

      await user.save();

      // 🎟️ Auto-login if password was set via invite
      let token;
      if (!password && newPassword) {
        token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
      }

      res.status(200).json({
        message: "User updated successfully",
        user,
        token, // 👉 frontend can store this for login
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
        error: "SERVER_ERROR",
        message: "An error occurred while updating the user.",
        details: error.message,
      });
    }
  };


  static deleteUser = async (req, res) => {
    try {
      const userId = req.params.id; // Get the user ID from the request params

      // Find the user by ID and remove
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res
        .status(200)
        .json({ message: "User deleted successfully", user: deletedUser });
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  };
  // View all users
  static viewUsers = async (req, res) => {
    try {
      const user = await User.find().populate("roleId", "name"); // Populate role name only
      // Fetch all jobs from the database
      res.status(200).json(user); // Send the jobs as a response
    } catch (err) {
      console.error("Error fetching jobs:", err);
      res
        .status(500)
        .json({ message: "Error fetching jobs", error: err.message });
    }
  };

  static viewUserById = async (req, res) => {
    try {
      const { id } = req.params; // Get the user ID from the request parameters

      const user = await User.findById(id)
        .populate("roleId", "name")
        .populate("organizationId", "name");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (err) {
      console.error("Error fetching user:", err);
      res
        .status(500)
        .json({ message: "Error fetching user", error: err.message });
    }
  };
  static addOrUpdateEducation = async (req, res) => {
    try {
      const { userId } = req.params;
      const { educationDetails } = req.body;

      console.log("REQ.PARAMS:", req.params);
      console.log("REQ.BODY:", req.body);

      if (!Array.isArray(educationDetails)) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "educationDetails must be an array",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.educationDetails = educationDetails;
      user.markModified("educationDetails"); // <-- Try this
      await user.save();

      res.status(200).json({
        message: "Education details updated successfully",
        educationDetails: user.educationDetails,
      });
    } catch (error) {
      console.error("Error updating education:", error);
      res.status(500).json({
        error: "SERVER_ERROR",
        message: "Error updating education details",
        details: error.message,
      });
    }
  };


  // 📄 Get Education Details
  static getEducation = async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId).select("educationDetails");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user.educationDetails);
    } catch (error) {
      console.error("Error fetching education:", error);
      res.status(500).json({
        message: "Error fetching education details",
        error: error.message,
      });
    }
  };

  // 🗑️ Delete a Single Education Entry
  static deleteEducation = async (req, res) => {
    try {
      const { userId, eduId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.educationDetails = user.educationDetails.filter(
        (edu) => edu._id.toString() !== eduId
      );

      await user.save();
      res.status(200).json({
        message: "Education entry deleted successfully",
        educationDetails: user.educationDetails,
      });
    } catch (error) {
      console.error("Error deleting education:", error);
      res.status(500).json({
        message: "Error deleting education entry",
        error: error.message,
      });

    }
  };

  static addOrUpdateWorkExperience = async (req, res) => {
    try {
      const { userId } = req.params;
      const { workExperience } = req.body;

      if (!Array.isArray(workExperience)) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "workExperience must be an array",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.workExperience = workExperience;
      user.markModified("workExperience");
      await user.save();

      res.status(200).json({
        message: "Work experience updated successfully",
        workExperience: user.workExperience,
      });
    } catch (error) {
      console.error("Error updating work experience:", error);
      res.status(500).json({
        error: "SERVER_ERROR",
        message: "Error updating work experience",
        details: error.message,
      });
    }
  };

  static getWorkExperience = async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId).select("workExperience");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user.workExperience);
    } catch (error) {
      console.error("Error fetching work experience:", error);
      res.status(500).json({
        message: "Error fetching work experience",
        error: error.message,
      });
    }
  };

  static deleteWorkExperience = async (req, res) => {
    try {
      const { userId, workId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.workExperience = user.workExperience.filter(
        (exp) => exp._id.toString() !== workId
      );

      await user.save();
      res.status(200).json({
        message: "Work experience entry deleted successfully",
        workExperience: user.workExperience,
      });
    } catch (error) {
      console.error("Error deleting work experience:", error);
      res.status(500).json({
        message: "Error deleting work experience entry",
        error: error.message,
      });
    }
  };




}

module.exports = UserController;