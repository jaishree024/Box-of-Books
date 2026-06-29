const Book = require("../models/booksModel");

const tokenize = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const buildContentTokens = (book) => {
  const fields = [
    book.title,
    book.description,
    book.genre,
    ...(book.genres || []),
    book.authorName,
    book.publisher,
    book.language,
  ];

  return tokenize(fields.filter(Boolean).join(" "));
};

const toVector = (tokens) =>
  tokens.reduce((vector, token) => {
    vector[token] = (vector[token] || 0) + 1;
    return vector;
  }, {});

const cosineSimilarity = (left, right) => {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  const rightKeySet = new Set(rightKeys);

  const dotProduct = leftKeys.reduce(
    (sum, key) => sum + (rightKeySet.has(key) ? left[key] * right[key] : 0),
    0
  );

  const leftMagnitude = Math.sqrt(
    leftKeys.reduce((sum, key) => sum + left[key] * left[key], 0)
  );
  const rightMagnitude = Math.sqrt(
    rightKeys.reduce((sum, key) => sum + right[key] * right[key], 0)
  );

  if (!leftMagnitude || !rightMagnitude) {
    return 0;
  }

  return dotProduct / (leftMagnitude * rightMagnitude);
};

const getRecommendationsForBook = async (bookId, limit = 8) => {
  const targetBook = await Book.findOne({ _id: bookId, status: "active" });

  if (!targetBook) {
    return null;
  }

  const targetVector = toVector(buildContentTokens(targetBook));
  const candidateBooks = await Book.find({
    _id: { $ne: targetBook._id },
    status: "active",
  })
    .limit(500)
    .populate("author", "name")
    .populate("authorId", "name");

  return candidateBooks
    .map((book) => ({
      book,
      score: cosineSimilarity(targetVector, toVector(buildContentTokens(book))),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ book }) => book);
};

module.exports = {
  getRecommendationsForBook,
};
