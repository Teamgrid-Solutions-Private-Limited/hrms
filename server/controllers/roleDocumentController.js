
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

      const filePath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      const cleanJobTitle = jobTitle.trim();

      //  1. Get organizationId of uploadedBy user
      const uploader = await User.findById(uploadedBy);
      if (!uploader) {
        return res.status(404).json({ success: false, message: "Uploader not found." });
      }

      const uploaderOrgId = uploader.organizationId;

      //  2. Get employment records for users matching jobTitle
      const employmentRecords = await EmploymentInfo.find({
        jobTitle: { $regex: `^${cleanJobTitle}$`, $options: "i" }
      });

      const userIds = employmentRecords.map((record) => record.userId);

      //  3. Get users matching both jobTitle AND same organizationId
      const users = await User.find({
        _id: { $in: userIds },
        organizationId: uploaderOrgId,
      });

      if (!users.length) {
        return res.status(404).json({
          success: false,
          message: `No users with job title "${cleanJobTitle}" found in the same organization.`,
        });
      }

      const completeRecipients = users.map((user) => ({
        userId: user._id.toString(),
        email: user.email,
      }));

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
      // 1. Fetch all documents with necessary population
      const documents = await RoleDocument.find()
        .populate("uploadedBy", "firstName lastName organizationId")
        .populate("recipients.userId", "firstName lastName email") // recipient info
        .sort({ createdAt: -1 })
        .lean();

      // 2. Collect all unique recipient userIds
      const recipientUserIds = Array.from(
        new Set(
          documents.flatMap((doc) =>
            doc.recipients.map((rec) => rec.userId?._id?.toString())
          )
        )
      );

      // 3. Fetch employment info for those userIds
      const employmentInfos = await EmploymentInfo.find({
        userId: { $in: recipientUserIds },
      })
        .select("userId jobTitle")
        .lean();

      const jobTitleMap = {};
      employmentInfos.forEach((info) => {
        jobTitleMap[info.userId.toString()] = info.jobTitle || "Unknown";
      });

      // 4. Inject jobTitle into each recipient
      documents.forEach((doc) => {
        doc.recipients.forEach((rec) => {
          const uid = rec.userId?._id?.toString();
          rec.jobTitle = jobTitleMap[uid] || "Unknown";
        });
      });

      return res.status(200).json({
        success: true,
        message: "All documents fetched successfully with job titles.",
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

      // 1. Fetch documents with populated user info
      const documents = await RoleDocument.find({
        recipients: { $elemMatch: { userId } },
      })
        .populate("categoryId", "name description")
        .populate("recipients.userId", "firstName lastName email") // basic user info
        .populate("uploadedBy", "firstName lastName")
        .sort({ createdAt: -1 })
        .lean();

      // 2. Collect all unique recipient userIds
      const recipientUserIds = Array.from(
        new Set(
          documents.flatMap((doc) =>
            doc.recipients.map((rec) => rec.userId?._id?.toString())
          )
        )
      );

      // 3. Fetch employment info for those userIds
      const employmentInfos = await EmploymentInfo.find({
        userId: { $in: recipientUserIds },
      })
        .select("userId jobTitle")
        .lean();

      const jobTitleMap = {};
      employmentInfos.forEach((info) => {
        jobTitleMap[info.userId.toString()] = info.jobTitle || "Unknown";
      });

      // 4. Inject jobTitle into each recipient
      documents.forEach((doc) => {
        doc.recipients.forEach((rec) => {
          const uid = rec.userId?._id?.toString();
          rec.jobTitle = jobTitleMap[uid] || "Unknown";
        });
      });

      return res.status(200).json({
        success: true,
        message:
          documents.length === 0
            ? "No documents found for this userRole."
            : `Documents shared with user ${userId} fetched successfully.`,
        data: {
          documents,
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
  };

  //update status 
  // Update recipient's status in a role document
static async updateRecipientStatus(req, res) {
  try {
    const { documentId, userId } = req.params;
    const { status } = req.body;

    if (!["pending", "viewed", "acknowledged"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: pending, viewed, acknowledged",
      });
    }

    const updatedDoc = await RoleDocument.findOneAndUpdate(
      {
        _id: documentId,
        "recipients.userId": userId,
      },
      {
        $set: {
          "recipients.$.status": status,
        },
      },
      { new: true }
    )
      .populate("uploadedBy", "firstName lastName")
      .populate("recipients.userId", "firstName lastName email");

    if (!updatedDoc) {
      return res.status(404).json({
        success: false,
        message: "Document or recipient not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Status updated to '${status}' for user ${userId}.`,
      data: updatedDoc,
    });
  } catch (error) {
    console.error("Error updating recipient status:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating recipient status.",
      error: error.message,
    });
  }
}

static async deleteRoleDocument(req, res) {
  try {
    const { documentId } = req.params;

    const document = await RoleDocument.findByIdAndDelete(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Role document not found.",
      });
    }

    // Delete the file from the filesystem
    const fileUrl = document.filePath; // e.g., http://localhost:6010/uploads/file.pdf
    const filename = path.basename(fileUrl);
    const filePath = path.join(__dirname, "../my-upload/uploads", filename);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Failed to delete file:", err.message);
        // Continue without throwing; file deletion failure shouldn't block DB delete
      }
    });

    return res.status(200).json({
      success: true,
      message: "Role document and file deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting role document:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the role document.",
      error: error.message,
    });
  }
}



}

module.exports = roleDocumentController;