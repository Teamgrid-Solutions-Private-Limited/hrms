const Role = require("../models/roleSchema"); // Role model
const Page = require("../models/pagesSchema"); // Page model

const checkPageAccess = (pageSlug) => async (req, res, next) => {
  try {
    const user = req.user; // User set by authenticate middleware

    if (!user || !user.roleId) {
      return res
        .status(403)
        .json({ message: "Access denied. No role assigned to the user." });
    }

    // Populate role with pageAccess
    const role = await Role.findById(user.roleId).populate("pageAccess");

    if (!role) {
      return res.status(403).json({ message: "Role not found." });
    }

    const page = await Page.findOne({ slug: pageSlug });

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    // Check if the role has access to the page
    const hasPageAccess = role.pageAccess.some((p) => p._id.equals(page._id));

    if (hasPageAccess) {
      next(); // Proceed to next middleware if access is granted
    } else {
      res.status(403).json({ message: "Access Denied" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error checking page access", error: err.message });
  }
};

module.exports = checkPageAccess;
