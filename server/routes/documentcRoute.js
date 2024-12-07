const express = require("express");
const router = express.Router();
const DocumentCategoryController = require("../controllers/documentcController");
const authJwt = require("../middlewares/authJwt"); // JWT Authentication middleware
const checkRole = require("../middlewares/checkRole"); // Role Checking Middleware

// Route to create a new document category
// Requires 'create_document_category' permission and 'admin' or 'super_admin' role
router.post(
  "/categories",
  authJwt("create"), // Check if the user has 'create_document_category' permission
  checkRole(["admin", "super_admin"]), // Only allow 'admin' or 'super_admin' roles
  DocumentCategoryController.createDocumentCategory
);

// Route to get all document categories
// Requires 'view_document_category' permission
router.get(
  "/categories",
  authJwt("view"), // Check if the user has 'view_document_category' permission
  DocumentCategoryController.getAllDocumentCategories
);

// Route to get a single document category by ID
// Requires 'view_document_category' permission
router.get(
  "/categories/:id",
  authJwt("view"), // Check if the user has 'view_document_category' permission
  DocumentCategoryController.getDocumentCategoryById
);

// Route to update a document category
// Requires 'update_document_category' permission and 'admin' or 'super_admin' role
router.put(
  "/categories/:id",
  authJwt("update"), // Check if the user has 'update_document_category' permission
  checkRole(["admin", "super_admin"]), // Only allow 'admin' or 'super_admin' roles
  DocumentCategoryController.updateDocumentCategory
);

// Route to delete a document category
// Requires 'delete_document_category' permission and 'admin' or 'super_admin' role
router.delete(
  "/categories/:id",
  authJwt("delete"), // Check if the user has 'delete_document_category' permission
  checkRole(["admin", "super_admin"]), // Only allow 'admin' or 'super_admin' roles
  DocumentCategoryController.deleteDocumentCategory
);

module.exports = router;
