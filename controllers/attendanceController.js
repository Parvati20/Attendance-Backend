// import Attendance from "../models/Attendance.js";
// import Kitchen from "../models/Kitchen.js";
// import Leave from "../models/Leave.js";
// import moment from "moment";

// export const markAttendance = async (req, res) => {
//   try {
//     const studentId = req.user.id; 
//     const today = moment().format("YYYY-MM-DD");

//     const alreadyMarked = await Attendance.findOne({ studentId, date: today });
//     if (alreadyMarked) {
//       return res.status(400).json({ message: "Attendance already marked today." });
//     }

//     const attendance = new Attendance({
//       studentId,
//       date: today,
//       status: "Present",
//     });

//     await attendance.save();
//     res.status(201).json({ message: "Attendance marked successfully!" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const getTodayStatus = async (req, res) => {
//   try {
//     const studentId = req.user.id;
//     const today = moment().format("YYYY-MM-DD");

//     const attendance = await Attendance.findOne({ studentId, date: today });
//     if (attendance) {
//       return res.json({ status: "Present" });
//     }

//     const kitchen = await Kitchen.findOne({ studentId, date: today });
//     if (kitchen) {
//       return res.json({ status: "Kitchen Turn" });
//     }

//     const leave = await Leave.findOne({
//       studentId,
//       startDate: { $lte: today },
//       endDate: { $gte: today },
//     });
//     if (leave) {
//       return res.json({
//         status: `On Leave (${leave.status})`,
//       });
//     }

    
//     return res.json({ status: "No Status Yet" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// export const verifyQR = async (req, res) => {
//   try {
//     const { token } = req.query;

//     if (!token) {
//       return res.status(400).json({ valid: false, message: "QR token is missing." });
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

import Attendance from "../models/Attendance.js";
import Kitchen from "../models/Kitchen.js";
import Leave from "../models/Leave.js";
import moment from "moment";

/* ===========================================================
   STUDENT: Mark attendance manually (via QR)
   Endpoint: POST /api/attendance/mark
   Auth: Student (protect)
=========================================================== */
export const markAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;
    const today = moment().format("YYYY-MM-DD");

    // ✅ Check if attendance already exists
    const alreadyMarked = await Attendance.findOne({ studentId, date: today });
    if (alreadyMarked) {
      return res.status(400).json({ message: "Attendance already marked today." });
    }

    // ✅ Mark new attendance
    const attendance = new Attendance({
      studentId,
      date: today,
      status: "Present",
      source: "QR",
    });

    await attendance.save();
    res.status(201).json({ message: "Attendance marked successfully!", attendance });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================================================
   STUDENT: Get today's attendance/leave/kitchen/correction status
   Endpoint: GET /api/attendance/today
   Auth: Student (protect)
=========================================================== */
export const getTodayStatus = async (req, res) => {
  try {
    const studentId = req.user.id;
    const today = moment().format("YYYY-MM-DD");

    // ✅ 1. Check attendance (includes correction-approved attendance)
    const attendance = await Attendance.findOne({ studentId, date: today });
    if (attendance) {
      return res.status(200).json({
        status: attendance.status,
        source: attendance.source || "Self",
      });
    }

    // ✅ 2. Check kitchen duty
    const kitchen = await Kitchen.findOne({ studentId, date: today });
    if (kitchen) {
      return res.status(200).json({ status: "Kitchen Turn" });
    }

    // ✅ 3. Check approved leave
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

    // ✅ 4. No records found
    return res.status(200).json({ status: "No Status Yet" });
  } catch (error) {
    console.error("Error fetching today's status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================================================
   QR VERIFICATION (optional helper)
   Endpoint: GET /api/attendance/verifyQR?token=<QR_TOKEN>
=========================================================== */
export const verifyQR = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res
        .status(400)
        .json({ valid: false, message: "QR token is missing." });
    }

    // ✅ (In future) You can verify token from DB or JWT here
    return res.status(200).json({
      valid: true,
      message: "QR verified successfully. You can mark attendance now.",
    });
  } catch (error) {
    console.error("QR verification error:", error);
    res.status(500).json({ valid: false, message: "Server error." });
  }
};

