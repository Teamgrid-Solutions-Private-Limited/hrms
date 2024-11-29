const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = new Schema(
  {
    name: {
      type: String,
      enum: ["super_admin", "admin", "hr", "employee"],
      required: true,
      
    },
   
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("roles", roleSchema);

module.exports = Role;
