const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    address :{
      type:String
    },
    city:{
      type:String
    },
    gender:{
      type:String,
      enum: ["male", "female", "other","select"],
      default: "select",
     
      
    },
    photo:{
      type:String
    },
    zipCode:{
      type:String
    },
    state:{
      type:String
    },
    country:{
      type:String
    },
    idDocument:{
      type:String
    },
    idExpiryDate:{
      type:Date
    },
    idNumber:{
      type:String
    },
    dob: { type: Date, required: true },
    contactNumber: { type: String, required: true},
  },
  { timestamps: true }
);

module.exports = mongoose.model("userprofile", UserProfileSchema);
