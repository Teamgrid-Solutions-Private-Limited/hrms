const express = require("express")
const router = express.Router();
const orgDocumentController = require("../controllers/orgDocumentController");
const authJwt = require("../middlewares/authJwt");
const checkRole = require("../middlewares/checkRole");
const upload = require("../middlewares/fileUpload")
router.post("/orgDocument/create-upload",
    authJwt("create"),
    upload.single("file"), // Correct usage
    checkRole(["admin", "hr", "manager", "super_admin"]),
    orgDocumentController.uploadOrgDocument
)
module.exports = router;
