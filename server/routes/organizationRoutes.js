const express = require("express");
const router = express.Router();
const { addOrgainzation } = require("../controllers/organizationController");

router.post("/organization/create", addOrgainzation);

module.exports = router;
