const express = require("express");
const router = express.Router();
const {updateOrganization, addOrganization, getOrganizationByUserId, viewOrganization } = require("../controllers/organizationController");
const checkRole = require("../middlewares/checkRole");
const authJwt = require("../middlewares/authJwt");
const upload = require("../middlewares/fileUpload");
 

router.post("/organization/create",addOrganization);
router.put("/organization/update/:id",
    authJwt(), // JWT middleware to authenticate
    checkRole(["super_admin", "admin"]),updateOrganization);

router.get("/organization/viewById/:id",viewOrganization);

// router.get("/organization/viewByuserId/:id",getOrganizationByUserId);

module.exports = router;
