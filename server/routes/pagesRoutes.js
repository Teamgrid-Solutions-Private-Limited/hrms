// routes/pageRoutes.js
const express = require("express");
const router = express.Router();
const PagesController = require("../controllers/pagesController");

// Routes for managing pages
router.post("/pages", PagesController.createPage); // Create a new page
router.get("/pages", PagesController.getAllPages); // Get all pages
router.get("/pages/:id", PagesController.getPageById); // Get a specific page
router.put("/pages/:id", PagesController.updatePage); // Update a specific page
router.delete("/pages/:id", PagesController.deletePage); // Delete a specific page

module.exports = router;
