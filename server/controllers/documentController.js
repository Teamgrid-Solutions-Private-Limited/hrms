// const notifyUsers = require("../utility/notifyUsers");
// const path = require("path");
// const BASE_URL = process.env.BASE_URL;
// // const upload_URL = `${BASE_URL}images/`;
// class DocumentService {
//   static async uploadDocumentWithRecipients(req, res) {
//     try {
//       const { title, categoryId, recipients, uploadedBy } = req.body;
//       // Get the file path from the uploaded file
//       if (!req.file) {
//         return res.status(400).json({ message: "No file uploaded" });
//       }
//       // Construct the file path from the uploaded file
//       const filePath = `${BASE_URL}images/`;
//       // Create the document with recipients
//       const document = await Document.create({
//         title,
//         filePath,
//         categoryId,
//         uploadedBy,
//         recipients: recipients.map((recipient) => ({
//           userId: recipient.userId, // List of user IDs
//           status: "pending", // Default status
//         })),
//       });

//       // Send bulk notifications to recipients
//       if (recipients && recipients.length > 0) {
//         await notifyUsers(recipients, document);
//       }

//       res.status(201).json({
//         success: true,
//         message:
//           "Document uploaded successfully and notifications sent to recipients",
//         data: document,
//       });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   }
// }

// // Export the class for use in other parts of the application
// module.exports = DocumentService;

const path = require("path");
const Document = require("../models/documentSchema"); // Assuming this is your Document model
const notifyUsers = require("../utility/notifyUsers");
const User = require("../models/userSchema");
const EmploymentInfo = require("../models/employeementSchema"); // Your employment schema
const RoleDocument = require("../models/roleDocumentSchema");

const fs = require("fs");
// const BASE_URL = process.env.BASE_URL || "http://localhost:3000"; // Fallback for base URL

