
import Attendance from "../models/Attendance.js";
import QRSession from "../models/QRSession.js";
import Kitchen from "../models/Kitchen.js"; // Make sure you have this model
import moment from "moment";

// Validate QR and allow attendance marking
export const validateQRandMark = async (req, res) => {
  try {
    const { qrCode } = req.body;
    const studentId = req.user.id;

    if (!qrCode) {
      return res.status(400).json({ success: false, message: "QR code missing" });
    }

    let parsed;
    try {
      parsed = JSON.parse(qrCode);
    } catch {
      return res.status(400).json({ success: false, message: "Invalid QR data" });
    }

    const { token } = parsed;
    if (!token) return res.status(400).json({ success: false, message: "Invalid QR" });

    // Find QR session
    const qr = await QRSession.findOne({ token });
    if (!qr) {
      return res.status(400).json({ success: false, message: "QR expired or invalid" });
    }

    // Current time
    const now = new Date();

    // Set allowed start and end time (9:00 AM to 12:00 PM)
    const startTime = new Date();
    startTime.setHours(9, 0, 0, 0); // 9:00 AM

    const endTime = new Date();
    endTime.setHours(12, 0, 0, 0); // 12:00 PM

    // Check QR validity and allowed time
    if (
      qr.status === "expired" ||
      now > qr.endAt ||
      now < qr.startAt ||
      now < startTime ||
      now > endTime ||
      now.toDateString() !== new Date(qr.date).toDateString()
    ) {
      qr.status = "expired";
      await qr.save();
      return res.status(400).json({ success: false, message: "QR expired or inactive now" });
    }

    // Check if attendance already marked today
    const today = moment().format("YYYY-MM-DD");
    const existingAttendance = await Attendance.findOne({ studentId, date: today });
    if (existingAttendance) {
      return res.status(400).json({ success: false, message: "Attendance already marked today" });
    }

    // Mark attendance
    const attendance = await Attendance.create({
      studentId,
      qr: qr._id,
      status: "Present",
      date: today,
      source: "QR Scan",
    });

    return res.status(200).json({
      valid: true,
      message: "QR verified successfully. Attendance marked.",
      attendance,
    });
  } catch (error) {
    console.error("QR verification error:", error);
    res.status(500).json({ valid: false, message: "Server error." });
  }
};

// Get Yesterday's Attendance Status
export const getYesterdayStatus = async (req, res) => {
  try {
    const studentId = req.user.id;
    const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");

    const attendance = await Attendance.findOne({ studentId, date: yesterday });
    if (attendance) {
      return res.status(200).json({
        status: attendance.status,
        source: attendance.source || "Self",
      });
    }

    const kitchen = await Kitchen.findOne({ studentId, date: yesterday });
    if (kitchen) {
      return res.status(200).json({ status: "Kitchen Turn" });
    }

    return res.status(200).json({ status: "No Data" });
  } catch (error) {
    console.error("Error fetching yesterday status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Today's Attendance Status
export const getTodayStatus = async (req, res) => {
  try {
    const studentId = req.user.id;
    const today = moment().format("YYYY-MM-DD");

    let attendance = await Attendance.findOne({ studentId, date: today });

    if (!attendance) {
      return res.status(200).json({ status: "No Data" });
    }

    return res.status(200).json({
      status: attendance.status,
      source: attendance.source || "Self",
    });
  } catch (error) {
    console.error("Error fetching today status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



