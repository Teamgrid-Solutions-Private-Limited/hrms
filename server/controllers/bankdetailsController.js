const BankDetails = require('../models/bankDetailsSchema');  

class bankdetailsController {
  // Error handling function
  static handleError = (res, error, statusCode = 500) => {
    res.status(statusCode).json({ error: error.message });
  };

  // Create new bank details
  static createBankDetails = async (req, res) => {
    try {
      const {
        userId,
        bankName,
        accountNumber,
        branch,
        ifsc,
        bankAddressLine,
        bankCity,
        bankState,
        bankZipCode,
      } = req.body;
  
      // Validate required fields
      if (!userId || !accountNumber || !ifsc) {
        return res.status(400).json({ message: "User ID, Account Number, and IFSC are required" });
      }
  
      // Create a new bank details instance
      const bankDetails = new BankDetails({
        userId,
        bankName,
        accountNumber,
        branch,
        ifsc,
        bankAddressLine,
        bankCity,
        bankState,
        bankZipCode,
      });
  
      // Save the bank details to the database
      const savedBankDetails = await bankDetails.save();
      res.status(201).json(savedBankDetails);
    } catch (error) {
      console.error("Error creating bank details:", error);
      bankdetailsController.handleError(res, error, 400);
    }
  };
  
  // Get all bank details 
  static getBankDetails = async (req, res) => {
    try {
       
      const bankDetails = await BankDetails.find();
      res.status(200).json(bankDetails);
    } catch (error) {
        bankdetailsController.handleError(res, error);
    }
  };
// get bank details by userID
  static getBankUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const bankDetails = await BankDetails.findOne({ userId: userId});
      res.status(200).json({message:"Bank details retrive successfully", info:bankDetails});
    } catch (error) {
        bankdetailsController.handleError(res, error);
    }
  };

  // Get bank details by ID
  static getBankDetailsById = async (req, res) => {
    try {
      const {id}= req.params;
      const bankDetails = await BankDetails.findById(id);
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
      const {id} = req.params;
      const data = req.body;
      const bankDetails = await BankDetails.findByIdAndUpdate(
        id,
        {$set:data},
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
