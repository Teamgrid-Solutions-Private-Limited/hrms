const express = require("express");
const { createPageGroup } = require("../controllers/pagesGroupController");

const router = express.Router();

router.post("/page-groups", createPageGroup);

module.exports = router;
