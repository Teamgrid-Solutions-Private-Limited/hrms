const Role = require("../models/roleSchema");
const Permission = require("../models/permissionSchema");

const checkRole = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      // Find the role and populate its permissions
      const role = await Role.findById(user.roleId).populate("permissions");

      // Extract the permissions names
      const rolePermissions = role.permissions.map(
        (permission) => permission.name
      );

      // Check if the user has all required permissions
      const hasPermission = requiredPermissions.every((permission) =>
        rolePermissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({
          message: "Access denied. You do not have the required permissions.",
        });
      }

      // If permissions are granted, move to the next middleware
      next();
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  };
};

module.exports = checkRole;
