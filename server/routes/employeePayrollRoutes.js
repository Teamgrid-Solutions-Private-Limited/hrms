const express = require("express");
const router = express.Router();
const {
  getEmployeePayrollDashboard,
  configureEmployeeSalary,
  collectTaxDetails,
  getEmployeePayrollDetails,
  getEmployeeForm16,
  getAvailableSalaryComponents,
  getEmployeePayrollSummary
} = require("../controllers/employeePayrollController");

// Employee Payroll Dashboard
router.get("/dashboard/:employeeId", getEmployeePayrollDashboard);

// Employee Salary Configuration
router.post("/configure-salary/:employeeId", configureEmployeeSalary);

// Tax Details Collection
router.post("/collect-tax-details/:employeeId", collectTaxDetails);

// Employee Payroll Details
router.get("/details/:employeeId", getEmployeePayrollDetails);

// Employee Form 16
router.get("/form16/:employeeId", getEmployeeForm16);

// Available Salary Components
router.get("/salary-components", getAvailableSalaryComponents);

// Employee Payroll Summary
router.get("/summary/:employeeId", getEmployeePayrollSummary);

module.exports = router; 