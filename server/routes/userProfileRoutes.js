const express = require("express");
const router = express.Router();
const UserProfileController = require("../controllers/userProfileController");
const authMiddleware = require("../middlewares/authJwt"); // Ensures user is logged in
const roleMiddleware = require("../middlewares/checkRole"); // Ensures user has proper permissions

// View all user profiles (Employee Directory View)
router.get(
  "/profiles",
  authMiddleware,
  roleMiddleware("view_profiles"), // User must have the 'view_profiles' permission
  UserProfileController.getAllUserProfiles
);

// View a specific user profile (View a single employee)
router.get(
  "/profile/:id",
  authMiddleware,
  roleMiddleware("view_profile"), // User must have the 'view_profile' permission
  UserProfileController.getUserProfileById
);

// Add a new user profile (Add Employee)
router.post(
  "/profile",
  authMiddleware,
  roleMiddleware("add_profile"), // User must have the 'add_profile' permission
  UserProfileController.addUserProfile
);

// Update a user profile (Edit Employee)
router.put(
  "/profile/:id",
  authMiddleware,
  roleMiddleware("edit_profile"), // User must have the 'edit_profile' permission
  UserProfileController.updateUserProfile
);

// Delete a user profile (Delete Employee)
router.delete(
  "/profile/:id",
  authMiddleware,
  roleMiddleware("delete_profile"), // User must have the 'delete_profile' permission
  UserProfileController.deleteUserProfile
);

module.exports = router;
