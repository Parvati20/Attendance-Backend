
import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { applyLeave, approveLeave, rejectLeave, getAllLeaves , getMyLeaves } from "../controllers/leaveController.js";

const router = express.Router();

router.post("/apply", protect, applyLeave);
router.get("/", protect, adminOnly, getAllLeaves);
router.get("/my-leaves", protect, getMyLeaves);


router.put("/approve/:id", protect, adminOnly, approveLeave);
router.put("/reject/:id", protect, adminOnly, rejectLeave);

export default router;


