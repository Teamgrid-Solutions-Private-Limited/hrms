const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name : {
        type:String,
        required :true
    },
 logo:{
    type: String,
    required:true

 },
 email:{
    type: String,
    required: true

 },
 addressLine:{
    type:String,
    required:true

 },
 phone:{
    type:String,
    required:true

 },
 
city:{
    type:String,
    required:true

},
state:{
    type:String,
    required:true
},
country:{
    type:String,
    required:true
},
zipCode:{
    type:String,
    required:true
}
});
organization = mongoose.model('organizations',organizationSchema);

module.exports= organization