const express = require("express");
const {
  addUser,
  loginUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// Route to handle adding a new user
router.post("/add-user", addUser);
router.post("/loginuser", loginUser);
router.put("/update-user/:id", updateUser);
router.delete("/update-user/:id", deleteUser);

module.exports = router;
