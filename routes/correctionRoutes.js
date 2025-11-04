import express from "express";
import { requestCorrection } from "../controllers/correctionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/request", protect, requestCorrection);

export default router;
