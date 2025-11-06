import express from "express";
import {
  requestCorrection,
  getMyCorrections,
  getAllCorrections,
  updateCorrectionStatus,
} from "../controllers/correctionController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧑‍🎓 Student Routes
router.post("/request", protect, requestCorrection);
router.get("/my", protect, getMyCorrections);

// 🧑‍💼 Admin Routes
router.get("/admin", protect, adminOnly, getAllCorrections);
router.put("/admin/:id", protect, adminOnly, updateCorrectionStatus);

export default router;
