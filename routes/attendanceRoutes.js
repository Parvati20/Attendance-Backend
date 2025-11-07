


import express from "express";
import {
  markAttendance,
  getTodayStatus,
  getYesterdayStatus,  
  verifyQR,
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/mark", protect, markAttendance);
router.get("/today", protect, getTodayStatus);
router.get("/yesterday", protect, getYesterdayStatus); 
router.get("/verify-qr", protect, verifyQR);

export default router;

