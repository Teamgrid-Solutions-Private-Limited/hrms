const mongoose = require("mongoose");
const { Payroll, PaySchedule, SalaryComponent, Form16 } = require("../models/payrollSchema");
const fs = require('fs');
const path = require('path');

// Payroll Dashboard Controller
const getPayrollDashboard = async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // Get payroll statistics
    const totalEmployees = await Payroll.distinct('employeeId').countDocuments();
    const processedPayrolls = await Payroll.countDocuments({ 
      isProcessed: true, 
      'payPeriod.month': currentMonth, 
      'payPeriod.year': currentYear 
    });
    const pendingPayrolls = await Payroll.countDocuments({ 
      isProcessed: false, 
      'payPeriod.month': currentMonth, 
      'payPeriod.year': currentYear 
    });
    const totalSalaryPaid = await Payroll.aggregate([
      { 
        $match: { 
          isPaid: true, 
          'payPeriod.month': currentMonth, 
          'payPeriod.year': currentYear 
        } 
      },
      { $group: { _id: null, total: { $sum: "$netSalary" } } }
    ]);

    // Get recent payrolls
    const recentPayrolls = await Payroll.find({ isProcessed: true })
      .populate('employeeId', 'firstName lastName email')
      .populate('paySchedule', 'name frequency')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get monthly payroll trend
    const monthlyTrend = await Payroll.aggregate([
      { $match: { isProcessed: true, 'payPeriod.year': currentYear } },
      { 
        $group: { 
          _id: "$payPeriod.month", 
          totalSalary: { $sum: "$netSalary" },
          count: { $sum: 1 }
        } 
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        statistics: {
          totalEmployees,
          processedPayrolls,
          pendingPayrolls,
          totalSalaryPaid: totalSalaryPaid[0]?.total || 0
        },
        recentPayrolls,
        monthlyTrend
      }
    });
  } catch (error) {
    console.error('Payroll Dashboard Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching dashboard data' });
  }
};

// Salary Components Management
const createSalaryComponent = async (req, res) => {
  try {
    const { name, type, isTaxable, isRecurring, amount, percentage, description } = req.body;

    const salaryComponent = new SalaryComponent({
      name,
      type,
      isTaxable,
      isRecurring,
      amount,
      percentage,
      description
    });

    await salaryComponent.save();

    res.status(201).json({
      success: true,
      message: 'Salary component created successfully',
      data: salaryComponent
    });
  } catch (error) {
    console.error('Create Salary Component Error:', error);
    res.status(500).json({ success: false, message: 'Error creating salary component' });
  }
};

const getAllSalaryComponents = async (req, res) => {
  try {
    const components = await SalaryComponent.find({ isActive: true }).sort({ name: 1 });
    res.json({
      success: true,
      data: components
    });
  } catch (error) {
    console.error('Get Salary Components Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching salary components' });
  }
};

const updateSalaryComponent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const component = await SalaryComponent.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!component) {
      return res.status(404).json({ success: false, message: 'Salary component not found' });
    }

    res.json({
      success: true,
      message: 'Salary component updated successfully',
      data: component
    });
  } catch (error) {
    console.error('Update Salary Component Error:', error);
    res.status(500).json({ success: false, message: 'Error updating salary component' });
  }
};

// Delete Salary Component
const deleteSalaryComponent = async (req, res) => {
  try {
    const { id } = req.params;

    const component = await SalaryComponent.findByIdAndDelete(id);

    if (!component) {
      return res.status(404).json({ success: false, message: 'Salary component not found' });
    }

    res.json({
      success: true,
      message: 'Salary component deleted successfully'
    });
  } catch (error) {
    console.error('Delete Salary Component Error:', error);
    res.status(500).json({ success: false, message: 'Error deleting salary component' });
  }
};

// Pay Schedule Management
const createPaySchedule = async (req, res) => {
  try {
    const { name, frequency, payDay, payDayOfWeek } = req.body;

    const paySchedule = new PaySchedule({
      name,
      frequency,
      payDay,
      payDayOfWeek
    });

    await paySchedule.save();

    res.status(201).json({
      success: true,
      message: 'Pay schedule created successfully',
      data: paySchedule
    });
  } catch (error) {
    console.error('Create Pay Schedule Error:', error);
    res.status(500).json({ success: false, message: 'Error creating pay schedule' });
  }
};

