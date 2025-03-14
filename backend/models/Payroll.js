// const mongoose = require("mongoose");

// const payrollSchema = new mongoose.Schema(
//   {
//     employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
//     baseSalary: { type: Number, required: true },
//     totalDays: { type: Number, default: 30 },
//     presentDays: { type: Number, default: 0 },
//     leaveDays: { type: Number, default: 0 },
//     finalSalary: { type: Number, default: 0 }, // Default value added
//     month: { type: String, required: true },
//   },
//   { timestamps: true }
// );


const mongoose = require("mongoose")

const payrollSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    baseSalary: {
      type: Number,
      required: true,
    },
    totalWorkingDays: {
      type: Number,
      required: true,
    },
    presentDays: {
      type: Number,
      required: true,
    },
    leaveDays: {
      type: Number,
      required: true,
    },
    netSalary: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processed", "paid"],
      default: "pending",
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    processedDate: {
      type: Date,
    },
  },
  { timestamps: true },
)

// Compound index to ensure one payroll record per employee per month/year
payrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true })

const Payroll = mongoose.model("Payroll", payrollSchema)
module.exports = Payroll

