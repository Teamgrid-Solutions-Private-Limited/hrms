const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Maximum file size (2 MB)
const maxSize = 2 * 1024 * 1024;

// Create storage configuration
const storage = multer.diskStorage({
  // Destination folder
  destination: (req, file, cb) => {
    const dir = "my-upload/images";
    // Ensure the directory exists or create it
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  // File naming convention
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File type validation
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/svg+xml",
    "application/pdf",
  ];
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".svg", ".pdf"];

  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (
    allowedMimeTypes.includes(file.mimetype) &&
    allowedExtensions.includes(fileExtension)
  ) {
    cb(null, true); // Accept the file
  } else {
    cb(null, false); // Reject the file
    return cb(new Error("Only .jpg, .jpeg, .png, .svg, and .pdf formats are allowed!"));
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxSize },
});

module.exports = upload;
