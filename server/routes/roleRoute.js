const express = require("express");
const { createRole } = require("../controllers/roleController");

const router = express.Router();

router.post("/roles", createRole);

module.exports = router;
