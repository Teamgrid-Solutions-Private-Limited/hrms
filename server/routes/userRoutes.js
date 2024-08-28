const express = require("express");
const { addUser } = require("../controllers/UserController");

const router = express.Router();

// Route to handle adding a new user
router.post("/add-user", addUser);

module.exports = router;
