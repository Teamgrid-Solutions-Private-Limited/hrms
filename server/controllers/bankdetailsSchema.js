const BankDetails = require('../models/BankDetails'); // Adjust the path as necessary

class bankdetailsController {
  // Error handling function
  static handleError = (res, error, statusCode = 500) => {
    res.status(statusCode).json({ error: error.message });
  };

  // Create new bank details
  static createBankDetails = async (req, res) => {
    try {
      const bankDetails = new BankDetails(req.body);
      await bankDetails.save();
      res.status(201).json(bankDetails);
    } catch (error) {
        bankdetailsController.handleError(res, error, 400);
    }
  };

  // Get all bank details for a user
  static getBankDetails = async (req, res) => {
    try {
      const bankDetails = await BankDetails.find({ userId: req.params.userId });
      res.status(200).json(bankDetails);
    } catch (error) {
        bankdetailsController.handleError(res, error);
    }
  };

  // Get bank details by ID
  static getBankDetailsById = async (req, res) => {
    try {
      const bankDetails = await BankDetails.findById(req.params.id);
      if (!bankDetails) {
        return res.status(404).json({ message: 'Bank details not found' });
      }
      res.status(200).json(bankDetails);
    } catch (error) {
        bankdetailsController.handleError(res, error);
    }
  };

  // Update bank details by ID
  static updateBankDetails = async (req, res) => {
    try {
      const bankDetails = await BankDetails.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!bankDetails) {
        return res.status(404).json({ message: 'Bank details not found' });
      }
      res.status(200).json(bankDetails);
    } catch (error) {
        bankdetailsController.handleError(res, error, 400);
    }
  };

  // Delete bank details by ID
  static deleteBankDetails = async (req, res) => {
    try {
      const bankDetails = await BankDetails.findByIdAndDelete(req.params.id);
      if (!bankDetails) {
        return res.status(404).json({ message: 'Bank details not found' });
      }
      res.status(204).send();
    } catch (error) {
        bankdetailsController.handleError(res, error);
    }
  };
}

module.exports =  bankdetailsController;
