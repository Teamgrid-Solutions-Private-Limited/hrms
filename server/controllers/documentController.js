// controllers/documentController.js
const Document = require("../models/documentSchema"); // Adjust the path to your model
const User = require("../models/userSchema"); // Adjust the path to your user model

class DocumentController {
  static async createDocument(req, res) {
    try {
      const { userId, documentType, expirationDate, status, metadata, notes } =
        req.body;

      // Check if a file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Document file is required",
        });
      }

      // Get the document URL from the file's path
      const documentUrl = `http://localhost:5000/uploads/${req.file.filename}`;

      // Validate and fetch user details using userId
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User does not exist",
        });
      }

      // Create a new document with user details
      const newDocument = new Document({
        userId,
        documentType,
        documentUrl,
        expirationDate,
        status,
        uploaderName: user.username, // Add the username of the uploader
        notes,
        metadata, // Assuming metadata is part of the request body
      });

      // Save the document to the database
      const savedDocument = await newDocument.save();

      // Send success response with the created document
      res.status(201).json({
        success: true,
        message: "Document created successfully",
        document: savedDocument,
      });
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({
        success: false,
        message: "Error creating document",
        error: error.message,
      });
    }
  }
}

module.exports = DocumentController;
