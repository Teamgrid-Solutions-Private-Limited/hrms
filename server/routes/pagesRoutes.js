const express = require("express");
const { createPage } = require("../controllers/pagesController");

const router = express.Router();

router.post("/pages", createPage);

module.exports = router;
