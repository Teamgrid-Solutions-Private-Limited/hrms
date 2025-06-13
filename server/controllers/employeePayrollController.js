const { Payroll, PaySchedule, SalaryComponent, Form16 } = require("../models/payrollSchema");
const User = require("../models/userSchema");

// Get Employee Payroll Dashboard
const getEmployeePayrollDashboard = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // Get employee details
    const employee = await User.findById(employeeId).select('firstName lastName email');
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Get current month payroll
    const currentPayroll = await Payroll.findOne({
      employeeId,
      'payPeriod.month': currentMonth,
      'payPeriod.year': currentYear
    }).populate('paySchedule', 'name frequency');

    // Get payroll history
    const payrollHistory = await Payroll.find({ employeeId })
      .populate('paySchedule', 'name frequency')
      .sort({ 'payPeriod.year': -1, 'payPeriod.month': -1 })
      .limit(12);

    // Calculate year-to-date totals
    const ytdData = await Payroll.aggregate([
      {
        $match: {
          employeeId: employee._id,
          'payPeriod.year': currentYear,
          isProcessed: true
        }
      },
      {
        $group: {
          _id: null,
          totalGrossSalary: { $sum: "$grossSalary" },
          totalNetSalary: { $sum: "$netSalary" },
          totalTaxPaid: { $sum: "$taxDetails.tds" },
          totalDeductions: { $sum: "$totalDeductions" }
        }
      }
    ]);

    // Get Form 16 history
    const form16History = await Form16.find({ employeeId })
      .sort({ financialYear: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        employee,
        currentPayroll,
        payrollHistory,
        ytdData: ytdData[0] || {
          totalGrossSalary: 0,
          totalNetSalary: 0,
          totalTaxPaid: 0,
          totalDeductions: 0
        },
        form16History
      }
    });
  } catch (error) {
    console.error('Employee Payroll Dashboard Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching employee payroll dashboard' });
  }
};

// Configure Employee Salary Components
const configureEmployeeSalary = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { basicSalary, salaryComponents, paySchedule } = req.body;

    // Validate employee exists
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Validate pay schedule exists
    if (paySchedule) {
      const schedule = await PaySchedule.findById(paySchedule);
      if (!schedule) {
        return res.status(404).json({ success: false, message: 'Pay schedule not found' });
      }
    }

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

    // Create or update payroll configuration
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    let payroll = await Payroll.findOne({
      employeeId,
      'payPeriod.month': currentMonth,
      'payPeriod.year': currentYear
    });

    if (payroll) {
      // Update existing payroll
      payroll.basicSalary = basicSalary;
      payroll.salaryComponents = salaryComponents;
      payroll.grossSalary = grossSalary;
      payroll.totalEarnings = totalEarnings;
      payroll.totalDeductions = totalDeductions;
      payroll.netSalary = netSalary;
      payroll.paySchedule = paySchedule;
      payroll.updatedBy = req.user?.id;
    } else {
      // Create new payroll
      payroll = new Payroll({
        employeeId,
        payPeriod: { month: currentMonth, year: currentYear },
        paySchedule,
        salaryComponents,
        basicSalary,
        grossSalary,
        totalEarnings,
        totalDeductions,
        netSalary,
        createdBy: req.user?.id
      });
    }

    await payroll.save();

    res.json({
      success: true,
      message: 'Employee salary configured successfully',
      data: payroll
    });
  } catch (error) {
    console.error('Configure Employee Salary Error:', error);
    res.status(500).json({ success: false, message: 'Error configuring employee salary' });
  }
};

