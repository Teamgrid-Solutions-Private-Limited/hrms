const Document = require("../models/documentSchema");
const User = require("../models/userSchema");
const mongoose = require("mongoose");

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
        uploaderName: user.username,
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
  static async getDocumentById(req, res, next) {
    try {
      const _id = req.params.id;
      const getDatas = await Document.findById(_id);
      res.status(201).json({
        message: "Documents fetch succesfully",
        result: getDatas,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async getDocument(req, res, next) {
    try {
      const getDatas = await Document.find();
      res.status(201).json({
        message: "Documents fetch succesfully",
        result: getDatas,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async updateDocument(req, res) {
    try {
      const { id } = req.params;
      const { userId, documentType, expirationDate, status, notes } = req.body;

      // Validate the provided document ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid document ID",
        });
      }

      // Validate and fetch user details using userId
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User does not exist",
        });
      }

      // Check if a file was uploaded, update documentUrl if a new file is uploaded
      let documentUrl = null;
      if (req.file) {
        documentUrl = `${UPLOAD_URL}${req.file.filename}`;
      }

      // Find the document by ID
      const document = await Document.findById(id);
      if (!document) {
        return res.status(404).json({
          success: false,
          message: "Document not found",
        });
      }

      // Update the document with the new data
      document.userId = userId || document.userId;
      document.documentType = documentType || document.documentType;
      document.documentUrl = documentUrl || document.documentUrl;
      document.expirationDate = expirationDate || document.expirationDate;
      document.status = status || document.status;
      document.uploaderName = user.username || document.uploaderName;
      document.notes = notes || document.notes;

      // Save the updated document
      const updatedDocument = await document.save();

      // Send success response with the updated document
      res.status(200).json({
        success: true,
        message: "Document updated successfully",
        document: updatedDocument,
      });
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({
        success: false,
        message: "Error updating document",
        error: error.message,
      });
    }
  }
  static async deleteDocument(req, res, next) {
    try {
      const getDatas = await Document.findByIdAndDelete(req.params.id);
      res.status(201).json({
        success: true,
        message: "Documents deleted succesfully",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = documentController;
