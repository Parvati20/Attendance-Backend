import express from "express";
import { addTracking } from "../controllers/trackingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addTracking);


export default router;
