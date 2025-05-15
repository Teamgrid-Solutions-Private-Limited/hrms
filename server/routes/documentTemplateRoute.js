const express = require("express");
const router = express.Router();
const DocumentTemplateController = require("../controllers/documentTemplateController");
const authJwt = require("../middlewares/authJwt");
const checkRole = require("../middlewares/checkRole");
const upload = require("../middlewares/fileUpload");

// Routes
router.post(
  "/",
  authJwt("create"), // Middleware to verify JWT and authenticate the user
  checkRole(["admin", "hr", "manager"]), // Middleware to verify user roles/permissions // Ensures only authenticated users can create templates
  upload.single("file"), // Expect a single file upload with the key "file"
  DocumentTemplateController.createTemplate
);

router.get(
  "/",
  authJwt("create"), // Middleware to verify JWT and authenticate the user
  checkRole(["admin", "hr", "manager", "employee","super_admin"]), // Ensures only authenticated users can access templates
  DocumentTemplateController.getAllTemplates
);

router.get(
  "/:id",
  authJwt("create"), // Middleware to verify JWT and authenticate the user
  checkRole(["admin", "hr", "manager", "employee"]),
  // Ensures only authenticated users can fetch a specific template
  DocumentTemplateController.getTemplateById
);

router.delete(
  "/:id",
  authJwt("create"), // Middleware to verify JWT and authenticate the user
  checkRole(["admin", "hr", "manager"]),
  // Ensures only authenticated users can delete templates
  DocumentTemplateController.deleteTemplate
);

module.exports = router;
