const RotatingShiftAssign = require('../models/rotatingShiftAssignSchema'); // Ensure this path is correct

class rotatingShiftAssignController {
  // Create a new rotating shift assignment
  static async createRotatingShiftAssign(req, res) {
    try {
      const {
        userId,
        currentShiftType,
        newShiftType,
        changeDate,
        status,
        rotatingShiftType,
        startDate,
        rotationFrequency,
        rotateAfterDays,
        rotateAfterMonth,
        rotateAfterWeekday,
      } = req.body;

      // Validate required fields
      if (!userId || !currentShiftType || !newShiftType) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Create new rotating shift assignment
      const newAssignment = new RotatingShiftAssign({
        userId,
        currentShiftType,
        newShiftType,
        changeDate,
        status,
        rotatingShiftType,
        startDate,
        rotationFrequency,
        rotateAfterDays,
        rotateAfterMonth,
        rotateAfterWeekday,
      });

      const savedAssignment = await newAssignment.save();

      res.status(201).json({
        message: "Rotating shift assignment created successfully",
        data: savedAssignment,
      });
    } catch (error) {
      console.error("Error creating rotating shift assignment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get all rotating shift assignments
  static async getRotatingShiftAssigns(req, res) {
    try {
      const assignments = await RotatingShiftAssign.find();
      res.status(200).json(assignments);
    } catch (error) {
      console.error("Error fetching rotating shift assignments:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get a specific rotating shift assignment by ID
  static async getRotatingShiftAssignById(req, res) {
    try {
      const assignment = await RotatingShiftAssign.findById(req.params.id);
      if (!assignment) {
        return res.status(404).json({ message: "Rotating shift assignment not found" });
      }
      res.status(200).json(assignment);
    } catch (error) {
      console.error("Error fetching rotating shift assignment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update a rotating shift assignment by ID
  static async updateRotatingShiftAssign(req, res) {
    try {
      const {
        currentShiftType,
        newShiftType,
        changeDate,
        status,
        rotatingShiftType,
        startDate,
        rotationFrequency,
        rotateAfterDays,
        rotateAfterMonth,
        rotateAfterWeekday,
      } = req.body;

      const updatedAssignment = await RotatingShiftAssign.findByIdAndUpdate(
        req.params.id,
        {
          currentShiftType,
          newShiftType,
          changeDate,
          status,
          rotatingShiftType,
          startDate,
          rotationFrequency,
          rotateAfterDays,
          rotateAfterMonth,
          rotateAfterWeekday,
        },
        { new: true }
      );

      if (!updatedAssignment) {
        return res.status(404).json({ message: "Rotating shift assignment not found" });
      }

      res.status(200).json({
        message: "Rotating shift assignment updated successfully",
        data: updatedAssignment,
      });
    } catch (error) {
      console.error("Error updating rotating shift assignment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Delete a rotating shift assignment by ID
  static async deleteRotatingShiftAssign(req, res) {
    try {
      const deletedAssignment = await RotatingShiftAssign.findByIdAndDelete(req.params.id);
      if (!deletedAssignment) {
        return res.status(404).json({ message: "Rotating shift assignment not found" });
      }
      res.status(200).json({ message: "Rotating shift assignment deleted successfully" });
    } catch (error) {
      console.error("Error deleting rotating shift assignment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = rotatingShiftAssignController;
