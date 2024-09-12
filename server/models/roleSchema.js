const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = new Schema(
  {
    name: {
      type: String,
      enum: ["super_admin", "admin", "hr", "employee"],
      required: true,
      unique: true,
      trim: true,
    },
    permissionsId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "permission",
      },
    ],
    pageAccessId: [
      {
        type: Schema.Types.ObjectId,
        ref: "pages",
      },
    ],
    elementAccessId: [
      {
        type: Schema.Types.ObjectId,
        ref: "pageelements",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("roles", roleSchema);

module.exports = Role;
