const express = require("express");
const router = express.Router();
const RoleDocumentController = require("../controllers/roleDocumentController");
const upload = require("../middlewares/fileUpload");
const authJwt = require("../middlewares/authJwt");
const checkRole = require("../middlewares/checkRole");

router.post(
  "/upload-by-job-title",
  authJwt("create"), // Middleware to verify JWT and authenticate the user
  checkRole(["admin", "hr", "manager","super_admin"]), 
  upload.single("file"),
  RoleDocumentController.uploadDocumentByJobTitle
);
router.get('/role-documents/user/:userId',authJwt("view"),
checkRole(["admin", "manager","super_admin","employee"]),
 RoleDocumentController.getRoleDocumentsForUser);


router.get("/by-role/allDocByRole",authJwt("view"), // Ensure user is authenticated to update recipient statuses
checkRole(["admin", "manager","super_admin","employee"]),
   RoleDocumentController.viewAllDocumentsByRole);
   module.exports = router;
