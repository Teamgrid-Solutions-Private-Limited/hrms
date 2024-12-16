const express = require("express");
const router = express.Router();
const UserProfileController = require("../controllers/userProfileController");
//const authMiddleware = require("../middlewares/authJwt"); // Ensures user is logged in
//const roleMiddleware = require("../middlewares/checkRole"); // Ensures user has proper permissions
const authJwt = require("../middlewares/authJwt");
const checkRole = require("../middlewares/checkRole");


 

router.get(
  "/profile/viewById/:id",
  authJwt(),
  checkRole(["super_admin", "admin","employee"]), // Ensure the user has 'view' permission
  UserProfileController.getUserProfileById // Controller function to get user profile
);

router.post(
  "/profile/add", authJwt(),
  checkRole(["super_admin", "admin"]), // Require "create" permission
  UserProfileController.createUserProfile // Your controller function
);
// Update a user profile (Edit Employee)
router.put(
  "/profile/update/:id",
  authJwt(),
  checkRole(["super_admin", "admin"]), // User must have the 'edit_profile' permission
  UserProfileController.updateUserProfile
);

// Delete a user profile (Delete Employee)
router.delete(
  "/profile/delete/:id",
  authJwt(),
  checkRole(["super_admin"]), // User must have the 'delete_profile' permission
  UserProfileController.deleteUserProfile
);

module.exports = router;
