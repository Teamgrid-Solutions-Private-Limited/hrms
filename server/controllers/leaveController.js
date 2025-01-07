// const { default: mongoose } = require("mongoose");
// const Leave = require("../models/leaveSchema");
// const User = require("../models/userSchema");
// const EmployeeLeaveAllocation = require("../models/leaveAllocationSchema");
// class leaveController {
//   static createLeaveRequest = async (req, res) => {
//     const {
//       userId,
//       leaveTypeId,
//       startDate,
//       endDate,
//       reason,
//       supportingDocuments,
//     } = req.body;

//     try {
//       const leaveRequest = new Leave({
//         userId,
//         leaveTypeId,
//         startDate,
//         endDate,
//         reason,
//         supportingDocuments,
//       });

//       await leaveRequest.save();
//       res
//         .status(201)
//         .json({ message: "Leave request created successfully", leaveRequest });
//     } catch (err) {
//       console.error("Error creating leave request:", err);
//       res.status(500).json({ error: "Error creating leave request" });
//     }
//   };

//   // static    approveLeaveRequest = async (req, res) => {
//   //         const { leaveId } = req.params;
//   //         const { managerComments } = req.body;

//   //         try {
//   //             const leaveRequest = await Leave.findById(leaveId).populate('employeeId').populate('leaveTypeId');

//   //             if (!leaveRequest) {
//   //                 return res.status(404).json({ message: 'Leave request not found' });
//   //             }

//   //             leaveRequest.status = 'approved';
//   //             leaveRequest.managerComments = managerComments;
//   //             await leaveRequest.save();

//   //             // const user = leaveRequest.employeeId;
//   //             const allocatedLeaves = leaveRequest.leaveTypeId.allocatedLeaves;
//   //             if(allocatedLeaves == undefined || allocatedLeaves==null)
//   //                 {
//   //                     return res.status(400).json({message:"allocated leaves is not defined for this leavve type"});

//   //                 }
//   //               const leaveDays = this.calculateLeaveDays(leaveRequest.startDate, leaveRequest.endDate); // Update the leave balance

//   //               if(leaveDays > allocatedLeaves)
//   //               {
//   //                 return res.status(400).json({message:"  insufficient allocated  leaves "});
//   //               }
//   //               allocatedLeaves -= leaveDays;
//   //               leaveRequest.leaveTypeId.allocatedLeaves = allocatedLeaves;

//   //               await leaveRequest.leaveTypeId.save();

//   //             res.status(200).json({ message: 'Leave request approved', leaveRequest });
//   //         } catch (err) {
//   //             console.error('Error approving leave request:', err);
//   //             res.status(500).json({ error: 'Error approving leave request' });
//   //         }
//   //     };

//   static approveLeaveRequest = async (req, res) => {
//     const { leaveId } = req.params;
//     const { managerComments } = req.body;

//     try {
//       // Find the leave request
//       const leaveRequest = await Leave.findById(leaveId)
//         .populate("userId")
//         .populate("leaveTypeId");
//       if (!leaveRequest) {
//         return res.status(404).json({ message: "Leave request not found" });
//       }

//       // Approve the leave request and update manager comments
//       leaveRequest.status = "approved";
//       leaveRequest.managerComments = managerComments;

//       // Calculate the number of leave days
//       const leaveDays = this.calculateLeaveDays(
//         leaveRequest.startDate,
//         leaveRequest.endDate
//       );

//       // Fetch the employee's specific leave allocation
//       const employeeLeaveAllocation = await EmployeeLeaveAllocation.findOne({
//         userId: leaveRequest.userId._id,
//         leaveTypeId: leaveRequest.leaveTypeId._id,
//       });

//       if (!employeeLeaveAllocation) {
//         return res
//           .status(400)
//           .json({ message: "No leave allocation found for this employee" });
//       }

//       // Check if the employee has enough allocated leaves
//       const remainingLeaves =
//         employeeLeaveAllocation.allocatedLeaves -
//         employeeLeaveAllocation.usedLeaves;
//       if (leaveDays > remainingLeaves) {
//         return res
//           .status(400)
//           .json({ message: "Insufficient allocated leaves" });
//       }

//       // Update the used leaves for the employee
//       employeeLeaveAllocation.usedLeaves += leaveDays;

//       // Save the updated leave request and employee leave allocation
//       await leaveRequest.save();
//       await employeeLeaveAllocation.save();

//       res.status(200).json({ message: "Leave request approved", leaveRequest });
//     } catch (err) {
//       console.error("Error approving leave request:", err);
//       res.status(500).json({ error: "Error approving leave request" });
//     }
//   };

//   static rejectLeaveRequest = async (req, res) => {
//     try {
//       const { leaveId } = req.params;
//       const { managerComments } = req.body;
//       const leaveRequest = await Leave.findById(leaveId).populate("employeeId");

//       if (!leaveRequest) {
//         return res.status(404).json({ message: "Leave request not found" });
//       }

//       leaveRequest.status = "rejected";
//       leaveRequest.managerComments = managerComments;
//       await leaveRequest.save();

