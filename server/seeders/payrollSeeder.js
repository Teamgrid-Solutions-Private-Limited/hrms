const { PaySchedule, SalaryComponent } = require("../models/payrollSchema");
const mongoose = require("mongoose");

// Sample salary components data
const salaryComponentsData = [
  {
    name: "Basic Salary",
    type: "earnings",
    isTaxable: true,
    isRecurring: true,
    amount: 0, // Will be set per employee
    description: "Basic salary component"
  },
  {
    name: "House Rent Allowance",
    type: "allowances",
    isTaxable: true,
    isRecurring: true,
    amount: 0, // Will be set per employee
    description: "House rent allowance"
  },
  {
    name: "Dearness Allowance",
    type: "allowances",
    isTaxable: true,
    isRecurring: true,
    amount: 0, // Will be set per employee
    description: "Dearness allowance"
  },
  {
    name: "Special Allowance",
    type: "allowances",
    isTaxable: true,
    isRecurring: true,
    amount: 0, // Will be set per employee
    description: "Special allowance"
  },
  {
    name: "Transport Allowance",
    type: "allowances",
    isTaxable: false,
    isRecurring: true,
    amount: 1600,
    description: "Transport allowance (non-taxable up to 1600)"
  },
  {
    name: "Medical Allowance",
    type: "allowances",
    isTaxable: false,
    isRecurring: true,
    amount: 1250,
    description: "Medical allowance (non-taxable up to 1250)"
  },
  {
    name: "Provident Fund",
    type: "deductions",
    isTaxable: false,
    isRecurring: true,
    percentage: 12,
    description: "Employee PF contribution (12% of basic)"
  },
  {
    name: "Professional Tax",
    type: "deductions",
    isTaxable: false,
    isRecurring: true,
    amount: 200,
    description: "Professional tax"
  },
  {
    name: "Income Tax",
    type: "deductions",
    isTaxable: false,
    isRecurring: true,
    amount: 0, // Will be calculated based on tax slabs
    description: "Income tax/TDS"
  },
  {
    name: "ESI Contribution",
    type: "deductions",
    isTaxable: false,
    isRecurring: true,
    percentage: 0.75,
    description: "Employee ESI contribution (0.75% of gross)"
  },
  {
    name: "Performance Bonus",
    type: "earnings",
    isTaxable: true,
    isRecurring: false,
    amount: 0, // Will be set per employee
    description: "Performance-based bonus"
  },
  {
    name: "Overtime Allowance",
    type: "earnings",
    isTaxable: true,
    isRecurring: false,
    amount: 0, // Will be set per employee
    description: "Overtime work allowance"
  },
  {
    name: "Leave Encashment",
    type: "earnings",
    isTaxable: true,
    isRecurring: false,
    amount: 0, // Will be set per employee
    description: "Leave encashment amount"
  }
];

// Sample pay schedules data
const paySchedulesData = [
  {
    name: "Monthly Payroll",
    frequency: "monthly",
    payDay: 25,
    isActive: true
  },
  {
    name: "Bi-weekly Payroll",
    frequency: "bi-weekly",
    payDayOfWeek: "friday",
    isActive: true
  },
  {
    name: "Weekly Payroll",
    frequency: "weekly",
    payDayOfWeek: "friday",
    isActive: true
  },
  {
    name: "Quarterly Payroll",
    frequency: "quarterly",
    payDay: 25,
    isActive: true
  }
];

// Function to seed salary components
const seedSalaryComponents = async () => {
  try {
    console.log("Seeding salary components...");
    
    // Clear existing data
    await SalaryComponent.deleteMany({});
    
    // Insert new data
    const components = await SalaryComponent.insertMany(salaryComponentsData);
    
    console.log(`✅ Successfully seeded ${components.length} salary components`);
    return components;
  } catch (error) {
    console.error("❌ Error seeding salary components:", error);
    throw error;
  }
};

// Function to seed pay schedules
const seedPaySchedules = async () => {
  try {
    console.log("Seeding pay schedules...");
    
    // Clear existing data
    await PaySchedule.deleteMany({});
    
    // Insert new data
    const schedules = await PaySchedule.insertMany(paySchedulesData);
    
    console.log(`✅ Successfully seeded ${schedules.length} pay schedules`);
    return schedules;
  } catch (error) {
    console.error("❌ Error seeding pay schedules:", error);
    throw error;
  }
};

// Main seeding function
const seedPayrollData = async () => {
  try {
    console.log("🚀 Starting payroll data seeding...");
    
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      console.log("📡 Connecting to database...");
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/hrms");
    }
    
    // Seed salary components
    await seedSalaryComponents();
    
    // Seed pay schedules
    await seedPaySchedules();
    
    console.log("🎉 Payroll data seeding completed successfully!");
    
    // Display seeded data
    const components = await SalaryComponent.find({});
    const schedules = await PaySchedule.find({});
    
    console.log("\n📊 Seeded Data Summary:");
    console.log(`- Salary Components: ${components.length}`);
    console.log(`- Pay Schedules: ${schedules.length}`);
    
    console.log("\n📋 Available Salary Components:");
    components.forEach(comp => {
      console.log(`  - ${comp.name} (${comp.type})`);
    });
    
    console.log("\n📅 Available Pay Schedules:");
    schedules.forEach(schedule => {
      console.log(`  - ${schedule.name} (${schedule.frequency})`);
    });
    
  } catch (error) {
    console.error("💥 Error during payroll data seeding:", error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
};

// Export functions for individual use
module.exports = {
  seedSalaryComponents,
  seedPaySchedules,
  seedPayrollData
};

// Run seeder if this file is executed directly
if (require.main === module) {
  seedPayrollData();
} 