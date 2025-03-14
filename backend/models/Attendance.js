// const mongoose = require("mongoose");

// const attendanceSchema = new mongoose.Schema(
//   {
//     employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
//     date: { type: String, required: true }, // Store as "YYYY-MM-DD"
//     checkIn: { type: String }, // Time in "HH:MM:SS"
//     checkOut: { type: String }, // Time in "HH:MM:SS"
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Attendance", attendanceSchema);



const mongoose = require("mongoose")

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    checkIn: {
      time: { type: Date },
      status: { type: String, enum: ["on-time", "late"], default: "on-time" },
    },
    checkOut: {
      time: { type: Date },
      status: { type: String, enum: ["on-time", "early", "overtime"], default: "on-time" },
    },
    status: {
      type: String,
      enum: ["present", "absent", "half-day", "on-leave"],
      default: "absent",
    },
    workingHours: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true },
)

// Compound index to ensure one attendance record per employee per day
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true })

const Attendance = mongoose.model("Attendance", attendanceSchema)
module.exports = Attendance

