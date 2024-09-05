const professionalinfo = require("../models/professionalInfoSchema");

class professionalInfoController {
  static async addProfessionalInfo(req, res) {
    try {
      const newProfessionalInfo = new professionalinfo({ ...req.body });

      // Save the new professional info to the database
      const savedProfessionalInfo = await newProfessionalInfo.save();

      // Return a success response
      res.status(201).json({
        message: "Professional information added successfully.",
        data: savedProfessionalInfo,
      });
    } catch (error) {
      console.error("Error adding professional info:", error);
      res.status(500).json({
        message: "Failed to add professional information.",
        error: error.message,
      });
    }
  }

  static async getProfessionalInfo(req, res) {
    try {
      const getData = await professionalinfo.find();
      // Return a success response
      res.status(201).json({
        message: "Professional information retrieved successfully.",
        data: getData,
      });
    } catch (error) {
      console.error("Error adding professional info:", error);
      res.status(500).json({
        message: "Failed to add professional information.",
        error: error.message,
      });
    }
  }

  static async getProfessionalInfoByid(req, res, next) {
    try {
      const _id = req.params.id;
      const professionalData = await professionalinfo.findById(_id);
      res.status(201).json({
        sucess: false,
        message: "data retreived successfully by id",
        professionalData,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfessionalInfo(req, res, next) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid document ID",
        });
      }

      const updatedProfessionalInfo = await professionalinfo.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedProfessionalInfo) {
        return res.status(404).json({
          success: false,
          message: "data not found or update failed",
        });
      }

      // Return success response with updated document data
      res.status(200).json({
        success: true,
        message: "professionalinfo updated successfully",
        data: updatedDocument,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProfessionalinfoController(req, res, next) {
    try {
      const _id = req.params.id;
      const data = await professionalinfo.findByIdAndDelete(_id);

      if (!data) {
        res.status(201).json({
          success: true,
          message: "data not found OR deleting proablem",
        });
      }
      res.status(201).json({ sucess: true, message: "successfully deleted" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = professionalInfoController;
