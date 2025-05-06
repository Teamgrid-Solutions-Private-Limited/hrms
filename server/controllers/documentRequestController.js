const DocumentRequest = require("../models/documentRequest");
const DocumentCategory = require("../models/documentCategory");
const DocumentTemplate = require("../models/documentTemplateSchema");
const userprofiles = require("../models/userProfileSchema");


class DocumentRequestController {
  // Create a new document request
  static async createDocumentRequest(req, res) {
    try {
      const {
        title,
        description,
        categoryId,
        employee,
        format,
        maxSize,
        dueDate,
        templateId,
      } = req.body;

      // Create a new document request
      const newRequest = new DocumentRequest({
        title,
        description,
        categoryId,
        requestedBy: req.user.id, // Assuming JWT middleware adds req.user
        employee,
        format,
        maxSize,
        dueDate,
        templateId,
      });

      // Save to database
      await newRequest.save();

      // Respond with success
      return res.status(201).json({
        message: "Document request created successfully",
        request: newRequest,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    }
  }

  // Get all document requests
  static async getDocumentRequests(req, res) {
    try {
      const { page = 1, limit = 10, search, categoryId, employee } = req.query;

      // Build query object
      const query = {};
      if (search) {
        query.title = { $regex: search, $options: "i" }; // Case-insensitive search by title
      }
      if (categoryId) {
        query.categoryId = categoryId;
      }
      if (employee) {
        query.employee = employee;
      }

      // Fetch document requests with pagination
      const documentRequests = await DocumentRequest.find(query)
        // .skip((page - 1) * limit)
        // .limit(parseInt(limit))
        .sort({ createdAt: -1 }) // Sort by latest created
        .populate("categoryId employee requestedBy templateId"); // Populate related fields

      // Get total count for pagination
      const total = await DocumentRequest.countDocuments(query);

      // Respond with data
      return res.status(200).json({
        message: "Document requests fetched successfully",
        data: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          documentRequests: documentRequests.map((req) => ({
            ...req._doc,
            employee: req.employee || "No employee assigned",
          })),
        },
      });
    } catch (err) {
      return res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    }
  }

// Get a specific document request by ID
static async getDocumentRequestById(req, res) {
  try {
    const { id } = req.params;
    const documentRequest = await DocumentRequest.findById(id)
      .populate("categoryId", "name")
      .populate("requestedBy", "name email")
      .populate("employee", "name email")
      .populate("templateId", "title");
    

    // Log the employee field to debug
    console.log("Employee populated value:", documentRequest.employee);

    if (!documentRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Document request not found" });
    }

    res.status(200).json({ success: true, data: documentRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Get document requests by employee userId
static async getRequestsByEmployee(req, res) {
  try {
    const { userId } = req.params;
    const documentRequests = await DocumentRequest.find({ employee: userId })
      .sort({ createdAt: -1 })
      .populate("categoryId", "name")
      .populate("requestedBy", "name email")
      .populate("employee",)
      .populate("templateId", "title");

    if (!documentRequests.length) {
      return res
        .status(404)
        .json({ success: false, message: "No document requests found for this employee" });
    }

    res.status(200).json({ success: true, data: documentRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Get document requests for the currently logged-in employee
static async getLoggedInEmployeeRequests(req, res) {
  try {
    const employeeId = req.user.id; // From JWT middleware

    const documentRequests = await DocumentRequest.find({ employee: employeeId })
      .sort({ createdAt: -1 })
      .populate("categoryId", "name")
      .populate("requestedBy", "name email firstName lastName")
      .populate("employee",)
      .populate("templateId", "title");

    if (!documentRequests.length) {
      return res.status(404).json({
        success: false,
        message: "No document requests found for this employee",
      });
    }

    res.status(200).json({ success: true, data: documentRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


  // // Get a specific document request by ID
  // static async getDocumentRequestById(req, res) {
  //   try {
  //     const { id } = req.params;
  //     const documentRequest = await DocumentRequest.findById(id)
  //       .populate("categoryId", "name")
  //       .populate("requestedBy", "name email")
  //       .populate("employee", "name email")
  //       .populate("templateId", "title");

  //     if (!documentRequest) {
  //       return res
  //         .status(404)
  //         .json({ success: false, message: "Document request not found" });
  //     }

  //     res.status(200).json({ success: true, data: documentRequest });
  //   } catch (error) {
  //     res.status(500).json({ success: false, message: error.message });
  //   }
  // }

  // Update a document request
  static async updateDocumentRequest(req, res) {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      const updatedDocumentRequest = await DocumentRequest.findByIdAndUpdate(
        id,
        updatedData,
        { new: true }
      );

      if (!updatedDocumentRequest) {
        return res
          .status(404)
          .json({ success: false, message: "Document request not found" });
      }

      res.status(200).json({ success: true, data: updatedDocumentRequest });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Delete a document request
  static async deleteDocumentRequest(req, res) {
    try {
      const { id } = req.params;
      const deletedDocumentRequest = await DocumentRequest.findByIdAndDelete(
        id
      );

      if (!deletedDocumentRequest) {
        return res
          .status(404)
          .json({ success: false, message: "Document request not found" });
      }

      res.status(200).json({
        success: true,
        message: "Document request deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update the status of a document request
  static async updateDocumentRequestStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Validate status
      const validStatuses = ["pending", "submitted", "approved", "rejected"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of ${validStatuses.join(", ")}`,
        });
      }

      const updatedRequest = await DocumentRequest.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedRequest) {
        return res
          .status(404)
          .json({ success: false, message: "Document request not found" });
      }

      res.status(200).json({ success: true, data: updatedRequest });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = DocumentRequestController;
