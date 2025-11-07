import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  applyLeave,
  approveLeave,
  rejectLeave,
  getAllLeaves,
  getMyLeaves,
} from "../controllers/leaveController.js";

const router = express.Router();
router.post("/apply", protect, applyLeave);
router.get("/my-leaves", protect, getMyLeaves); // Student's own leaves

router.get("/all", protect, getAllLeaves);// Get all leaves
router.put("/approve/:id", protect, approveLeave);
router.put("/reject/:id", protect, rejectLeave);

export default router;



