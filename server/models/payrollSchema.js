const mongoose = require("mongoose");

const salaryComponentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['earnings', 'deductions', 'allowances'],
    required: true
  },
  isTaxable: {
    type: Boolean,
    default: true
  },
  isRecurring: {
    type: Boolean,
    default: true
  },
  amount: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  description: String,
  isActive: {
    type: Boolean,
    default: true
  }
});

const payScheduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  frequency: {
    type: String,
    enum: ['weekly', 'bi-weekly', 'monthly', 'quarterly', 'annually'],
    required: true
  },
  payDay: {
    type: Number,
    required: true,
    min: 1,
    max: 31
  },
  payDayOfWeek: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const taxDetailsSchema = new mongoose.Schema({
  panNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  taxRegime: {
    type: String,
    enum: ['old', 'new'],
    default: 'old'
  },
  basicSalary: {
    type: Number,
    required: true
  },
  hra: {
    type: Number,
    default: 0
  },
  specialAllowance: {
    type: Number,
    default: 0
  },
  otherAllowances: {
    type: Number,
    default: 0
  },
  professionalTax: {
    type: Number,
    default: 0
  },
  pfContribution: {
    type: Number,
    default: 0
  },
  otherDeductions: {
    type: Number,
    default: 0
  },
  totalTaxableIncome: {
    type: Number,
    default: 0
  },
  taxLiability: {
    type: Number,
    default: 0
  },
  tds: {
    type: Number,
    default: 0
  }
});

const form16Schema = new mongoose.Schema({
  financialYear: {
    type: String,
    required: true
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  employerName: {
    type: String,
    required: true
  },
  employerAddress: {
    type: String,
    required: true
  },
  employerTAN: {
    type: String,
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  employeePAN: {
    type: String,
    required: true
  },
  employeeAddress: {
    type: String,
    required: true
  },
  grossSalary: {
    type: Number,
    required: true
  },
  totalDeductions: {
    type: Number,
    required: true
  },
  totalTaxableIncome: {
    type: Number,
    required: true
  },
  totalTaxLiability: {
    type: Number,
    required: true
  },
  tds: {
    type: Number,
    required: true
  },
  taxPaid: {
    type: Number,
    required: true
  },
  refundDue: {
    type: Number,
    default: 0
  },
  isGenerated: {
    type: Boolean,
    default: false
  },
  generatedAt: {
    type: Date
  },
  downloadUrl: String
});

const payrollSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  payPeriod: {
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },
    year: {
      type: Number,
      required: true
    }
  },
  paySchedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaySchedule',
    required: true
  },
  salaryComponents: [salaryComponentSchema],
  basicSalary: {
    type: Number,
    required: true
  },
  grossSalary: {
    type: Number,
    required: true
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  totalDeductions: {
    type: Number,
    default: 0
  },
  netSalary: {
    type: Number,
    required: true
  },
  taxDetails: taxDetailsSchema,
  isProcessed: {
    type: Boolean,
    default: false
  },
  processedAt: {
    type: Date
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  },
  remarks: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }
}, {
  timestamps: true
});

// Indexes for better performance
payrollSchema.index({ employeeId: 1, 'payPeriod.month': 1, 'payPeriod.year': 1 });
payrollSchema.index({ isProcessed: 1 });
payrollSchema.index({ isPaid: 1 });

const Payroll = mongoose.model("Payroll", payrollSchema);
const PaySchedule = mongoose.model("PaySchedule", payScheduleSchema);
const SalaryComponent = mongoose.model("SalaryComponent", salaryComponentSchema);
const Form16 = mongoose.model("Form16", form16Schema);

module.exports = {
  Payroll,
  PaySchedule,
  SalaryComponent,
  Form16
}; 