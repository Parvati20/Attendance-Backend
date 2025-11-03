import Kitchen from "../models/Kitchen.js";
import moment from "moment";

export const markKitchenTurn = async (req, res) => {
  try {
    const studentId = req.user.id;
    const today = moment().format("YYYY-MM-DD");

    const alreadyMarked = await Kitchen.findOne({ studentId, date: today });
    if (alreadyMarked) {
      return res.status(400).json({ message: "Kitchen turn already marked today." });
    }

    const kitchenTurn = new Kitchen({ studentId, date: today });
    await kitchenTurn.save();

    res.status(201).json({ message: "Kitchen turn marked successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
