const Organization = require("../models/organizationSchema");
const Role = require("../models/roleSchema");

class organizationController {
  static addOrgainzation = async (req, res) => {
    try {
      const { name, logo, email, address, phone } = req.body;
      console.log(name, logo, email, address, phone);
      if (!name || !logo || !email || !address || !phone) {
        return res.status(400).json({ message: " missing required fields" });
      }

      const organization = new Organization({
        name,
        email,

        logo,
        phone,
        address,
      });
      const data = await organization.save();
      res
        .status(201)
        .json({ message: "organization created successfully", info: data });
    } catch (error) {
      res
        .status(500)
        .json({ message: "error creating organization", error: error.message });
    }
  };
}

module.exports = organizationController;
