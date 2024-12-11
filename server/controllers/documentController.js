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
// const notifyUsers = require("../utility/notifyUsers");
const User = require("../models/userSchema");

// const BASE_URL = process.env.BASE_URL || "http://localhost:3000"; // Fallback for base URL

class DocumentService {
  static async uploadDocumentWithRecipients(req, res) {
    try {
      const { title, categoryId, recipients, uploadedBy } = req.body;

      if (!title || !categoryId || !uploadedBy) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields." });
      }

      if (!Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Recipients must be a non-empty array.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded.",
        });
      }

      const filePath = `${req.protocol}://${req.get("host")}/uploads/images/${
        req.file.filename
      }`;

      // Fetch user details
      const userIds = recipients.map((id) => id);
      const users = await User.find({ _id: { $in: userIds } });

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

      // Create document
      const document = await Document.create({
        title,
        filePath,
        categoryId,
        uploadedBy,
        recipients: completeRecipients.map((recipient) => ({
          userId: recipient.userId,
          status: "pending",
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
}

module.exports = DocumentService;
