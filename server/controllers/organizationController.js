const Employee = require("../models/employeeSchema");
const Organization = require("../models/organizationSchema");
const Role = require("../models/roleSchema");
const bcrypt = require("bcryptjs");
const Employee = require("../model/employeeSchema");
const Organization = require("../model/organizationSchema");
const Role = require("../model/roleSchema");
const bcrypt = require("bcryptjs");

class organizationController {
  static addOrgainzation = async (req, res) => {
    try {
      const { name, logo, email, address, phone } = req.body;
      console.log(name, logo, email, address, phone);

      // Check for required fields
      if (!name || !logo || !email || !address || !phone) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Create and save the organization
      const organization = new Organization({
        name,
        email,
        logo,
        phone,
        address,
      });
      const savedOrganization = await organization.save();

      // Ensure the 'admin' role exists
      let role = await Role.findOne({ name: "admin" });
      if (!role) {
        role = new Role({
          name: "admin",
          permissions: ["create", "update", "delete", "read"],
        });
        await role.save();
      }

      // Hash the default password
      const hashedPassword = await bcrypt.hash("admin", 10);

      // Create and save the admin employee
      const admin = new Employee({
        firstName: "Admin",
        lastName: "User",
        email,
        phone,
        username: "admin",
        password: hashedPassword,
        role: role._id,
        organization: savedOrganization._id,
        department: "Administration",
        jobPosition: "Administrator",
        jobRole: "", // Default empty string
        shiftInformation: "", // Default empty string
        workType: "full-time",
        employeeType: "permanent",
        companyType: "default",
        workLocation: "", // Default empty string
        joiningDate: new Date(),
        contractEndDate: null, // Default null
        baseSalary: 0, // Default value
        emergencyContacts: [], // Default empty array
        documents: [], // Default empty array

        // Provide default values that match the schema requirements
        adharId: "", // Default empty string
        qualification: "", // Default empty string
        maritalStatus: "single", // Default value (update based on requirement)
        nationality: "", // Default empty string
        gender: "other", // Default value (update based on requirement)
        dob: new Date(), // Default to current date

        // Provide default values as objects
        address: {
          addressLine: "",
          country: "",
          state: "",
          city: "",
          zipCode: "",
        }, // Default empty AddressSchema
        bankAddress: {
          addressLine: "",
          country: "",
          state: "",
          city: "",
          zipCode: "",
        }, // Default empty AddressSchema

        // Bank Information
        bank: "", // Default empty string
        accountDetails: "", // Default empty string
        branch: "", // Default empty string
        ifsc: "", // Default empty string
      });

      await admin.save();

      res.status(201).json({
        message: "Organization created successfully",
        info: savedOrganization,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating organization", error: error.message });
    }
  };
}

module.exports = organizationController;
