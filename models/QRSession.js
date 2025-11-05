import mongoose from "mongoose";

const qrSessionSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    active: { type: Boolean, default: true },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("QRSession", qrSessionSchema);
