const Role = require("../models/roleSchema");
const User = require("../models/userSchema");
const Organization = require("../models/organizationSchema");
const upload = require("../middleware/fileUploads");

const BASE_URL = "http://localhost:8080/";
const upload_URL = `${BASE_URL}images/`;

class authController {
  static handleFileUpload = (req, res, next) => {
    upload.single("logo")(req, res, (err) => {
      if (err) {
        console.error("Error uploading file:", err);
        return res.status(400).json({ message: "error uploading file" });
      }
      next();
    });
  };
 

  static addOrganization = async (req, res) => {
    try {
      authController.handleFileUpload(req, res, async () => {
        const {
          userId,
          name,
          noEmployees,
          industry,
          logo,
          email,
          addressLine,
          phone,
          city,
          state,
          country,
          zipCode,
        } = req.body;
        if (!email || !noEmployees ) {
          return res.status(400).json({ message: "Missing required fields" });
        }
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const organization = new Organization({
          name,
          logo: req.file ? `${upload_URL}${req.file.filename}` : undefined,
          email,
          addressLine,
          noEmployees,
          industry,

          phone,
          city,
          state,
          country,
          zipCode,
        });
        try {
          const savedOrganization = await organization.save();
          user.organizationId = savedOrganization._id;
          savedOrganization.users.push(user._id);
          await savedOrganization.save();
          await user.save();
          res.status(200).json({
            message: "organization setup successfully",
            organization: savedOrganization,
            user: user,
          });
        } catch (error) {
          res.status(500).json({ message: "error saving organization" });
        }
      });
    } catch (error) {
      res
        .status(200)
        .json({ message: "Error creating Organization", error: error.message });
    }
  };

  static updateOrganization = async (req, res) => {
    const { id } = req.params.id;
    try {
      authController.handleFileUpload(req, res, async () => {
        const updateData = req.body;
        if (req.file) {
          updateData.logo = `${upload_URL}${req.file.filename}`;
        }
        const updatedData = await Organization.findByIdAndUpadte(
          id,
          updateData,
          { new: true }
        );
        if (!updatedData) {
          return res.status(404).json({ message: "organization not found" });
        }
        res.status(201).json({ message: "updated successfully" });
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "error updating organization", error: error.message });
    }
  };

  static viewOrganization = async (req,res) => {
    try {
      const organizationId = req.params.id;
      const data = await Organization.findById(organizationId).populate('users');
      if (!data) {
        return res.status(404).json({message:"organization not found"});
      }
      res.status(200).json({message:"organization retrive successfully",info:data});
    } catch (error) {
      res.status(500).json({message:"error creating organization ",error:error.message});
    }
    
  };
  static getOrganizationByUserId = async (req, res) => {
    try {
      const { userId } = req.params; // Expecting userId to be passed as a URL parameter
  
      // Find the organization that contains the userId in its users array
      const organization = await Organization.findOne({ users: userId });
      
      if (!organization) {
        return res.status(404).json({ message: "Organization not found for the specified user." });
      }
  
      return res.status(200).json({
        message: "Organization retrieved successfully",
        organization,
      });
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving organization", error: error.message });
    }
  };
  
}

module.exports = authController;
