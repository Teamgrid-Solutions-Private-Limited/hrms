# HRMS Payroll System Documentation

## Overview
This document describes the comprehensive payroll system implemented in the HRMS application, similar to Zoho Payroll. The system includes dashboard functionality, employee payroll management, salary component configuration, pay schedule setup, tax calculation, and Form 16 generation.

## Features Implemented

### 1. Payroll Dashboard
- **Overview**: Central dashboard showing payroll statistics and trends
- **Features**:
  - Total employees count
  - Processed vs pending payrolls
  - Total salary paid
  - Recent payroll history
  - Monthly payroll trends

### 2. Salary Components Management
- **Types**: Earnings, Deductions, Allowances
- **Features**:
  - Create custom salary components
  - Configure taxable/non-taxable components
  - Set recurring or one-time components
  - Amount or percentage-based calculations

### 3. Pay Schedule Configuration
- **Frequencies**: Weekly, Bi-weekly, Monthly, Quarterly, Annually
- **Features**:
  - Configure pay days
  - Set payment frequency
  - Multiple schedule support

### 4. Employee Payroll Management
- **Features**:
  - Individual employee payroll configuration
  - Salary component assignment
  - Tax details collection
  - Payroll processing and approval
  - Bulk payroll processing

### 5. Tax Calculation & Form 16
- **Tax Regimes**: Old and New tax regimes
- **Features**:
  - Automatic tax calculation
  - TDS computation
  - Form 16 generation
  - PDF download functionality

## API Endpoints

### Payroll Dashboard
```
GET /payroll/dashboard
```
Returns payroll statistics and dashboard data.

### Salary Components
```
POST /payroll/salary-components
GET /payroll/salary-components
PUT /payroll/salary-components/:id
```

### Pay Schedules
```
POST /payroll/pay-schedules
GET /payroll/pay-schedules
```

### Employee Payroll
```
POST /payroll/employee-payroll
GET /payroll/employee-payroll/:employeeId
PUT /payroll/process-payroll/:payrollId
POST /payroll/bulk-process
```

### Form 16
```
POST /payroll/generate-form16
GET /payroll/download-form16/:form16Id
```

### Employee-Specific Payroll
```
GET /employee-payroll/dashboard/:employeeId
POST /employee-payroll/configure-salary/:employeeId
POST /employee-payroll/collect-tax-details/:employeeId
GET /employee-payroll/details/:employeeId
GET /employee-payroll/form16/:employeeId
GET /employee-payroll/salary-components
GET /employee-payroll/summary/:employeeId
```

## Database Schema

### Payroll Schema
```javascript
{
  employeeId: ObjectId,
  payPeriod: { month: Number, year: Number },
  paySchedule: ObjectId,
  salaryComponents: [SalaryComponent],
  basicSalary: Number,
  grossSalary: Number,
  totalEarnings: Number,
  totalDeductions: Number,
  netSalary: Number,
  taxDetails: TaxDetails,
  isProcessed: Boolean,
  isPaid: Boolean,
  createdBy: ObjectId,
  updatedBy: ObjectId
}
```

### Salary Component Schema
```javascript
{
  name: String,
  type: String, // 'earnings', 'deductions', 'allowances'
  isTaxable: Boolean,
  isRecurring: Boolean,
  amount: Number,
  percentage: Number,
  description: String,
  isActive: Boolean
}
```

### Pay Schedule Schema
```javascript
{
  name: String,
  frequency: String, // 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'annually'
  payDay: Number,
  payDayOfWeek: String,
  isActive: Boolean
}
```

### Form 16 Schema
```javascript
{
  financialYear: String,
  employeeId: ObjectId,
  employerDetails: Object,
  employeeDetails: Object,
  grossSalary: Number,
  totalDeductions: Number,
  totalTaxableIncome: Number,
  totalTaxLiability: Number,
  tds: Number,
  taxPaid: Number,
  refundDue: Number,
  isGenerated: Boolean,
  downloadUrl: String
}
```

## Usage Examples

### 1. Create Salary Component
```javascript
POST /payroll/salary-components
{
  "name": "House Rent Allowance",
  "type": "allowances",
  "isTaxable": true,
  "isRecurring": true,
  "amount": 5000,
  "description": "Monthly HRA allowance"
}
```

### 2. Configure Employee Salary
```javascript
POST /employee-payroll/configure-salary/:employeeId
{
  "basicSalary": 30000,
  "salaryComponents": [
    {
      "name": "HRA",
      "type": "allowances",
      "amount": 5000
    },
    {
      "name": "PF",
      "type": "deductions",
      "amount": 1800
    }
  ],
  "paySchedule": "scheduleId"
}
```

### 3. Collect Tax Details
```javascript
POST /employee-payroll/collect-tax-details/:employeeId
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

### 4. Generate Form 16
```javascript
POST /payroll/generate-form16
{
  "employeeId": "employeeId",
  "financialYear": "2024-25"
}
```

## Tax Calculation Logic

### New Tax Regime
- Up to ₹3,00,000: 0%
- ₹3,00,001 to ₹6,00,000: 5%
- ₹6,00,001 to ₹9,00,000: 10%
- ₹9,00,001 to ₹12,00,000: 15%
- ₹12,00,001 to ₹15,00,000: 20%
- Above ₹15,00,000: 30%

### Old Tax Regime
- Up to ₹2,50,000: 0%
- ₹2,50,001 to ₹5,00,000: 5%
- ₹5,00,001 to ₹10,00,000: 20%
- Above ₹10,00,000: 30%

## Installation & Setup

1. Install dependencies:
```bash
npm install pdfkit
```

2. Ensure MongoDB connection is configured

3. Create upload directories:
```bash
mkdir -p my-upload/uploads/form16
```

## Security Considerations

- Implement authentication middleware for all payroll routes
- Validate user permissions for payroll operations
- Sanitize all input data
- Implement audit logging for payroll changes
- Secure PDF file storage

## Future Enhancements

1. **Advanced Tax Features**:
   - Section 80C deductions
   - HRA exemption calculation
   - Professional tax slabs
   - State-specific tax rules

2. **Reporting**:
   - Payroll reports
   - Tax reports
   - Compliance reports
   - Custom report builder

3. **Integration**:
   - Bank integration for salary disbursement
   - TDS filing integration
   - PF/ESI integration
   - Accounting software integration

4. **Automation**:
   - Automated payroll processing
   - Email notifications
   - SMS alerts
   - Auto-payment processing

## Support

For technical support or questions about the payroll system, please refer to the development team or create an issue in the project repository. 