class DocumentService {
  static async uploadDocumentWithRecipients(req, res) {
    try {
      const { title, categoryId, recipients, uploadedBy, description } = req.body;
      console.log("passed recipients", recipients);

      if (!title || !categoryId || !uploadedBy) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields." });
      }
      let parsedRecipients = [];
      try {
        parsedRecipients = JSON.parse(recipients);
        if (!Array.isArray(parsedRecipients)) {
          throw new Error("Recipients should be an array");
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid recipients format. Should be an array.",
        });
      }


      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded.",
        });
      }

      const filePath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename
        }`;
      // Fetch user details
      const userIds = parsedRecipients.map((user) => user._id);
      console.log("paased userIds", userIds);
      const users = await User.find({ _id: { $in: userIds } });
      console.log("Fetched users", users);

      if (users.length !== userIds.length) {
        return res.status(400).json({
          success: false,
          message: "Some recipients could not be found in the database.",
        });
      }

      const completeRecipients = users.map((user) => ({
        userId: user._id.toString(),
        email: user.email,
      }));
      console.log("Complete recipients", completeRecipients);

      // Create document
      const document = await Document.create({
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

      // Notify recipients
      await notifyUsers(completeRecipients, document);

      return res.status(201).json({
        success: true,
        message: "Document uploaded and notifications sent.",
        data: document,
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred.",
        error: error.message,
      });
    }
  }

  // Get all documents
  static async getAllDocuments(req, res) {
    try {
      const documents = await Document.find()
        .populate("uploadedBy", "name email firstName lastName ")
        .populate("categoryId", "name")
        .populate("recipients.userId", "name email firstName lastName organizationId")
      return res.status(200).json({
        success: true,
        message: "Documents fetched successfully.",
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

  // Get a single document by ID
  static async getDocumentById(req, res) {
    try {
      const { documentId } = req.params;

      const document = await Document.findById(documentId)
        .populate("uploadedBy", "name email")
        .populate("categoryId", "name");

      if (!document) {
        return res.status(404).json({
          success: false,
          message: "Document not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Document fetched successfully.",
        data: document,
      });
    } catch (error) {
      console.error("Error fetching document by ID:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching the document.",
        error: error.message,
      });
    }
  }

  // Update document status for a recipient
  static async updateRecipientStatus(req, res) {
    try {
      const { documentId, recipientId } = req.params;
      const { status } = req.body;

      if (!["pending", "viewed", "acknowledged"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status value.",
        });
      }

      const document = await Document.findOneAndUpdate(
        {
          _id: documentId,
          "recipients.userId": recipientId,
        },
        {
          $set: { "recipients.$.status": status },
        },
        { new: true }
      );

      if (!document) {
        return res.status(404).json({
          success: false,
          message: "Document or recipient not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Recipient status updated successfully.",
        data: document,
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

  // GET  by userid  /api/documents/user/:userId
  static async getDocumentsForLoggedInUser(req, res) {
    const { userId } = req.params;

    try {
      const documents = await Document.find({
        recipients: {
          $elemMatch: { userId: userId }
        }
      }).populate("uploadedBy", "firstName lastName email")
        .populate("recipients.userId", " email");

      res.status(200).json(documents);
    } catch (err) {
      console.error("Error fetching documents:", err);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  };

  // Delete a document


  static async deleteDocument(req, res) {
    try {
      const { documentId } = req.params;

      const document = await Document.findByIdAndDelete(documentId);

      if (!document) {
        return res.status(404).json({
          success: false,
          message: "Document not found.",
        });
      }

      // Delete file from the filesystem
      const fileUrl = document.filePath; // Example: http://localhost:3000/uploads/myfile.pdf
      const filename = path.basename(fileUrl); // Extract filename
      const filePath = path.join(__dirname, "../my-upload/uploads", filename);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Failed to delete file:", err.message);
          // You may choose to ignore this error or return a warning
        }
      });

      return res.status(200).json({
        success: true,
        message: "Document and file deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the document.",
        error: error.message,
      });
    }
  }

  // static async deleteDocument(req, res) {
  //   try {
  //     const { documentId } = req.params;

  //     const document = await Document.findByIdAndDelete(documentId);

  //     if (!document) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "Document not found.",
  //       });
  //     }

  //     return res.status(200).json({
  //       success: true,
  //       message: "Document deleted successfully.",
  //     });
  //   } catch (error) {
  //     console.error("Error deleting document:", error);
  //     return res.status(500).json({
  //       success: false,
  //       message: "An error occurred while deleting the document.",
  //       error: error.message,
  //     });
  //   }
  // }
  // Search for documents by title
  static async searchDocuments(req, res) {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: "Query parameter is required.",
        });
      }

      const documents = await Document.find({
        title: { $regex: query, $options: "i" },
      });

      return res.status(200).json({
        success: true,
        message: "Documents searched successfully.",
        data: documents,
      });
    } catch (error) {
      console.error("Error searching documents:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while searching for documents.",
        error: error.message,
      });
    }
  }

  // static async uploadDocumentByJobTitle(req, res) {
  //   try {
  //     const { title, categoryId, uploadedBy, description, jobTitle } = req.body;

  //     // Validate fields
  //     const missingFields = [];
  //     if (!title) missingFields.push("title");
  //     if (!categoryId) missingFields.push("categoryId");
  //     if (!uploadedBy) missingFields.push("uploadedBy");
  //     if (!jobTitle) missingFields.push("jobTitle");
  //     if (!req.file) missingFields.push("file");

  //     if (missingFields.length > 0) {
  //       return res.status(400).json({
  //         success: false,
  //         message: `Missing required fields: ${missingFields.join(", ")}`,
  //       });
  //     }

  //     // Define filePath now (important)
  //     const filePath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  //     // Sanitize jobTitle
  //     const cleanJobTitle = jobTitle.trim();
  //     console.log('Searching EmploymentInfo for jobTitle:', cleanJobTitle);

  //     // Find employment records
  //     const employmentRecords = await EmploymentInfo.find({
  //       jobTitle: { $regex: `^${cleanJobTitle}$`, $options: "i" }
  //     });

  //     if (!employmentRecords || employmentRecords.length === 0) {
  //       return res.status(404).json({
  //         success: false,
  //         message: `No users found with job title: "${cleanJobTitle}"`,
  //       });
  //     }

  //     const userIds = employmentRecords.map((record) => record.userId);

  //     // Fetch user details
  //     const users = await User.find({ _id: { $in: userIds } });

  //     const completeRecipients = users.map((user) => ({
  //       userId: user._id.toString(),
  //       email: user.email,
  //     }));

  //     // Create document
  //     const document = await RoleDocument.create({
  //       title,
  //       description,
  //       filePath,
  //       categoryId,
  //       uploadedBy,
  //       recipients: completeRecipients.map((recipient) => ({
  //         userId: recipient.userId,
  //         status: "pending",
  //         email: recipient.email,
  //       })),
  //     });

  //     // Notify users
  //     await notifyUsers(completeRecipients, document);

  //     return res.status(201).json({
  //       success: true,
  //       message: `Document uploaded and sent to ${completeRecipients.length} recipients with job title: ${cleanJobTitle}`,
  //       data: document,
  //     });

  //   } catch (error) {
  //     console.error("Error uploading document by job title:", error);
  //     return res.status(500).json({
  //       success: false,
  //       message: "An error occurred while uploading the document.",
  //       error: error.message,
  //     });
  //   }
  // }
  // //GetALLdocumentsSendByRole
  // static async viewAllDocumentsByRole(req, res) {
  //   try {
  //     const documents = await RoleDocument.find().sort({ createdAt: -1 });

  //     return res.status(200).json({
  //       success: true,
  //       message: "All documents fetched successfully.",
  //       data: documents,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching documents:", error);
  //     return res.status(500).json({
  //       success: false,
  //       message: "An error occurred while fetching documents.",
  //       error: error.message,
  //     });
  //   }
  // }



}

module.exports = DocumentService;
