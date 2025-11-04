import mongoose from "mongoose";

const kitchenSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Kitchen", kitchenSchema);
