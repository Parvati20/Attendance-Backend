// import mongoose from "mongoose";

// const attendanceSchema = new mongoose.Schema({
//   student: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   date: {
//     type: String,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ["Present", "Absent", "Leave", "Kitchen"],
//     default: "Present",
//   },
//   markedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// export default mongoose.model("Attendance", attendanceSchema);

import mongoose from "mongoose";

// 🗓️ Attendance Schema
const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // connects attendance to user
      required: true,
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Leave", "Kitchen"],
      default: "Present",
    },
    markedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ✅ Prevent duplicate attendance for the same student on the same date
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

// ✅ Export model
const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
