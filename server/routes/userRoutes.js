const express = require("express");
const {
  addUser,
  loginUser,
  updateUser,
  deleteUser,
  viewUserById,
  viewUsers,
} = require("../controllers/userController");

const router = express.Router();

// Route to handle adding a new user
router.post("/add-user", addUser);
router.post("/loginuser", loginUser);
router.put("/update-user/:id", updateUser);
router.delete("/delete-user/:id", deleteUser);
router.get("/view-user/:id",viewUserById);
router.get("/viewall-user",viewUsers);

module.exports = router;
