import Attendance from "../models/Attendance.js";
import QRSession from "../models/QRSession.js";
import Kitchen from "../models/Kitchen.js";
import Leave from "../models/Leave.js";
import moment from "moment";


// ✅ 1️⃣ Mark Attendance Manually (friend's logic)
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
      source: "Self",
    });

    await attendance.save();
    res.status(201).json({ message: "Attendance marked successfully!", attendance });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ 2️⃣ Get Today’s Status
export const getTodayStatus = async (req, res) => {
  try {
    const studentId = req.user.id;
    const today = moment().format("YYYY-MM-DD");

    const attendance = await Attendance.findOne({ studentId, date: today });
    if (attendance) {
      return res.status(200).json({
        status: attendance.status,
        source: attendance.source || "Self",
      });
    }

    const kitchen = await Kitchen.findOne({ studentId, date: today });
    if (kitchen) {
      return res.status(200).json({ status: "Kitchen Turn" });
    }

    const leave = await Leave.findOne({
      studentId,
      startDate: { $lte: today },
      endDate: { $gte: today },
    });
    if (leave) {
      return res.status(200).json({
        status: `On Leave (${leave.status})`,
      });
    }

    return res.status(200).json({ status: "No Status Yet" });
  } catch (error) {
    console.error("Error fetching today's status:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ 3️⃣ Get Yesterday’s Status
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

    const leave = await Leave.findOne({
      studentId,
      startDate: { $lte: yesterday },
      endDate: { $gte: yesterday },
    });

    if (leave) {
      return res.status(200).json({
        status: `On Leave (${leave.status})`,
      });
    }

    return res.status(200).json({ status: "No Status (Yesterday)" });
  } catch (error) {
    console.error("Error fetching yesterday's status:", error);
    res.status(500).json({ message: "Server error while fetching yesterday's status." });
  }
};


// ✅ 4️⃣ Verify QR (optional pre-check)
export const verifyQR = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ valid: false, message: "QR token is missing." });
    }

    const qr = await QRSession.findOne({ token, status: "active" });
    if (!qr) {
      return res.status(400).json({ valid: false, message: "QR invalid or expired." });
    }

    return res.status(200).json({
      valid: true,
      message: "QR verified successfully. You can mark attendance now.",
    });
  } catch (error) {
    console.error("QR verification error:", error);
    res.status(500).json({ valid: false, message: "Server error verifying QR." });
  }
};


// ✅ 5️⃣ Validate QR & Mark Attendance Automatically
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
      message: "Attendance marked successfully via QR!",
      attendance,
    });
  } catch (error) {
    console.error("QR validation error:", error);
    res.status(500).json({ success: false, message: "Server error validating QR" });
  }
};
