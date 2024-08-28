// controllers/WorkTypeAssignmentController.js
const WorkTypeAssignment = require("../models/WorkTypeAssignment");

class WorkTypeAssignmentController {
  static async createWorkTypeAssignment(req, res) {
    try {
      const {
        employeeId,
        currentWorkType,
        newWorkType,
        changeDate,
        status,
        rotatingWorkType,
        startDate,
        rotationFrequency,
        rotateAfterDays,
        rotateAfterMonth,
        rotateAfterWeekday,
      } = req.body;

      // Validate required fields
      if (!employeeId || !currentWorkType || !newWorkType) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Create new work type assignment
      const newAssignment = new WorkTypeAssignment({
        employeeId,
        currentWorkType,
        newWorkType,
        changeDate,
        status,
        rotatingWorkType,
        startDate,
        rotationFrequency,
        rotateAfterDays,
        rotateAfterMonth,
        rotateAfterWeekday,
      });

      const savedAssignment = await newAssignment.save();

      res.status(201).json({
        message: "Work type assignment created successfully",
        data: savedAssignment,
      });
    } catch (error) {
      console.error("Error creating work type assignment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = WorkTypeAssignmentController;
