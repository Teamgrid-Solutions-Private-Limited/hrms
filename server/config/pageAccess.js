// const Role = require("../models/Role");
// const Page = require("../models/Page");
// const PageElement = require("../models/PageElement");

// // Middleware to check page access
// async function checkPageAccess(req, res, next) {
//   const userRole = req.user.role; // Assuming role is part of the user object

//   try {
//     const page = await Page.findOne({ slug: req.params.slug });
//     if (!page) {
//       return res.status(404).json({ message: "Page not found" });
//     }

//     const role = await Role.findOne({ _id: userRole })
//       .populate("pageAccess")
//       .exec();

//     const hasAccess = role.pageAccess.some((accessPage) =>
//       accessPage._id.equals(page._id)
//     );
//     if (!hasAccess) {
//       return res.status(403).json({ message: "Access denied to this page" });
//     }

//     next();
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// }

// // Middleware to check element access
// async function checkElementAccess(req, res, next) {
//   const userRole = req.user.role;

//   try {
//     const element = await PageElement.findOne({ _id: req.params.elementId });
//     if (!element) {
//       return res.status(404).json({ message: "Element not found" });
//     }

//     const role = await Role.findOne({ _id: userRole })
//       .populate("elementAccess")
//       .exec();

//     const hasAccess = role.elementAccess.some((accessElement) =>
//       accessElement._id.equals(element._id)
//     );
//     if (!hasAccess) {
//       return res.status(403).json({ message: "Access denied to this element" });
//     }

//     next();
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// }

// module.exports = {
//   checkPageAccess,
//   checkElementAccess,
// };

const Role = require("../models/roleModel");
const Pages = require("../models/pagesModel");

const checkPageAccess = (pageSlug) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const role = await Role.findById(user.roleId).populate("pageAccess");

      // Find the page by its slug
      const page = await Pages.findOne({ slug: pageSlug });

      if (!page || !role.pageAccess.some((p) => p._id.equals(page._id))) {
        return res.status(403).json({ message: "Access denied to this page" });
      }

      // Proceed to the next middleware or route handler if access is granted
      next();
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  };
};

module.exports = checkPageAccess;

const checkPermission = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const user = req.user; // Assuming user is set after authentication
      const role = await Role.findById(user.roleId).populate("permissions");

      // Check if user role has the required permissions
      const hasPermission = role.permissions.some((permission) =>
        requiredPermissions.includes(permission.name)
      );

      if (!hasPermission) {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Usage in route
app.get("/some-secured-page", checkPermission(["view_page"]), (req, res) => {
  res.send("This is a secured page");
});

module.exports = checkPermission;
