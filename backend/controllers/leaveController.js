const Leave = require("../models/Leave");
const moment = require("moment");

// Employee applies for leave
exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const employeeId = req.user._id;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const leave = await Leave.create({
      employee: employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Employee views leave requests
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user._id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// HR views all leave requests
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate("employee", "name email").sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// HR approves/rejects leave request
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await Leave.findById(leaveId);
    if (!leave) return res.status(404).json({ message: "Leave request not found" });

    leave.status = status;
    await leave.save();

    res.json({ message: `Leave request ${status}` });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
