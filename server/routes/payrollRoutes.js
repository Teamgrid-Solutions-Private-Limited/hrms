const express = require("express");
const router = express.Router();
const {
  getPayrollDashboard,
  createSalaryComponent,
  getAllSalaryComponents,
  updateSalaryComponent,
  createPaySchedule,
  getAllPaySchedules,
  createEmployeePayroll,
  getEmployeePayrolls,
  processPayroll,
  generateForm16,
  downloadForm16,
  processBulkPayroll
} = require("../controllers/payrollController");

// Payroll Dashboard
router.get("/dashboard", getPayrollDashboard);

// Salary Components Routes
router.post("/salary-components", createSalaryComponent);
router.get("/salary-components", getAllSalaryComponents);
router.put("/salary-components/:id", updateSalaryComponent);

// Pay Schedule Routes
router.post("/pay-schedules", createPaySchedule);
router.get("/pay-schedules", getAllPaySchedules);

// Employee Payroll Routes
router.post("/employee-payroll", createEmployeePayroll);
router.get("/employee-payroll/:employeeId", getEmployeePayrolls);
router.put("/process-payroll/:payrollId", processPayroll);
router.post("/bulk-process", processBulkPayroll);

// Form 16 Routes
router.post("/generate-form16", generateForm16);
router.get("/download-form16/:form16Id", downloadForm16);

module.exports = router; 