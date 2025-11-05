import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import kitchenRoutes from "./routes/kitchenRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";  
import correctionRoutes from "./routes/correctionRoutes.js";
import trackingRoutes from "./routes/trackingRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import adminQRRoutes from "./routes/adminQRRoutes.js";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();


app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/kitchen", kitchenRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/correction", correctionRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/admin/qr", adminQRRoutes);

app.get("/", (req, res) => {
  res.send(" Smart Attendance Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
