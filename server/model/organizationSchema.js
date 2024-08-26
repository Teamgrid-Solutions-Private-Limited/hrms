const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Organization Schema
const organizationSchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true
  },
  contactInfo: {
    address: String,
    phone: String,
    email: String
  },
  logo: {
    type: String
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create the Organization Model
const Organization = mongoose.model('organization', organizationSchema);

module.exports = Organization;