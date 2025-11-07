import Attendance from "../models/Attendance.js";
import QRSession from "../models/QRSession.js";
import moment from "moment";
// import Kitchen from "../models/Kitchen.js"; // Uncomment only if you have Kitchen model

// 🔹 Dummy (placeholder) controllers — basic testing ke liye
export const markAttendance = (req, res) => res.send("Mark Attendance");
export const getTodayStatus = (req, res) => res.send("Today's Status");
export const verifyQR = (req, res) => res.send("Verify QR");

// 🔹 Validate QR and Mark Attendance (main working logic)
export const validateQRandMark = async (req, res) => {
  try {
    const { qrCode } = req.body;
    const studentId = req.user.id;
    const today = moment().format("YYYY-MM-DD");

    // 🧩 Step 1: Check if QR data present
    if (!qrCode) {
      return res.status(400).json({ success: false, message: "QR code missing" });
    }

    // 🧩 Step 2: Parse QR JSON safely
    let parsed;
    try {
      parsed = JSON.parse(qrCode);
    } catch {
      return res.status(400).json({ success: false, message: "Invalid QR data" });
    }

    // 🧩 Step 3: Extract and validate token
    const { token } = parsed;
    if (!token) {
      return res.status(400).json({ success: false, message: "Invalid QR" });
    }

    // 🧩 Step 4: Check QR validity in DB
    const qr = await QRSession.findOne({ token, status: "active" });
    if (!qr) {
      return res.status(400).json({ success: false, message: "QR expired or invalid" });
    }

    // 🧩 Step 5: Mark Attendance
    const attendance = await Attendance.create({
      studentId,
      date: today,
      status: "Present",
      source: "QR",
    });

    return res.status(200).json({
      success: true,
      message: "QR verified & attendance marked successfully!",
      attendance,
    });
  } catch (error) {
    console.error("QR validation error:", error);
    res.status(500).json({ success: false, message: "Server error validating QR" });
  }
};

// 🔹 Get Yesterday Attendance Status
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

    // 🔹 Optional: Check kitchen duty (agar Kitchen model hai)
    /*
    const kitchen = await Kitchen.findOne({ studentId, date: yesterday });
    if (kitchen) {
      return res.status(200).json({ status: "Kitchen Turn" });
    }
    */

    // Agar kuch bhi record nahi mila
    return res.status(200).json({ status: "Absent" });
  } catch (error) {
    console.error("Yesterday status error:", error);
    res.status(500).json({ success: false, message: "Server error fetching yesterday status" });
  }
};
