// const Employee = require('../models/Employee');

// // Create Employee (HR Only)
// exports.createEmployee = async (req, res) => {
//   try {
//     console.log('data', req.body);
//     const employee = await Employee.create(req.body);

//     res.status(201).json(employee);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };

// const Employee = require("../models/Employee");
// const Payroll = require("../models/Payroll");

// exports.createEmployee = async (req, res) => {
//   try {
//     console.log("Received Data:", req.body);

//     // Step 1: Ensure salary exists
//     if (!req.body.salary) {
//       return res.status(400).json({ message: "Salary is required to create an employee" });
//     }

//     // Step 2: Create Employee
//     const employee = await Employee.create({ ...req.body, salary: req.body.salary });
//     console.log("Employee Created:", employee);

//     // Step 3: Get the current month in "YYYY-MM" format
//     const currentMonth = new Date().toISOString().slice(0, 7);

//     // Step 4: Create Payroll entry
//     const payroll = new Payroll({
//       employee: employee._id,
//       baseSalary: req.body.salary,
//       totalDays: 30,
//       presentDays: 0,
//       leaveDays: 0,
//       finalSalary: 0, // This will be updated later based on attendance & leaves
//       month: currentMonth,
//     });

//     // Step 5: Save Payroll and handle errors
//     await payroll.save();
//     console.log("Payroll Created:", payroll);

//     res.status(201).json({ employee, payroll });
//   } catch (error) {
//     console.error("Error creating employee and payroll:", error);
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

// // Get All Employees (HR Only)
// exports.getEmployees = async (req, res) => {
//   try {
//     const employees = await Employee.find();
//     res.json(employees);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };

// // Get Employee by ID
// exports.getEmployeeById = async (req, res) => {
//   try {
//     const employee = await Employee.findById(req.params.id);
//     if (!employee)
//       return res.status(404).json({ message: 'Employee not found' });
//     res.json(employee);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };

// // Update Employee (HR Only)
// exports.updateEmployee = async (req, res) => {
//   try {
//     const updatedEmployee = await Employee.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!updatedEmployee)
//       return res.status(404).json({ message: 'Employee not found' });
//     res.json(updatedEmployee);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };

// // Delete Employee (HR Only)
// exports.deleteEmployee = async (req, res) => {
//   try {
//     const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
//     if (!deletedEmployee)
//       return res.status(404).json({ message: 'Employee not found' });
//     res.json({ message: 'Employee deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };




const Employee = require("../models/employee");
const User = require("../models/user")

// Create a new employee
const createEmployee = async (req, res) => {
  const employeeData = req.body

  try {
    // Check if employee with same email, aadhaar, or PAN already exists
    const existingEmployee = await Employee.findOne({
      $or: [{ email: employeeData.email }, { aadhaar: employeeData.aadhaar }, { pan: employeeData.pan }],
    })

    if (existingEmployee) {
      return res.status(400).json({ message: "Employee with this email, Aadhaar, or PAN already exists" })
    }

    // Create new employee
    const newEmployee = new Employee(employeeData)
    await newEmployee.save()

    // Create user account for the employee
    const newUser = new User({
      name: employeeData.name,
      email: employeeData.email,
      password: "password123", // Default password, should be changed on first login
      role: "employee",
      employeeId: newEmployee._id,
    })

    await newUser.save()

    res.status(201).json(newEmployee)
  } catch (error) {
    res.status(500).json({ message: "Failed to create employee", error: error.message })
  }
}

// Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
    res.status(200).json(employees)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employees", error: error.message })
  }
}

// Get employee by ID
const getEmployeeById = async (req, res) => {
  const { id } = req.params

  try {
    const employee = await Employee.findById(id)

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" })
    }

    res.status(200).json(employee)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employee", error: error.message })
  }
}

// Update employee
const updateEmployee = async (req, res) => {
  const { id } = req.params
  const updates = req.body

  try {
    // Check if trying to update email, aadhaar, or PAN to one that already exists
    if (updates.email || updates.aadhaar || updates.pan) {
      const existingEmployee = await Employee.findOne({
        _id: { $ne: id },
        $or: [{ email: updates.email }, { aadhaar: updates.aadhaar }, { pan: updates.pan }],
      })

      if (existingEmployee) {
        return res.status(400).json({ message: "Employee with this email, Aadhaar, or PAN already exists" })
      }
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true })

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" })
    }

    // Update user name and email if they changed
    if (updates.name || updates.email) {
      await User.findOneAndUpdate(
        { employeeId: id },
        {
          $set: {
            name: updates.name || undefined,
            email: updates.email || undefined,
          },
        },
        { runValidators: true },
      )
    }

    res.status(200).json(updatedEmployee)
  } catch (error) {
    res.status(500).json({ message: "Failed to update employee", error: error.message })
  }
}

// Delete employee
const deleteEmployee = async (req, res) => {
  const { id } = req.params

  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id)

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" })
    }

    // Delete associated user account
    await User.findOneAndDelete({ employeeId: id })

    res.status(200).json({ message: "Employee deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Failed to delete employee", error: error.message })
  }
}

module.exports = { createEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee }

