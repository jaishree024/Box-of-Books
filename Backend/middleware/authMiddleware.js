const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 🔒 NEW LOGIC: block unapproved authors
    if (user.role === "AUTHOR" && user.status !== "active") {
      return res.status(403).json({
        message: "Your account is pending admin approval",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

module.exports = { protect, adminOnly };
