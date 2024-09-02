const UserProfile = require("../models/userProfileSchema"); // Assuming UserProfile is the Mongoose model

class UserProfileController {
  // Get all user profiles (Employee Directory View)
  static async getAllUserProfiles(req, res) {
    try {
      const userProfiles = await UserProfile.find().populate("userId", "email"); // Populate the userId field with user's email
      res.status(200).json(userProfiles);
    } catch (err) {
      res.status(500).json({
        message: "Failed to retrieve user profiles",
        error: err.message,
      });
    }
  }

  // Get a specific user profile (View a single employee)
  static async getUserProfileById(req, res) {
    try {
      const userProfile = await UserProfile.findById(req.params.id).populate(
        "userId",
        "email"
      );
      if (!userProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }
      res.status(200).json(userProfile);
    } catch (err) {
      res.status(500).json({
        message: "Failed to retrieve the user profile",
        error: err.message,
      });
    }
  }

  // Add a new user profile (Add Employee)
  static async addUserProfile(req, res) {
    try {
      const newUserProfile = new UserProfile(req.body);
      await newUserProfile.save();
      res.status(201).json(newUserProfile);
    } catch (err) {
      res.status(400).json({
        message: "Failed to create a new user profile",
        error: err.message,
      });
    }
  }

  // Update an existing user profile (Edit Employee)
  static async updateUserProfile(req, res) {
    try {
      const updatedUserProfile = await UserProfile.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedUserProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }
      res.status(200).json(updatedUserProfile);
    } catch (err) {
      res.status(400).json({
        message: "Failed to update the user profile",
        error: err.message,
      });
    }
  }

  // Delete a user profile (Delete Employee)
  static async deleteUserProfile(req, res) {
    try {
      const deletedUserProfile = await UserProfile.findByIdAndDelete(
        req.params.id
      );
      if (!deletedUserProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }
      res.status(200).json({ message: "User profile deleted successfully" });
    } catch (err) {
      res.status(500).json({
        message: "Failed to delete the user profile",
        error: err.message,
      });
    }
  }
}

module.exports = UserProfileController;
