// routes/workTypeAssignmentRoutes.js
const express = require("express");
const router = express.Router();
const {
  createWorkTypeAssignment,
} = require("../controllers/workTypeAssignmentController");

// POST route for creating a new work type assignment
router.post("/work-type-assignments", createWorkTypeAssignment);

module.exports = router;
