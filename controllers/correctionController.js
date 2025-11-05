import Correction from "../models/Correction.js";
import User from "../models/User.js";
import moment from "moment";

export const requestCorrection = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { date, reason } = req.body;

    if (!date || !reason) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findById(studentId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const formattedDate = moment(date).format("YYYY-MM-DD");

    const existing = await Correction.findOne({ studentId, date: formattedDate });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You already submitted a correction request for this date." });
    }

    const correction = new Correction({
      studentId,
      name: user.name,
      date: formattedDate,
      reason,
    });

    await correction.save();

    res.status(201).json({
      message: "Correction request submitted successfully!",
      correction,
    });
  } catch (error) {
    console.error("Error creating correction request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

