<<<<<<< HEAD
const Role = require("../models/roleSchema");
=======
const RolePermission = require("../models/rolePermissionSchema");
>>>>>>> main

module.exports = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const roleId = req.user.role; // Assuming the user's role ID is set in req.user
      console.log("User Role ID:", roleId);

      if (!roleId) {
        return res.status(403).json({ message: "User role not found" });
      }

      // Directly query using string roleId
      const roleWithPermissions = await Role.findOne({ _id: roleId }).populate(
        "permissionsId"
      );

      console.log("Role with Permissions:", roleWithPermissions);
      if (!roleWithPermissions) {
        return res.status(404).json({ message: "Role not found" });
      }

      const permissions = roleWithPermissions.permissionsId.map(
        (permission) => permission.name
      );
      console.log("Permissions:", permissions);

      if (!permissions.includes(requiredPermission)) {
        return res.status(403).json({
          message: "Forbidden: You do not have the required permissions",
        });
      }

      next();
    } catch (err) {
      console.error("Error in Role Middleware:", err);
      res
        .status(500)
        .json({ message: "Failed to check permissions", error: err.message });
    }
  };
};
