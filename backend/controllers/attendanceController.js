const Attendance = require("../models/Attendance");
const moment = require("moment");

// Check-In API
exports.checkIn = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const today = moment().format("YYYY-MM-DD");
    const currentTime = moment().format("HH:mm:ss");

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({ employee: employeeId, date: today });
    if (existingAttendance) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    // Create new check-in record
    const attendance = await Attendance.create({
      employee: employeeId,
      date: today,
      checkIn: currentTime,
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Check-Out API
exports.checkOut = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const today = moment().format("YYYY-MM-DD");
    const currentTime = moment().format("HH:mm:ss");

    // Find today's attendance record
    const attendance = await Attendance.findOne({ employee: employeeId, date: today });

    if (!attendance) {
      return res.status(400).json({ message: "Check-in required before check-out" });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    // Update check-out time
    attendance.checkOut = currentTime;
    await attendance.save();

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get Attendance Records
exports.getAttendance = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const attendanceRecords = await Attendance.find({ employee: employeeId }).sort({ date: -1 });

    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get All Attendance Records (HR Only)
exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().populate("employee", "name email");
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
