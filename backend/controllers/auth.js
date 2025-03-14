// const User = require('../models/User');
// const jwt = require('jsonwebtoken');

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
// };

// // Register User (HR or Employee)
// exports.registerUser = async (req, res) => {
//   const { name, email, password, role } = req.body;

//   try {
//     const userExists = await User.findOne({ email });
//     if (userExists)
//       return res.status(400).json({ message: 'User already exists' });

//     const user = await User.create({ name, email, password, role });
//     res.status(201).json({ token: generateToken(user._id), user });
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // Login User
// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//     const isMatch = await user.matchPassword(password);
//     if (!isMatch)
//       return res.status(400).json({ message: 'Invalid credentials' });
//     console.log('user', user);
//     const token1 = generateToken(user._id);
//     console.log(token1)
//     res.json({ token:token1, user });
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// exports.getUserProfile = async (req, res) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ error: 'Not authorized' });
//     }

//     res.json({
//       id: req.user._id,
//       name: req.user.name,
//       email: req.user.email,
//       role: req.user.role,
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };



const jwt = require("jsonwebtoken")
const User = require("../models/user")

// Register a new user
const register = async (req, res) => {
  const { name, email, password, role } = req.body

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      role: role || "employee",
    })

    await newUser.save()

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id, email: newUser.email, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    })

    res.status(201).json({
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }
}

// Login user
const login = async (req, res) => {
  const { email, password } = req.body

  try {
    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    })

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
      },
      token,
    })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }
}

module.exports = { register, login }

