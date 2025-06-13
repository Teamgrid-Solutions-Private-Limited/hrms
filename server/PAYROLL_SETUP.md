# Payroll System Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd server
npm install pdfkit
```

### 2. Create Required Directories
```bash
mkdir -p my-upload/uploads/form16
```

### 3. Seed Initial Data
```bash
node seeders/payrollSeeder.js
```

### 4. Start the Server
```bash
npm start
```

## API Testing

### 1. Test Payroll Dashboard
```bash
curl -X GET http://localhost:6010/payroll/dashboard
```

### 2. Create a Pay Schedule
```bash
curl -X POST http://localhost:6010/payroll/pay-schedules \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Monthly Payroll",
    "frequency": "monthly",
    "payDay": 25
  }'
```

### 3. Get Salary Components
```bash
curl -X GET http://localhost:6010/payroll/salary-components
```

### 4. Configure Employee Salary
```bash
curl -X POST http://localhost:6010/employee-payroll/configure-salary/YOUR_EMPLOYEE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "basicSalary": 30000,
    "salaryComponents": [
      {
        "name": "House Rent Allowance",
        "type": "allowances",
        "amount": 5000
      },
      {
        "name": "Provident Fund",
        "type": "deductions",
        "amount": 1800
      }
    ],
    "paySchedule": "PAY_SCHEDULE_ID"
  }'
```

## Sample Data Structure

### Employee Payroll Configuration
```json
{
  "basicSalary": 30000,
  "salaryComponents": [
    {
      "name": "Basic Salary",
      "type": "earnings",
      "amount": 30000
    },
    {
      "name": "House Rent Allowance",
      "type": "allowances",
      "amount": 5000
    },
    {
      "name": "Dearness Allowance",
      "type": "allowances",
      "amount": 2000
    },
    {
      "name": "Transport Allowance",
      "type": "allowances",
      "amount": 1600
    },
    {
      "name": "Provident Fund",
      "type": "deductions",
      "amount": 1800
    },
    {
      "name": "Professional Tax",
      "type": "deductions",
      "amount": 200
    }
  ],
  "paySchedule": "schedule_id"
}
```

### Tax Details Collection
```json
{
  "panNumber": "ABCDE1234F",
  "taxRegime": "new",
  "basicSalary": 30000,
  "hra": 5000,
  "specialAllowance": 2000,
  "otherAllowances": 1000,
  "professionalTax": 200,
  "pfContribution": 1800,
  "otherDeductions": 500
}
```

## Key Features Overview

### ✅ Implemented Features
- [x] Payroll Dashboard with statistics
- [x] Salary Components Management
- [x] Pay Schedule Configuration
- [x] Employee Payroll Management
- [x] Tax Calculation (Old & New Regime)
- [x] Form 16 Generation & Download
- [x] Bulk Payroll Processing
- [x] Employee-specific Payroll Views

### 🔄 Workflow
1. **Setup**: Create salary components and pay schedules
2. **Configuration**: Configure employee salaries
3. **Tax Details**: Collect employee tax information
4. **Processing**: Process monthly payrolls
5. **Reporting**: Generate Form 16 and reports

## Common Use Cases

### 1. Monthly Payroll Processing
1. Configure employee salaries
2. Collect tax details
3. Process payroll for the month
4. Generate payslips
5. Mark as paid

### 2. Form 16 Generation
1. Ensure all monthly payrolls are processed
2. Generate Form 16 for the financial year
3. Download PDF for employee

### 3. Bulk Operations
1. Select multiple employees
2. Process payroll in bulk
3. Generate bulk reports

## Troubleshooting

### Common Issues

1. **PDF Generation Fails**
   - Ensure `pdfkit` is installed
   - Check directory permissions for uploads
   - Verify Form 16 data is complete

2. **Tax Calculation Errors**
   - Verify tax regime selection
   - Check salary component amounts
   - Ensure PAN number is valid

3. **Payroll Processing Issues**
   - Verify employee exists
   - Check pay schedule configuration
   - Ensure salary components are valid

### Debug Mode
Enable debug logging by setting:
```bash
export DEBUG=payroll:*
```

## Security Notes

- Implement authentication for all payroll routes
- Validate user permissions
- Sanitize all input data
- Secure PDF file storage
- Implement audit logging

## Next Steps

1. **Frontend Integration**: Create React/Vue components
2. **Email Notifications**: Add payroll notification system
3. **Bank Integration**: Connect with banking APIs
4. **Advanced Tax Features**: Add more tax deductions
5. **Reporting**: Create comprehensive reports

## Support

For issues or questions:
1. Check the documentation
2. Review error logs
3. Test with sample data
4. Contact development team 