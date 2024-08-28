const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const User = require("../models/userSchema"); // Adjust the path based on your folder structure

// Configure Multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/profile_photos"); // Adjust the destination as needed
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
//   fileFilter: function (req, file, cb) {
//     const filetypes = /jpeg|jpg|png|svg/; // Added svg to the allowed file types
//     const mimetype = filetypes.test(file.mimetype);
//     const extname = filetypes.test(
//       path.extname(file.originalname).toLowerCase()
//     );

//     // Logging for debugging
//     console.log("MIME Type: ", file.mimetype);
//     console.log("Extension: ", path.extname(file.originalname).toLowerCase());

//     if (mimetype && extname) {
//       return cb(null, true);
//     } else {
//       cb(new Error("Only .jpeg, .jpg, .png, and .svg formats allowed!"));
//     }
//   },
// });

var maxSize = 1 * 1000 * 1000;
const storage = multer.diskStorage({
  destination: "my-upload/images",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || "image/jpg" || "image/jpeg") {
      return cb(null, true);
    } else {
      cb(null, false);
      return cb(newError("Only .jpg,.jpeg,.png thoose format are allowed!!!"));
    }
  },
  limits: maxSize,
});

class userController {
  // Static method to handle adding a new user
  static addUser = async (req, res) => {
    try {
      upload.single("profilePhoto")(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          return res
            .status(400)
            .json({ error: "File upload error", details: err.message });
        } else if (err) {
          return res.status(400).json({ error: "Invalid file type" });
        }

        const { username, email, password, roleId, organizationId } = req.body;

        // Validate required fields
        if (!username || !email || !password || !roleId || !organizationId) {
          return res.status(400).json({ error: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res
            .status(400)
            .json({ error: "User already exists with this email" });
        }

        // Create a new user object
        const user = new User({
          username,
          email,
          password,
          roleId,
          organizationId,
          profilePhoto: req.file ? req.file.path : null, // Save the file path if uploaded
        });

        // Save the user to the database
        await user.save();
        res.status(201).json({ message: "User created successfully", user });
      });
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  };
}

module.exports = userController;
