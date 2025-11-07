import express from "express";
import { 
  getTodayStatus, 
  getYesterdayStatus, 
  validateQRandMark 
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get today's attendance status
router.get("/today", protect, getTodayStatus);

// Get yesterday's attendance status
router.get("/yesterday", protect, getYesterdayStatus);

// Validate QR and allow marking attendance
router.post("/validate", protect, validateQRandMark);

export default router;

