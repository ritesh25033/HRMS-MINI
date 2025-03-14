// const express = require("express");
// const {
//   checkIn,
//   checkOut,
//   getAttendance,
//   getAllAttendance,
// } = require("../controllers/attendance");
// const { protect, isHR } = require("../middleware/authMiddleware");

// const router = express.Router();

// // Employee Attendance
// router.post("/check-in", protect, checkIn); // Employees can check-in
// router.post("/check-out", protect, checkOut); // Employees can check-out
// router.get("/", protect, getAttendance); // Employees can view their own attendance

// // HR Attendance Management
// router.get("/all", protect, isHR, getAllAttendance); // HR can see all employees' attendance

// module.exports = router;


const express = require("express")
const { checkIn, checkOut, getAttendanceHistory, getTodayAttendance } = require("../controllers/attendance")
const { auth, hrOnly } = require("../middleware/auth")

const router = express.Router()

// All routes require authentication
router.use(auth)

// Employee routes
router.post("/check-in", checkIn)
router.post("/check-out", checkOut)
router.get("/:employeeId", getAttendanceHistory)

// HR only routes
router.get("/today/all", hrOnly, getTodayAttendance)

module.exports = router

