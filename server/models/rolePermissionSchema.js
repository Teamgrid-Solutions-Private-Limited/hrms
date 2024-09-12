const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rolePermissionSchema = new Schema(
  {
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "roles", // Reference to the Role model
      required: true,
    },
    permissionId: {
      type: Schema.Types.ObjectId,
      ref: "permission", // Reference to the Permission model
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const RolePermission = mongoose.model("rolepermissions", rolePermissionSchema);

module.exports = RolePermission;
