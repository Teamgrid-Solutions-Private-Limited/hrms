// controllers/documentController.js
const Document = require("../models/documentSchema");
const User = require("../models/userSchema");

const BASE_URL = process.env.BASE_URL;
UPLOAD_URL = `${BASE_URL}images/`;
class documentController {
  static async createDocument(req, res) {
    try {
      const { userId, documentType, expirationDate, status, notes } = req.body;

      // Check if a file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Document file is required",
        });
      }

      // Get the document URL from the file's path
      const documentUrl = `${UPLOAD_URL}${req.file.filename}` || null;

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

module.exports = documentController;
