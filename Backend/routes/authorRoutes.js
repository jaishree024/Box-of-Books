const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getMyBooks,
  addBook,
  editBook,
  removeBook,
} = require("../controllers/authorController");

router.get("/allbooks", protect, getMyBooks);
router.post("/addbook", protect, addBook);
router.put("/books/:id", protect, editBook);
router.delete("/books/:id", protect, removeBook);

module.exports = router;
