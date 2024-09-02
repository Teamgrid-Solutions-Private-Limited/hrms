// controllers/PagesController.js
const Pages = require("../models/pagesSchema");
const PageGroup = require("../models/pageGroupSchema"); // Make sure to import related models if needed
const Role = require("../models/roleSchema"); // Import Role model

class PagesController {
  static async createPage(req, res) {
    try {
      const { pageName, url, pageGroupId, order, isVisible, accessRoles } =
        req.body;

      // Validate pageGroupId and accessRoles (optional)
      const pageGroup = await PageGroup.findById(pageGroupId);
      if (!pageGroup) {
        return res.status(400).json({ message: "Invalid pageGroupId" });
      }

      const roles = await Role.find({ _id: { $in: accessRoles } });
      if (roles.length !== accessRoles.length) {
        return res
          .status(400)
          .json({ message: "One or more roles are invalid" });
      }

      // Create a new page instance
      const newPage = new Pages({
        pageName,
        url,
        pageGroupId,
        order,
        isVisible,
        accessRoles,
      });

      // Save to the database
      await newPage.save();

      // Respond with success
      res.status(201).json({
        message: "Page created successfully",
        data: newPage,
      });
    } catch (error) {
      // Respond with error
      res.status(500).json({
        message: "Error creating page",
        error: error.message,
      });
    }
  }

  static view = async(req,res)=>{
    try{
      const data = await Pages.find();
      res.status(200).json({message:"data retrive successfully",info:data});
    }catch(error)
    {
      res.status(500).json({message:"data retrieval unsuccessfull"});
    }
  }

  static delete = async(req,res)=>{
    const {id} = req.params;
    try{
      const data = await Pages.findByIdAndDelete(id);
      res.status(200).json({message:"pages deletetd successfully",info:data});

    }catch(error)
    {res.status(500).json({message:"error deleting pages",error:error.message})};
  }

  static updatePages = async(req,res)=>{
    const {id}= req.params.id;
    const data = req.body;
    try{ 
      const  update = await Pages.findByIdAndUpdate(id,{$set:data},{new:true});

      if(!update)
      {
        res.status(404).json({error:"pages id not found"});
      }
      res.status(200).json({message:"update done successfully",info:update})
    }catch(error)
    {
      res.status(500).json({message:"update can not be done",error:error.message})
    }
   
  }
}

module.exports = PagesController;
