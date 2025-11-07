import QRCode from "qrcode";
import moment from "moment";
import QRSession from "../models/QRSession.js";
import { v4 as uuidv4 } from "uuid";


export const generateQR = async (req, res) => {
  try {
    const now = moment();
    const startAt = moment().set({ hour: 9, minute: 0, second: 0 });
    const endAt = moment().set({ hour: 22, minute: 0, second: 0 }); 

  
    await QRSession.updateMany({ status: "active" }, { status: "expired" });

    const token = uuidv4();
    const qrData = {
      token,
      date: now.format("YYYY-MM-DD"),
      validFrom: startAt.format("HH:mm"),
      validTill: endAt.format("HH:mm"),
      generatedBy: req.user.name,
    };

    const qrImage = await QRCode.toDataURL(JSON.stringify(qrData));

    const newQR = await QRSession.create({
      token,
      qrImage,
      startAt,
      endAt,
      status: "active",
      generatedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "✅ QR generated successfully",
      qrImage,
      token,
      validFrom: startAt.format("hh:mm A"),
      validTill: endAt.format("hh:mm A"),
      status: newQR.status,
    });
  } catch (error) {
    console.error("QR Generation Error:", error);
    res.status(500).json({ message: "Server error while generating QR" });
  }
};


export const getCurrentQR = async (req, res) => {
  try {
 
    const qr = await QRSession.findOne().sort({ createdAt: -1 });

    if (!qr) {
      return res.status(404).json({ message: "No QR generated yet" });
    }

    const now = moment();
    const today = moment().format("YYYY-MM-DD");
    const qrDate = moment(qr.createdAt).format("YYYY-MM-DD");

  
    if (qrDate !== today && qr.status === "active") {
      qr.status = "expired";
      await qr.save();
    }

   
    if (moment(now).isAfter(qr.endAt) && qr.status === "active") {
      qr.status = "expired";
      await qr.save();
    }

   
    if (qr.status === "active") {
      return res.status(200).json({
        success: true,
        qrImage: qr.qrImage,
        validFrom: moment(qr.startAt).format("hh:mm A"),
        validTill: moment(qr.endAt).format("hh:mm A"),
        status: qr.status,
      });
    } else {
    
      return res.status(200).json({
        success: false,
        message: "No active QR currently",
      });
    }
  } catch (error) {
    console.error("Get Current QR Error:", error);
    res.status(500).json({ message: "Server error fetching QR" });
  }
};
