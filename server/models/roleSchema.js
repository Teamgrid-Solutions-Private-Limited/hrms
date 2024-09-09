const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = new Schema(
  {
    name: {
      type: String,
      enum: ["super_admin", "admin", "hr", "employee"], // Enum-like validation
      required: true,
      unique: true,
      trim: true,
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Permission", // Reference to the 'permissions' model
      },
    ],
    pageAccess: [
      {
        type: Schema.Types.ObjectId,
        ref: "pages", // Reference to the 'pages' model
      },
    ],
    elementAccess: [
      {
        type: Schema.Types.ObjectId,
        ref: "pageelement", // Reference to the 'pageelement' model
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
