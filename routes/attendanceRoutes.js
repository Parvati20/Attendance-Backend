import express from "express";
import { markAttendance, getTodayStatus, verifyQR } from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📸 Mark Attendance (QR Scan)
router.post("/mark", protect, markAttendance);

// 📅 Get Today’s Status
router.get("/today", protect, getTodayStatus);

// ✅ Verify QR Code
router.get("/verify-qr", protect, verifyQR);

export default router;
