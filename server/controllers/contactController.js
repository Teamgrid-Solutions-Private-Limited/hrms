const Contact = require('../models/Contact');

class contactController {
  // Error handling function
  static handleError = (res, error, statusCode = 500) => {
    res.status(statusCode).json({ error: error.message });
  };

  // Create a new contact
  static createContact = async (req, res) => {
    try {
      const {userId,contactName,contactRelationship,contactNumber} = req.body;
      if(!userId || !contactName || !contactRelationship ||!contactNumber)
      {
          return res.status(201).json({message:"All fields are required "})
      }
      const contact = new Contact();
      await contact.save(userId,contactName,contactRelationship,contactNumber);
      res.status(201).json(contact);
    } catch (error) {
      contactController.handleError(res, error, 400);
    }
  };

  // Get all contacts for a user
  static getContacts = async (req, res) => {
    try {
      const contacts = await Contact.find({ userId: req.params.userId }).populate('userId');
      res.status(200).json(contacts);
    } catch (error) {
      contactController.handleError(res, error);
    }
  };

  // Get a contact by ID
  static getContactById = async (req, res) => {
    try {
      const contact = await Contact.findById(req.params.id).populate('userId');
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.status(200).json(contact);
    } catch (error) {
      contactController.handleError(res, error);
    }
  };

  // Update a contact by ID
  static updateContact = async (req, res) => {
    try {
      const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('userId');
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.status(200).json(contact);
    } catch (error) {
      contactController.handleError(res, error, 400);
    }
  };

  // Delete a contact by ID
  static deleteContact = async (req, res) => {
    try {
      const contact = await Contact.findByIdAndDelete(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.status(204).send();
    } catch (error) {
      contactController.handleError(res, error);
    }
  };
}

module.exports = contactController;