const getAllPaySchedules = async (req, res) => {
  try {
    const schedules = await PaySchedule.find({ isActive: true }).sort({ name: 1 });
    res.json({
      success: true,
      data: schedules
    });
  } catch (error) {
    console.error('Get Pay Schedules Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching pay schedules' });
  }
};

// Update Pay Schedule
const updatePaySchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const schedule = await PaySchedule.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Pay schedule not found' });
    }

    res.json({
      success: true,
      message: 'Pay schedule updated successfully',
      data: schedule
    });
  } catch (error) {
    console.error('Update Pay Schedule Error:', error);
    res.status(500).json({ success: false, message: 'Error updating pay schedule' });
  }
};

// Delete Pay Schedule
const deletePaySchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await PaySchedule.findByIdAndDelete(id);

    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Pay schedule not found' });
    }

    res.json({
      success: true,
      message: 'Pay schedule deleted successfully'
    });
  } catch (error) {
    console.error('Delete Pay Schedule Error:', error);
    res.status(500).json({ success: false, message: 'Error deleting pay schedule' });
  }
};

// Employee Payroll Management
const createEmployeePayroll = async (req, res) => {
  try {
    console.log('=== CREATE EMPLOYEE PAYROLL START ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User:', req.user);
    
    const {
      employeeId,
      payPeriod,
      paySchedule,
      salaryComponents,
      basicSalary,
      taxDetails
    } = req.body;

    // Validate required fields
    if (!employeeId) {
      console.log('❌ Validation failed: employeeId is missing');
      return res.status(400).json({ success: false, message: 'employeeId is required' });
    }

    if (!payPeriod || !payPeriod.month || !payPeriod.year) {
      console.log('❌ Validation failed: payPeriod is missing or invalid');
      return res.status(400).json({ success: false, message: 'payPeriod with month and year is required' });
    }

    if (!basicSalary || isNaN(basicSalary) || basicSalary <= 0) {
      console.log('❌ Validation failed: basicSalary is missing or invalid');
      return res.status(400).json({ success: false, message: 'Valid basicSalary is required' });
    }

    console.log('✅ Validation passed');

    // Calculate totals
    let totalEarnings = 0;
    let totalDeductions = 0;

    if (salaryComponents && Array.isArray(salaryComponents)) {
      console.log('Processing salary components:', salaryComponents.length);
      salaryComponents.forEach((component, index) => {
        console.log(`Component ${index}:`, component);
        if (component.type === 'earnings' || component.type === 'allowances') {
          totalEarnings += component.amount || 0;
        } else if (component.type === 'deductions') {
          totalDeductions += component.amount || 0;
        }
      });
    } else {
      console.log('No salary components provided or invalid format');
    }

    const grossSalary = basicSalary + totalEarnings;
    const netSalary = grossSalary - totalDeductions;

    console.log('Calculated values:', {
      basicSalary,
      totalEarnings,
      totalDeductions,
      grossSalary,
      netSalary
    });

    // Calculate tax if tax details provided
    let calculatedTaxDetails = null;
    if (taxDetails) {
      console.log('Calculating tax details:', taxDetails);
      calculatedTaxDetails = calculateTax(taxDetails);
      console.log('Calculated tax details:', calculatedTaxDetails);
    }

    // Create payroll object
    const payrollData = {
      employeeId,
      payPeriod,
      paySchedule,
      salaryComponents: salaryComponents || [],
      basicSalary,
      grossSalary,
      totalEarnings,
      totalDeductions,
      netSalary,
      taxDetails: calculatedTaxDetails,
      createdBy: req.user?.id
    };

    console.log('Creating Payroll with data:', JSON.stringify(payrollData, null, 2));

    // Validate mongoose ObjectId
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      console.log('❌ Invalid employeeId ObjectId:', employeeId);
      return res.status(400).json({ success: false, message: 'Invalid employeeId format' });
    }

    if (paySchedule && !mongoose.Types.ObjectId.isValid(paySchedule)) {
      console.log('❌ Invalid paySchedule ObjectId:', paySchedule);
      return res.status(400).json({ success: false, message: 'Invalid paySchedule format' });
    }

    console.log('✅ ObjectId validation passed');

    const payroll = new Payroll(payrollData);

    console.log('Payroll model created, attempting to save...');
    await payroll.save();
    console.log('✅ Payroll saved successfully');

    res.status(201).json({
      success: true,
      message: 'Payroll created successfully',
      data: payroll
    });
  } catch (error) {
    console.error('=== CREATE EMPLOYEE PAYROLL ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Check for specific mongoose validation errors
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
      const validationErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error', 
        errors: validationErrors 
      });
    }

    // Check for duplicate key errors
    if (error.code === 11000) {
      console.error('Duplicate key error:', error.keyValue);
      return res.status(400).json({ 
        success: false, 
        message: 'Duplicate payroll entry for this employee and period' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Error creating payroll',
      error: error.message 
    });
  }
};

