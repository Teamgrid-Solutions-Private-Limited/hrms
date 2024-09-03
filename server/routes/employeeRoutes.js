const express = require("express");
const router = express.Router();
const upload = require("../middlewares/fileUpload");
const EmployeeController = require("../controllers/employeeController");

// Apply validation rules and attach the handler
router.post(
  "/add-employee",
  upload.single("profilePhoto"),
  EmployeeController.validationRules(),
  EmployeeController.addEmployee
);
router.post("/signin", EmployeeController.login);

module.exports = router;
