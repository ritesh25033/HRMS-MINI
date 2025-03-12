const express = require("express");
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} = require("../controllers/leaveController");
const { protect, isHR } = require("../middleware/authMiddleware");

const router = express.Router();

// Employee Routes
router.post("/apply", protect, applyLeave);
router.get("/", protect, getMyLeaves);

// HR Routes
router.get("/all", protect, isHR, getAllLeaves);
router.put("/:leaveId/status", protect, isHR, updateLeaveStatus);

module.exports = router;
