import express from "express";
import { getTodayStatus, getYesterdayStatus, validateQRandMark } from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/today", protect, getTodayStatus);
router.get("/yesterday", protect, getYesterdayStatus);
router.post("/validate", protect, validateQRandMark);

export default router;
