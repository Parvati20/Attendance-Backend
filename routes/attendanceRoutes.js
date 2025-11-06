// import express from "express";
// import { markAttendance, getTodayStatus, verifyQR } from "../controllers/attendanceController.js";
// import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.post("/mark", protect, markAttendance);

// router.get("/today", protect, getTodayStatus);

// router.get("/verify-qr", protect, verifyQR);

// export default router;


import express from "express";
import {
  markAttendance,
  getTodayStatus,
  getYesterdayStatus, // ✅ Added for yesterday's API
  verifyQR,
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Mark attendance (via QR or manual)
router.post("/mark", protect, markAttendance);

// ✅ Get today's attendance status
router.get("/today", protect, getTodayStatus);

// ✅ Get yesterday's attendance status
router.get("/yesterday", protect, getYesterdayStatus);

// ✅ Verify QR before marking attendance
router.get("/verify-qr", protect, verifyQR);

export default router;
