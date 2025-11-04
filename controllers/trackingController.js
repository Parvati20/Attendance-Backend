import Tracking from "../models/Tracking.js";
import User from "../models/User.js";
import moment from "moment";

export const addTracking = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { date, status, document } = req.body;

    if (!date || !status) {
      return res.status(400).json({ message: "Date and Status are required." });
    }

    const user = await User.findById(studentId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const formattedDate = moment(date).format("YYYY-MM-DD");

    const tracking = new Tracking({
      studentId,
      name: user.name,
      email: user.email,
      date: formattedDate,
      status,
      document,
    });

    await tracking.save();

    res.status(201).json({
      message: "Student lifecycle entry added successfully!",
      tracking,
    });
  } catch (error) {
    console.error("Error adding tracking entry:", error);
    res.status(500).json({ message: "Server error" });
  }
};
