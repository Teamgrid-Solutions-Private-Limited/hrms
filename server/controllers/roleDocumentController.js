
const path = require("path");
const Document = require("../models/documentSchema"); // Assuming this is your Document model
const notifyUsers = require("../utility/notifyUsers");
const User = require("../models/userSchema");
const EmploymentInfo = require("../models/employeementSchema"); // Your employment schema
const RoleDocument = require("../models/roleDocumentSchema");

const fs = require("fs");
class roleDocumentController {
  static async uploadDocumentByJobTitle(req, res) {
    try {
      const { title, categoryId, uploadedBy, description, jobTitle } = req.body;

      // Validate fields
      const missingFields = [];
      if (!title) missingFields.push("title");
      if (!categoryId) missingFields.push("categoryId");
      if (!uploadedBy) missingFields.push("uploadedBy");
      if (!jobTitle) missingFields.push("jobTitle");
      if (!req.file) missingFields.push("file");

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }

      // Define filePath now (important)
      const filePath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

      // Sanitize jobTitle
      const cleanJobTitle = jobTitle.trim();
      console.log('Searching EmploymentInfo for jobTitle:', cleanJobTitle);

      // Find employment records
      const employmentRecords = await EmploymentInfo.find({
        jobTitle: { $regex: `^${cleanJobTitle}$`, $options: "i" }
      });

      if (!employmentRecords || employmentRecords.length === 0) {
        return res.status(404).json({
          success: false,
          message: `No users found with job title: "${cleanJobTitle}"`,
        });
      }

      const userIds = employmentRecords.map((record) => record.userId);

      // Fetch user details
      const users = await User.find({ _id: { $in: userIds } });

      const completeRecipients = users.map((user) => ({
        userId: user._id.toString(),
        email: user.email,
      }));

      // Create document
      const document = await RoleDocument.create({
        title,
        description,
        filePath,
        categoryId,
        uploadedBy,
        recipients: completeRecipients.map((recipient) => ({
          userId: recipient.userId,
          status: "pending",
          email: recipient.email,
        })),
      });

      // Notify users
      await notifyUsers(completeRecipients, document);

      return res.status(201).json({
        success: true,
        message: `Document uploaded and sent to ${completeRecipients.length} recipients with job title: ${cleanJobTitle}`,
        data: document,
      });

    } catch (error) {
      console.error("Error uploading document by job title:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while uploading the document.",
        error: error.message,
      });
    }
  }
  //GetALLdocumentsSendByRole
  static async viewAllDocumentsByRole(req, res) {
    try {
      const documents = await RoleDocument.find().sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: "All documents fetched successfully.",
        data: documents,
      });
    } catch (error) {
      console.error("Error fetching documents:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching documents.",
        error: error.message,
      });
    }
  }
// Fetch documents shared with a specific user
static async getRoleDocumentsForUser(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Missing userId in request parameters.",
      });
    }

    // Fetch documents where user is a recipient
    const documents = await RoleDocument.find({
      recipients: { $elemMatch: { userId } },
    }).sort({ createdAt: -1 });

    // Fetch job title for the user
    const employmentInfo = await EmploymentInfo.findOne({ userId });
    const jobTitle = employmentInfo?.jobTitle || "Unknown";

    return res.status(200).json({
      success: true,
      message: `Documents shared with user ${userId} fetched successfully.`,
      data: {
        documents,
        jobTitle,
      },
    });
  } catch (error) {
    console.error("Error fetching role-based documents for user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch documents.",
      error: error.message,
    });
  }
}

}

module.exports = roleDocumentController;