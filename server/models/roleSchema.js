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
        ref: "permission", // Reference to the 'permissions' model
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
        ref: "pageelements", // Reference to the 'pageelement' model
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("roles", roleSchema);

module.exports = Role;
