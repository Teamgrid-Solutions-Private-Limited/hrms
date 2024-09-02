const LeaveModel = require("../../model/Leave/LeaveModel"); // Ensure the model is imported

class LeaveController {
  static LeaveCreate = async (req, res, next) => {
    try {
      // Destructure the relevant fields from the request body
      const {
        employeeId,
        leaveType,
        leaveDetails,
        numOfDay,
        hodStatus,
        adminStatus,
      } = req.body;

      // Create and save the document in one step
      const newLeave = await LeaveModel.create({
        employeeId,
        leaveType,
        leaveDetails,
        numOfDay,
        hodStatus,
        adminStatus,
      });

      // Respond with status 201 (Created) and the newly created record
      res.status(201).json(newLeave);
    } catch (error) {
      // Log the error (optional)
      console.error("Error creating leave:", error);

      next();
    }
  };
  ed;

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
