const mongoose = require("mongoose");
const { PaySchedule, SalaryComponent } = require("./models/payrollSchema");

// Test database connection and basic operations
const testPayrollSystem = async () => {
  try {
    console.log("🧪 Testing Payroll System...");
    
    // Test database connection
    console.log("📡 Testing database connection...");
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/hrms");
    console.log("✅ Database connected successfully");
    
    // Test model creation
    console.log("📋 Testing model creation...");
    
    // Create a test pay schedule
    const testSchedule = new PaySchedule({
      name: "Test Monthly Payroll",
      frequency: "monthly",
      payDay: 25
    });
    
    await testSchedule.save();
    console.log("✅ Pay schedule created successfully");
    
    // Create a test salary component
    const testComponent = new SalaryComponent({
      name: "Test Basic Salary",
      type: "earnings",
      isTaxable: true,
      isRecurring: true,
      amount: 30000,
      description: "Test basic salary component"
    });
    
    await testComponent.save();
    console.log("✅ Salary component created successfully");
    
    // Test fetching data
    console.log("📊 Testing data retrieval...");
    const schedules = await PaySchedule.find({});
    const components = await SalaryComponent.find({});
    
    console.log(`✅ Found ${schedules.length} pay schedules`);
    console.log(`✅ Found ${components.length} salary components`);
    
    // Clean up test data
    console.log("🧹 Cleaning up test data...");
    await PaySchedule.findByIdAndDelete(testSchedule._id);
    await SalaryComponent.findByIdAndDelete(testComponent._id);
    console.log("✅ Test data cleaned up");
    
    console.log("🎉 All payroll system tests passed!");
    
  } catch (error) {
    console.error("❌ Payroll system test failed:", error.message);
    console.error("Stack trace:", error.stack);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
};

// Run the test
testPayrollSystem(); 