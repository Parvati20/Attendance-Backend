import QRCode from "qrcode";
import QRSession from "../models/QRSession.js";
import moment from "moment";

/**
 * 🌀 Generate new QR code (valid from 9:00 AM to 9:20 AM)
 */
export const generateQR = async (req, res) => {
  try {
    const now = moment();
    const expiry = moment().set({ hour: 9, minute: 20, second: 0 });

    // Expire any previous active QR
    await QRSession.updateMany({ active: true }, { active: false });

    const token = `${req.user._id}-${Date.now()}`;
    const qrData = {
      token,
      date: now.format("YYYY-MM-DD"),
      validTill: expiry.format("HH:mm:ss"),
      generatedBy: req.user.name,
    };

    const qrImage = await QRCode.toDataURL(JSON.stringify(qrData));

    await QRSession.create({
      token,
      startAt: now.toDate(),
      endAt: expiry.toDate(),
      active: true,
      generatedBy: req.user._id,
    });

    res.status(201).json({
      message: "✅ QR Code generated successfully",
      qrImage,
      validTill: expiry.format("hh:mm A"),
    });
  } catch (error) {
    console.error("QR Generate Error:", error);
    res.status(500).json({ message: "Server error while generating QR" });
  }
};

/**
 * 📅 Get current active QR code
 */
export const getCurrentQR = async (req, res) => {
  try {
    const qr = await QRSession.findOne({ active: true }).sort({ createdAt: -1 });
    if (!qr) return res.status(404).json({ message: "No active QR found" });

    res.status(200).json(qr);
  } catch (error) {
    console.error("Get Current QR Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ⏰ Expire a QR manually
 */
export const expireQR = async (req, res) => {
  try {
    const { id } = req.params;
    const qr = await QRSession.findById(id);
    if (!qr) return res.status(404).json({ message: "QR not found" });

    qr.active = false;
    await qr.save();

    res.status(200).json({ message: "QR expired successfully" });
  } catch (error) {
    console.error("Expire QR Error:", error);
    res.status(500).json({ message: "Server error while expiring QR" });
  }
};
