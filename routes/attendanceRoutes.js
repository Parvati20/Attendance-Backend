import express from "express";
import { markAttendance } from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected route (only logged-in users)
router.post("/mark", protect, markAttendance);

export default router;
