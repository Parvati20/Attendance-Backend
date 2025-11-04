import express from "express";
import { markKitchenTurn } from "../controllers/kitchenController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/mark", protect, markKitchenTurn);


export default router;
