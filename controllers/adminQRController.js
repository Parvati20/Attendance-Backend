

import QRSession from "../models/QRSession.js";
import moment from "moment";
import QRCode from "qrcode";

// Generate QR
export const generateQR = async (req, res) => {
  try {
    const now = moment();
    const startAt = moment().set({ hour: 9, minute: 0, second: 0 });
    const endAt = moment().set({ hour: 22, minute: 0, second: 0 });

    // Only allow generation 2 mins before 9 AM
    if (now.isBefore(startAt.clone().subtract(2, "minutes"))) {
      return res.status(400).json({ message: "Too early to generate QR" });
    }

    // Expire old QR
    await QRSession.updateMany({ status: "active" }, { status: "expired" });

    const token = Math.random().toString(36).substring(2, 12);
    const qrImage = await QRCode.toDataURL(token);

    const qr = await QRSession.create({
      token,
      qrImage,
      startAt: startAt.toDate(),
      endAt: endAt.toDate(),
      date: now.format("YYYY-MM-DD"),
      generatedBy: req.user._id,
    });

    res.status(201).json({
      qrImage: qr.qrImage,
      validFrom: qr.startAt,
      validTill: qr.endAt,
      status: qr.status,
      token: qr.token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get current QR
export const getCurrentQR = async (req, res) => {
  try {
    const qr = await QRSession.findOne({ status: "active" }).sort({ createdAt: -1 });
    if (!qr) return res.json({ message: "No active QR" });

    if (qr.checkAndExpire()) await qr.save();

    res.json({
      qrImage: qr.qrImage,
      validFrom: qr.startAt,
      validTill: qr.endAt,
      status: qr.status,
      token: qr.token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Expire QR manually
export const expireQR = async (req, res) => {
  try {
    const qr = await QRSession.findById(req.params.id);
    if (!qr) return res.status(404).json({ message: "QR not found" });

    qr.status = "expired";
    await qr.save();
    res.json({ message: "QR expired successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};



