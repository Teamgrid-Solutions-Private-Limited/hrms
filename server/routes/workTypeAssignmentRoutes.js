const express = require("express");
const router = express.Router();

const {
  createWorkTypeAssignment,
  getWorkTypeAssignments,
  getWorkTypeAssignmentById,
  updateWorkTypeAssignment,
  deleteWorkTypeAssignment,
} = require("../controllers/workTypeAssignmentController");
const jwtAuth = require("../middlewares/authJwt");
const checkRole = require("../middlewares/checkRole");

// Apply JWT authentication middleware to all routes
router.use(jwtAuth);

router.post(
  "/work-type/assignments",
  checkRole("create"),
  createWorkTypeAssignment
);
router.get("/work-type/assignments", checkRole("view"), getWorkTypeAssignments);
router.get(
  "/work-type/assignments/:id",
  checkRole("view"),
  getWorkTypeAssignmentById
);
router.put(
  "/work-type/assignments/:id",
  checkRole("update"),
  updateWorkTypeAssignment
);
router.delete(
  "/work-type/assignments/:id",
  checkRole("delete"),
  deleteWorkTypeAssignment
);

module.exports = router;
