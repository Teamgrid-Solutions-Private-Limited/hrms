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

// Employee Payroll Management
const createEmployeePayroll = async (req, res) => {
  try {
    const {
      employeeId,
      payPeriod,
      paySchedule,
      salaryComponents,
      basicSalary,
      taxDetails
    } = req.body;

    // Calculate totals
    let totalEarnings = 0;
    let totalDeductions = 0;

    salaryComponents.forEach(component => {
      if (component.type === 'earnings' || component.type === 'allowances') {
        totalEarnings += component.amount;
      } else if (component.type === 'deductions') {
        totalDeductions += component.amount;
      }
    });

    const grossSalary = basicSalary + totalEarnings;
    const netSalary = grossSalary - totalDeductions;

    // Calculate tax if tax details provided
    let calculatedTaxDetails = null;
    if (taxDetails) {
      calculatedTaxDetails = calculateTax(taxDetails);
    }

    const payroll = new Payroll({
      employeeId,
      payPeriod,
      paySchedule,
      salaryComponents,
      basicSalary,
      grossSalary,
      totalEarnings,
      totalDeductions,
      netSalary,
      taxDetails: calculatedTaxDetails,
      createdBy: req.user?.id
    });

    await payroll.save();

    res.status(201).json({
      success: true,
      message: 'Payroll created successfully',
      data: payroll
    });
  } catch (error) {
    console.error('Create Employee Payroll Error:', error);
    res.status(500).json({ success: false, message: 'Error creating payroll' });
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
  createPaySchedule,
  getAllPaySchedules,
  createEmployeePayroll,
  getEmployeePayrolls,
  processPayroll,
  generateForm16,
  downloadForm16,
  processBulkPayroll
}; 