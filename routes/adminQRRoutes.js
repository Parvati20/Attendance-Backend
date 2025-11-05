import express from "express";
import {
  generateQR,
  getCurrentQR,
  expireQR,
} from "../controllers/adminQRController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only admin (Sweta & Parvati) can access
router.post("/generate", protect, adminOnly, generateQR);
router.get("/current", protect, adminOnly, getCurrentQR);
router.put("/expire/:id", protect, adminOnly, expireQR);

export default router;