//       res.status(200).json({ message: "Leave request rejected", leaveRequest });
//     } catch (error) {
//       console.error("Error approving leave request:", err);
//       res.status(500).json({
//         message: "Error approving leave request",
//         error: error.message,
//       });
//     }
//   };

//   static calculateLeaveDays(startDate, endDate) {
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     const diffTime = Math.abs(end - start);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include the end date
//     return diffDays;
//   }
//   static viewLeave = async (req, res) => {
//     try {
//       const organizationId =
//         req.user?.organizationId || req.body.organizationId;

//       if (!organizationId) {
//         return res.status(404).json({ message: "Organization ID is missing" });
//       }

//       // Convert organizationId to ObjectId for the query
//       const validOrganizationId = new mongoose.Types.ObjectId(organizationId);

//       const leaveRequest = await Leave.find().populate({
//         path: "userId",
//         select: "name organizationId",
//         match: { organizationId: validOrganizationId },
//       });

//       return res.status(200).json({
//         message: "Leave requests retrieved successfully",
//         info: leaveRequest,
//       });
//     } catch (error) {
//       return res
//         .status(500)
//         .json({ message: "Error retrieving data", error: error.message });
//     }
//   };

//   static viewLeaveById = async (req, res) => {
//     try {
//       const userId = req.user._id;
//       const organizationId = req.user?.organizationId || req.user.body;

//       if (!organizationId) {
//         return res.status(404).json({ message: " organization Id is missing" });
//       }
//       const validOrganizationId = new mongoose.Types.ObjectId(organizationId);

//       const leaveRequest = await Leave.findById(userId).populate({
//         path: "userId",
//         select: "name organizationId",
//         match: { organizationId: validOrganizationId },
//       });
//       return res.status(200).json({
//         message: "Leave requests retrieved successfully",
//         info: leaveRequest,
//       });
//     } catch (error) {
//       res
//         .status(500)
//         .json({ message: "error retrieving leaves", error: error.message });
//     }
//   };
// }

// module.exports = leaveController;
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
      leaveDuration, // "full-day", "half-day", "first-half", "second-half"
      reason,
      supportingDocuments,
    } = req.body;

    try {
      // Dynamically calculate leaveUnits
      let leaveUnits = 0;

      if (leaveDuration === "half-day" || leaveDuration === "first-half" || leaveDuration === "second-half") {
        leaveUnits = 0.5; // Set to 0.5 for any half-day-related leave
      } else {
        leaveUnits = this.calculateLeaveDays(startDate, endDate, leaveDuration); // Full-day or multiple days
      }

      const leaveRequest = new Leave({
        userId,
        leaveTypeId,
        startDate,
        endDate,
        leaveDuration,
        leaveUnits, // Store calculated units
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
      // Find the leave request and populate user and leave type
      const leaveRequest = await Leave.findById(leaveId)
        .populate("userId")
        .populate("leaveTypeId");

      if (!leaveRequest) {
        return res.status(404).json({ message: "Leave request not found" });
      }

      // Dynamically calculate leaveUnits during approval
      let leaveUnits = 0;

      if (leaveRequest.leaveDuration === "half-day" || leaveRequest.leaveDuration === "first-half" || leaveRequest.leaveDuration === "second-half") {
        leaveUnits = 0.5; // Set to 0.5 for any half-day-related leave
      } else {
        leaveUnits = this.calculateLeaveDays(
          leaveRequest.startDate,
          leaveRequest.endDate,
          leaveRequest.leaveDuration
        ); // Full-day or multiple days
      }

      leaveRequest.leaveUnits = leaveUnits; // Update leaveUnits in the request
      leaveRequest.status = "approved";
      leaveRequest.managerComments = managerComments;

      // Fetch employee's leave allocation
      const employeeLeaveAllocation = await EmployeeLeaveAllocation.findOne({
        userId: leaveRequest.userId._id,
        leaveTypeId: leaveRequest.leaveTypeId._id,
      });

      if (!employeeLeaveAllocation) {
        return res.status(400).json({ message: "No leave allocation found" });
      }

      // Check if the employee has enough allocated leaves
      const remainingLeaves =
        employeeLeaveAllocation.allocatedLeaves -
        employeeLeaveAllocation.usedLeaves;

      if (leaveUnits > remainingLeaves) {
        return res.status(400).json({ message: "Insufficient allocated leaves" });
      }

      // Update the used leaves
      employeeLeaveAllocation.usedLeaves += leaveUnits;

      // Save updated leave request and allocation
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
      res.status(500).json({ message: "Error rejecting leave request", error: error.message });
    }
  };

  // Calculate leave days based on duration (half-day or full-day)
  static calculateLeaveDays(startDate, endDate, leaveDuration) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // If it's a half-day leave, set the leave days to 0.5
    if (leaveDuration === "half-day") {
      return 0.5; // Half-day leave
    }

    // If it's a full day, calculate the difference between start and end date
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include the end date
    return diffDays; // Full-day leave
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




