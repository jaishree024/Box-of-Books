const User = require("../models/userModel");
const Book = require("../models/booksModel");

const getAuthorsService = async ({ filter, page, pageSize }) => {
  const skip = (page - 1) * pageSize;

  const [authors, totalItems] = await Promise.all([
    User.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(pageSize),
    User.countDocuments(filter),
  ]);

  return {
    authors,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    },
  };
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
