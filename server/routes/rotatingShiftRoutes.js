const express = require("express");
const router = express.Router();
const RotatingShiftAssignController = require("../controllers/rotatingShiftAssignController");
const authMiddleware = require('../middleware/authJwt');

// Apply JWT authentication middleware to all routes

router.post(
  "/rotating-shift-assigns",
  authMiddleware("create"),
  RotatingShiftAssignController.createRotatingShiftAssign
);
router.get(
  "/rotating-shift-assigns",
  authMiddleware("view"),
  RotatingShiftAssignController.getRotatingShiftAssigns
);
router.get(
  "/rotating-shift-assigns/:id",
  authMiddleware("view"),
  RotatingShiftAssignController.getRotatingShiftAssignById
);
router.put(
  "/rotating-shift-assigns/:id",
  authMiddleware("update"),
  RotatingShiftAssignController.updateRotatingShiftAssign
);
router.delete(
  "/rotating-shift-assigns/:id",
  authMiddleware("delete"),
  RotatingShiftAssignController.deleteRotatingShiftAssign
);

module.exports = router;
