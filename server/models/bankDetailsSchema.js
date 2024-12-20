const mongoose = require("mongoose");

const bankDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    bankName: { type: String,
         },
    accountNumber: { type: String, 
      required: true },
    branch: { type: String,
         },
    ifsc: { type: String, 
      required: true },
    bankAddressLine: { type: String,
         },
    bankCity: { type: String, 
       },
    bankState: { type: String,
        },
    bankCountry: { type: String,
        },
    bankZipCode: { type: String, 
      
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("bank_details", bankDetailsSchema);
