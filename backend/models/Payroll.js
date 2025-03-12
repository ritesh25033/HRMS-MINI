const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    baseSalary: { type: Number, required: true },
    totalDays: { type: Number, default: 30 }, // Assuming 30 days in a month
    presentDays: { type: Number, required: true },
    leaveDays: { type: Number, default: 0 },
    finalSalary: { type: Number, required: true },
    month: { type: String, required: true }, // Format: "YYYY-MM"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payroll", payrollSchema);