const getEmployeePayrolls = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month, year, page = 1, limit = 10 } = req.query;

    const query = { employeeId };
    if (month && year) {
      query['payPeriod.month'] = parseInt(month);
      query['payPeriod.year'] = parseInt(year);
    }

    const payrolls = await Payroll.find(query)
      .populate('paySchedule', 'name frequency')
      .sort({ 'payPeriod.year': -1, 'payPeriod.month': -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Payroll.countDocuments(query);

    res.json({
      success: true,
      data: {
        payrolls,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          totalRecords: total
        }
      }
    });
  } catch (error) {
    console.error('Get Employee Payrolls Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching payrolls' });
  }
};

// Update Employee Payroll
const updateEmployeePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const payroll = await Payroll.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!payroll) {
      return res.status(404).json({ success: false, message: 'Payroll not found' });
    }

    res.json({
      success: true,
      message: 'Payroll updated successfully',
      data: payroll
    });
  } catch (error) {
    console.error('Update Employee Payroll Error:', error);
    res.status(500).json({ success: false, message: 'Error updating payroll' });
  }
};

// Delete Employee Payroll
const deleteEmployeePayroll = async (req, res) => {
  try {
    const { id } = req.params;

    const payroll = await Payroll.findByIdAndDelete(id);

    if (!payroll) {
      return res.status(404).json({ success: false, message: 'Payroll not found' });
    }

    res.json({
      success: true,
      message: 'Payroll deleted successfully'
    });
  } catch (error) {
    console.error('Delete Employee Payroll Error:', error);
    res.status(500).json({ success: false, message: 'Error deleting payroll' });
  }
};

const processPayroll = async (req, res) => {
  try {
    const { payrollId } = req.params;

    const payroll = await Payroll.findById(payrollId);
    if (!payroll) {
      return res.status(404).json({ success: false, message: 'Payroll not found' });
    }

    payroll.isProcessed = true;
    payroll.processedAt = new Date();
    payroll.updatedBy = req.user?.id;

    await payroll.save();

    res.json({
      success: true,
      message: 'Payroll processed successfully',
      data: payroll
    });
  } catch (error) {
    console.error('Process Payroll Error:', error);
    res.status(500).json({ success: false, message: 'Error processing payroll' });
  }
};

