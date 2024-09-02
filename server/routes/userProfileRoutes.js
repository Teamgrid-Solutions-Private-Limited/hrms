const express = require("express");
const { addUserProfile } = require("../controllers/userProfileController");

const router = express.Router();

router.post("/add-userprofile", addUserProfile);

module.exports = router;
