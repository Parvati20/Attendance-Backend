import Kitchen from "../models/Kitchen.js";

export const markKitchenTurn = async (req, res) => {
  try {
    const studentId = req.user?._id;
    const { name, email, date } = req.body;

    if (!name || !email || !date) {
      return res.status(400).json({ message: "All fields are required." });
    }

 
    const alreadyMarked = await Kitchen.findOne({ email, date });
    if (alreadyMarked) {
      return res.status(400).json({
        message: "You have already marked your kitchen turn for this date.",
      });
    }

    

 
    const kitchenTurn = new Kitchen({
      studentId,
      name,
      email,
      date,
    });

    await kitchenTurn.save();
    res.status(201).json({ message: " Kitchen turn marked successfully!" });
  } catch (error) {
    console.error("Error in markKitchenTurn:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};
