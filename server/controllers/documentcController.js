const DocumentCategory = require("../models/documentCategory");

class DocumentCategoryController {
  // Create a new document category
  static async createDocumentCategory(req, res) {
    try {
      const { name, description } = req.body;
      const category = await DocumentCategory.create({ name, description });
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ success: false, message: "Category name already exists" });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get all document categories
  static async getAllDocumentCategories(req, res) {
    try {
      const categories = await DocumentCategory.find();
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get a single document category by ID
  static async getDocumentCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await DocumentCategory.findById(id);

      if (!category) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }

      res.status(200).json({ success: true, data: category });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update a document category
  static async updateDocumentCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const category = await DocumentCategory.findByIdAndUpdate(
        id,
        { name, description },
        { new: true }
      );

      if (!category) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }

      res.status(200).json({ success: true, data: category });
    } catch (error) {
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ success: false, message: "Category name already exists" });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Delete a document category
  static async deleteDocumentCategory(req, res) {
    try {
      const { id } = req.params;
      const category = await DocumentCategory.findByIdAndDelete(id);

      if (!category) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }

      res
        .status(200)
        .json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = DocumentCategoryController;
