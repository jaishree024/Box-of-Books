const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/userModel");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const createAdmin = async () => {
  const adminExists = await User.findOne({ role: "ADMIN" });

  if (adminExists) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("jgoyal123", 10);

  await User.create({
    name: "Jaishree Goyal",
    email: "jgoyal@boxofbooks.com",
    password: hashedPassword,
    role: "ADMIN",
    status: "active",
  });

  console.log("Admin created successfully");
  process.exit();
};

createAdmin();