// Collect Tax Details from Employee
const collectTaxDetails = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const {
      panNumber,
      taxRegime,
      basicSalary,
      hra,
      specialAllowance,
      otherAllowances,
      professionalTax,
      pfContribution,
      otherDeductions
    } = req.body;

    // Validate employee exists
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Calculate tax details
    const totalTaxableIncome = basicSalary + hra + specialAllowance + otherAllowances;
    
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

    const taxDetails = {
      panNumber,
      taxRegime,
      basicSalary,
      hra,
      specialAllowance,
      otherAllowances,
      professionalTax,
      pfContribution,
      otherDeductions,
      totalTaxableIncome,
      taxLiability,
      tds
    };

    // Update current month payroll with tax details
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const payroll = await Payroll.findOne({
      employeeId,
      'payPeriod.month': currentMonth,
      'payPeriod.year': currentYear
    });

    if (payroll) {
      payroll.taxDetails = taxDetails;
      payroll.updatedBy = req.user?.id;
      await payroll.save();
    }

    res.json({
      success: true,
      message: 'Tax details collected successfully',
      data: {
        taxDetails,
        calculatedTax: {
          totalTaxableIncome,
          taxLiability,
          monthlyTDS: tds
        }
      }
    });
  } catch (error) {
    console.error('Collect Tax Details Error:', error);
    res.status(500).json({ success: false, message: 'Error collecting tax details' });
  }
};

// Get Employee Payroll Details
const getEmployeePayrollDetails = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month, year } = req.query;

    const query = { employeeId };
    if (month && year) {
      query['payPeriod.month'] = parseInt(month);
      query['payPeriod.year'] = parseInt(year);
    }

    const payroll = await Payroll.findOne(query)
      .populate('paySchedule', 'name frequency')
      .populate('employeeId', 'firstName lastName email');

    if (!payroll) {
      return res.status(404).json({ success: false, message: 'Payroll not found' });
    }

    res.json({
      success: true,
      data: payroll
    });
  } catch (error) {
    console.error('Get Employee Payroll Details Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching payroll details' });
  }
};

// Get Employee Form 16
const getEmployeeForm16 = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { financialYear } = req.query;

    const query = { employeeId };
    if (financialYear) {
      query.financialYear = financialYear;
    }

    const form16s = await Form16.find(query)
      .populate('employeeId', 'firstName lastName email')
      .sort({ financialYear: -1 });

    res.json({
      success: true,
      data: form16s
    });
  } catch (error) {
    console.error('Get Employee Form 16 Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching Form 16' });
  }
};

// Get Available Salary Components for Employee
const getAvailableSalaryComponents = async (req, res) => {
  try {
    const components = await SalaryComponent.find({ isActive: true })
      .sort({ type: 1, name: 1 });

    // Group by type
    const groupedComponents = components.reduce((acc, component) => {
      if (!acc[component.type]) {
        acc[component.type] = [];
      }
      acc[component.type].push(component);
      return acc;
    }, {});

    res.json({
      success: true,
      data: groupedComponents
    });
  } catch (error) {
    console.error('Get Available Salary Components Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching salary components' });
  }
};

// Get Employee Payroll Summary
const getEmployeePayrollSummary = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { year } = req.query;

    const query = { employeeId };
    if (year) {
      query['payPeriod.year'] = parseInt(year);
    }

    const payrolls = await Payroll.find(query)
      .populate('paySchedule', 'name frequency')
      .sort({ 'payPeriod.month': 1 });

    // Calculate summary
    const summary = payrolls.reduce((acc, payroll) => {
      acc.totalGrossSalary += payroll.grossSalary;
      acc.totalNetSalary += payroll.netSalary;
      acc.totalTaxPaid += payroll.taxDetails?.tds || 0;
      acc.totalDeductions += payroll.totalDeductions;
      acc.monthlyData.push({
        month: payroll.payPeriod.month,
        year: payroll.payPeriod.year,
        grossSalary: payroll.grossSalary,
        netSalary: payroll.netSalary,
        taxPaid: payroll.taxDetails?.tds || 0,
        isProcessed: payroll.isProcessed,
        isPaid: payroll.isPaid
      });
      return acc;
    }, {
      totalGrossSalary: 0,
      totalNetSalary: 0,
      totalTaxPaid: 0,
      totalDeductions: 0,
      monthlyData: []
    });

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Get Employee Payroll Summary Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching payroll summary' });
  }
};

module.exports = {
  getEmployeePayrollDashboard,
  configureEmployeeSalary,
  collectTaxDetails,
  getEmployeePayrollDetails,
  getEmployeeForm16,
  getAvailableSalaryComponents,
  getEmployeePayrollSummary
}; 