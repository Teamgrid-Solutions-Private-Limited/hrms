const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    contactType: {
      type: String,
      enum: ["emergency"],
      required: true,
    },
    contactName: {
      type: String,
      required: true,
    },
    contactRelationship: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create a model for the schema
const Contact = mongoose.model("contacts", contactSchema);

module.exports = Contact;
