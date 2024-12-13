const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }],
    name : {
        type:String,
         },
 logo:{
    type: String,
     },
 noEmployees:
 {
    type: Number
},
 industry:{
         type:String
 },
 email:{
    type: String,
    required: true
},
 addressLine:{
    type:String,
     },
 phone:{
    type:String,
    },
 
city:{
    type:String,
    

},
state:{
    type:String,
  
},
country:{
    type:String,
     
},
zipCode:{
    type:String,
   
}
});
organization = mongoose.model('organizations',organizationSchema);

module.exports= organization