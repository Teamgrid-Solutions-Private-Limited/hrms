const WorkTypeAssignment = require("../models/WorkTypeAssignment");

class WorkTypeAssignmentController {
  // Create a new work type assignment
  static async createWorkTypeAssignment(req, res) {
    try {
      const {
        userId,
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
      if (!userId || !currentWorkType || !newWorkType) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Create new work type assignment
      const newAssignment = new WorkTypeAssignment({
        userId,
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

  // Get all work type assignments
  static async getWorkTypeAssignments(req, res) {
    try {
      const assignments = await WorkTypeAssignment.find();
      res.status(200).json(assignments);
    } catch (error) {
      console.error("Error fetching work type assignments:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get a single work type assignment by ID
  static async getWorkTypeAssignmentById(req, res) {
    try {
      const assignment = await WorkTypeAssignment.findById(req.params.id);
      if (!assignment) {
        return res.status(404).json({ message: "Work type assignment not found" });
      }
      res.status(200).json(assignment);
    } catch (error) {
      console.error("Error fetching work type assignment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update a work type assignment by ID
  static async updateWorkTypeAssignment(req, res) {
    try {
      const {
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

      const updatedAssignment = await WorkTypeAssignment.findByIdAndUpdate(
        req.params.id,
        {
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
        },
        { new: true }
      );

      if (!updatedAssignment) {
        return res.status(404).json({ message: "Work type assignment not found" });
      }

      res.status(200).json({
        message: "Work type assignment updated successfully",
        data: updatedAssignment,
      });
    } catch (error) {
      console.error("Error updating work type assignment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Delete a work type assignment by ID
  static async deleteWorkTypeAssignment(req, res) {
    try {
      const deletedAssignment = await WorkTypeAssignment.findByIdAndDelete(req.params.id);
      if (!deletedAssignment) {
        return res.status(404).json({ message: "Work type assignment not found" });
      }
      res.status(200).json({ message: "Work type assignment deleted successfully" });
    } catch (error) {
      console.error("Error deleting work type assignment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = WorkTypeAssignmentController;
