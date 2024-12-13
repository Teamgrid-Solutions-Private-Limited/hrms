const express = require("express");
const router = express.Router();
const {updateOrganization, addOrganization, getOrganizationByUserId, viewOrganization } = require("../controllers/organizationController");
 

router.post("/organization/create", addOrganization);
router.put("/organization/update/:id",updateOrganization);
router.get("/organization/viewById/:id",viewOrganization);
// router.get("/organization/viewByuserId/:id",getOrganizationByUserId);

module.exports = router;
