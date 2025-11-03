import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String,
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
});

export default mongoose.model("Attendance", attendanceSchema);
