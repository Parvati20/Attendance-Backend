import mongoose from "mongoose";

const kitchenSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Kitchen", kitchenSchema);
