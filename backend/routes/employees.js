// const express = require("express");
// const {
//   createEmployee,
//   getEmployees,
//   getEmployeeById,
//   updateEmployee,
//   deleteEmployee,
// } = require("../controllers/employeeController");
// const { protect, isHR } = require("../middleware/authMiddleware");

// const router = express.Router();

// // Employee CRUD APIs
// router.post("/", protect, isHR, createEmployee); // HR can create employees
// router.get("/", protect, isHR, getEmployees); // HR can get all employees
// router.get("/:id", protect, getEmployeeById); // Any employee can view their details
// router.put("/:id", protect, isHR, updateEmployee); // HR can update employee
// router.delete("/:id", protect, isHR, deleteEmployee); // HR can delete employee

// module.exports = router;



const express = require("express")
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employees")
const { auth, hrOnly } = require("../middleware/auth")

const router = express.Router()

// All routes require authentication
router.use(auth)

// HR only routes
router.post("/", hrOnly, createEmployee)
router.get("/", hrOnly, getEmployees)
router.delete("/:id", hrOnly, deleteEmployee)

// Routes accessible by both HR and employees
router.get("/:id", getEmployeeById)
router.patch("/:id", hrOnly, updateEmployee)

module.exports = router

