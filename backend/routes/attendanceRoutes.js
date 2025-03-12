const express = require("express");
const {
  checkIn,
  checkOut,
  getAttendance,
  getAllAttendance,
} = require("../controllers/attendanceController");
const { protect, isHR } = require("../middleware/authMiddleware");

const router = express.Router();

// Employee Attendance
router.post("/check-in", protect, checkIn); // Employees can check-in
router.post("/check-out", protect, checkOut); // Employees can check-out
router.get("/", protect, getAttendance); // Employees can view their own attendance

// HR Attendance Management
router.get("/all", protect, isHR, getAllAttendance); // HR can see all employees' attendance

module.exports = router;
