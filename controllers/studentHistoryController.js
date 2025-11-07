import Attendance from "../models/Attendance.js";
import Leave from "../models/Leave.js";
import Kitchen from "../models/Kitchen.js";

export const getStudentHistory = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate, filter } = req.query;

    const start = startDate || "2023-01-01";
    const end = endDate || new Date().toISOString().split("T")[0];

    // Attendance
    const attendance = await Attendance.find({
      studentId,
      date: { $gte: start, $lte: end },
    });

    const totalPresent = attendance.filter(a => a.status === "Present").length;
    const totalAbsent = attendance.filter(a => a.status === "Absent").length;

    // Leave
    const leaves = await Leave.find({
      studentId,
      startDate: { $lte: end },
      endDate: { $gte: start },
    });
    const totalLeaves = leaves.length;

    // Kitchen
    const kitchen = await Kitchen.find({
      studentId,
      date: { $gte: start, $lte: end },
    });
    const totalKitchen = kitchen.length;

    // Combine all
    let records = [];

    if (filter === "All" || filter === "Leaves") {
      records.push(
        ...leaves.map(l => ({
          _id: l._id,
          from: l.startDate,
          to: l.endDate,
          leaveType: "Leave",
          status: l.status || "Approved",
          days:
            (new Date(l.endDate) - new Date(l.startDate)) /
              (1000 * 60 * 60 * 24) +
            1,
        }))
      );
    }

    if (filter === "All" || filter === "Kitchen") {
      records.push(
        ...kitchen.map(k => ({
          _id: k._id,
          from: k.date,
          to: k.date,
          leaveType: "Kitchen Turn",
          status: "Completed",
          days: 1,
        }))
      );
    }

    if (filter === "All" || filter === "Absent") {
      records.push(
        ...attendance
          .filter(a => a.status === "Absent")
          .map(a => ({
            _id: a._id,
            from: a.date,
            to: a.date,
            leaveType: "Absent",
            status: "Absent",
            days: 1,
          }))
      );
    }

    records.sort((a, b) => new Date(b.from) - new Date(a.from));

    res.json({
      totalPresent,
      totalLeaves,
      totalKitchen,
      totalAbsent,
      records,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching student history" });
  }
};
