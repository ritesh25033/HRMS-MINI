// const Attendance = require("../models/Attendance");
// const moment = require("moment");

// // Check-In API
// exports.checkIn = async (req, res) => {
//   try {
//     const employeeId = req.user._id;
//     const today = moment().format("YYYY-MM-DD");
//     const currentTime = moment().format("HH:mm:ss");

//     // Check if already checked in today
//     const existingAttendance = await Attendance.findOne({ employee: employeeId, date: today });
//     if (existingAttendance) {
//       return res.status(400).json({ message: "Already checked in today" });
//     }

//     // Create new check-in record
//     const attendance = await Attendance.create({
//       employee: employeeId,
//       date: today,
//       checkIn: currentTime,
//     });

//     res.status(201).json(attendance);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

// // Check-Out API
// exports.checkOut = async (req, res) => {
//   try {
//     const employeeId = req.user._id;
//     const today = moment().format("YYYY-MM-DD");
//     const currentTime = moment().format("HH:mm:ss");

//     // Find today's attendance record
//     const attendance = await Attendance.findOne({ employee: employeeId, date: today });

//     if (!attendance) {
//       return res.status(400).json({ message: "Check-in required before check-out" });
//     }

//     if (attendance.checkOut) {
//       return res.status(400).json({ message: "Already checked out today" });
//     }

//     // Update check-out time
//     attendance.checkOut = currentTime;
//     await attendance.save();

//     res.json(attendance);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

// // Get Attendance Records
// exports.getAttendance = async (req, res) => {
//   try {
//     const employeeId = req.user._id;
//     const attendanceRecords = await Attendance.find({ employee: employeeId }).sort({ date: -1 });

//     res.json(attendanceRecords);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

// // Get All Attendance Records (HR Only)
// exports.getAllAttendance = async (req, res) => {
//   try {
//     const records = await Attendance.find().populate("employee", "name email");
//     res.json(records);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

const Attendance = require('../models/attendance');
const Employee = require('../models/employee');
const moment = require('moment');

// Check in
const checkIn = async (req, res) => {
  const { employeeId } = req.body;
  const now = new Date();

  try {
    // Validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if already checked in today
    const today = moment(now).startOf('day').toDate();
    const tomorrow = moment(today).add(1, 'days').toDate();

    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    if (existingAttendance && existingAttendance.checkIn.time) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    // Determine if check-in is late (after 9:30 AM)
    const workStartTime = moment(today).add(9, 'hours').add(30, 'minutes');
    const isLate = moment(now).isAfter(workStartTime);

    // Create or update attendance record
    let attendance;

    if (existingAttendance) {
      attendance = existingAttendance;
    } else {
      attendance = new Attendance({
        employeeId,
        date: today,
      });
    }

    attendance.checkIn = {
      time: now,
      status: isLate ? 'late' : 'on-time',
    };

    attendance.status = 'present';

    await attendance.save();

    res.status(200).json(attendance);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to check in', error: error.message });
  }
};

// Check out
const checkOut = async (req, res) => {
  const { employeeId } = req.body;
  const now = new Date();

  try {
    // Find today's attendance record
    const today = moment(now).startOf('day').toDate();
    const tomorrow = moment(today).add(1, 'days').toDate();

    const attendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    if (!attendance) {
      return res
        .status(404)
        .json({ message: 'No check-in record found for today' });
    }

    if (!attendance.checkIn.time) {
      return res
        .status(400)
        .json({ message: 'Cannot check out without checking in first' });
    }

    if (attendance.checkOut.time) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    // Determine if check-out is early (before 6:00 PM) or overtime (after 6:00 PM)
    const workEndTime = moment(today).add(18, 'hours');
    let checkOutStatus = 'on-time';

    if (moment(now).isBefore(workEndTime)) {
      checkOutStatus = 'early';
    } else if (moment(now).isAfter(workEndTime.add(1, 'hours'))) {
      checkOutStatus = 'overtime';
    }

    // Calculate working hours
    const checkInTime = moment(attendance.checkIn.time);
    const checkOutTime = moment(now);
    const workingHours = checkOutTime.diff(checkInTime, 'hours', true);

    // Update attendance record
    attendance.checkOut = {
      time: now,
      status: checkOutStatus,
    };

    attendance.workingHours = workingHours;

    await attendance.save();

    res.status(200).json(attendance);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to check out', error: error.message });
  }
};

// Get attendance history for an employee
const getAttendanceHistory = async (req, res) => {
  const { employeeId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    // Validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Build query
    const query = { employeeId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendanceRecords = await Attendance.find(query).sort({ date: -1 });

    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch attendance history',
      error: error.message,
    });
  }
};

// Get today's attendance for all employees (HR only)
const getTodayAttendance = async (req, res) => {
  try {
    const today = moment().startOf('day').toDate();
    const tomorrow = moment(today).add(1, 'days').toDate();

    const attendanceRecords = await Attendance.find({
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    }).populate('employeeId', 'name email department');

    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch today's attendance",
      error: error.message,
    });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getAttendanceHistory,
  getTodayAttendance,
};
