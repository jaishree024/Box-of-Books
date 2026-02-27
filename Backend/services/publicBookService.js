const Book = require("../models/booksModel");

const getPublicBooks = async (filter) => {
  return Book.find(filter).populate("author", "name");
};

module.exports = { getPublicBooks };
