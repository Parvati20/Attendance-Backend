import mongoose from "mongoose";

const qrSessionSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true }, // unique token
    qrImage: { type: String, required: true }, // base64 image
    startAt: { type: Date, required: true }, // 9:00 AM
    endAt: { type: Date, required: true },   // 9:20 AM
    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("QRSession", qrSessionSchema);
