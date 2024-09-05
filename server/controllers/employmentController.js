const EmploymentInfo = require('../models/employmentInfo');

class employmentController {
   
  static handleError = (res, error, statusCode = 500) => {
    res.status(statusCode).json({ error: error.message });
  };
 
  static createEmploymentInfo = async (req, res) => {
    try {
      const employmentInfo = new EmploymentInfo(req.body);
      await employmentInfo.save();
      res.status(201).json(employmentInfo);
    } catch (error) {
      EmploymentInfoController.handleError(res, error, 400);
    }
  };

 
  static getAllEmploymentInfos = async (req, res) => {
    try {
      const employmentInfos = await EmploymentInfo.find().populate('userId');
      res.status(200).json(employmentInfos);
    } catch (error) {
      EmploymentInfoController.handleError(res, error);
    }
  };

 
  static getEmploymentInfoById = async (req, res) => {
    try {
      const employmentInfo = await EmploymentInfo.findById(req.params.id).populate('userId');
      if (!employmentInfo) {
        return res.status(404).json({ message: 'Employment information not found' });
      }
      res.status(200).json(employmentInfo);
    } catch (error) {
      EmploymentInfoController.handleError(res, error);
    }
  };
 
  static updateEmploymentInfo = async (req, res) => {
    try {
      const employmentInfo = await EmploymentInfo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('userId');
      if (!employmentInfo) {
        return res.status(404).json({ message: 'Employment information not found' });
      }
      res.status(200).json(employmentInfo);
    } catch (error) {
      EmploymentInfoController.handleError(res, error, 400);
    }
  };

   
  static deleteEmploymentInfo = async (req, res) => {
    try {
      const employmentInfo = await EmploymentInfo.findByIdAndDelete(req.params.id);
      if (!employmentInfo) {
        return res.status(404).json({ message: 'Employment information not found' });
      }
      res.status(204).send();
    } catch (error) {
      EmploymentInfoController.handleError(res, error);
    }
  };
}

module.exports = employmentController;