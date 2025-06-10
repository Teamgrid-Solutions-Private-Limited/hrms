const OrgDocument = require("../models/orgDocumentModel");
const User = require("../models/userSchema");

class orgDocumentController {
  static async uploadOrgDocument(req, res) {
    try {
      const { title, description, categoryId, uploadedBy } = req.body;

      const missingFields = [];
      if (!title) missingFields.push("title");
      if (!categoryId) missingFields.push("categoryId");
      if (!uploadedBy) missingFields.push("uploadedBy");
      if (!req.file) missingFields.push("file");

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }

      //  1. Get uploader info to get organizationId
      const uploader = await User.findById(uploadedBy);
      if (!uploader) {
        return res.status(404).json({
          success: false,
          message: "Uploader not found.",
        });
      }

      const organizationId = uploader.organizationId;
      const filePath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

      //  2. Get all users in the same organization
      const orgUsers = await User.find({ organizationId }).select("_id");
      const recipients = orgUsers.map(user => ({
        userId: user._id,
        status: "pending",
      }));

      //  3. Create document with recipients
      const document = await OrgDocument.create({
        title,
        description,
        categoryId,
        uploadedBy,
        organizationId,
        filePath,
        recipients, //  include all org members
      });

      return res.status(201).json({
        success: true,
        message: `Organization document uploaded and sent to ${recipients.length} recipients.`,
        data: document,
      });
    } catch (error) {
      console.error("Upload Org Document Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to upload organization document.",
        error: error.message,
      });
    }
  }

  //fetchallOrgDocuments
  static async getDocumentsByOrganization(req, res) {
    try {
      const { organizationId } = req.params;

      if (!organizationId) {
        return res.status(400).json({
          success: false,
          message: "Missing organizationId in request parameters.",
        });
      }

      const documents = await OrgDocument.find({ organizationId })
        .populate("uploadedBy", "firstName lastName email")
        .populate("organizationId", "name")
        .populate("categoryId", "name description")
        .populate("recipients.userId", "firstName lastName email")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: `Found ${documents.length} documents for organization.`,
        data: documents,
      });
    } catch (error) {
      console.error("Error fetching organization documents:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch documents by organization.",
        error: error.message,
      });
    }
  }
  static async updateRecipientStatus(req, res) {
    try {
      const { documentId } = req.params;
      const { userId, status } = req.body;

      if (!userId || !status) {
        return res.status(400).json({
          success: false,
          message: "userId and status are required",
        });
      }

      const updatedDoc = await OrgDocument.findOneAndUpdate(
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
      ).populate("recipients.userId", "firstName lastName email");

      if (!updatedDoc) {
        return res.status(404).json({
          success: false,
          message: "Document or recipient not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: `Status updated to '${status}'`,
        data: updatedDoc,
      });
    } catch (error) {
      console.error("Update Status Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update recipient status",
        error: error.message,
      });
    }
  }


}

module.exports = orgDocumentController;
