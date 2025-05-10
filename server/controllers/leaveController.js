const { default: mongoose } = require("mongoose");
const Leave = require("../models/leaveSchema");
const User = require("../models/userSchema");
const Employment = require("../models/employeementSchema");
const fs = require("fs");
const path = require("path");
const EmployeeLeaveAllocation = require("../models/leaveAllocationSchema");

class leaveController {
  static createLeaveRequest = async (req, res) => {
    const {
      userId,
      leaveTypeId,
      startDate,
      endDate,
      leaveDuration, // "half_day", "full_day", "multiple_days"
      reason,
    } = req.body;

    try {
      // Validate inputs for half-day leave
      let half = null; // Default value for half-day indication

      if (leaveDuration === "half_day") {
        if (new Date(startDate).toDateString() !== new Date(endDate).toDateString()) {
          return res
            .status(400)
            .json({ error: "Half-day leave must have the same start and end date" });
        }
        half = "first_half"; // Default to "first_half"
      }

      // Dynamically calculate leaveUnits
      let leaveUnits = 0;
      if (leaveDuration === "half_day") {
        leaveUnits = 0.5; // Set for half-day leave
      } else {
        leaveUnits = this.calculateLeaveDays(startDate, endDate); // Full-day or multiple days
      }

      // Create the leave request
      const leaveRequest = new Leave({
        userId,
        leaveTypeId,
        startDate,
        endDate,
        leaveDuration,
        half,
        leaveUnits,
        reason,
        supportingDocuments: null, // Default null; updated after processing file
      });

      // Save leaveRequest to get its ID
      await leaveRequest.save();

      // Handle file upload if supporting document is present
      if (req.file) {
        const leaveId = leaveRequest._id.toString(); // Get leave ID
        const originalFileName = req.file.originalname;
        const timestamp = Date.now();
        const fileName = `${timestamp}-${originalFileName}`;

        // Create user and leave-specific folder
        const userFolderPath = path.join(
          "my-upload/uploads/leaves",
          userId,
          leaveId
        );

        // Ensure the folder exists
        fs.mkdirSync(userFolderPath, { recursive: true });

        // Move the file to the specific folder
        const filePath = path.join(userFolderPath, fileName);
        fs.renameSync(req.file.path, filePath);

        // Save the file name (not full path) in the leave request
        leaveRequest.supportingDocuments = fileName;
        await leaveRequest.save();
      }

      res
        .status(201)
        .json({ message: "Leave request created successfully", leaveRequest });
    } catch (err) {
      console.error("Error creating leave request:", err);
      res.status(500).json({ error: "Error creating leave request" });
    }
  };

