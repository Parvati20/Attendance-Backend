import Attendance from "../models/Attendance.js";
import Leave from "../models/Leave.js";
import Kitchen from "../models/Kitchen.js";

export const getViewHistory = async (req, res) => {
  try {
    const studentId = req.user._id;

    const attendanceRecords = await Attendance.find({ studentId });

    const leaveRecords = await Leave.find({ studentId });

    const kitchenRecords = await Kitchen.find({ studentId });

    const totalDays = attendanceRecords.length;
    const totalPresent = attendanceRecords.filter(a => a.status === "Present").length;
    const totalAbsent = attendanceRecords.filter(a => a.status === "Absent").length;
    const totalLeave = leaveRecords.length;
    const totalKitchen = kitchenRecords.length;

    const overallPercentage =
      totalDays > 0 ? ((totalPresent / totalDays) * 100).toFixed(2) : 0;

    const leaveDetails = leaveRecords.map(l => ({
      startDate: l.startDate,
      endDate: l.endDate,
      status: l.status
    }));

    const kitchenDetails = kitchenRecords.map(k => ({
      date: k.date
    }));

    res.status(200).json({
      message: "Student history fetched successfully ✅",
      data: {
        totalPresent,
        totalAbsent,
        totalLeave,
        totalKitchen,
        overallPercentage: `${overallPercentage}%`,
        leaves: leaveDetails,
        kitchenTurns: kitchenDetails,
      },
    });

  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
