const LeaveModel = require("../../model/Leave/LeaveModel"); // Ensure the model is imported

class LeaveController {
  /**
   * @desc Create a new leave record
   * @access Private
   * @route POST /api/v1/leave
   * @method POST
   */
  static LeaveCreate = async (req, res, next) => {
    try {
      // Destructure fields from the request body
      const {
        employeeId,
        leaveTypeId,
        startDate,
        endDate,
        status = "pending",
        allocatedLeaves,
        carryForwardDays = 0,
        additionalDaysRequested,
        approvalLevel = 1,
        managerComments,
        hrComments,
        reason,
        supportingDocuments,
      } = req.body;

      const newLeave = new LeaveModel({
        employeeId,
        leaveTypeId,
        startDate,
        endDate,
        status,
        allocatedLeaves,
        carryForwardDays,
        additionalDaysRequested,
        approvalLevel,
        managerComments,
        hrComments,
        reason,
        supportingDocuments,
      });

      // Save the new leave record to the database
      const result = await newLeave.save();

      // Respond with the newly created leave record
      res.status(201).json(result);
    } catch (error) {
      // Pass the error to the next middleware (error handler)
      next(new CreateError("Failed to create leave record", 500, error));
    }
  };

  /**
   * @desc Leave List
   * @access private
   * @route /api/v1/Leave/LeaveList/:searchKeyword
   * @method GET
   */

  static LeaveList = async (req, res, next) => {
    try {
      const searchKeyword = req.params.searchKeyword;
      const regex = new RegExp(searchKeyword, "i");

      // Define aggregation pipeline stages
      const pipeline = [
        {
          $match: {
            $or: [{ LeaveDetails: regex }, { LeaveType: regex }],
          },
        },
        {
          $lookup: {
            from: "userprofile",
            localField: "userId",
            foreignField: "_id",
            as: "Employee",
          },
        },
        {
          $lookup: {
            from: "leavetypes",
            localField: "LeaveType",
            foreignField: "_id",
            as: "LeaveType",
          },
        },
        {
          $project: {
            LeaveType: { $arrayElemAt: ["$LeaveType.LeaveTypeName", 0] },
            LeaveDetails: 1,
            NumOfDay: 1,
            HodStatus: 1,
            AdminStatus: 1,
            createdAt: 1,
            Employee: {
              FirstName: 1,
              LastName: 1,
              Email: 1,
              Image: 1,
            },
          },
        },
      ];

      // Execute aggregation pipeline
      const result = await LeaveModel.aggregate(pipeline);

      // Send response
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = LeaveController;