// Tax Calculation Function
const calculateTax = (taxDetails) => {
  const { basicSalary, hra, specialAllowance, otherAllowances, taxRegime } = taxDetails;
  
  let totalTaxableIncome = basicSalary + hra + specialAllowance + otherAllowances;
  
  // Basic tax calculation (simplified - you may want to implement more complex tax slabs)
  let taxLiability = 0;
  
  if (taxRegime === 'new') {
    // New tax regime calculation
    if (totalTaxableIncome <= 300000) {
      taxLiability = 0;
    } else if (totalTaxableIncome <= 600000) {
      taxLiability = (totalTaxableIncome - 300000) * 0.05;
    } else if (totalTaxableIncome <= 900000) {
      taxLiability = 15000 + (totalTaxableIncome - 600000) * 0.10;
    } else if (totalTaxableIncome <= 1200000) {
      taxLiability = 45000 + (totalTaxableIncome - 900000) * 0.15;
    } else if (totalTaxableIncome <= 1500000) {
      taxLiability = 90000 + (totalTaxableIncome - 1200000) * 0.20;
    } else {
      taxLiability = 150000 + (totalTaxableIncome - 1500000) * 0.30;
    }
  } else {
    // Old tax regime calculation
    if (totalTaxableIncome <= 250000) {
      taxLiability = 0;
    } else if (totalTaxableIncome <= 500000) {
      taxLiability = (totalTaxableIncome - 250000) * 0.05;
    } else if (totalTaxableIncome <= 1000000) {
      taxLiability = 12500 + (totalTaxableIncome - 500000) * 0.20;
    } else {
      taxLiability = 112500 + (totalTaxableIncome - 1000000) * 0.30;
    }
  }

  const tds = taxLiability / 12; // Monthly TDS

  return {
    ...taxDetails,
    totalTaxableIncome,
    taxLiability,
    tds
  };
};

// Form 16 Generation
const generateForm16 = async (req, res) => {
  try {
    const { employeeId, financialYear } = req.body;

    // Get employee payroll data for the financial year
    const payrolls = await Payroll.find({
      employeeId,
      'payPeriod.year': parseInt(financialYear),
      isProcessed: true
    }).populate('employeeId', 'firstName lastName email');

    if (payrolls.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No payroll data found for the specified financial year' 
      });
    }

    // Calculate annual totals
    const annualData = payrolls.reduce((acc, payroll) => {
      acc.grossSalary += payroll.grossSalary;
      acc.totalDeductions += payroll.totalDeductions;
      acc.totalTaxableIncome += payroll.taxDetails?.totalTaxableIncome || 0;
      acc.totalTaxLiability += payroll.taxDetails?.taxLiability || 0;
      acc.tds += payroll.taxDetails?.tds || 0;
      return acc;
    }, {
      grossSalary: 0,
      totalDeductions: 0,
      totalTaxableIncome: 0,
      totalTaxLiability: 0,
      tds: 0
    });

    const employee = payrolls[0].employeeId;
    const taxPaid = annualData.tds * 12; // Assuming monthly TDS
    const refundDue = Math.max(0, taxPaid - annualData.totalTaxLiability);

    // Create Form 16 document
    const form16 = new Form16({
      financialYear,
      employeeId,
      employerName: 'Your Company Name', // This should come from organization settings
      employerAddress: 'Your Company Address',
      employerTAN: 'YOURTAN123',
      employeeName: `${employee.firstName} ${employee.lastName}`,
      employeePAN: 'EMPLOYEEPAN', // This should come from employee profile
      employeeAddress: 'Employee Address',
      grossSalary: annualData.grossSalary,
      totalDeductions: annualData.totalDeductions,
      totalTaxableIncome: annualData.totalTaxableIncome,
      totalTaxLiability: annualData.totalTaxLiability,
      tds: annualData.tds,
      taxPaid,
      refundDue,
      isGenerated: true,
      generatedAt: new Date()
    });

    await form16.save();

    // Generate simple text file instead of PDF for now
    const filePath = await generateForm16Text(form16);

    form16.downloadUrl = `/uploads/form16/${form16._id}.txt`;
    await form16.save();

    res.json({
      success: true,
      message: 'Form 16 generated successfully',
      data: {
        form16,
        downloadUrl: form16.downloadUrl
      }
    });
  } catch (error) {
    console.error('Generate Form 16 Error:', error);
    res.status(500).json({ success: false, message: 'Error generating Form 16' });
  }
};

