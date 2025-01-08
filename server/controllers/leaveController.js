const { default: mongoose } = require("mongoose");
const Leave = require("../models/leaveSchema");
const User = require("../models/userSchema");
const EmployeeLeaveAllocation = require("../models/leaveAllocationSchema");

class leaveController {
  // Create a new leave request
  static createLeaveRequest = async (req, res) => {
    const {
      userId,
      leaveTypeId,
      startDate,
      endDate,
      leaveDuration, // "half_day", "full_day", "multiple_days"
      reason,
      supportingDocuments,
    } = req.body;

    try {
      // Validate inputs for half-day leave
      let half = null; // Default value for half-day indication

      if (leaveDuration === "half_day") {
        // Ensure start and end dates are the same for half-day leave
        if (new Date(startDate).toDateString() !== new Date(endDate).toDateString()) {
          return res
            .status(400)
            .json({ error: "Half-day leave must have the same start and end date" });
        }

        // Automatically determine if it's "first_half" or "second_half" based on time
        const currentHour = new Date(startDate).getHours();
        half = currentHour < 12 ? "first_half" : "second_half";
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
        half, // Dynamically set the specified half
        leaveUnits,
        reason,
        supportingDocuments,
      });

      await leaveRequest.save();
      res
        .status(201)
        .json({ message: "Leave request created successfully", leaveRequest });
    } catch (err) {
      console.error("Error creating leave request:", err);
      res.status(500).json({ error: "Error creating leave request" });
    }
  };

  // Approve leave request
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
        return res.status(400).json({ message: "Insufficient allocated leaves" });
      }

      // Update used leaves
      employeeLeaveAllocation.usedLeaves += leaveUnits;

      // Save changes
      await leaveRequest.save();
      await employeeLeaveAllocation.save();

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
        .json({ message: "Error rejecting leave request", error: error.message });
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
        select: "name organizationId",
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
  static viewLeaveById = async (req, res) => {
    try {
      const userId = req.user._id;
      const organizationId = req.user?.organizationId || req.user.body;

      if (!organizationId) {
        return res.status(404).json({ message: "Organization Id is missing" });
      }

      const validOrganizationId = new mongoose.Types.ObjectId(organizationId);

      const leaveRequest = await Leave.findById(userId).populate({
        path: "userId",
        select: "name organizationId",
        match: { organizationId: validOrganizationId },
      });

      return res.status(200).json({
        message: "Leave requests retrieved successfully",
        info: leaveRequest,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving leaves", error: error.message });
    }
  };
}

module.exports = leaveController;
