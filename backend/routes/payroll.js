// const express = require("express");
// const { generatePayroll, getAllPayrolls, getEmployeePayroll } = require("../controllers/payroll");
// const { protect, isHR } = require("../middleware/auth");

// const router = express.Router();

// // Generate Payroll (HR Only)
// router.post("/generate", protect, isHR, generatePayroll);

// // HR views all payrolls
// router.get("/all", protect, isHR, getAllPayrolls);

// // Employee views their payroll
// router.get("/", protect, getEmployeePayroll);

// module.exports = router;


const express = require("express")
const { generatePayroll, getEmployeePayroll, updatePayrollStatus } = require("../controllers/payroll")
const { auth, hrOnly } = require("../middleware/auth")

const router = express.Router()

// All routes require authentication
router.use(auth)

// HR only routes
router.post("/generate", hrOnly, generatePayroll)
router.patch("/:id", hrOnly, updatePayrollStatus)

// Routes accessible by both HR and employees
router.get("/employee/:employeeId", getEmployeePayroll)

module.exports = router

