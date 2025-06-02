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
      appliedBy,
      leaveTypeId,
      startDate,
      endDate,
      leaveDuration,
      reason,
    } = req.body;

    try {
      let requestingUserRole = req.user.role;

      // Convert dates to start of day for consistent comparison
      const newStartDate = new Date(startDate);
      newStartDate.setHours(0, 0, 0, 0);
      const newEndDate = new Date(endDate);
      newEndDate.setHours(23, 59, 59, 999);

      // Check for existing leave requests that overlap with the requested dates
      const existingLeave = await Leave.findOne({
        userId,
        status: { $ne: 'rejected' }, // Exclude rejected leaves
        $or: [
          {
            $and: [
              { startDate: { $lte: newEndDate } },
              { endDate: { $gte: newStartDate } }
            ]
          }
        ]
      });

      if (existingLeave) {
        console.log('Found overlapping leave:', existingLeave);
        return res.status(400).json({ 
          error: "You already have a leave request for these dates",
          existingLeave: {
            startDate: existingLeave.startDate,
            endDate: existingLeave.endDate,
            status: existingLeave.status
          }
        });
      }

      let half = null;
      if (leaveDuration === "half_day") {
        if (new Date(startDate).toDateString() !== new Date(endDate).toDateString()) {
          return res.status(400).json({ 
            error: "Half-day leave must have the same start and end date" 
          });
        }

        // For half-day, check if there's already any leave on this date
        const existingHalfDayLeave = await Leave.findOne({
          userId,
          status: { $ne: 'rejected' },
          $and: [
            { startDate: { $lte: newEndDate } },
            { endDate: { $gte: newStartDate } }
          ]
        });

        if (existingHalfDayLeave) {
          console.log('Found existing half-day leave:', existingHalfDayLeave);
          return res.status(400).json({ 
            error: "You already have a leave request for this date",
            existingLeave: {
              startDate: existingHalfDayLeave.startDate,
              endDate: existingHalfDayLeave.endDate,
              status: existingHalfDayLeave.status
            }
          });
        }

        half = "first_half";
      }

      // Calculate total days and working days
      const totalDays = Math.ceil(Math.abs(newEndDate - newStartDate) / (1000 * 60 * 60 * 24)) + 1;
      let leaveUnits = 0;

      if (leaveDuration === "half_day") {
        const date = new Date(startDate);
        const dayOfWeek = date.getDay();
        
        // For half days, check if it's a working day
        if (dayOfWeek === 0 || // Sunday
            (dayOfWeek === 6 && this.isAlternateSaturday(date))) { // Alternate Saturday
          leaveUnits = 0; // Non-working day
        } else {
          leaveUnits = 0.5;
        }
      } else {
        // For full days, calculate only working days
        leaveUnits = this.calculateLeaveDays(startDate, endDate);
      }

      const allocation = await EmployeeLeaveAllocation.findOne({
        userId,
        leaveTypeId
      });

      if (!allocation) {
        return res.status(400).json({ 
          error: "No leave allocation found for this leave type" 
        });
      }

      const availableLeaves = allocation.allocatedLeaves - allocation.usedLeaves;
      if (leaveUnits > availableLeaves) {
        return res.status(400).json({ 
          error: "Insufficient leave balance" 
        });
      }

      // Only deduct working days from leave balance
      if (leaveUnits > 0) {
        allocation.usedLeaves += leaveUnits;
        await allocation.save();
      }

      const status = requestingUserRole === 'super_admin'? 'approved':'pending';

      const leaveRequest = new Leave({
        userId,
        appliedBy,
        leaveTypeId,
        startDate,
        endDate,
        leaveDuration,
        half,
        leaveUnits,
        reason,
        status,
        supportingDocuments: null,
      });

      if (req.file) {
        const leaveId = leaveRequest._id.toString();
        const originalFileName = req.file.originalname;
        const timestamp = Date.now();
        const fileName = `${timestamp}-${originalFileName}`;

        const userFolderPath = path.join(
          "my-upload/uploads/leaves",
          userId,
          leaveId
        );

        fs.mkdirSync(userFolderPath, { recursive: true });
        const filePath = path.join(userFolderPath, fileName);
        fs.renameSync(req.file.path, filePath);

        leaveRequest.supportingDocuments = fileName;
      }

      await leaveRequest.save();

      // Calculate non-working days for the response
      const nonWorkingDays = totalDays - leaveUnits;

      res.status(201).json({ 
        message: "Leave request created successfully", 
        leaveRequest,
        updatedBalance: {
          allocated: allocation.allocatedLeaves,
          used: allocation.usedLeaves,
          available: allocation.allocatedLeaves - allocation.usedLeaves,
          nonWorkingDaysIncluded: nonWorkingDays
        }
      });

    } catch (err) {
      console.error("Error creating leave request:", err);
      res.status(500).json({ error: "Error creating leave request" });
    }
  };

  

  static isAlternateSaturday(date) {
    // Reference date known to be an alternate Saturday (31/05/2025)
    const referenceDate = new Date(2025, 4, 31); // Month is 0-based
    
    // Calculate weeks between the reference date and the given date
    const weeksDiff = Math.floor((date - referenceDate) / (7 * 24 * 60 * 60 * 1000));
    
    // If weeks difference is even, it follows the same pattern as reference date
    return weeksDiff % 2 === 0;
  }

  static calculateLeaveDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let workingDays = 0;
    const currentDate = new Date(start);

    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      
      // Don't count Sundays (0 is Sunday)
      if (dayOfWeek !== 0) {
        // For Saturdays, check if it's an alternate Saturday
        if (dayOfWeek === 6) {
          if (!this.isAlternateSaturday(currentDate)) {
            workingDays++; // Count only working Saturdays
          }
        } else {
          // Count all other weekdays
          workingDays++;
        }
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return workingDays;
  }

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

      // Check if already approved
      if (leaveRequest.status === "approved") {
        return res.status(400).json({ message: "Leave request already approved" });
      }

      // Only calculate leave units if not already set
      if (!leaveRequest.leaveUnits) {
        let leaveUnits = 0;
        if (leaveRequest.leaveDuration === "half_day") {
          leaveUnits = 0.5;
        } else {
          leaveUnits = this.calculateLeaveDays(
            leaveRequest.startDate,
            leaveRequest.endDate
          );
        }
        leaveRequest.leaveUnits = leaveUnits;
      }

      // Fetch leave allocation (no need to deduct again)
      const employeeLeaveAllocation = await EmployeeLeaveAllocation.findOne({
        userId: leaveRequest.userId._id,
        leaveTypeId: leaveRequest.leaveTypeId._id,
      });

      if (!employeeLeaveAllocation) {
        return res.status(400).json({ message: "No leave allocation found" });
      }

      // Verify sufficient leaves are available (should already be checked at creation)
      const remainingLeaves = employeeLeaveAllocation.allocatedLeaves - employeeLeaveAllocation.usedLeaves;
      if (leaveRequest.leaveUnits > remainingLeaves) {
        return res.status(400).json({ message: "Insufficient allocated leaves" });
      }

      // Update status and comments (no need to update usedLeaves again)
      leaveRequest.status = "approved";
      leaveRequest.managerComments = managerComments;

      // Update user status to "on leave"
      const user = await Employment.findOne({ userId: leaveRequest.userId._id });
      if (user) {
        user.employmentStatus = "on leave";
        await user.save();
      }

      // Save changes
      await leaveRequest.save();

      res.status(200).json({ 
        message: "Leave request approved", 
        leaveRequest,
        updatedBalance: {
          allocated: employeeLeaveAllocation.allocatedLeaves,
          used: employeeLeaveAllocation.usedLeaves,
          available: remainingLeaves
        }
      });
    } catch (err) {
      console.error("Error approving leave request:", err);
      res.status(500).json({ error: "Error approving leave request" });
    }
  };

  static rejectLeaveRequest = async (req, res) => {
    try {
      const { leaveId } = req.params;
      const { managerComments } = req.body;

      const leaveRequest = await Leave.findById(leaveId)
        .populate("userId")
        .populate("leaveTypeId");

      if (!leaveRequest) {
        return res.status(404).json({ message: "Leave request not found" });
      }

      // Only refund leaves if status was previously approved
      
        const allocation = await EmployeeLeaveAllocation.findOne({
          userId: leaveRequest.userId._id,
          leaveTypeId: leaveRequest.leaveTypeId._id
        });

        if (allocation) {
          allocation.usedLeaves -= leaveRequest.leaveUnits;
          await allocation.save();
        }
      

      // Update leave request status
      leaveRequest.status = "rejected";
      leaveRequest.managerComments = managerComments;
      await leaveRequest.save();

      // Update user status back to active if needed
      const user = await Employment.findOne({ 
        userId: leaveRequest.userId._id 
      });
      if (user && user.employmentStatus === "on leave") {
        user.employmentStatus = "active";
        await user.save();
      }

      res.status(200).json({ 
        message: "Leave request rejected", 
        leaveRequest,
        updatedBalance: allocation ? {
          allocated: allocation.allocatedLeaves,
          used: allocation.usedLeaves,
          available: allocation.allocatedLeaves - allocation.usedLeaves
        } : null
      });

    } catch (error) {
      console.error("Error rejecting leave request:", error);
      res.status(500).json({
        message: "Error rejecting leave request",
        error: error.message,
      });
    }
  };

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

  static serveLeaveDocument = (req,res)=>{
    const {userId, leaveId, fileName} = req.params;

    const filePath = path.join(
      __dirname,
      "..",
      "my-upload",
      "uploads",
      "leaves",
      userId,
      leaveId,
      fileName
    );
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  }

  static deleteLeave = async (req, res) => {
    const { leaveId } = req.params;

    try {
      
       const leaveRequest = await Leave.findById(leaveId)
        .populate('userId')
        .populate('leaveTypeId');

      if (!leaveRequest) {
        return res.status(404).json({ message: "Leave request not found" });
      }

      console.log('Supporting Document:', leaveRequest.supportingDocuments);


      if (leaveRequest.status === "approved") {
        return res.status(400).json({ 
          message: "Cannot delete an approved leave request" 
        });
      }

      console.log("leave request:",leaveRequest)

       const allocation = await EmployeeLeaveAllocation.findOne({
        userId: leaveRequest.userId._id,
        leaveTypeId: leaveRequest.leaveTypeId._id
      });

      if (!allocation) {
        return res.status(400).json({ message: "Leave allocation not found" });
      }
       if (allocation) {
          allocation.usedLeaves -= leaveRequest.leaveUnits;
          await allocation.save();
        }


      await Leave.findByIdAndDelete(leaveId);


      if (leaveRequest.supportingDocuments) {
    const filePath = path.resolve(
      "my-upload/uploads/leaves",
      leaveRequest.userId._id.toString(),
      leaveId,
      leaveRequest.supportingDocuments
    );



    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("File deleted successfully");
    } else {
      console.log("File does not exist at path:", filePath);
    }


    const dirPath = path.dirname(filePath);
    if (fs.existsSync(dirPath)) {
      fs.rmdirSync(dirPath, { recursive: true });
      console.log("Directory deleted:", dirPath);
    } else {
      console.log("Directory not found:", dirPath);
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
