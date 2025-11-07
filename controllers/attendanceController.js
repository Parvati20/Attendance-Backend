// import Attendance from "../models/Attendance.js";
// import QRSession from "../models/QRSession.js";
// import moment from "moment";

// export const validateQRandMark = async (req, res) => {
//   try {
//     const { qrCode } = req.body;
//     const studentId = req.user.id;
//     const today = moment().format("YYYY-MM-DD");

//     if (!qrCode) {
//       return res.status(400).json({ success: false, message: "QR code missing" });
//     }

   
//     let parsed;
//     try {
//       parsed = JSON.parse(qrCode);
//     } catch {
//       return res.status(400).json({ success: false, message: "Invalid QR data" });
//     }

//     const { token } = parsed;
//     if (!token) return res.status(400).json({ success: false, message: "Invalid QR" });

  
//     const qr = await QRSession.findOne({ token, status: "active" });
//     if (!qr) {
//       return res.status(400).json({ success: false, message: "QR expired or invalid" });
//     }

//     return res.status(200).json({
//       valid: true,
//       message: "QR verified successfully. You can mark attendance now.",
//     });
//   } catch (error) {
//     console.error("QR verification error:", error);
//     res.status(500).json({ valid: false, message: "Server error." });
//   }
// };

// export const getYesterdayStatus = async (req, res) => {
//   try {
//     const studentId = req.user.id;
//     const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");

//     const attendance = await Attendance.findOne({ studentId, date: yesterday });
//     if (attendance) {
//       return res.status(200).json({
//         status: attendance.status,
//         source: attendance.source || "Self",
//       });
//     }

//     const kitchen = await Kitchen.findOne({ studentId, date: yesterday });
//     if (kitchen) {
//       return res.status(200).json({ status: "Kitchen Turn" });
//     }

   
//     const attendance = await Attendance.create({
//       studentId,
//       date: today,
//       status: "Present",
//       source: "QR",
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Attendance marked successfully!",
//       attendance,
//     });
//   } catch (error) {
//     console.error("QR validation error:", error);
//     res.status(500).json({ success: false, message: "Server error validating QR" });
//   }
// };


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

    const qr = await QRSession.findOne({ token, status: "active" });
    if (!qr) {
      return res.status(400).json({ success: false, message: "QR expired or invalid" });
    }

    return res.status(200).json({
      valid: true,
      message: "QR verified successfully. You can mark attendance now.",
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
      // If no attendance exists yet, you can optionally create it automatically
      // Or just return "No Data" if you prefer
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
