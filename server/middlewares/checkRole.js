// const Role = require("../models/roleSchema");
// const Permission = require("../models/permissionSchema");

// const checkRole = (requiredPermissions) => {
//   return async (req, res, next) => {
//     try {
//       const user = req.user;

//       // Check if user or roleId is missing
//       if (!user || !user.roleId) {
//         return res.status(403).json({
//           message: "Access denied: User role ID is missing.",
//         });
//       }

//       console.log(`User roleId: ${user.roleId}`);

//       // Fetch role and populate permissions
//       const role = await Role.findById(user.roleId).populate("permissions");

//       // Handle case where the role is not found
//       if (!role) {
//         return res.status(403).json({
//           message: "Access denied: Role not found.",
//         });
//       }

//       // If no permissions are found, log a warning but continue
//       if (!role.permissions || role.permissions.length === 0) {
//         console.warn(`No permissions found for roleId: ${user.roleId}`);
//       }

//       // Extract permission names
//       const rolePermissions = role.permissions.map(
//         (permission) => permission.name
//       );

//       // Log role permissions and required permissions
//       console.log(
//         `Role permissions: ${JSON.stringify(rolePermissions, null, 2)}`
//       );
//       console.log(
//         `Required permissions: ${JSON.stringify(requiredPermissions, null, 2)}`
//       );

//       // Check if user has all required permissions
//       const hasPermission = requiredPermissions.every((permission) =>
//         rolePermissions.includes(permission)
//       );

//       // Handle case where permissions are insufficient
//       if (!hasPermission) {
//         return res.status(403).json({
//           message: "Access denied: Insufficient permissions.",
//         });
//       }

//       // If all required permissions are present, proceed to the next middleware
//       next();
//     } catch (error) {
//       // Log the error with detailed information
//       console.error("Error in checkRole middleware:", error);

//       // Respond with a 500 status code and error details
//       return res.status(500).json({
//         message: "Server error",
//         error: error.message,
//       });
//     }
//   };
// };

// module.exports = checkRole;

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
        return res
          .status(403)
          .json({
            message: "Forbidden: You do not have the required permissions",
          });
      }

      next();
    } catch (err) {
      res.status(500).json({ message: "Failed to check permissions" });
    }
  };
};
