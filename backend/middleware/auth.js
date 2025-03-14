// const jwt = require("jsonwebtoken");
// const User = require("../models/user");

// // Middleware to protect routes
// exports.protect = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//     try {
//       token = req.headers.authorization.split(" ")[1]; // Extract token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

//       req.user = await User.findById(decoded.id).select("-password"); // Attach user to request
//       next();
//     } catch (error) {
//       res.status(401).json({ message: "Not authorized, token failed" });
//     }
//   } else {
//     res.status(401).json({ message: "Not authorized, no token" });
//   }
// };

// // Middleware for HR-only access
// exports.isHR = (req, res, next) => {
//   if (req.user && req.user.role === "HR") {
//     next();
//   } else {
//     res.status(403).json({ message: "Access denied, HRs only" });
//   }
// };


const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ message: "Authentication failed. No token provided." })
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decodedData.id
    req.userRole = decodedData.role

    next()
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed. Invalid token." })
  }
}

const hrOnly = (req, res, next) => {
  if (req.userRole !== "hr") {
    return res.status(403).json({ message: "Access denied. HR only." })
  }
  next()
}

module.exports = { auth, hrOnly }
