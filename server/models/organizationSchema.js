const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name : {
        type:String,
        required :true
    },
 logo:{
    type: String,
     

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
    required:true

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