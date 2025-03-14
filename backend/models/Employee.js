// // const mongoose = require('mongoose');

// // const employeeSchema = new mongoose.Schema(
// //   {
// //     name: { type: String, required: true },
// //     email: { type: String, required: true, unique: true },
// //     contact: { type: String, required: false },
// //     aadhaar: { type: String, required: false },
// //     pan: { type: String, required: false },
// //     bankDetails: { type: String, required: false },
// //     emergencyContact: { type: String, required: false },
// //     address: { type: String, required: false },
// //     profilePicture: { type: String },
// //     role: { type: String, default: 'Employee' }, // Fixed role
// //     salary: { type: this.toString, required: false },
// //   },
// //   { timestamps: true }
// // );

// // module.exports = mongoose.model('Employee', employeeSchema);

// const mongoose = require('mongoose');

// const employeeSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     contact: { type: String },
//     aadhaar: { type: String },
//     pan: { type: String },
//     bankDetails: { type: String },
//     emergencyContact: { type: String },
//     address: { type: String },
//     profilePicture: { type: String },
//     role: { type: String, default: 'Employee' }, // Default role
//     salary: { type: Number, required: true }, // Now required
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('Employee', employeeSchema);


const mongoose = require("mongoose")

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    aadhaar: { type: String, required: true, unique: true },
    pan: { type: String, required: true, unique: true },
    bankDetails: {
      accountNumber: { type: String, required: true },
      ifscCode: { type: String, required: true },
      bankName: { type: String, required: true },
    },
    emergencyContact: {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      phone: { type: String, required: true },
    },
    profilePicture: { type: String },
    baseSalary: { type: Number, required: true },
    joiningDate: { type: Date, default: Date.now },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

const Employee = mongoose.model("Employee", employeeSchema)
module.exports = Employee

