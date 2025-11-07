import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Error:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export const adminOnly = (req, res, next) => {
  try {
    if (req.user && req.user.role === "Admin") {
      next();
    } else {
      res.status(403).json({ message: "Access denied — Admins only" });
    }
  } catch (err) {
    console.error("Admin check error:", err);
    res.status(500).json({ message: "Server error in adminOnly middleware" });
  }
};

// authMiddleware.js



// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const protect = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "No token, authorization denied" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) return res.status(404).json({ message: "User not found" });

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error("Auth Error:", err);
//     res.status(401).json({ message: "Token is not valid" });
//   }
// };

// export const adminOnly = (req, res, next) => {
//   try {
//     if (req.user && req.user.role === "Admin") {
//       next();
//     } else {
//       res.status(403).json({ message: "Access denied — Admins only" });
//     }
//   } catch (err) {
//     console.error("Admin check error:", err);
//     res.status(500).json({ message: "Server error in adminOnly middleware" });
//   }
// };



