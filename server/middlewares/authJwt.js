const jwt = require("jsonwebtoken");
const User = require("../models/userSchema"); // Adjust path as needed
const Role = require("../models/roleSchema"); // Adjust path as needed
const RolePermission = require("../models/rolePermissionSchema"); // Adjust path as needed

const checkPermission = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      // Extract token from headers
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      // Verify token and extract user information
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).populate("roleId");
      if (!user) return res.status(404).json({ message: "User not found" });

      // Get permissions for the user's role
      const role = await Role.findById(user.roleId);
      const permissions = await RolePermission.find({
        roleId: role._id,
      }).populate("permissionId");

      const userPermissions = permissions.map((p) => p.permissionId.name);

      // Check if user has required permissions
      const hasPermission = requiredPermissions.every((permission) =>
        userPermissions.includes(permission)
      );
      if (!hasPermission) return res.status(403).json({ message: "Forbidden" });

      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};

module.exports = checkPermission;
