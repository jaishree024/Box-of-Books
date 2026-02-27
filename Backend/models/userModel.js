const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,

    role: {
      type: String,
      enum: ["AUTHOR", "ADMIN"],
      default: "AUTHOR",
    },

    status: {
      type: String,
      enum: ["pending", "active", "rejected"],
      default: "pending", // 👈 KEY CHANGE
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
