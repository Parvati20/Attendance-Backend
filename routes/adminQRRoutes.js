

import express from "express";
import {
  generateQR,
  getCurrentQR,
  expireQR,
} from "../controllers/adminQRController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Generate QR (admin only)
router.post("/generate", protect, adminOnly, generateQR);

// Get current QR (anyone can view — optional protect)
router.get("/current", protect, getCurrentQR);

// Expire QR manually
router.put("/expire/:id", protect, adminOnly, expireQR);

export default router;
