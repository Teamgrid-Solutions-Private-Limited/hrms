const RolePermission = require("../models/rolePermissionSchema");

module.exports = (requiredPermission) => {
  return async (req, res, next) => {
    const { role } = req.user;
    try {
      const rolePermissions = await RolePermission.find({
        roleId: role,
      }).populate("permissionId");
      const permissions = rolePermissions.map((rp) => rp.permissionId.name);

      if (!permissions.includes(requiredPermission)) {
        return res.status(403).json({
          message: "Forbidden: You do not have the required permissions",
        });
      }

      next();
    } catch (err) {
      res.status(500).json({ message: "Failed to check permissions" });
    }
  };
};
