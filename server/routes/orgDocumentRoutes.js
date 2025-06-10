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

//  New: Get all documents by orgId
router.get("/by-org/:organizationId",
    authJwt("view"),
    checkRole(["admin", "hr", "manager", "super_admin", "employee"]),
    orgDocumentController.getDocumentsByOrganization);

router.put("/status/:documentId",
    authJwt("update"),
    checkRole(["admin", "hr", "manager", "super_admin", "employee"]),
    orgDocumentController.updateRecipientStatus);

router.delete("/delete/:documentId",
    authJwt("delete"),
    checkRole(["admin", "hr", "manager", "super_admin", "employee"]),
    orgDocumentController.deleteOrgDocument);


module.exports = router;
