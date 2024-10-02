const express = require("express");
const router = express.Router();

const {
  createWorkTypeAssignment,
  getWorkTypeAssignments,
  getWorkTypeAssignmentById,
  updateWorkTypeAssignment,
  deleteWorkTypeAssignment,
} = require("../controllers/workTypeAssignmentController");
const authMiddleware = require('../middleware/authJwt');

 

router.post(
  "/work-type/assignments",
  authMiddleware("create"),
  createWorkTypeAssignment
);
router.get("/work-type/assignments",  authMiddleware("view"), getWorkTypeAssignments);
router.get(
  "/work-type/assignments/:id",
  authMiddleware("view"),
  getWorkTypeAssignmentById
);
router.put(
  "/work-type/assignments/:id",
  authMiddleware("update"),
  updateWorkTypeAssignment
);
router.delete(
  "/work-type/assignments/:id",
  authMiddleware("delete"),
  deleteWorkTypeAssignment
);

module.exports = router;
