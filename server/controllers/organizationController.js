const User = require("../models/userSchema");
const Personal = require("../models/personalInfoSchema");
const Bank = require("../models/bankDetailsSchema");
const Document = require("../models/documentSchema");
const Organization = require("../models/organizationSchema");
const Role = require("../models/roleSchema");
const bcrypt = require("bcryptjs");

class organizationController {
  static addOrgainzation = async (req, res) => {
    try {
      const {
        name,
        logo,
        email,
        addressLine,
        phone,
        description,
        city,
        state,
        country,
        zipCode,
        username,
      } = req.body;
      console.log(
        name,
        logo,
        state,
        zipCode,
        email,
        addressLine,
        phone,
        description,
        city,
        country,
        username
      );

      // Check for required fields
      if (
        !name ||
        !logo ||
        !email ||
        !addressLine ||
        !phone ||
        !description ||
        !city ||
        !state ||
        !country ||
        !zipCode ||
        !username
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Create and save the organization
      const organization = new Organization({
        name,
        logo,
        email,
        addressLine,
        phone,
        description,
        city,
        state,
        country,
        zipCode,
      });
      const savedOrganization = await organization.save();

      // Ensure the 'admin' role exists
      let role = await Role.findOne({ name: "super_admin" });
      if (!role) {
        role = new Role({
          name: "admin",
          permissions: ["create", "update", "delete", "read"],
        });
        await role.save();
      }

      // Hash the default password
      const hashedPassword = await bcrypt.hash("admin", 10);

      // Create and save the admin user
      const user = new User({
        email,
        username,
        password: hashedPassword,
        roleId: role._id,
        organizationId: savedOrganization._id,
      });
      await user.save();

      // Create and save personal info
      const personal = new Personal({
        userId: user._id,
        photo: "Not Provided",
        adharId: "Not Provided",
        maritalStatus: "single",
        nationality: "Not Provided",
        dob: new Date(),
      });
      await personal.save();

      // Create and save bank details
      const bank = new Bank({
        userId: user._id,
        bankName: "Not Provided",
        accountNumber: "Not Provided",
        branch: "Not Provided",
        ifsc: "Not Provided",
        bankAddressLine: "Not Provided",
        bankCity: "Not Provided",
        bankState: "Not Provided",
        bankCountry: "Not Provided",
        bankZipCode: "Not Provided",
      });
      await bank.save();

      // Create and save document
      const document = new Document({
        userId: user._id,
        documentType: "Not Provided",
        documentUrl: "Not Provided",
      });
      await document.save();

      res
        .status(201)
        .json({
          message: "Organization created successfully",
          info: savedOrganization,
        });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating organization", error: error.message });
    }
  };

  static getOrganization = async (req, res) => {
    try {
      const data = await Organization.find();
      res
        .status(200)
        .json({ message: "Data retrieved successfully", info: data });
    } catch (error) {
      res
        .status(404)
        .json({ message: "Organizations not found", error: error.message });
    }
  };

  static getOrganizationById = async (req, res) => {
    try {
      const { id } = req.params;
      const data = await Organization.findById(id);
      if (!data) {
        return res.status(404).json({ message: "Organization not found" });
      }
      res
        .status(200)
        .json({ message: "Data retrieved successfully", info: data });
    } catch (error) {
      res
        .status(404)
        .json({ message: "Organization not found", error: error.message });
    }
  };

  static updateOrganization = async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const update = await Organization.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
      );
      if (!update) {
        return res.status(404).json({ message: "Organization not found" });
      }
      res
        .status(200)
        .json({ message: "Update done successfully", info: update });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating organization", error: error.message });
    }
  };

  static deleteOrganization = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedData = await Organization.findByIdAndDelete(id);
      if (!deletedData) {
        return res.status(404).json({ message: "Organization not found" });
      }
      res
        .status(200)
        .json({
          message: "Organization deleted successfully",
          info: deletedData,
        });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting organization", error: error.message });
    }
  };
}

module.exports = organizationController;
