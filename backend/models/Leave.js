// const mongoose = require("mongoose");

// const leaveSchema = new mongoose.Schema(
//   {
//     employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
//     leaveType: { type: String, enum: ["CL", "SL", "EL"], required: true }, // Casual, Sick, Earned Leave
//     startDate: { type: String, required: true }, // "YYYY-MM-DD"
//     endDate: { type: String, required: true },
//     reason: { type: String, required: true },
//     status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Leave", leaveSchema);


const mongoose = require("mongoose")

const leaveSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    leaveType: {
      type: String,
      enum: ["CL", "SL", "EL"], // Casual Leave, Sick Leave, Earned Leave
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvalDate: {
      type: Date,
    },
    comments: {
      type: String,
    },
  },
  { timestamps: true },
)

const Leave = mongoose.model("Leave", leaveSchema)
module.exports = Leave