const generateForm16Text = async (form16) => {
  return new Promise((resolve, reject) => {
    try {
      const uploadDir = path.join(__dirname, '../my-upload/uploads/form16');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, `${form16._id}.txt`);
      const content = `
================================================================
                           FORM 16
================================================================

Financial Year: ${form16.financialYear}

EMPLOYER DETAILS:
Name: ${form16.employerName}
Address: ${form16.employerAddress}
TAN: ${form16.employerTAN}

EMPLOYEE DETAILS:
Name: ${form16.employeeName}
PAN: ${form16.employeePAN}
Address: ${form16.employeeAddress}

SALARY DETAILS:
Gross Salary: ₹${form16.grossSalary.toLocaleString()}
Total Deductions: ₹${form16.totalDeductions.toLocaleString()}
Total Taxable Income: ₹${form16.totalTaxableIncome.toLocaleString()}

TAX DETAILS:
Total Tax Liability: ₹${form16.totalTaxLiability.toLocaleString()}
TDS: ₹${form16.tds.toLocaleString()}
Tax Paid: ₹${form16.taxPaid.toLocaleString()}
Refund Due: ₹${form16.refundDue.toLocaleString()}

Generated on: ${form16.generatedAt.toLocaleDateString()}
================================================================
      `;

      fs.writeFileSync(filePath, content);
      resolve(filePath);
    } catch (error) {
      reject(error);
    }
  });
};

const downloadForm16 = async (req, res) => {
  try {
    const { form16Id } = req.params;

    const form16 = await Form16.findById(form16Id);
    if (!form16) {
      return res.status(404).json({ success: false, message: 'Form 16 not found' });
    }

    if (!form16.isGenerated) {
      return res.status(400).json({ success: false, message: 'Form 16 not generated yet' });
    }

    const filePath = path.join(__dirname, '../my-upload/uploads/form16', `${form16Id}.txt`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Form 16 file not found' });
    }

    res.download(filePath, `Form16_${form16.financialYear}_${form16.employeeName}.txt`);
  } catch (error) {
    console.error('Download Form 16 Error:', error);
    res.status(500).json({ success: false, message: 'Error downloading Form 16' });
  }
};

// Get All Form 16s
const getAllForm16s = async (req, res) => {
  try {
    const form16s = await Form16.find()
      .populate('employeeId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: form16s
    });
  } catch (error) {
    console.error('Get All Form 16s Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching Form 16s' });
  }
};

// Create Form 16
const createForm16 = async (req, res) => {
  try {
    const form16Data = req.body;
    const form16 = new Form16(form16Data);
    await form16.save();

    res.status(201).json({
      success: true,
      message: 'Form 16 created successfully',
      data: form16
    });
  } catch (error) {
    console.error('Create Form 16 Error:', error);
    res.status(500).json({ success: false, message: 'Error creating Form 16' });
  }
};

// Update Form 16
const updateForm16 = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const form16 = await Form16.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!form16) {
      return res.status(404).json({ success: false, message: 'Form 16 not found' });
    }

    res.json({
      success: true,
      message: 'Form 16 updated successfully',
      data: form16
    });
  } catch (error) {
    console.error('Update Form 16 Error:', error);
    res.status(500).json({ success: false, message: 'Error updating Form 16' });
  }
};

// Delete Form 16
const deleteForm16 = async (req, res) => {
  try {
    const { id } = req.params;

    const form16 = await Form16.findByIdAndDelete(id);

    if (!form16) {
      return res.status(404).json({ success: false, message: 'Form 16 not found' });
    }

    res.json({
      success: true,
      message: 'Form 16 deleted successfully'
    });
  } catch (error) {
    console.error('Delete Form 16 Error:', error);
    res.status(500).json({ success: false, message: 'Error deleting Form 16' });
  }
};

// Bulk Payroll Processing
const processBulkPayroll = async (req, res) => {
  try {
    const { month, year, employeeIds } = req.body;

    const payrolls = await Payroll.find({
      employeeId: { $in: employeeIds },
      'payPeriod.month': month,
      'payPeriod.year': year,
      isProcessed: false
    });

    const processedPayrolls = [];
    for (const payroll of payrolls) {
      payroll.isProcessed = true;
      payroll.processedAt = new Date();
      payroll.updatedBy = req.user?.id;
      await payroll.save();
      processedPayrolls.push(payroll);
    }

    res.json({
      success: true,
      message: `Processed ${processedPayrolls.length} payrolls successfully`,
      data: processedPayrolls
    });
  } catch (error) {
    console.error('Bulk Payroll Processing Error:', error);
    res.status(500).json({ success: false, message: 'Error processing bulk payroll' });
  }
};

module.exports = {
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
  processBulkPayroll
}; 