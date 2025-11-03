import express from "express";
import { markAttendance, getTodayStatus } from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Mark attendance (when student scans QR)
router.post("/mark", protect, markAttendance);

// ✅ Get today's attendance status (Present, Leave, Kitchen, or No Status)
router.get("/today", protect, getTodayStatus);

export default router;
