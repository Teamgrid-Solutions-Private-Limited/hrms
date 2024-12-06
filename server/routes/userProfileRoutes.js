const express = require("express");
const router = express.Router();
const UserProfileController = require("../controllers/userProfileController");
const authMiddleware = require("../middlewares/authJwt"); // Ensures user is logged in
const roleMiddleware = require("../middlewares/checkRole"); // Ensures user has proper permissions


 

router.get(
  "/profile/viewById/:id",
  authMiddleware("view"), // Ensure the user has 'view' permission
  UserProfileController.getUserProfileById // Controller function to get user profile
);

router.post(
  "/profile/add",
  authMiddleware("create"), // Require "create" permission
  UserProfileController.createUserProfile // Your controller function
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
