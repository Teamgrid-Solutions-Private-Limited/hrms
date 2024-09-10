const mongoose = require("mongoose");

const rolePermissionSchema = new mongoose.Schema(
  {
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "roles",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RolePermission", rolePermissionSchema);
