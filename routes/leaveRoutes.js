// import express from "express";
// import { applyLeave, getMyLeaves } from "../controllers/leaveController.js";
// import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.post("/apply", protect, applyLeave);

// router.get("/my-leaves", protect, getMyLeaves);

// export default router;

import express from "express";
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} from "../controllers/leaveController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧑‍🎓 Student Routes
router.post("/apply", protect, applyLeave);
router.get("/my-leaves", protect, getMyLeaves);

// 🧑‍💼 Admin Routes
router.get("/all", protect, adminOnly, getAllLeaves);
router.put("/update-status/:id", protect, adminOnly, updateLeaveStatus);

export default router;
