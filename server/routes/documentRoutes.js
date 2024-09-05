const express = require("express");
const upload = require("../middlewares/fileUpload");
const {
  createDocument,
  getDocument,
  getDocumentById,
  updateDocument,
  deleteDocument,
} = require("../controllers/documentController");

const router = express.Router();

router.post("/add-documents", upload.single("document"), createDocument);
router.get("/view-documents", getDocument);
router.get("/view-documents/:id", getDocumentById);
router.put("/update-documents/:id", updateDocument);
router.delete("/delete-documents/:id", deleteDocument);

module.exports = router;
