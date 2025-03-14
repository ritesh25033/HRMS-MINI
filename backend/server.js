// const express = require("express")
// const mongoose = require("mongoose")
// const cors = require("cors")
// const dotenv = require("dotenv")

// // Load environment variables
// dotenv.config()

// // Import routes
// const authRoutes = require("./routes/auth")
// const employeeRoutes = require("./routes/employees")
// const attendanceRoutes = require("./routes/attendance")
// const leaveRoutes = require("./routes/leave")
// const payrollRoutes = require("./routes/payroll")

// const app = express()
// const PORT = process.env.PORT || 5000

// // Middleware
// app.use(express.json({ limit: "30mb" }))
// app.use(express.urlencoded({ limit: "30mb", extended: true }))
// app.use(cors())

// // Routes
// app.use("/api/auth", authRoutes)
// app.use("/api/employees", employeeRoutes)
// app.use("/api/attendance", attendanceRoutes)
// app.use("/api/leave", leaveRoutes)
// app.use("/api/payroll", payrollRoutes)

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log("Connected to MongoDB")
//     app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
//   })
//   .catch((error) => console.log("MongoDB connection error:", error.message))


const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

// Import routes
const authRoutes = require("./routes/auth")
const employeeRoutes = require("./routes/employees")
const attendanceRoutes = require("./routes/attendance")
const leaveRoutes = require("./routes/leave")
const payrollRoutes = require("./routes/payroll")

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json({ limit: "30mb" }))
app.use(express.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/employees", employeeRoutes)
app.use("/api/attendance", attendanceRoutes)
app.use("/api/leave", leaveRoutes)
app.use("/api/payroll", payrollRoutes)

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  })
  .catch((error) => console.log("MongoDB connection error:", error.message))

