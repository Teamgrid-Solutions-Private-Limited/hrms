const express = require("express");
const authenticate = require("../middlewares/authJwt");

const {
  addUserProfile,
  getAllUserProfiles,
  getUserProfileById,
} = require("../controllers/userProfileController");
const checkRole = require("../middlewares/checkRole");

const router = express.Router();

router.post("/add-userprofile", addUserProfile);
router.get("/view-userprofile", getAllUserProfiles);
router.get(
  "/view-userprofile/:id",
  authenticate,
  checkRole(["employee", "HR", "admin"]),
  getUserProfileById
);

module.exports = router;
