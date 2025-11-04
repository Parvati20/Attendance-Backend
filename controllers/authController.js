import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import validator from "validator";

const ADMIN_EMAILS = [
  "parvati23@navgurukul.org",
  "shwetajumde@navgurukul.org",
];

// 🧾 Signup Controller
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ✅ Check all fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // ✅ Only @navgurukul.org emails allowed
    if (!email.endsWith("@navgurukul.org")) {
      return res
        .status(400)
        .json({ message: "Only @navgurukul.org emails are allowed." });
    }

    // ✅ Password validation: must be at least 8 chars & contain at least 1 symbol
    const isStrong = validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 0,
      minSymbols: 1,
    });

    if (!isStrong) {
      return res.status(400).json({
        message:
          "Weak password! It must be at least 8 characters long and include at least one symbol (e.g. @, #, $, %).",
      });
    }

    // ✅ Only specific emails can register as Admin
    if (role === "Admin" && !ADMIN_EMAILS.includes(email)) {
      return res
        .status(403)
        .json({ message: "Only authorized admins can sign up as Admin." });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // ✅ Hash password & save
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "Signup successful! Please login." });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// 🔐 Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // ✅ Check user existence
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // ✅ Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // ✅ Prevent unauthorized admin login
    if (user.role === "Admin" && !ADMIN_EMAILS.includes(email)) {
      return res
        .status(403)
        .json({ message: "Unauthorized admin login attempt." });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );

    res.json({
      message: "Login successful.",
      token,
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};
