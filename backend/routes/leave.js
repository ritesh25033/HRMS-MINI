// const express = require("express");
// const {
//   applyLeave,
//   getMyLeaves,
//   getAllLeaves,
//   updateLeaveStatus,
// } = require("../controllers/leaveController");
// const { protect, isHR } = require("../middleware/authMiddleware");

// const router = express.Router();

// // Employee Routes
// router.post("/apply", protect, applyLeave);
// router.get("/", protect, getMyLeaves);

// // HR Routes
// router.get("/all", protect, isHR, getAllLeaves);
// router.put("/:leaveId/status", protect, isHR, updateLeaveStatus);

// module.exports = router;


const express = require("express")
const { applyLeave, updateLeaveStatus, getEmployeeLeaves, getPendingLeaves } = require("../controllers/leave")
const { auth, hrOnly } = require("../middleware/auth")

const router = express.Router()

// All routes require authentication
router.use(auth)

// Employee routes
router.post("/apply", applyLeave)
router.get("/employee/:employeeId", getEmployeeLeaves)

// HR only routes
router.patch("/:id", hrOnly, updateLeaveStatus)
router.get("/pending", hrOnly, getPendingLeaves)

module.exports = router

