const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Organization Schema
const organizationSchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true
  },
  address:{
type:String,
required:true,
  },
  email: {
    type: String,
    required: true,
    
  },
  phone:{
    type:Number,
    required:true,
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