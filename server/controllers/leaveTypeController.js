const LeaveType = require("../models/leaveTypeSchema"); // Adjust the path as needed

class LeaveTypeController {
  // Create a new leave type
  static async createLeaveType(req, res) {
    const { name, description, accrualPolicy } = req.body;

    // Validate input
    if (!name || !accrualPolicy) {
      return res
        .status(400)
        .json({ message: "Name and accrual policy are required" });
    }

    try {
      // Create a new leave type
      const newLeaveType = new LeaveType({
        name,
        description,
        accrualPolicy,
      });

      // Save to the database
      await newLeaveType.save();

      // Respond with the created leave type
      res.status(201).json({
        message: "Leave type created successfully",
        leaveType: newLeaveType,
      });
    } catch (err) {
      console.error("Error creating leave type:", err.message);
      res.status(500).json({ error: "Error creating leave type" });
    }
  }
}

module.exports = LeaveTypeController;
