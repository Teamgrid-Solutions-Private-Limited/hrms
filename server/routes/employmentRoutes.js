const express = require("express");
const authJwt = require('../middlewares/authJwt');
const checkRole = require('../middlewares/checkRole');
const EmploymentInfoController = require("../controllers/employmentController");
const router = express.Router();

// Create employment info (POST)
router.post("/employmentinfo", EmploymentInfoController.createEmploymentInfo);

// Get all employment infos (GET)
router.get("/employmentinfo",authJwt(),
checkRole(["admin", "super_admin","hr"]), EmploymentInfoController.getAllEmploymentInfos);

// Get employment info by user ID (GET)
router.get("/employmentinfo/:id",authJwt(),
checkRole(["admin", "super_admin", "employee", "hr"]),EmploymentInfoController.getEmploymentInfoByIdUserID);

// Get employment info by ID (GET)
router.get(
  "/employmentinfo/:id",authJwt(),
  checkRole(["admin", "super_admin", "employee", "hr"]),
  EmploymentInfoController.getEmploymentInfoById
);

// Update employment info by ID (PUT)
router.put(
  "/employmentinfo/:id",
  EmploymentInfoController.updateEmploymentInfo
);

// Delete employment info by ID (DELETE)
router.delete(
  "/employmentinfo/:id",
  EmploymentInfoController.deleteEmploymentInfo
);

module.exports = router;
