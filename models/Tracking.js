import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema(
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
    email: {
      type: String,
      required: true,
    },
    date: {
      type: String, 
      required: true,
    },
    status: {
      type: String,
      enum: ["Admission", "Placed", "Dropout"],
      required: true,
    },
    document: {
      type: String, 
    },
  },
  { timestamps: true }
);

const Tracking = mongoose.model("Tracking", trackingSchema);
export default Tracking;
