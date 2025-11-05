import mongoose from "mongoose";

const qrSessionSchema = new mongoose.Schema(
  {
    qrImage: {
      type: String,
      required: true,
    },
    startAt: {
      type: Date,
      required: true,
    },
    endAt: {
      type: Date,
      required: true,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },
  },
  { timestamps: true }
);

const QRSession = mongoose.model("QRSession", qrSessionSchema);
export default QRSession;
