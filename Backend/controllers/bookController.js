const User = require("../models/userModel");
const publicBookService = require("../services/publicBookService");

const getBooks = async (req, res) => {
  try {
    const { title, genre, author } = req.query;
    const filter = { status: "active" };

    if (title?.trim()) {
      filter.title = new RegExp(title.trim(), "i");
    }

    if (genre?.trim()) {
      filter.genre = { $regex: genre.trim(), $options: "i" };
    }

    if (author?.trim()) {
      const authors = await User.find({
        name: { $regex: author.trim(), $options: "i" },
        role: "AUTHOR",
      }).select("_id");

      if (authors.length === 0) {
        return res.json([]); // ✅ no matching authors → return empty
      }

      filter.author = { $in: authors.map((a) => a._id) };
    }
    console.log("FILTER:", filter);

    const books = await publicBookService.getPublicBooks(filter);

    res.json(books);
  } catch (err) {
    console.error("BOOK FILTER ERROR:", err);
    res.status(500).json({ message: "Failed to fetch books" });
  }
};

module.exports = { getBooks };
