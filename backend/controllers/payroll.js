// const Payroll = require('../models/payroll');
// const Attendance = require('../models/attendance');
// const Leave = require('../models/leave');
// const Employee = require('../models/employee');
// const moment = require('moment');

// // Generate Payroll for an Employee
// exports.generatePayroll = async (req, res) => {
//   try {
//     const { employeeId, month } = req.body;

//     const employee = await Employee.findById(employeeId);
//     if (!employee)
//       return res.status(404).json({ message: 'Employee not found' });

//     const baseSalary = employee.salary;
//     if (!baseSalary)
//       return res.status(400).json({ message: 'Salary not set for employee' });

//     // Fetch attendance for the given month
//     const attendanceRecords = await Attendance.find({
//       employee: employeeId,
//       date: { $regex: `^${month}` }, // Matches "YYYY-MM" format
//     });

//     const presentDays = attendanceRecords.length;

//     // Fetch approved leaves for the given month
//     const leaveRecords = await Leave.find({
//       employee: employeeId,
//       status: 'Approved',
//       startDate: { $regex: `^${month}` },
//     });

//     let leaveDays = 0;
//     leaveRecords.forEach((leave) => {
//       const start = moment(leave.startDate, 'YYYY-MM-DD');
//       const end = moment(leave.endDate, 'YYYY-MM-DD');
//       leaveDays += end.diff(start, 'days') + 1;
//     });

//     // Calculate final salary
//     const totalDays = 30;
//     const finalSalary = (baseSalary / totalDays) * (presentDays + leaveDays);

//     // Save Payroll
//     const payroll = await Payroll.create({
//       employee: employeeId,
//       baseSalary,
//       totalDays,
//       presentDays,
//       leaveDays,
//       finalSalary,
//       month,
//     });

//     res.status(201).json(payroll);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };

// // HR View Payroll of All Employees
// exports.getAllPayrolls = async (req, res) => {
//   try {
//     const payrolls = await Payroll.find()
//       .populate('employee', 'name email')
//       .sort({ createdAt: -1 });
//     res.json(payrolls);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };

// // Employee View Payroll
// exports.getEmployeePayroll = async (req, res) => {
//   try {
//     const payrolls = await Payroll.find({ employee: req.user._id }).sort({
//       createdAt: -1,
//     });
//     console.log(payrolls);
//     res.json(payrolls);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };

const Payroll = require('../models/payroll');
const Employee = require('../models/employee');
const Attendance = require('../models/attendance');
const Leave = require('../models/leave');
const moment = require('moment');

// Generate payroll for an employee
const generatePayroll = async (req, res) => {
  const { employeeId, month, year } = req.body;

  try {
    // Validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if payroll already exists for this month/year
    const existingPayroll = await Payroll.findOne({
      employeeId,
      month,
      year,
    });

    if (existingPayroll) {
      return res
        .status(400)
        .json({ message: 'Payroll already generated for this month' });
    }

    // Calculate total working days in the month
    const startOfMonth = moment({ year, month: month - 1, day: 1 }).startOf(
      'day'
    );
    const endOfMonth = moment(startOfMonth).endOf('month');
    const totalDays = endOfMonth.diff(startOfMonth, 'days') + 1;

    // Count weekends (assuming Saturday and Sunday are weekends)
    let weekendCount = 0;
    for (let day = 0; day < totalDays; day++) {
      const currentDate = moment(startOfMonth).add(day, 'days');
      const dayOfWeek = currentDate.day();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // 0 is Sunday, 6 is Saturday
        weekendCount++;
      }
    }

    const totalWorkingDays = totalDays - weekendCount;

    // Get attendance records for the month
    const attendanceRecords = await Attendance.find({
      employeeId,
      date: {
        $gte: startOfMonth.toDate(),
        $lte: endOfMonth.toDate(),
      },
      status: 'present',
    });

    const presentDays = attendanceRecords.length;

    // Get approved leave records for the month
    const leaveRecords = await Leave.find({
      employeeId,
      status: 'approved',
      $or: [
        {
          startDate: { $lte: endOfMonth.toDate() },
          endDate: { $gte: startOfMonth.toDate() },
        },
      ],
    });

    // Calculate leave days within the month
    let leaveDays = 0;

    leaveRecords.forEach((leave) => {
      const leaveStart = moment(leave.startDate).startOf('day');
      const leaveEnd = moment(leave.endDate).startOf('day');

      // Adjust dates to be within the month
      const effectiveStart = moment.max(leaveStart, startOfMonth);
      const effectiveEnd = moment.min(leaveEnd, endOfMonth);

      // Calculate days, excluding weekends
      for (
        let day = 0;
        day <= effectiveEnd.diff(effectiveStart, 'days');
        day++
      ) {
        const currentDate = moment(effectiveStart).add(day, 'days');
        const dayOfWeek = currentDate.day();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          // Not a weekend
          leaveDays++;
        }
      }
    });

    // Calculate net salary
    // Formula: Salary = (Base Salary / Total Working Days) * (Present Days)
    const baseSalary = employee.baseSalary;
    const netSalary = (baseSalary / totalWorkingDays) * presentDays;

    // Create payroll record
    const newPayroll = new Payroll({
      employeeId,
      month,
      year,
      baseSalary,
      totalWorkingDays,
      presentDays,
      leaveDays,
      netSalary,
      status: 'pending',
      processedBy: req.userId,
      processedDate: new Date(),
    });

    await newPayroll.save();

    res.status(201).json(newPayroll);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to generate payroll', error: error.message });
  }
};

// Get payroll for an employee
const getEmployeePayroll = async (req, res) => {
  const { employeeId } = req.params;
  const { month, year } = req.query;

  try {
    // Validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Build query
    const query = { employeeId };

    if (month && year) {
      query.month = month;
      query.year = year;
    }

    const payrollRecords = await Payroll.find(query).sort({
      year: -1,
      month: -1,
    });

    res.status(200).json(payrollRecords);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch payroll records',
      error: error.message,
    });
  }
};

// Update payroll status (HR only)
const updatePayrollStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const payroll = await Payroll.findById(id);

    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }

    payroll.status = status;

    await payroll.save();

    res.status(200).json(payroll);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update payroll status',
      error: error.message,
    });
  }
};

module.exports = { generatePayroll, getEmployeePayroll, updatePayrollStatus };
