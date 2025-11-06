import Correction from "../models/Correction.js";
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import moment from "moment";

/* ===========================================================
   STUDENT: Create a new correction request
   Endpoint: POST /api/correction/request
   Auth: Student (protect)
=========================================================== */
export const requestCorrection = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { date, reason } = req.body;

    if (!date || !reason) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findById(studentId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const formattedDate = moment(date).format("YYYY-MM-DD");

    const existing = await Correction.findOne({ studentId, date: formattedDate });
    if (existing) {
      return res.status(400).json({
        message: "You already submitted a correction request for this date.",
      });
    }

    const correction = new Correction({
      studentId,
      name: user.name,
      date: formattedDate,
      reason,
    });

    await correction.save();

    res.status(201).json({
      message: "Correction request submitted successfully!",
      correction,
    });
  } catch (error) {
    console.error("❌ Error creating correction request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================================================
   STUDENT: Get logged-in student's corrections
   Endpoint: GET /api/correction/my
   Auth: Student (protect)
=========================================================== */
export const getMyCorrections = async (req, res) => {
  try {
    const studentId = req.user.id;
    const corrections = await Correction.find({ studentId }).sort({ createdAt: -1 });
    res.status(200).json({ data: corrections });
  } catch (error) {
    console.error("❌ Error fetching corrections:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================================================
   ADMIN: Get all correction requests
   Endpoint: GET /api/correction/admin
   Auth: Admin (protect + adminOnly)
=========================================================== */
export const getAllCorrections = async (req, res) => {
  try {
    const corrections = await Correction.find()
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ data: corrections });
  } catch (error) {
    console.error("❌ Error fetching all corrections:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================================================
   ADMIN: Approve or Reject correction
   Endpoint: PUT /api/correction/admin/:id
   Auth: Admin (protect + adminOnly)
=========================================================== */
export const updateCorrectionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🟡 Received body:", req.body); // helpful for debugging

    // Support both 'action' or 'status' keys
    const action = req.body.action || req.body.status;

    if (!["Approved", "Rejected"].includes(action)) {
      return res.status(400).json({ message: "Invalid action. Use 'Approved' or 'Rejected'." });
    }

    // ✅ Find correction
    const correction = await Correction.findById(id);
    if (!correction) {
      return res.status(404).json({ message: "Correction not found." });
    }

    correction.status = action;
    await correction.save();

    // ✅ If approved, mark attendance as "Present"
    if (action === "Approved") {
      const formattedDate = moment(correction.date).format("YYYY-MM-DD");

      const alreadyMarked = await Attendance.findOne({
        studentId: correction.studentId,
        date: formattedDate,
      });

      if (!alreadyMarked) {
        await Attendance.create({
          studentId: correction.studentId,
          name: correction.name,
          date: formattedDate,
          status: "Present",
          source: "Correction",
        });
      }
    }

    res.status(200).json({
      message: `Correction ${action.toLowerCase()} successfully.`,
      correction,
    });
  } catch (error) {
    console.error("❌ Error updating correction:", error);
    res.status(500).json({ message: "Server error" });
  }
};
