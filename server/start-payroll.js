const mongoose = require("mongoose");
const { seedPayrollData } = require("./seeders/payrollSeeder");
const fs = require("fs");
const path = require("path");

const initializePayrollSystem = async () => {
  try {
    console.log("🚀 Initializing Payroll System...");
    
    // Create required directories
    console.log("📁 Creating required directories...");
    const uploadDir = path.join(__dirname, "my-upload/uploads/form16");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log("✅ Created upload directory");
    } else {
      console.log("✅ Upload directory already exists");
    }
    
    // Test database connection
    console.log("📡 Testing database connection...");
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/hrms");
    console.log("✅ Database connected successfully");
    
    // Check if payroll data exists
    const { PaySchedule, SalaryComponent } = require("./models/payrollSchema");
    const scheduleCount = await PaySchedule.countDocuments();
    const componentCount = await SalaryComponent.countDocuments();
    
    console.log(`📊 Found ${scheduleCount} pay schedules and ${componentCount} salary components`);
    
    // Seed data if none exists
    if (scheduleCount === 0 || componentCount === 0) {
      console.log("🌱 Seeding initial payroll data...");
      await seedPayrollData();
    } else {
      console.log("✅ Payroll data already exists");
    }
    
    console.log("🎉 Payroll system initialized successfully!");
    console.log("\n📋 Available API Endpoints:");
    console.log("  GET  /payroll/dashboard");
    console.log("  GET  /payroll/salary-components");
    console.log("  POST /payroll/salary-components");
    console.log("  GET  /payroll/pay-schedules");
    console.log("  POST /payroll/pay-schedules");
    console.log("  GET  /employee-payroll/dashboard/:employeeId");
    console.log("  POST /employee-payroll/configure-salary/:employeeId");
    console.log("  POST /employee-payroll/collect-tax-details/:employeeId");
    console.log("  POST /payroll/generate-form16");
    console.log("  GET  /payroll/download-form16/:form16Id");
    
    console.log("\n🚀 You can now start the server with: npm start");
    
  } catch (error) {
    console.error("❌ Error initializing payroll system:", error.message);
    console.error("Stack trace:", error.stack);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
};

// Run initialization
initializePayrollSystem(); 