import express from "express";
import { getStudentHistory } from "../controllers/studentHistoryController.js";

const router = express.Router();

// GET → /api/student/:studentId/history
router.get("/:studentId/history", getStudentHistory);

export default router;
