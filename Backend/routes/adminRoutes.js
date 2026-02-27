const express = require("express");
const router = express.Router();

const {
  getAuthors,
  approveAuthor,
  rejectAuthor,
  deleteAuthor,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/authors", protect, adminOnly, getAuthors);
router.put("/authors/:id/approve", protect, adminOnly, approveAuthor);
router.put("/authors/:id/reject", protect, adminOnly, rejectAuthor);
router.delete("/authors/:id", protect, adminOnly, deleteAuthor);

module.exports = router;
