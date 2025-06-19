const express = require("express");
const router = express.Router();
const {
  getPayrollDashboard,
  createSalaryComponent,
  getAllSalaryComponents,
  updateSalaryComponent,
  deleteSalaryComponent,
  createPaySchedule,
  getAllPaySchedules,
  updatePaySchedule,
  deletePaySchedule,
  createEmployeePayroll,
  getEmployeePayrolls,
  updateEmployeePayroll,
  deleteEmployeePayroll,
  processPayroll,
  generateForm16,
  downloadForm16,
  getAllForm16s,
  createForm16,
  updateForm16,
  deleteForm16,
  processBulkPayroll,
  getAllPayrolls,
  getAllEmployeePayrolls
} = require("../controllers/payrollController");

// Payroll Dashboard
router.get("/dashboard", getPayrollDashboard);

// Get All Payrolls
router.get("/all", getAllPayrolls);

// Salary Components Routes
router.post("/salary-components", createSalaryComponent);
router.get("/salary-components", getAllSalaryComponents);
router.put("/salary-components/:id", updateSalaryComponent);
router.delete("/salary-components/:id", deleteSalaryComponent);

// Pay Schedule Routes
router.post("/pay-schedules", createPaySchedule);
router.get("/pay-schedules", getAllPaySchedules);
router.put("/pay-schedules/:id", updatePaySchedule);
router.delete("/pay-schedules/:id", deletePaySchedule);

// Employee Payroll Routes
router.post("/employee-payroll", createEmployeePayroll);
router.get("/employee-payroll/:employeeId", getEmployeePayrolls);
router.put("/employee-payroll/:id", updateEmployeePayroll);
router.delete("/employee-payroll/:id", deleteEmployeePayroll);
router.put("/process-payroll/:payrollId", processPayroll);
router.post("/bulk-process", processBulkPayroll);

// Get All Employee Payrolls with Advanced Filtering
router.get("/employee-payrolls", getAllEmployeePayrolls);

// Form 16 Routes
router.post("/generate-form16", generateForm16);
router.get("/download-form16/:form16Id", downloadForm16);
router.get("/form16", getAllForm16s);
router.post("/form16", createForm16);
router.put("/form16/:id", updateForm16);
router.delete("/form16/:id", deleteForm16);

module.exports = router; 