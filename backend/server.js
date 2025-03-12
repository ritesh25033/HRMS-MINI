require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const payrollRoutes = require("./routes/payrollRoutes");

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request body
app.use(cors()); // Enable CORS for frontend requests

// Add Authentication Routes
app.use("/api/auth", authRoutes);
// Employee Management Routes
app.use("/api/employees", employeeRoutes);
// Attendance Routes
app.use("/api/attendance", attendanceRoutes);
// Leave Routes
app.use("/api/leaves", leaveRoutes);
// Payroll Routes
app.use("/api/payrolls", payrollRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(" MongoDB Connection Error:", err));

// Default Route
app.get("/", (req, res) => {
  res.send("Mini HRMS API is Running...");
});

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
