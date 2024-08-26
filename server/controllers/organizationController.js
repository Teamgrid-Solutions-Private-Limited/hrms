const Employee = require('../model/employeeSchema');
const Organization = require('../model/organizationSchema');
const Role = require('../model/roleSchema');
const bcrypt = require('bcryptjs');
 
class organizationController {
    static addOrgainzation = async (req, res) => {
        try {
            const { name, logo, email, address, phone } = req.body;
            console.log(name, logo, email, address, phone);
 
            // Check for required fields
            if (!name || !logo || !email || !address || !phone) {
                return res.status(400).json({ message: "Missing required fields" });
            }
 
            // Create and save the organization
            const organization = new Organization({
                name,
                email,
                logo,
                phone,
                address
            });
            const savedOrganization = await organization.save();
 
            // Ensure the 'admin' role exists
            let role = await Role.findOne({ name: 'admin' });
            if (!role) {
                role = new Role({
                    name: 'admin',
                    permissions: ['create', 'update', 'delete', 'read']
                });
                await role.save();
            }
 
            // Hash the default password
            const hashedPassword = await bcrypt.hash('admin', 10);
 
            // Create and save the admin employee
            const admin = new Employee({
                firstName: 'Admin',
                lastName: 'User',
                email,
                phone,
                username: 'admin',
                password: hashedPassword,
                role: role._id,
                organization: savedOrganization._id,
                department: 'Administration',
                jobPosition: 'Administrator',
                jobRole: 'Administrator', // Default value
                shiftInformation: '', // Default empty string
                workType: 'full-time',
                employeeType: 'permanent',
                companyType: 'default',
                workLocation: '', // Default empty string
                joiningDate: new Date(),
                contractEndDate: null, // Default null
                baseSalary: 0, // Default value
                emergencyContacts: [], // Default empty array
                documents: [], // Default empty array
 
                // Provide default values that match the schema requirements
                adharId: '000000000000', // Default value
                qualification: 'Not Specified', // Default value
                maritalStatus: 'single', // Default value
                nationality: 'Not Specified', // Default value
                gender: 'other', // Default value
                dob: new Date(), // Default to current date
 
                // Provide default values as objects
                address: {
                    addressLine: 'Not Provided',
                    country: 'Not Provided',
                    state: 'Not Provided',
                    city: 'Not Provided',
                    zipCode: '000000'
                }, // Default empty AddressSchema
                bankAddress: {
                    addressLine: 'Not Provided',
                    country: 'Not Provided',
                    state: 'Not Provided',
                    city: 'Not Provided',
                    zipCode: '000000'
                }, // Default empty AddressSchema
 
                // Bank Information
                bank: 'Not Provided', // Default empty string
                accountDetails: 'Not Provided', // Default empty string
                branch: 'Not Provided', // Default empty string
                ifsc: 'Not Provided' // Default empty string
            });
 
            await admin.save();
 
            res.status(201).json({ message: "Organization created successfully", info: savedOrganization });
        } catch (error) {
            res.status(500).json({ message: "Error creating organization", error: error.message });
        }
    }

    static getOrganization = async(req,res)=>{
        try{
            const data = await Organization.find();
            res.status(200).json({message:'data retrive successfully'});

        }catch(error)
        {
            res.status(404).json({message:'organization not found',error:error.message});
        }
    }
    static getOrganizationById = async(req,res)=>{
        try{
            const organizationId = req.params;
            const data = await Organization.find(organizationId);
            res.status(200).json({message:'data retrive successfully',info:data});

        }catch(error)
        {
            res.status(404).json({message:'organization not found',error:error.message});
        }
    }


    static updateOrganization = async(req,res)=>{
        try{
            const {id} = req.params;
            const data = req.body;
            const update = await findByIdAndUpdate(id,
                {$set:data},
                {new:true}
            )
            if(!update)
            {
                return res.status(404).json({error:"organization not found"});
            }
            res.status(200).json({message:'update done successfully'});

        }catch(error)
        {
            res.status(500).json({message:'error updating',error:error.message});
        }
    }
    static deleteOrganization = async(req,res)=>{
        try{
            const {id} = req.params;
            
            const deletedData = await Organization.findByIdAndDelete(id);
            res.status(201).json({message:'organization delted successfully',info:deletedData});

        }catch(error)
        {
            res.status(500).json({message:'error deleting organization',error:error.message});
        }
    }
}
 
module.exports = organizationController;