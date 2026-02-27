const Book = require("../models/booksModel");

const getBooksByAuthor = async (authorId) => {
  return Book.find({
    author: authorId,
    status: "active",
  }).populate("author", "name");
};

const createBook = async (data, authorId) => {
  const existingBook = await Book.findOne({
    title: data.title,
    author: authorId,
    status: "active",
  });

  if (existingBook) {
    const error = new Error("This book already exists");
    error.statusCode = 400;
    throw error;
  }

  return Book.create({ ...data, author: authorId });
};

const updateBook = async (bookId, authorId, data) => {
  return Book.findOneAndUpdate({ _id: bookId, author: authorId }, data, {
    new: true,
  });
};

const deleteBook = async (bookId, authorId) => {
  return Book.findOneAndDelete({
    _id: bookId,
    author: authorId,
  });
};

module.exports = {
  getBooksByAuthor,
  createBook,
  updateBook,
  deleteBook,
};
