const User = require("../models/userSchema");
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "jwt-token";

class UserController {
  static addUser = async (req, res) => {
    try {
      const {email, password, roleId, organizationId , firstName, lastName } = req.body;
      console.log(email,password,roleId,organizationId,firstName,lastName);
      

      // Validate required fields
      if ( !firstName || !lastName) {
        return res.status(400).json({ error: "All fields are required" });
      }
      // if (!mongoose.Types.ObjectId.isValid(roleId) || !mongoose.Types.ObjectId.isValid(organizationId)) {
      //   return res.status(400).json({ error: "Invalid roleId or organizationId" });
      // }
      

      // Check if user already exists
      if(email){
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res
            .status(400)
            .json({ error: "User already exists with this email" });
        }
      }
    
         // If password is provided, hash it
    let hashedPassword = undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

      // Create a new user object
      const user = new User({
        
        email,
        password:hashedPassword,
        roleId,
        organizationId,
        firstName,
        lastName,
      });
      await user.save();
      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
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
          message: "No account found with this email address. Please check your email or sign up.",
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
          message: "Incorrect password. Please try again or reset your password.",
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
      return res.status(200).json({ message: "Login successful", token });
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

  static updateUser = async (req, res) => {
    try {
      const { username, email, password, roleId, firstName, lastName } = req.body;
      const userId = req.params.id; // Assuming user ID is passed as a parameter
  
      // Validate that at least one field to update is provided
      if (!username && !email && !password && !roleId && !firstName && !lastName) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "At least one field must be provided to update.",
        });
      }
  
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: "USER_NOT_FOUND",
          message: "User not found.",
        });
      }
  
      // Check for duplicate email if email is updated
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
  
      // Update user fields if provided
      if (username) user.username = username;
      if (roleId) user.roleId = roleId;
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
  
      // Hash and update the password if provided
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
  
      // Save the updated user to the database
      await user.save();
  
      res.status(200).json({
        message: "User updated successfully",
        user,
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
  static viewUsers = async (req, res) => {
    try {
      const user = await User.find(); // Fetch all jobs from the database
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
  
      
      const user = await User.findById(id).populate("roleId").populate("organizationId");
  
       
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
       
      res.status(200).json(user);
    } catch (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({ message: "Error fetching user", error: err.message });
    }
  };
  
}

module.exports = UserController;
