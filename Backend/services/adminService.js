const User = require("../models/userModel");
const Book = require("../models/booksModel");

const getAuthorsService = async (filter) => {
  return User.find(filter).select("-password");
};

const approveAuthorByIdService = async (authorId) => {
  return User.findByIdAndUpdate(
    authorId,
    { status: "active" },
    { new: true }
  ).select("-password");
};

const rejectAuthorByIdService = async (authorId) => {
  return User.findByIdAndUpdate(
    authorId,
    { status: "rejected" },
    { new: true }
  ).select("-password");
};

const deleteAuthorByIdService = async (authorId) => {
  await Book.deleteMany({ author: authorId });
  await User.findByIdAndDelete(authorId);
};

module.exports = {
  getAuthorsService,
  approveAuthorByIdService,
  rejectAuthorByIdService,
  deleteAuthorByIdService,
};
