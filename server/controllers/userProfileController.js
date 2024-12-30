const multer = require("multer");
const upload = require("../middlewares/fileUpload");
const UserProfile = require("../models/userProfileSchema"); // Import the UserProfile model
const User = require("../models/userSchema"); // Import the User model
const BASE_URL = process.env.BASE_URL || "http://localhost:6010/";
const upload_URL = `${BASE_URL}images/`;

class UserProfileController {
  // Create a new user profile
  static createUserProfile = async (req, res) => {
    try {
      upload.single("photo")(req, res, async (err) =>{
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        const { userId, address,city,zipCode,country,state,idDocument,idNumber, dob, contactNumber,gender,photo,idExpiryDate } = req.body;
        console.log("reuest body",req.body);
        

        // Validate required fields
        // if (!userId || !dob || !contactNumber) {
        //   return res.status(400).json({ error: "All fields are required" });
        // }
  
        // Check if user exists
        const userExists = await User.findById(userId);
        if (!userExists) {
          return res.status(404).json({ error: "User not found" });
        }
  
        // Create and save the user profile
        const userProfile = new UserProfile({
          userId,
           country,
           zipCode,
           state,
           idDocument,
           idNumber,
           idExpiryDate,
           address,
           city,
           gender,
           photo:req.file
           ? `${upload_URL}${req.file.filename}`
           : undefined,
          dob,
          contactNumber,
        });
        const savedProfile = await userProfile.save();
  
        res
          .status(201)
          .json({
            message: "User profile created successfully",
            profile: savedProfile,
          });
      });
    
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  };

  // Get user profile by ID
  static getUserProfileById = async (req, res) => {
    const { id } = req.params;
    try {
      const profile = await UserProfile.findById(id);
      if (!profile) {
        return res.status(404).json({ error: "User profile not found" });
      }
      res.status(200).json({message:"profile retrive successfully", info:profile});
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  };
// get user profile by user ID
  static getProfileById = async (req, res) => {
    const { id } = req.params;// user ID
     
    
    try {
      const profile = await UserProfile.findOne({userId:id});
     
      if (!profile) {
        return res.status(404).json({ error: "User profile not found" });
      }
   
      
      res.status(200).json({ message: "profile retrieved successfully", info: profile });
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  };

  // Update user profile by ID
  // static updateUserProfile = async (req, res) => {
  //   const { id } = req.params;
  //   try {
  //     upload.single("photo")(req, res, async (err) =>{
  //       if (err) {
  //         return res.status(500).json({ error: err.message });
  //       }
  //       if (req.file) {
  //         req.body.Photo = `/uploads/${req.file.filename}`;  
  //       }
  
  //       const updatedProfile = await UserProfile.findByIdAndUpdate(id, req.body, {
  //         new: true,
  //       });
  //       if (!updatedProfile) {
  //         return res.status(404).json({ error: "User profile not found" });
  //       }
  //       res
  //         .status(200)
  //         .json({
  //           message: "User profile updated successfully",
  //           profile: updatedProfile,
  //         });
  //     });
      
  //   } catch (error) {
  //     res.status(500).json({ error: "Server error", details: error.message });
  //   }
  // };

  static updateUserProfile = async (req, res) => {
    const { id } = req.params;
    try {
      upload.single("photo")(req, res, async (err) => {
        if (err) {
          console.error("Multer Error:", err);
          return res.status(500).json({ error: err.message });
        }
        console.log("Uploaded file:", req.file);
  
        if (req.file) {
          req.body.photo = `${upload_URL}${req.file.filename}`;
        } else {
          console.warn("No file uploaded.");
        }
  
        console.log("Request body after file upload:", req.body);
  
        const updatedProfile = await UserProfile.findByIdAndUpdate(id, req.body, {
          new: true,
        });
  
        if (!updatedProfile) {
          return res.status(404).json({ error: "User profile not found" });
        }
  
        res.status(200).json({
          message: "User profile updated successfully",
          profile: updatedProfile,
        });
      });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: "Server error", details: error.message });
    }
  };
  

  // Delete user profile by ID
  static deleteUserProfile = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedProfile = await UserProfile.findByIdAndDelete(id);
      if (!deletedProfile) {
        return res.status(404).json({ error: "User profile not found" });
      }
      res.status(200).json({ message: "User profile deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  };
}

module.exports = UserProfileController;
