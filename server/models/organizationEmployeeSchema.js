const mongoose = require("mongoose");
const organizationEmployeeSchema = new mongoose.Schema({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: "organizations",
    required: true,
  },
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
});

module.exports = mongoose.model(
  "organization_employees",
  organizationEmployeeSchema
);
