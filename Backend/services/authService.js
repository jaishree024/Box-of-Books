const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const registerAuthor = async (data) => {
  const hashed = await bcrypt.hash(data.password, 10);

  return User.create({
    name: data.name,
    email: data.email,
    password: hashed,
    role: "AUTHOR", // 🔒 FORCE
    status: "pending", // 🔒 FORCE
  });
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) return null;

  if (user.status !== "active") {
    throw new Error("Account not approved");
  }

  const match = await bcrypt.compare(password, user.password);
  return match ? user : null;
};

module.exports = { registerAuthor, loginUser };
