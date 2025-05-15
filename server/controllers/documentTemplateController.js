const DocumentTemplate = require("../models/documentTemplateSchema");
const path = require("path");
const fs = require("fs");

const DocumentTemplateController = {
  // Create a new document template
  createTemplate: async (req, res) => {
    try {
      const { name, description } = req.body;
      const file = req.file; // Assuming a middleware like multer for file uploads

      if (!file) {
        return res.status(400).json({ error: "Template file is required." });
      }

      // Construct the file URL
      const filePath = `${req.protocol}://${req.get("host")}/uploads/${
        file.filename
      }`;

      // Create a new document template instance
      const newTemplate = new DocumentTemplate({
        name,
        description,
        filePath,
        createdBy: req.user.id, // Assuming `req.user` contains authenticated user data
      });

      await newTemplate.save();

      res.status(201).json({
        message: "Template created successfully.",
        template: newTemplate,
      });
    } catch (error) {
      console.error("Error creating template:", error);
      res.status(500).json({ error: "Error creating template." });
    }
  },

  // Fetch all document templates
  getAllTemplates: async (req, res) => {
    try {
      const templates = await DocumentTemplate.find()
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 }); // Latest templates first

      res.status(200).json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Error fetching templates." });
    }
  },

  // Fetch a single document template by ID
  getTemplateById: async (req, res) => {
    try {
      const { id } = req.params;
      const template = await DocumentTemplate.findById(id).populate(
        "createdBy",
        "name email"
      );

      if (!template) {
        return res.status(404).json({ error: "Template not found." });
      }
      res.status(200).json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ error: "Error fetching template." });
    }
  },
  // Delete a document template
  deleteTemplate: async (req, res) => {
    try {
      const { id } = req.params;
      const template = await DocumentTemplate.findById(id);

      if (!template) {
        return res.status(404).json({ error: "Template not found." });
      }
      // Delete the file from the file system
      if (fs.existsSync(path.resolve(template.filePath))) {
        fs.unlinkSync(path.resolve(template.filePath));
      }
      await DocumentTemplate.findByIdAndDelete(id);

      res.status(200).json({ message: "Template deleted successfully." });
    } catch (error) {
      console.error("Error deleting template:", error);
      res.status(500).json({ error: "Error deleting template." });
    }
  },
};
module.exports = DocumentTemplateController;
