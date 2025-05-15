const DocumentSubmission = require("../models/documentSubmissionSchema");
const DocumentRequest = require("../models/documentRequest");
const DocumentCategory = require("../models/documentCategory");
const Document = require("../models/documentSchema");
const User = require("../models/userSchema");

class DocumentSubmissionController {
  /**
   * Create a new document submission
   */
  static async createSubmission(req, res) {
    try {
      const { documentRequestId } = req.body;

      // Check if a file is uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded.",
        });
      }

      // Construct the file path URL
      const filePath = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;

      // Validate the input fields
      if (!documentRequestId) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: documentRequestId",
        });
      }

      // Validate the document request
      const documentRequest = await DocumentRequest.findById(
        documentRequestId
      ).populate("categoryId", "name");
      if (!documentRequest) {
        return res.status(404).json({
          success: false,
          message: "Document request not found",
        });
      }

      // Create a new document submission
      const documentSubmission = new DocumentSubmission({
        documentRequestId,
        submittedBy: req.user.id, // Assuming `req.user` is set by authentication middleware
        filePath, // Use constructed file path
      });

      await documentSubmission.save();

      return res.status(201).json({
        success: true,
        message: "Document submission created successfully",
        data: documentSubmission,
      });
    } catch (error) {
      console.error("Error creating document submission:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Review a document submission
   */
  static async reviewSubmission(req, res) {
    try {
      const { id } = req.params;
      const { status, feedback } = req.body;

      // Validate status
      if (!["reviewed", "approved", "rejected","pending"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      // Find the submission
      const documentSubmission = await DocumentSubmission.findById(id).populate(
        "documentRequestId",
        "title"
      );
      if (!documentSubmission) {
        return res
          .status(404)
          .json({ message: "Document submission not found" });
      }

      // Update submission status and feedback
      documentSubmission.status = status;
      documentSubmission.feedback = feedback || null;
      documentSubmission.reviewedAt = new Date();
      documentSubmission.reviewedBy = req.user.id;

      await documentSubmission.save();

      return res.status(200).json({
        message: "Document submission reviewed successfully",
        data: documentSubmission,
      });
    } catch (error) {
      console.error("Error reviewing document submission:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Fetch submissions by document request ID
   */
  static async getSubmissionsByRequest(req, res) {
    try {
      const { documentRequestId } = req.params;

      const submissions = await DocumentSubmission.find({ documentRequestId })
        .populate("submittedBy", "name email")
        .populate("reviewedBy", "name email")
        .populate({
          path: "documentRequestId",
          populate: { path: "categoryId", select: "name" },
        });

      return res.status(200).json({
        message: "Submissions retrieved successfully",
        data: submissions,
      });
    } catch (error) {
      console.error("Error fetching submissions:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Fetch a single document submission by ID
   */
  static async getSubmissionById(req, res) {
    try {
      const { id } = req.params;

      const submission = await DocumentSubmission.findById(id)
        .populate("documentRequestId", "title description dueDate")
        .populate("submittedBy", "name email")
        .populate("reviewedBy", "name email")
        .populate({
          path: "documentRequestId",
          populate: { path: "categoryId", select: "name" },
        });

      if (!submission) {
        return res
          .status(404)
          .json({ message: "Document submission not found" });
      }

      return res.status(200).json({
        message: "Document submission retrieved successfully",
        data: submission,
      });
    } catch (error) {
      console.error("Error fetching submission:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Fetch all submissions by an employee
   */
  static async getSubmissionsByEmployee(req, res) {
    try {
      const { employeeId } = req.params;

      const submissions = await DocumentSubmission.find({
        submittedBy: employeeId,
      })
        .populate("documentRequestId", "title description dueDate")
        .populate("reviewedBy", "name email")
        .populate({
          path: "documentRequestId",
          populate: { path: "categoryId", select: "name" },
        });

      return res.status(200).json({
        message: "Submissions by employee retrieved successfully",
        data: submissions,
      });
    } catch (error) {
      console.error("Error fetching submissions by employee:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Fetch all document submissions
   */
  static async getAllSubmissions(req, res) {
    try {
      const submissions = await DocumentSubmission.find()
        .populate("submittedBy", "name email")
        .populate("reviewedBy", "name email")
        .populate({
          path: "documentRequestId",
          populate: { path: "categoryId", select: "name" },
        });

      return res.status(200).json({
        message: "All document submissions retrieved successfully",
        data: submissions,
      });
    } catch (error) {
      console.error("Error fetching all submissions:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
 * Delete a document submission by ID
 */
static async deleteSubmission(req, res) {
  try {
    const { id } = req.params;

    const deletedSubmission = await DocumentSubmission.findByIdAndDelete(id);

    if (!deletedSubmission) {
      return res.status(404).json({
        success: false,
        message: "Document submission not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Document submission deleted successfully",
      data: deletedSubmission,
    });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

}



module.exports = DocumentSubmissionController;
