import express from "express";
import { requestCorrection, getMyCorrections } from "../controllers/correctionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/request", protect, requestCorrection);


router.get("/my", protect, getMyCorrections);

export default router;
