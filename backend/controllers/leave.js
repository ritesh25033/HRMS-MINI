// const Leave = require("../models/Leave");
// const moment = require("moment");

// // Employee applies for leave
// exports.applyLeave = async (req, res) => {
//   try {
//     const { leaveType, startDate, endDate, reason } = req.body;
//     const employeeId = req.user._id;

//     if (!leaveType || !startDate || !endDate || !reason) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const leave = await Leave.create({
//       employee: employeeId,
//       leaveType,
//       startDate,
//       endDate,
//       reason,
//     });

//     res.status(201).json(leave);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

// // Employee views leave requests
// exports.getMyLeaves = async (req, res) => {
//   try {
//     const leaves = await Leave.find({ employee: req.user._id }).sort({ createdAt: -1 });
//     res.json(leaves);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

// // HR views all leave requests
// exports.getAllLeaves = async (req, res) => {
//   try {
//     const leaves = await Leave.find().populate("employee", "name email").sort({ createdAt: -1 });
//     res.json(leaves);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

// // HR approves/rejects leave request
// exports.updateLeaveStatus = async (req, res) => {
//   try {
//     const { leaveId } = req.params;
//     const { status } = req.body;

//     if (!["Approved", "Rejected"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     const leave = await Leave.findById(leaveId);
//     if (!leave) return res.status(404).json({ message: "Leave request not found" });

//     leave.status = status;
//     await leave.save();

//     res.json({ message: `Leave request ${status}` });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

const Leave = require('../models/leave');
const Employee = require('../models/employee');
const moment = require('moment');

// Apply for leave
const applyLeave = async (req, res) => {
  const { employeeId, leaveType, startDate, endDate, reason } = req.body;

  try {
    // Validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Validate dates
    const start = moment(startDate);
    const end = moment(endDate);

    if (!start.isValid() || !end.isValid()) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    if (end.isBefore(start)) {
      return res
        .status(400)
        .json({ message: 'End date cannot be before start date' });
    }

    if (start.isBefore(moment(), 'day')) {
      return res
        .status(400)
        .json({ message: 'Cannot apply for leave in the past' });
    }

    // Check for overlapping leave requests
    const overlappingLeave = await Leave.findOne({
      employeeId,
      status: { $ne: 'rejected' },
      $or: [
        {
          startDate: { $lte: endDate },
          endDate: { $gte: startDate },
        },
      ],
    });

    if (overlappingLeave) {
      return res
        .status(400)
        .json({ message: 'You already have a leave request for this period' });
    }

    // Create leave request
    const newLeave = new Leave({
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await newLeave.save();

    res.status(201).json(newLeave);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to apply for leave', error: error.message });
  }
};

// Approve or reject leave (HR only)
const updateLeaveStatus = async (req, res) => {
  const { id } = req.params;
  const { status, comments } = req.body;

  try {
    const leave = await Leave.findById(id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.status !== 'pending') {
      return res
        .status(400)
        .json({ message: 'This leave request has already been processed' });
    }

    leave.status = status;
    leave.comments = comments;
    leave.approvedBy = req.userId;
    leave.approvalDate = new Date();

    await leave.save();

    res.status(200).json(leave);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to update leave status', error: error.message });
  }
};

// Get leave requests for an employee
const getEmployeeLeaves = async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const leaves = await Leave.find({ employeeId }).sort({ createdAt: -1 });

    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch leave requests',
      error: error.message,
    });
  }
};

// Get all pending leave requests (HR only)
const getPendingLeaves = async (req, res) => {
  try {
    const pendingLeaves = await Leave.find({ status: 'pending' })
      .populate('employeeId', 'name email department')
      .sort({ startDate: 1 });

    res.status(200).json(pendingLeaves);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch pending leave requests',
      error: error.message,
    });
  }
};

module.exports = {
  applyLeave,
  updateLeaveStatus,
  getEmployeeLeaves,
  getPendingLeaves,
};
