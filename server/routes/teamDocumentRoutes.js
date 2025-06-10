const express = require("express")
const router = express.Router();
const teamDocumentController = require("../controllers/teamDocumentController");
const authJwt = require("../middlewares/authJwt");
const checkRole = require("../middlewares/checkRole");
const upload = require("../middlewares/fileUpload")

//upload teamdoc
router.post("/teamDocument/create-upload",
    authJwt("create"),
    upload.single("file"), // Correct usage
    checkRole(["admin", "hr", "manager", "super_admin"]),
    teamDocumentController.uploadTeamDocument
)

//  New: Get all documents by team
router.get("/view-all",
    authJwt("view"),
    checkRole(["admin", "hr", "manager", "super_admin", "employee"]),
    teamDocumentController.viewAllTeamDocuments
);
router.get('/team-documents/user',
    authJwt("view"),
    checkRole(["admin", "hr", "manager", "super_admin", "employee"]),
    teamDocumentController.getTeamDocumentsForUser);
router.put('/team-documents/update-status',
    authJwt("update"),
    checkRole(["admin", "hr", "manager", "super_admin", "employee"]),
    teamDocumentController.updateTeamDocumentStatus);

//  New: Get all documents by orgId
// router.get("/by-team/:organizationId",
//     authJwt("view"),
//     checkRole(["admin", "hr", "manager", "super_admin", "employee"]),
//     teamDocumentController.getDocumentsByOrganization);

// router.put("/team/status/:documentId",
//     authJwt("update"),
//     checkRole(["admin", "hr", "manager", "super_admin", "employee"]),
//     teamDocumentController.updateRecipientStatus);

module.exports = router;