  // Calculate leave days (inclusive of both start and end dates)
  static calculateLeaveDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
    return diffDays;
  }

  // Calculate leave days (inclusive of both start and end dates)
  static calculateLeaveDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
    return diffDays;
  }

  // static createLeaveRequest = async (req, res) => {
  //   const {
  //     userId,
  //     leaveTypeId,
  //     startDate,
  //     endDate,
  //     leaveDuration, // "half_day", "full_day", "multiple_days"
  //     reason,
  //     supportingDocuments,
  //   } = req.body;

  //   try {
  //     // Validate inputs for half-day leave
  //     let half = null; // Default value for half-day indication

  //     if (leaveDuration === "half_day") {
  //       // Ensure start and end dates are the same for half-day leave
  //       if (new Date(startDate).toDateString() !== new Date(endDate).toDateString()) {
  //         return res
  //           .status(400)
  //           .json({ error: "Half-day leave must have the same start and end date" });
  //       }

  //       // Automatically determine if it's "first_half" or "second_half" based on time
  //       const currentHour = new Date(startDate).getHours();
  //       half = currentHour < 12 ? "first_half" : "second_half";
  //     }

  //     // Dynamically calculate leaveUnits
  //     let leaveUnits = 0;
  //     if (leaveDuration === "half_day") {
  //       leaveUnits = 0.5; // Set for half-day leave
  //     } else {
  //       leaveUnits = this.calculateLeaveDays(startDate, endDate); // Full-day or multiple days
  //     }

  //     // Create the leave request
  //     const leaveRequest = new Leave({
  //       userId,
  //       leaveTypeId,
  //       startDate,
  //       endDate,
  //       leaveDuration,
  //       half, // Dynamically set the specified half
  //       leaveUnits,
  //       reason,
  //       supportingDocuments,
  //     });

  //     await leaveRequest.save();
  //     res
  //       .status(201)
  //       .json({ message: "Leave request created successfully", leaveRequest });
  //   } catch (err) {
  //     console.error("Error creating leave request:", err);
  //     res.status(500).json({ error: "Error creating leave request" });
  //   }
  // };

  // Approve leave request
  // static approveLeaveRequest = async (req, res) => {
  //   const { leaveId } = req.params;
  //   const { managerComments } = req.body;

  //   try {
  //     const leaveRequest = await Leave.findById(leaveId)
  //       .populate("userId")
  //       .populate("leaveTypeId");

  //     if (!leaveRequest) {
  //       return res.status(404).json({ message: "Leave request not found" });
  //     }

  //     // Logic for leaveUnits based on leave type
  //     let leaveUnits = 0;
  //     if (leaveRequest.leaveDuration === "half_day") {
  //       leaveUnits = 0.5;

  //       // Handle first-half or second-half logic
  //       if (leaveRequest.half === "first_half") {
  //         console.log("Leave is for the first half of the day.");
  //       } else if (leaveRequest.half === "second_half") {
  //         console.log("Leave is for the second half of the day.");
  //       }
  //     } else {
  //       leaveUnits = this.calculateLeaveDays(
  //         leaveRequest.startDate,
  //         leaveRequest.endDate
  //       );
  //     }

  //     leaveRequest.leaveUnits = leaveUnits;
  //     leaveRequest.status = "approved";
  //     leaveRequest.managerComments = managerComments;

  //     // Fetch leave allocation
  //     const employeeLeaveAllocation = await EmployeeLeaveAllocation.findOne({
  //       userId: leaveRequest.userId._id,
  //       leaveTypeId: leaveRequest.leaveTypeId._id,
  //     });

  //     if (!employeeLeaveAllocation) {
  //       return res.status(400).json({ message: "No leave allocation found" });
  //     }

  //     // Check if sufficient leaves are available
  //     const remainingLeaves =
  //       employeeLeaveAllocation.allocatedLeaves -
  //       employeeLeaveAllocation.usedLeaves;

  //     if (leaveUnits > remainingLeaves) {
  //       return res
  //         .status(400)
  //         .json({ message: "Insufficient allocated leaves" });
  //     }

  //     // Update used leaves
  //     employeeLeaveAllocation.usedLeaves += leaveUnits;

  //     // Save changes
  //     await leaveRequest.save();
  //     await employeeLeaveAllocation.save();

  //     res.status(200).json({ message: "Leave request approved", leaveRequest });
  //   } catch (err) {
  //     console.error("Error approving leave request:", err);
  //     res.status(500).json({ error: "Error approving leave request" });
  //   }
  // };

  static approveLeaveRequest = async (req, res) => {
    const { leaveId } = req.params;
    const { managerComments } = req.body;

    try {
        const leaveRequest = await Leave.findById(leaveId)
            .populate("userId")
            .populate("leaveTypeId");

        if (!leaveRequest) {
            return res.status(404).json({ message: "Leave request not found" });
        }

        // Logic for leaveUnits based on leave type
        let leaveUnits = 0;
        if (leaveRequest.leaveDuration === "half_day") {
            leaveUnits = 0.5;

            // Handle first-half or second-half logic
            if (leaveRequest.half === "first_half") {
                console.log("Leave is for the first half of the day.");
            } else if (leaveRequest.half === "second_half") {
                console.log("Leave is for the second half of the day.");
            }
        } else {
            leaveUnits = this.calculateLeaveDays(
                leaveRequest.startDate,
                leaveRequest.endDate
            );
        }

        leaveRequest.leaveUnits = leaveUnits;
        leaveRequest.status = "approved";
        leaveRequest.managerComments = managerComments;

        // Fetch leave allocation
        const employeeLeaveAllocation = await EmployeeLeaveAllocation.findOne({
            userId: leaveRequest.userId._id,
            leaveTypeId: leaveRequest.leaveTypeId._id,
        });

        if (!employeeLeaveAllocation) {
            return res.status(400).json({ message: "No leave allocation found" });
        }

        // Check if sufficient leaves are available
        const remainingLeaves =
            employeeLeaveAllocation.allocatedLeaves -
            employeeLeaveAllocation.usedLeaves;

        if (leaveUnits > remainingLeaves) {
            return res
                .status(400)
                .json({ message: "Insufficient allocated leaves" });
        }

        // Update used leaves
        employeeLeaveAllocation.usedLeaves += leaveUnits;

        // Update user status if necessary
        const user = await Employment.findOne({ userId: leaveRequest.userId._id });
        console.log(user);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user status to "on_leave" or other appropriate status
        user.employmentStatus = "on leave";

        // Save changes
        await leaveRequest.save();
        await employeeLeaveAllocation.save();
        await user.save();

        res.status(200).json({ message: "Leave request approved", leaveRequest });
    } catch (err) {
        console.error("Error approving leave request:", err);
        res.status(500).json({ error: "Error approving leave request" });
    }
};


  // Reject leave request
  static rejectLeaveRequest = async (req, res) => {
    try {
      const { leaveId } = req.params;
      const { managerComments } = req.body;

      const leaveRequest = await Leave.findById(leaveId).populate("userId");

      if (!leaveRequest) {
        return res.status(404).json({ message: "Leave request not found" });
      }

      leaveRequest.status = "rejected";
      leaveRequest.managerComments = managerComments;
      await leaveRequest.save();

      res.status(200).json({ message: "Leave request rejected", leaveRequest });
    } catch (error) {
      console.error("Error rejecting leave request:", error);
      res
        .status(500)
        .json({
          message: "Error rejecting leave request",
          error: error.message,
        });
    }
  };

  // Calculate leave days
  static calculateLeaveDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive of the end date
    return diffDays;
  }

  // View all leave requests
  static viewLeave = async (req, res) => {
    try {
      const organizationId =
        req.user?.organizationId || req.body.organizationId;

      if (!organizationId) {
        return res.status(404).json({ message: "Organization ID is missing" });
      }

      const validOrganizationId = new mongoose.Types.ObjectId(organizationId);

      const leaveRequest = await Leave.find().populate({
        path: "userId",
        select: "name organizationId ",
        match: { organizationId: validOrganizationId },
      });

      return res.status(200).json({
        message: "Leave requests retrieved successfully",
        info: leaveRequest,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error retrieving data", error: error.message });
    }
  };

  // View leave request by ID
  // static viewLeaveById = async (req, res) => {
  //   try {
  //     const userId = req.user._id;
  //     const organizationId = req.user?.organizationId || req.user.body;

  //     if (!organizationId) {
  //       return res.status(404).json({ message: "Organization Id is missing" });
  //     }

  //     const validOrganizationId = new mongoose.Types.ObjectId(organizationId);

  //     const leaveRequest = await Leave.findById(userId).populate({
  //       path: "userId",
  //       select: "name organizationId",
  //       match: { organizationId: validOrganizationId },
  //     });

  //     return res.status(200).json({
  //       message: "Leave requests retrieved successfully",
  //       info: leaveRequest,
  //     });
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .json({ message: "Error retrieving leaves", error: error.message });
  //   }
  // };

  // View leave request by ID
  

    // Get leave requests by userId
    static getLeaveByUserId = async (req, res) => {
      try {
        // Extract userId from request parameters
        const userId = req.params.userId;
  
        if (!userId) {
          return res.status(400).json({ message: "User ID is required" });
        }
  
        // Validate userId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: "Invalid User ID" });
        }
  
        // Fetch leave requests for the given userId
        const leaveRequests = await Leave.find({ userId })
          .populate("leaveTypeId", "name description") // Populate leave type details
          .sort({ createdAt: -1 }); // Sort by newest leave requests first
  
        if (leaveRequests.length === 0) {
          return res.status(404).json({
            message: "No leave requests found for the specified user",
          });
        }
  
        return res.status(200).json({
          message: "Leave requests retrieved successfully",
          data: leaveRequests,
        });
      } catch (error) {
        return res.status(500).json({
          message: "Error retrieving leave requests",
          error: error.message,
        });
      }
    };

//mployee: Can update their own leave request (before approval).
static updateLeave = async (req, res) => {
  const { leaveId } = req.params; // Get leave ID from URL params
  const updateData = req.body; // Data to update

  try {
    // Find and update the leave request
    const updatedLeave = await Leave.findByIdAndUpdate(
      leaveId,
      updateData, // Directly update all fields provided in the request body
      { new: true } // Return updated document
    );

    // If leave request doesn't exist
    if (!updatedLeave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    // Return success response
    res.status(200).json({
      message: "Leave request updated successfully",
      leaveRequest: updatedLeave,
    });
  } catch (error) {
    console.error("Error updating leave request:", error);
    res.status(500).json({ error: "Error updating leave request" });
  }
};

static deleteLeave = async (req, res) => {
  const { leaveId } = req.params;

  try {
    // Find the leave request to check if it exists and get its status
    const leaveRequest = await Leave.findById(leaveId);

    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    // Optionally: Prevent deletion of approved leaves
    if (leaveRequest.status === "approved") {
      return res.status(400).json({ 
        message: "Cannot delete an approved leave request" 
      });
    }

    // Delete the leave request
    await Leave.findByIdAndDelete(leaveId);

    // If there was a supporting document, delete it from the filesystem
    if (leaveRequest.supportingDocuments) {
      const filePath = path.join(
        "my-upload/uploads/leaves",
        leaveRequest.userId.toString(),
        leaveId,
        leaveRequest.supportingDocuments
      );

      // Delete the file if it exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Optionally: Remove the empty directory
      const dirPath = path.dirname(filePath);
      if (fs.existsSync(dirPath)) {
        fs.rmdirSync(dirPath, { recursive: true });
      }
    }

    res.status(200).json({ 
      message: "Leave request deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting leave request:", error);
    res.status(500).json({ 
      error: "Error deleting leave request",
      message: error.message 
    });
  }
};
  

}

module.exports = leaveController;
