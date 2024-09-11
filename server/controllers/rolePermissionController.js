const RolePermission = require("../models/rolePermissionSchema");
const Role = require("../models/roleSchema");
const Permission = require("../models/permissionSchema");

// Assign permission to role
exports.assignPermission = async (req, res) => {
  const { roleId, permissionId } = req.body;
  try {
    const role = await Role.findById(roleId);
    const permission = await Permission.findById(permissionId);

    if (!role || !permission) {
      return res.status(404).json({ error: "Role or Permission not found" });
    }

    const rolePermission = new RolePermission({ roleId, permissionId });
    await rolePermission.save();
    res.json(rolePermission);
  } catch (err) {
    res.status(500).json({ error: "Failed to assign permission to role" });
  }
};

// Get permissions for a role
exports.getPermissionsByRole = async (req, res) => {
  const { roleId } = req.params;
  try {
    const rolePermissions = await RolePermission.find({ roleId }).populate(
      "permissionId"
    );
    res.json(rolePermissions.map((rp) => rp.permissionId.name));
  } catch (err) {
    res.status(500).json({ error: "Failed to get permissions for role" });
  }
};
