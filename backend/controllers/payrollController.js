const Payroll = require("../models/Payroll");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const Employee = require("../models/Employee");
const moment = require("moment");

// Generate Payroll for an Employee
exports.generatePayroll = async (req, res) => {
  try {
    const { employeeId, month } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const baseSalary = employee.salary;
    if (!baseSalary) return res.status(400).json({ message: "Salary not set for employee" });

    // Fetch attendance for the given month
    const attendanceRecords = await Attendance.find({
      employee: employeeId,
      date: { $regex: `^${month}` }, // Matches "YYYY-MM" format
    });

    const presentDays = attendanceRecords.length;

    // Fetch approved leaves for the given month
    const leaveRecords = await Leave.find({
      employee: employeeId,
      status: "Approved",
      startDate: { $regex: `^${month}` },
    });

    let leaveDays = 0;
    leaveRecords.forEach((leave) => {
      const start = moment(leave.startDate, "YYYY-MM-DD");
      const end = moment(leave.endDate, "YYYY-MM-DD");
      leaveDays += end.diff(start, "days") + 1;
    });

    // Calculate final salary
    const totalDays = 30;
    const finalSalary = (baseSalary / totalDays) * (presentDays + leaveDays);

    // Save Payroll
    const payroll = await Payroll.create({
      employee: employeeId,
      baseSalary,
      totalDays,
      presentDays,
      leaveDays,
      finalSalary,
      month,
    });

    res.status(201).json(payroll);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// HR View Payroll of All Employees
exports.getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find().populate("employee", "name email").sort({ createdAt: -1 });
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Employee View Payroll
exports.getEmployeePayroll = async (req, res) => {
  try {
    const payrolls = await Payroll.find({ employee: req.user._id }).sort({ createdAt: -1 });
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
