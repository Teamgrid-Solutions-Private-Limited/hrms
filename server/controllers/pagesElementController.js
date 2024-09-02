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
}

module.exports = PageElementController;
