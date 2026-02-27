const authorBookService = require("../services/authorBookService");

const getMyBooks = async (req, res) => {
  try {
    const books = await authorBookService.getBooksByAuthor(req.user._id);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
};

const addBook = async (req, res) => {
  try {
    const book = await authorBookService.createBook(req.body, req.user._id);
    res.json(book);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Failed to add book",
    });
  }
};

const editBook = async (req, res) => {
  const book = await authorBookService.updateBook(
    req.params.id,
    req.user._id,
    req.body
  );
  res.json(book);
};

const removeBook = async (req, res) => {
  const deletedBook = await authorBookService.deleteBook(
    req.params.id,
    req.user._id
  );

  if (!deletedBook) {
    return res.status(404).json({
      message: "Book not found or not authorized",
    });
  }

  res.json({ message: "Book deleted successfully" });
};

module.exports = { addBook, editBook, removeBook, getMyBooks };
