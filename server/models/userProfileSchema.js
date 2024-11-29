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
    zipcode:{
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
    idNumber:{
      type:Number
    },
    dob: { type: Date, required: true },
    contactNumber: { type: String, required: true},
  },
  { timestamps: true }
);

module.exports = mongoose.model("userprofile", UserProfileSchema);
