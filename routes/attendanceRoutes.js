import express from "express";
import { markAttendance, getTodayStatus } from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/mark", protect, markAttendance);

router.get("/today", protect, getTodayStatus);

export default router;
