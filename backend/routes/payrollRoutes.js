const express = require("express");
const { generatePayroll, getAllPayrolls, getEmployeePayroll } = require("../controllers/payrollController");
const { protect, isHR } = require("../middleware/authMiddleware");

const router = express.Router();

// Generate Payroll (HR Only)
router.post("/generate", protect, isHR, generatePayroll);

// HR views all payrolls
router.get("/all", protect, isHR, getAllPayrolls);

// Employee views their payroll
router.get("/", protect, getEmployeePayroll);

module.exports = router;
