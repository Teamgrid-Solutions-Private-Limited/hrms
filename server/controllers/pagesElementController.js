const PageElement = require("../models/pageElementSchema"); // Adjust the path as needed

class PageElementController {
  static async addPageElement(req, res) {
    try {
      const { elementName, pageId } = req.body;

      if (!elementName || !pageId) {
        return res
          .status(400)
          .json({ message: "Element name and page ID are required" });
      }

      // Create a new PageElement
      const newPageElement = new PageElement({
        elementName,
        pageId,
      });

      const savedPageElement = await newPageElement.save();

      // Send response
      return res.status(201).json({
        message: "PageElement created successfully",
        data: savedPageElement,
      });
    } catch (error) {
      console.error("Error creating PageElement:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static view = async(req,res)=>{
    try{
      const data = await PageElement.find();
      res.status(200).json({message:"data retrive successfully",info:data});
    }catch(error)
    {
      res.status(500).json({message:"data retrieval unsuccessfull"});
    }
  }

  static delete = async(req,res)=>{
    const {id} = req.params;
    try{
      const data = await PageElement.findByIdAndDelete(id);
      res.status(200).json({message:"pages element deletetd successfully",info:data});

    }catch(error)
    {res.status(500).json({message:"error deleting pages elements",error:error.message})};
  }

  static update = async(req,res)=>{
    const {id}= req.params.id;
    const data = req.body;
    try{ 
      const  update = await PageElement.findByIdAndUpdate(id,{$set:data},{new:true});

      if(!update)
      {
        res.status(404).json({error:"pages element id not found"});
      }
      res.status(200).json({message:"update done successfully",info:update})
    }catch(error)
    {
      res.status(500).json({message:"update can not be done",error:error.message})
    }
   
  }
}

module.exports = PageElementController;
