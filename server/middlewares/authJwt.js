const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const Role = require("../models/roleSchema");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Middleware to authenticate and authorize users
const authenticateAndAuthorize = (requiredPermissions = []) => {
  return async (req, res, next) => {
    try {
      // Check for the token in the request header
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({
          error: "AUTH_TOKEN_MISSING",
          message: "Authorization token is required",
        });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      const user = await User.findById(req.user.id).populate("roleId");
      if (!user) {
        return res.status(401).json({
          error: "USER_NOT_FOUND",
          message: "User not found",
        });
      }

      const userRole = user.roleId.name;
      const userPermissions = user.roleId.permissions;

      const hasPermission = requiredPermissions.every((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({
          error: "INSUFFICIENT_PERMISSIONS",
          message: `Access denied. You need the following permissions: ${requiredPermissions.join(
            ", "
          )}`,
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        error: "AUTHENTICATION_FAILED",
        message: "Authentication failed. Please log in again.",
        details: error.message,
      });
    }
  };
};

module.exports = authenticateAndAuthorize;
