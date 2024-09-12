const EmploymentInfo = require("../models/employeementSchema");

class EmploymentController {
  // Helper function to handle errors
  static handleError = (res, error, statusCode = 500) => {
    res.status(statusCode).json({ error: error.message });
  };

  // Create employment info
  static createEmploymentInfo = async (req, res, next) => {
    try {
      const employmentInfo = new EmploymentInfo(req.body);
      await employmentInfo.save();
      res.status(201).json(employmentInfo);
    } catch (error) {
      next(error); // Let Express handle uncaught errors via middleware
    }
  };

  // Get all employment infos
  static getAllEmploymentInfos = async (req, res) => {
    try {
      const employmentInfos = await EmploymentInfo.find().populate("userId");
      res.status(200).json(employmentInfos);
    } catch (error) {
      EmploymentController.handleError(res, error);
    }
  };

  // Get employment info by ID
  static getEmploymentInfoById = async (req, res) => {
    try {
      const employmentInfo = await EmploymentInfo.findById(
        req.params.id
      ).populate("userId");
      if (!employmentInfo) {
        return res
          .status(404)
          .json({ message: "Employment information not found" });
      }
      res.status(200).json(employmentInfo);
    } catch (error) {
      EmploymentController.handleError(res, error);
    }
  };

  // Update employment info by ID
  static updateEmploymentInfo = async (req, res) => {
    try {
      const employmentInfo = await EmploymentInfo.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate("userId");
      if (!employmentInfo) {
        return res
          .status(404)
          .json({ message: "Employment information not found" });
      }
      res.status(200).json(employmentInfo);
    } catch (error) {
      EmploymentController.handleError(res, error, 400);
    }
  };

  // Delete employment info by ID
  static deleteEmploymentInfo = async (req, res) => {
    try {
      const employmentInfo = await EmploymentInfo.findByIdAndDelete(
        req.params.id
      );
      if (!employmentInfo) {
        return res
          .status(404)
          .json({ message: "Employment information not found" });
      }
      res.status(204).send();
    } catch (error) {
      EmploymentController.handleError(res, error);
    }
  };
}

module.exports = EmploymentController;
