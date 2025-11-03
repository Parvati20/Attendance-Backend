import Attendance from "../models/Attendance.js";
import moment from "moment";

// POST /api/attendance/mark
export const markAttendance = async (req, res) => {
  try {
    const studentId = req.user._id; // from authMiddleware
    const today = moment().format("YYYY-MM-DD");

    // Check if already marked today
    const alreadyMarked = await Attendance.findOne({
      student: studentId,
      date: today,
    });

    if (alreadyMarked) {
      return res.status(400).json({ message: "Attendance already marked today." });
    }

    // Create new attendance record
    const attendance = new Attendance({
      student: studentId,
      date: today,
      status: "Present",
    });

    await attendance.save();
    res.status(201).json({ message: "Attendance marked successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
