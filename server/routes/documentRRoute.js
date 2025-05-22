const express = require("express");
const router = express.Router();
const DocumentRequestController = require("../controllers/documentRequestController");
const authJwt = require("../middlewares/authJwt");
const checkRole = require("../middlewares/checkRole");

// Create a new document request (HR/Admin only)
router.post(
  "/documentReuest",
  authJwt("create"),
  checkRole(["hr", "admin","super_admin","employee"]), // Only HR and Admin can create document requests
  DocumentRequestController.createDocumentRequest
);

// Get all document requests (HR/Admin only)
router.get(
  "/documentReuest",
  authJwt("view"),
  checkRole(["hr", "admin","super_admin", "employee"]), // HR/Admin can view all document requests
  DocumentRequestController.getDocumentRequests
);

// Get a specific document request by ID (HR/Admin/Employee)
router.get(
  "/documentRequest/:id",
  authJwt("view"),
  checkRole(["hr", "admin", "employee","super_admin"]), // HR/Admin/Employee can view
  DocumentRequestController.getDocumentRequestById
);

// Get all document requests by empUserId
router.get('/documentRequest/byEmployee/:userId', 
  authJwt("view"),
  checkRole(["hr", "admin", "employee","super_admin"]), 
  DocumentRequestController.getRequestsByEmployee);

  router.get("/documentRequest/employee/requests",
  authJwt("view"),
  checkRole([ "employee","super_admin"]), 
  DocumentRequestController.getLoggedInEmployeeRequests
  )
// Update a document request (HR/Admin only)
router.put(
  "/documentReuest/:id",
  authJwt,
  checkRole(["hr", "admin","super_admin"]),
  DocumentRequestController.updateDocumentRequest
);

// Delete a document request (Admin only)
router.delete(
  "/documentReuest/:id",
  authJwt,
  checkRole(["admin","super_admin"]), // Only Admin can delete document requests
  DocumentRequestController.deleteDocumentRequest
);

// Update the status of a document request (HR/Admin only)
router.put(
  "/documentRequest/:id/status",
  authJwt("update"),
  checkRole(["hr", "admin","super_admin","employee"]),
  DocumentRequestController.updateDocumentRequestStatus
);

module.exports = router;
