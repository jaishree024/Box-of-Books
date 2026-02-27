const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/userModel");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const deleteAdmin = async () => {
  const result = await User.findOneAndDelete({
    name: "Jaishree Goyal",
    role: "ADMIN",
  });

  if (result) {
    console.log("Admin deleted successfully");
  } else {
    console.log("Admin not found");
  }

  process.exit();
};

deleteAdmin();
