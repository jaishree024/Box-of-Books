import { useEffect, useState } from "react";
import { getMyBooks, addBook, editBook, deleteBook } from "../../api/author";

import Navbar from "../../components/Navbar";
import BookCard from "../../components/author/BookCard";
import AddBookForm from "../../components/author/AddBookForm";
import UpdateBook from "../../components/author/UpdateBook";

const AuthorDashboard = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    const res = await getMyBooks();
    setBooks(res.data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAdd = async (data) => {
    try {
      setError("");
      await addBook(data);
      fetchBooks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add book");
    }
  };

  const handleUpdate = async (data) => {
    if (!editingBook) return; // ✅ prevent crash

    await editBook(editingBook._id, data);
    setEditingBook(null);
    fetchBooks();
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) return;

    await deleteBook(id);
    fetchBooks();
  };

  return (
    <>
      <Navbar />
      <div className="author-dashboard">
        <h1>My Books 📚</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <AddBookForm onSubmit={handleAdd} />

        <UpdateBook
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onUpdate={handleUpdate}
        />

        <div className="books-grid">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onEdit={setEditingBook}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default AuthorDashboard;
