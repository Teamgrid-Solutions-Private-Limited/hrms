const organization = require('../models/organizationSchema');
const Role = require('../models/roleSchema');
const User = require('../models/userSchema');

class organizationController
{
    static addOrganization = async (req,res) => {
        try{
            const { name, logo,email, addressLine, phone , 
                city,
               state,
               country,
               zipCode} = req.body;
    
               if (!name || !logo || !email || !addressLine || !phone || !city || !state || !country || !zipCode)
                {
                   return res.status(400).json({ message: "Missing required fields" });
               }
    
               // Create and save the organization
               const organization = new Organization({
                   
                   name,
                   logo,
                   email,
                   addressLine,
                   phone,
                 
                   city,
                   state,
                   country,
                   zipCode ,
               });
               const savedOrganization = await organization.save();
    
               res.status(200).json({message:"organization created successfully",info:savedOrganization});
    

        }catch(error)
        {
            res.status(200).json({message:"Error in creating organization",error:error.message});
        }
        
           // Ensure the 'admin' role exists
        //    let role = await Role.findOne({ name: 'super_admin' });
        //    if (!role) {
        //        role = new Role({
        //            name: 'super_admin',
                   
        //        });
        //        await role.save();
        //    }

        //    // Hash the default password
        //    const hashedPassword = await bcrypt.hash('admin', 10);

        //    const user = new User({
        //     username
        //    })


        
    }

    static viewAll = async (req,res) => {
        try {
            // const {id}= req.params;
            const data = await User.find()
            res.status(200).json({message:"search successfull",data});
            
        } catch (error) {
            res.status(500).json({message:"internal server error",error:error.message});
        }
        
    }

}

module.exports = organizationController;