const express = require("express");
const { addUser, login } = require("../controllers/userController");

const router = express.Router();

// Route to handle adding a new user
router.post("/add-user", addUser);
router.post("/login-user", login);

module.exports = router;
