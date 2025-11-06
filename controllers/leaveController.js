

import Leave from "../models/Leave.js";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import moment from "moment";

/**
 */
export const applyLeave = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { startDate, endDate, reason, typeOfLeave } = req.body;

    if (!startDate || !endDate || !reason || !typeOfLeave) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findById(studentId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const start = moment(startDate).format("YYYY-MM-DD");
    const end = moment(endDate).format("YYYY-MM-DD");

    const existingLeave = await Leave.findOne({
      studentId,
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ],
    });

    if (existingLeave) {
      return res.status(400).json({
        message: "You already have a leave during this period.",
      });
    }

    const leave = new Leave({
      studentId,
      name: user.name,
      studentEmail: user.email,
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
    console.error("Error applying leave:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyLeaves = async (req, res) => {
  try {
    const studentId = req.user.id;
    const leaves = await Leave.find({ studentId }).sort({ createdAt: -1 });

    res.status(200).json({
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    console.error("Error fetching student leaves:", error);
    res.status(500).json({ message: "Server error while fetching leaves." });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.status(200).json({ count: leaves.length, leaves });
  } catch (error) {
    console.error("Error fetching all leaves:", error);
    res.status(500).json({ message: "Server error while fetching all leaves." });
  }
};


export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const leave = await Leave.findByIdAndUpdate(
      id,
      { $set: { status } },   
      { new: true, runValidators: false }  
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave not found." });
    }

   
    if (status === "Approved") {
      const { studentId, startDate, endDate } = leave;
      const dates = getDatesBetween(startDate, endDate);
      for (const date of dates) {
        await Attendance.findOneAndUpdate(
          { studentId, date },
          { status: "Leave" },
          { upsert: true }
        );
      }
    }

    res.status(200).json({
      message: `Leave ${status.toLowerCase()} successfully!`,
      leave,
    });
  } catch (error) {
    console.error("Error updating leave status:", error);
    res.status(500).json({ message: "Server error while updating leave." });
  }
};


function getDatesBetween(start, end) {
  const dates = [];
  let curr = new Date(start);
  const last = new Date(end);
  while (curr <= last) {
    dates.push(curr.toISOString().split("T")[0]);
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
}

