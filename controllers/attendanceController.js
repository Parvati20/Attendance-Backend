import Attendance from "../models/Attendance.js";
import Kitchen from "../models/Kitchen.js";
import Leave from "../models/Leave.js";
import moment from "moment";

export const markAttendance = async (req, res) => {
  try {
    const studentId = req.user.id; 
    const today = moment().format("YYYY-MM-DD");

    const alreadyMarked = await Attendance.findOne({ studentId, date: today });
    if (alreadyMarked) {
      return res.status(400).json({ message: "Attendance already marked today." });
    }

    const attendance = new Attendance({
      studentId,
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

export const getTodayStatus = async (req, res) => {
  try {
    const studentId = req.user.id;
    const today = moment().format("YYYY-MM-DD");

    const attendance = await Attendance.findOne({ studentId, date: today });
    if (attendance) {
      return res.json({ status: "Present" });
    }

    const kitchen = await Kitchen.findOne({ studentId, date: today });
    if (kitchen) {
      return res.json({ status: "Kitchen Turn" });
    }

    const leave = await Leave.findOne({
      studentId,
      startDate: { $lte: today },
      endDate: { $gte: today },
    });
    if (leave) {
      return res.json({
        status: `On Leave (${leave.status})`,
      });
    }

    
    return res.json({ status: "No Status Yet" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// ✅ Verify QR Code (temporary fake verification)
export const verifyQR = async (req, res) => {
  try {
    const { token } = req.query;

    // abhi ke liye koi real check nahi, sirf valid dikhayenge
    if (!token) {
      return res.status(400).json({ valid: false, message: "QR token is missing." });
    }

    // (Later: yahan check karenge ki QR expired ya fake to nahi)
    return res.status(200).json({
      valid: true,
      message: "QR verified successfully. You can mark attendance now.",
    });
  } catch (error) {
    console.error("QR verification error:", error);
    res.status(500).json({ valid: false, message: "Server error." });
  }
};

