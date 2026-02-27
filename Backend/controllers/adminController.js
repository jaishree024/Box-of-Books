const {
  getAuthorsService,
  approveAuthorByIdService,
  rejectAuthorByIdService,
  deleteAuthorByIdService,
} = require("../services/adminService");

const getAuthors = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { role: "AUTHOR" };

    if (status) filter.status = status;

    const authors = await getAuthorsService(filter);
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch authors" });
  }
};

const approveAuthor = async (req, res) => {
  try {
    const author = await approveAuthorByIdService(req.params.id);
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: "Failed to approve author" });
  }
};

const rejectAuthor = async (req, res) => {
  try {
    const author = await rejectAuthorByIdService(req.params.id);
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: "Failed to reject author" });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    await deleteAuthorByIdService(req.params.id);
    res.status(200).json({ message: "Author deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete author" });
  }
};

module.exports = {
  getAuthors,
  approveAuthor,
  rejectAuthor,
  deleteAuthor,
};
