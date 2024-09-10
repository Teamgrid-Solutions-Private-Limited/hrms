const express = require("express");
const router = express.Router();
const UserProfileController = require("../controllers/userProfileController");
const authenticate = require("../middleware/authenticate");
const checkRole = require("../middleware/checkRole");
const checkPageAccess = require("../middleware/checkPageAccess");

// Routes for user profiles with RBAC and page access control
router.get(
  "/profile",
  authenticate,
  checkRole(["view_profile"]), // Check if the user has the 'view_profile' permission
  checkPageAccess("profile"), // Check if the user has access to the 'profile' page
  UserProfileController.getAllUserProfiles // Handle the request
);

module.exports = router;
