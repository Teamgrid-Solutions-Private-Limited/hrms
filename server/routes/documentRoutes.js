const express = require("express");
const router = express.Router();
const DocumentService = require("../controllers/documentController");
const upload = require("../middlewares/fileUpload");
const authJwt = require("../middlewares/authJwt");
const checkRole = require("../middlewares/checkRole");

router.post(
  "/upload",
  authJwt("create"), // Middleware to verify JWT and authenticate the user
  checkRole(["admin", "hr", "manager","super_admin"]), // Middleware to verify user roles/permissions
  upload.single("file"), // Middleware to handle file uploads
  (req, res, next) => {
    DocumentService.uploadDocumentWithRecipients(req, res).catch(next);
  }
);
router.get("/",authJwt("view"), // Ensure user is authenticated to update recipient statuses
checkRole(["admin", "manager","super_admin"]),DocumentService.getAllDocuments);
router.get("/showByUserId/:userId",authJwt("view"), // Ensure user is authenticated to update recipient statuses
checkRole(["admin", "manager","super_admin","employee"]),DocumentService.getDocumentsForLoggedInUser);
router.get("/:documentId", authJwt("view"), // Ensure user is authenticated to update recipient statuses
checkRole(["admin","employee", "manager"]),DocumentService.getDocumentById);
router.put("/:documentId/recipients/:recipientId",authJwt("update"), // Ensure user is authenticated to update recipient statuses
checkRole(["admin", "hr", "manager","super_admin",'employee']), DocumentService.updateRecipientStatus);
router.delete("/deleteById/:documentId", authJwt("delete"), // Ensure user is authenticated to delete documents
checkRole(["admin", "hr","super_admin"]),DocumentService.deleteDocument);
router.get("/search",authJwt("view"),
checkRole(["admin", "hr", "manager"]), DocumentService.searchDocuments);



module.exports = router;
