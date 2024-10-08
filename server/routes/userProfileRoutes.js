const express = require("express");
const router = express.Router();
const UserProfileController = require("../controllers/userProfileController");
const authMiddleware = require("../middlewares/authJwt"); // Ensures user is logged in
const roleMiddleware = require("../middlewares/checkRole"); // Ensures user has proper permissions

// View all user profiles (Employee Directory View)
// router.get(
//   "/profile/view",
//   authMiddleware,
//   // roleMiddleware("read"), // User must have the 'view_profiles' permission
//   UserProfileController.getAllUserProfiles
// );
router.get(
  "/profile/view",
  authMiddleware("viewall"), // Require "viewall" permission
  UserProfileController.getAllUserProfiles // Your controller function to get all profiles
);

// View a specific user profile (View a single employee)
// router.get(
//   "/profile/viewById/:id",
//   authMiddleware,
//   // roleMiddleware("read"), // User must have the 'view_profile' permission
//   UserProfileController.getUserProfileById
// );
router.get(
  "/profile/viewById/:id",
  authMiddleware("view"), // Ensure the user has 'view' permission
  UserProfileController.getUserProfileById // Controller function to get user profile
);
// Add a new user profile (Add Employee)
// router.post(
//   "/profile/add",
//   // authMiddleware,
//   // roleMiddleware("add"), // User must have the 'add_profile' permission
//   UserProfileController.addUserProfile
// );
router.post(
  "/profile/add",
  authMiddleware("create"), // Require "create" permission
  UserProfileController.addUserProfile // Your controller function
);
// Update a user profile (Edit Employee)
router.put(
  "/profile/update/:id",
  authMiddleware,
  roleMiddleware("update"), // User must have the 'edit_profile' permission
  UserProfileController.updateUserProfile
);

// Delete a user profile (Delete Employee)
router.delete(
  "/profile/delete/:id",
  authMiddleware,
  roleMiddleware("delete"), // User must have the 'delete_profile' permission
  UserProfileController.deleteUserProfile
);

module.exports = router;
