const express = require("express");
const upload = require("../middlewares/fileUpload");
const { createDocument } = require("../controllers/documentController");

const router = express.Router();

router.post("/add-documents", upload.single("document"), createDocument);

module.exports = router;
