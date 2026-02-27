const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    genre: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //user already stored in mongoose models
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);

//author only stores object id...i.e. author id
