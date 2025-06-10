const EmploymentInfo = require("../models/employeementSchema");

class EmploymentInfoController {

  // Create Employment Info
  static createEmploymentInfo = async (req, res) => {
    try {
      const { userId } = req.body;

      const existingEmploymentInfo = await EmploymentInfo.findOne({ userId });

      if (existingEmploymentInfo) {
        return res
          .status(400)
          .json({ error: "Employment information already exists for this user" });
      }

      const employmentInfo = new EmploymentInfo(req.body);
      await employmentInfo.save();
      return res.status(201).json(employmentInfo);

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  // Get all employment infos
  static getAllEmploymentInfos = async (req, res, next) => {
    try {
      const employmentInfos = await EmploymentInfo.find()
        .populate("userId")
      
        
      res.status(200).json(employmentInfos);
    } catch (error) {
      next(error);
    }
  };

  // Get employment info by ID
  static getEmploymentInfoById = async (req, res, next) => {
    try {
      const employmentInfo = await EmploymentInfo.findById(req.params.id)
        .populate("userId", "firstName lastName email")
        .populate("reportingmanager", "firstName lastName email");

      if (!employmentInfo) {
        return res.status(404).json({ message: "Employment information not found" });
      }

      res.status(200).json(employmentInfo);
    } catch (error) {
      next(error);
    }
  };

  // Get employment info by User ID
  static getEmploymentInfoByIdUserID = async (req, res, next) => {
    try {
      const employmentInfo = await EmploymentInfo.findOne({ userId: req.params.id })
        .populate("userId", "firstName lastName email")
        .populate("reportingmanager", "firstName lastName email");

      if (!employmentInfo) {
        return res.status(404).json({ message: "Employment information not found" });
      }

      res.status(200).json(employmentInfo);
    } catch (error) {
      next(error);
    }
  };

  // Update employment info by ID
  static updateEmploymentInfo = async (req, res, next) => {
    try {
      const employmentInfo = await EmploymentInfo.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      )
        .populate("userId", "firstName lastName email")
        .populate("reportingmanager", "firstName lastName email");

      if (!employmentInfo) {
        return res.status(404).json({ message: "Employment information not found" });
      }

      res.status(200).json(employmentInfo);
    } catch (error) {
      next(error);
    }
  };

  // Delete employment info by ID
  static deleteEmploymentInfo = async (req, res, next) => {
    try {
      const employmentInfo = await EmploymentInfo.findByIdAndDelete(req.params.id);

      if (!employmentInfo) {
        return res.status(404).json({ message: "Employment information not found" });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = EmploymentInfoController;
