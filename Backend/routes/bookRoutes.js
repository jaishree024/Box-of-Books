const router = require("express").Router();
const { getBooks } = require("../controllers/bookController");

router.get("/", getBooks);

module.exports = router;
