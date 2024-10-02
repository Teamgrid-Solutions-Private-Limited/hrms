const Role = require('../models/roleSchema');
const User = require('../models/userSchema');
const Organization = require('../models/organizationSchema');

class authController {
    static signUp = async (req,res) => {
        try {

            const {name,email,password,phone} = req.body;
            if (!name || !email || !password || !phone) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const existingUser = await User.findOne({email});
            if(existingUser)
            {
                return res.status(200).json({message:"user  already exist"});
            }
            let role = await Role.findOne({ name: 'super_admin' });  
            if (!role) {
            
                role = new Role({ name: 'super_admin' });
                await role.save();
            }

            // let role = await Role.find({name:'super_admin'})
            // if(!role)
            // {
            //     role = new Role({
            //         name: 'super_admin'
            //     })
            //     await role.save();
            // }

            const user = new User({ name, email, password, phone, roleId: role._id });
            const savedUser = await user.save();

            res.status(201).json({ message: "User created successfully", user: savedUser });




        } catch (error) {
            res.status(500).json({ message: "Error in sign up", error: error.message });
        }
        
    }


    static addOrganization = async (req,res) => {
        try {
            const  { userId, name, logo, email, addressLine, phone, city, state, country, zipCode } = req.body;
            if (!name || !logo || !email || !addressLine || !phone || !city || !state || !country || !zipCode) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const organization = new Organization({
                name, logo, email, addressLine, phone, city, state, country, zipCode
            })
         const   savedOrganization = await organization.save();
            user.organizationId = savedOrganization._id;
            await user.save();
           res.status(200).json({message:"organization setup successfully",organization:savedOrganization,user:user});

            
        } catch (error) {
           res.status(200).json({message:"Error creating Organization",error:error.message}) 
        }
    }
}

module.exports= authController;