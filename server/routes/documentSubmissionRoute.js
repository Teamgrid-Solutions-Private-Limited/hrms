const express = require("express");
const router = express.Router();
const DocumentSubmissionController = require("../controllers/documentSubmissionController");
const authJwt = require("../middlewares/authJwt"); // JWT Authentication middleware
const checkRole = require("../middlewares/checkRole"); // Role Checking Middleware
const upload = require("../middlewares/fileUpload");

// Route to create a new document submission
router.post(
  "/submissions",
  authJwt("add_submision"),
  checkRole(["employee"]),
  upload.single("file"),
  DocumentSubmissionController.createSubmission
);

// Route to review a document submission
router.put(
  "/submissions/:id/review",
  authJwt("create"),
  checkRole(["admin", "HR_Manager", "super_admin", "hr"]),
  DocumentSubmissionController.reviewSubmission
);

// Route to fetch all submissions for a specific document request
router.get(
  "/submissions/request/:documentRequestId",
  authJwt("create"),
  checkRole(["HR_Manager", "super_admin", "hr"]),
  DocumentSubmissionController.getSubmissionsByRequest
);

// Route to fetch a single submission by ID
router.get(
  "/submissions/:id",
  authJwt("view"),
  checkRole(["employee", "HR_Manager", "super_admin", "hr"]),
  DocumentSubmissionController.getSubmissionById
);

// Route to fetch all submissions by an employee
router.get(
  "/submissions/employee/:employeeId",
  authJwt("view"),
  DocumentSubmissionController.getSubmissionsByEmployee
);

// Route to fetch all submissions
router.get(
  "/submissions",
  authJwt("viewall"),
  checkRole(["HR_Manager", "super_admin", "hr"]),
  DocumentSubmissionController.getAllSubmissions
);

// Route to delete a submission by ID
router.delete(
  "/submissions/:id",
  authJwt("delete"),
  checkRole(["HR_Manager", "super_admin", "hr"]),
  DocumentSubmissionController.deleteSubmission
);




module.exports = router;
