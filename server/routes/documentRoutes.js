const express = require("express");
const router = express.Router();
const DocumentService = require("../controllers/documentController"); // Updated controller import
const upload = require("../middlewares/fileUpload");
const authJwt = require("../middlewares/authJwt");
const checkRole = require("../middlewares/checkRole");

// Route: Upload a document with recipients
router.post(
  "/upload",
  authJwt("create"), // Middleware to verify JWT and authenticate the user
  checkRole(["admin", "hr", "manager"]), // Middleware to verify user roles/permissions
  upload.single("file"), // Middleware to handle file uploads
  (req, res, next) => {
    DocumentService.uploadDocumentWithRecipients(req, res).catch(next);
  }
);

module.exports = router;
