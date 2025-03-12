const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    date: { type: String, required: true }, // Store as "YYYY-MM-DD"
    checkIn: { type: String }, // Time in "HH:MM:SS"
    checkOut: { type: String }, // Time in "HH:MM:SS"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
