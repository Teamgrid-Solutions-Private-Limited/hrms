const express = require("express");
const { addPageElement } = require("../controllers/pagesElementController");

const router = express.Router();

router.post("/addPageelement", addPageElement);

module.exports = router;
