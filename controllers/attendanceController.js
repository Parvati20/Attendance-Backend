import Attendance from "../models/Attendance.js";
import QRSession from "../models/QRSession.js";
import moment from "moment";

// 🔹 Dummy (placeholder) controllers — abhi ke liye simple response bhejenge
export const markAttendance = (req, res) => res.send("Mark Attendance");
export const getTodayStatus = (req, res) => res.send("Today's Status");
export const getYesterdayStatus = (req, res) => res.send("Yesterday's Status");
export const verifyQR = (req, res) => res.send("Verify QR");

// 🔹 Actual main function — ye tumhara working logic hai
export const validateQRandMark = async (req, res) => {
  try {
    const { qrCode } = req.body;
    const studentId = req.user.id;
    const today = moment().format("YYYY-MM-DD");

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

    const qr = await QRSession.findOne({ token, status: "active" });
    if (!qr) {
      return res.status(400).json({ success: false, message: "QR expired or invalid" });
    }

    const now = moment();
    if (now.isBefore(qr.startAt) || now.isAfter(qr.endAt)) {
      return res.status(400).json({ success: false, message: "QR not valid at this time" });
    }

    const already = await Attendance.findOne({ studentId, date: today });
    if (already) {
      return res.status(400).json({ success: false, message: "Already marked today" });
    }

    const attendance = await Attendance.create({
      studentId,
      date: today,
      status: "Present",
      source: "QR",
    });

    return res.status(200).json({
      success: true,
      message: "Attendance marked successfully!",
      attendance,
    });
  } catch (error) {
    console.error("QR validation error:", error);
    res.status(500).json({ success: false, message: "Server error validating QR" });
  }
};
