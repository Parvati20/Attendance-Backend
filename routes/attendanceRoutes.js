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
  getYesterdayStatus,  // ✅ add this
  verifyQR,
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/mark", protect, markAttendance);
router.get("/today", protect, getTodayStatus);
router.get("/yesterday", protect, getYesterdayStatus); // ✅ new route
router.get("/verify-qr", protect, verifyQR);

export default router;

