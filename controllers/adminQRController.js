import QRCode from "qrcode";
import moment from "moment";
import QRSession from "../models/QRSession.js";

/**
 * 🧩 Generate QR (valid 9:00–9:20 AM)
 */
export const generateQR = async (req, res) => {
  try {
    const now = moment();
    const startAt = moment().set({ hour: 9, minute: 0, second: 0 });
    const endAt = moment().set({ hour: 9, minute: 20, second: 0 });

    // Expire all previous active QRs
    await QRSession.updateMany({ status: "active" }, { status: "expired" });

    const qrData = {
      date: now.format("YYYY-MM-DD"),
      validFrom: startAt.format("HH:mm"),
      validTill: endAt.format("HH:mm"),
    };

    const qrImage = await QRCode.toDataURL(JSON.stringify(qrData));

    const newQR = await QRSession.create({
      qrImage,
      startAt,
      endAt,
      generatedBy: req.user._id,
      status: "active",
    });

    res.status(201).json({
      success: true,
      message: "QR generated successfully",
      qrImage,
      validFrom: startAt.format("hh:mm A"),
      validTill: endAt.format("hh:mm A"),
      status: newQR.status,
    });
  } catch (error) {
    console.error("QR Generation Error:", error);
    res.status(500).json({ message: "Server error while generating QR" });
  }
};

/**
 * 🕒 Get current QR (auto-expire if past 9:20 AM)
 */
export const getCurrentQR = async (req, res) => {
  try {
    const qr = await QRSession.findOne().sort({ createdAt: -1 });
    if (!qr) {
      return res.status(404).json({ message: "No QR found" });
    }

    const now = moment();
    if (now.isAfter(moment(qr.endAt)) && qr.status === "active") {
      qr.status = "expired";
      await qr.save();
    }

    res.status(200).json({
      qrImage: qr.qrImage,
      validFrom: moment(qr.startAt).format("hh:mm A"),
      validTill: moment(qr.endAt).format("hh:mm A"),
      status: qr.status,
    });
  } catch (error) {
    console.error("Get Current QR Error:", error);
    res.status(500).json({ message: "Server error fetching QR" });
  }
};

/**
 * ⛔ Expire QR manually (Admin only)
 */
export const expireQR = async (req, res) => {
  try {
    const { id } = req.params;
    const qr = await QRSession.findById(id);
    if (!qr) {
      return res.status(404).json({ message: "QR not found" });
    }

    qr.status = "expired";
    await qr.save();

    res.status(200).json({ message: "QR expired successfully" });
  } catch (error) {
    console.error("Expire QR Error:", error);
    res.status(500).json({ message: "Server error while expiring QR" });
  }
};
