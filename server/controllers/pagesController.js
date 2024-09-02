// controllers/PagesController.js
const Pages = require("../models/pagesSchema");
const PageGroup = require("../models/pageGroupSchema"); // Make sure to import related models if needed
const Role = require("../models/roleSchema"); // Import Role model

class PagesController {
  static async createPage(req, res) {
    try {
      const { pageName, url, pageGroupId, order, isVisible, accessRoles } =
        req.body;

      // Validate pageGroupId and accessRoles (optional)
      const pageGroup = await PageGroup.findById(pageGroupId);
      if (!pageGroup) {
        return res.status(400).json({ message: "Invalid pageGroupId" });
      }

      const roles = await Role.find({ _id: { $in: accessRoles } });
      if (roles.length !== accessRoles.length) {
        return res
          .status(400)
          .json({ message: "One or more roles are invalid" });
      }

      // Create a new page instance
      const newPage = new Pages({
        pageName,
        url,
        pageGroupId,
        order,
        isVisible,
        accessRoles,
      });

      // Save to the database
      await newPage.save();

      // Respond with success
      res.status(201).json({
        message: "Page created successfully",
        data: newPage,
      });
    } catch (error) {
      // Respond with error
      res.status(500).json({
        message: "Error creating page",
        error: error.message,
      });
    }
  }
}

module.exports = PagesController;
