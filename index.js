import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import kitchenRoutes from "./routes/kitchenRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";  // ✅ Add this line




dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/kitchen", kitchenRoutes);
app.use("/api/leave", leaveRoutes);


app.get("/", (req, res) => {
  res.send("🚀 Smart Attendance Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
