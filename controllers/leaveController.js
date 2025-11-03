import Leave from "../models/Leave.js";
import User from "../models/User.js";
import moment from "moment";

export const applyLeave = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { startDate, endDate, reason, typeOfLeave } = req.body;

    // Validate
    if (!startDate || !endDate || !reason || !typeOfLeave) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findById(studentId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Format dates
    const start = moment(startDate).format("YYYY-MM-DD");
    const end = moment(endDate).format("YYYY-MM-DD");

    // Prevent overlapping leaves
    const existingLeave = await Leave.findOne({
      studentId,
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
    });

    if (existingLeave) {
      return res
        .status(400)
        .json({ message: "You already have a leave during this period." });
    }

    // Create leave entry
    const leave = new Leave({
      studentId,
      name: user.name,
      startDate: start,
      endDate: end,
      reason,
      typeOfLeave,
      status: "Pending",
    });

    await leave.save();

    res.status(201).json({
      message: "Leave applied successfully!",
      leave,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
