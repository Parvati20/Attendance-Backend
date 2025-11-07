import Tracking from "../models/Tracking.js";
import User from "../models/User.js";
import moment from "moment";

export const addTracking = async (req, res) => {
  try {
    const studentId = req.user.id;
    
   
    const { fullName, email, date, studentType } = req.body; 
    const uploadedFile = req.file; 

    if (!date || !studentType || !fullName || !email) {
      return res.status(400).json({ message: "All required fields are missing." });
    }

    const user = await User.findById(studentId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    
    
    let documentUrl = '';
    if (uploadedFile) {
      
      
        documentUrl = uploadedFile.originalname;
    }

    const formattedDate = moment(date).format("YYYY-MM-DD");

    const tracking = new Tracking({
      studentId,
      name: fullName, 
      email: email,
      date: formattedDate,
      status: studentType, 
      document: documentUrl, 
    });

    await tracking.save();

    res.status(201).json({
      message: "Student lifecycle entry added successfully!",
      tracking,
    });
  } catch (error) {
    console.error("Error adding tracking entry:", error);
    res.status(500).json({ message: "Server error during file/tracking submission." });
  }
};