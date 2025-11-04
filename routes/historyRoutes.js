import express from "express";
import { getViewHistory } from "../controllers/historyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/view", protect, getViewHistory);

export default router;
