// trackingRoutes.js
import express from "express";
import multer from "multer";
import { addTracking } from "../controllers/trackingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/add", protect, upload.single("document"), addTracking);

export default router;
