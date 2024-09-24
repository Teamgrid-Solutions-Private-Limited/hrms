const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const Role = require("../models/roleSchema");
const RolePermission = require("../models/rolePermissionSchema");

const checkRoleAndPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // Extract token from headers
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      // Verify token and extract user information
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id; // Make sure this matches your JWT payload

      // Find user and populate role
      const user = await User.findById(userId).populate("roleId");
      if (!user) return res.status(404).json({ message: "User not found" });

      // Fetch the role and its permissions
      const rolePermissions = await RolePermission.findOne({ roleId: user.roleId }).populate("permissionId");
      if (!rolePermissions) return res.status(404).json({ message: "Role permissions not found" });

      // Extract permissions
      const permissions = rolePermissions.permissionId.map(permission => permission.name);
      console.log("User Permissions:", permissions); // Debugging line

      // Check if user has the required permission
      if (!permissions.includes(requiredPermission)) {
        return res.status(403).json({ message: "Forbidden: You do not have the required permissions" });
      }

      // Set user information in the request for later use
      req.user = { id: user._id, role: user.roleId };
      next();
    } catch (err) {
      console.error("Error in authorization middleware:", err);
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};

module.exports = checkRoleAndPermission;
