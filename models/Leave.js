import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    startDate: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    typeOfLeave: {
      type: String,
      enum: [
        "Exam Leave",
        "Health Issue",
        "Interview Leave",
        "Casual Leave",
        "Period Leave",
        "Special Occasion Leave",
        "Documentation Leave",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Leave", leaveSchema);
