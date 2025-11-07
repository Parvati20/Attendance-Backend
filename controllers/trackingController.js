import Tracking from "../models/Tracking.js";
import moment from "moment";

export const addTracking = async (req, res) => {
  try {
    const studentId = req.user._id; // from JWT middleware
    const { fullName, email, date, studentType } = req.body; // frontend sends fullName
    const uploadedFile = req.file;

    // Validate required fields
    if (!fullName || !email || !date || !studentType) {
      return res.status(400).json({ message: "All required fields are missing." });
    }

    const tracking = new Tracking({
      studentId,
      name: fullName, // map fullName from frontend to schema name
      email,
      date: moment(date).format("YYYY-MM-DD"),
      status: studentType,
      document: uploadedFile ? uploadedFile.originalname : "",
    });

    await tracking.save();

    res.status(201).json({
      message: "Student lifecycle entry added successfully!",
      tracking,
    });

  } catch (err) {
    console.error("Error adding tracking entry:", err);
    res.status(500).json({ message: "Server error during tracking submission." });
  }
};
