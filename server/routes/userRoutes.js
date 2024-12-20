// const express = require("express");
// const {
//   addUser,
//   loginUser,
//   updateUser,
//   deleteUser,
//   viewUserById,
//   viewUsers,
// } = require("../controllers/userController");

// const router = express.Router();

// // Route to handle adding a new user
// router.post("/add-user", addUser);
// router.post("/loginuser", loginUser);
// router.put("/update-user/:id", updateUser);
// router.delete("/delete-user/:id", deleteUser);
// router.get("/view-user/:id",viewUserById);
// router.get("/viewall-user",viewUsers);

// module.exports = router;

const express = require("express");
const {
  addUser,
  loginUser,
  updateUser,
  deleteUser,
  viewUserById,
  viewUsers,
} = require("../controllers/userController");
const authJwt = require("../middlewares/authJwt");
const checkRole = require("../middlewares/checkRole");

const router = express.Router();

// Route to handle adding a new user
router.post("/add-user",addUser);

// Route to handle user login (no role required for login)
router.post("/loginuser", loginUser);

// Route to update a user
router.put(
  "/update-user/:id",
  
  updateUser
);

// Route to delete a user
router.delete(
  "/delete-user/:id",
  authJwt(),
  checkRole(["super_admin"]),
  deleteUser
);

// Route to view a specific user by ID
router.get(
  "/view-user/:id",
  
  viewUserById
);

// Route to view all users
router.get(
  "/viewall-user",
  authJwt(),
  checkRole(["admin", "super_admin"]),
  viewUsers
);

module.exports = router;
