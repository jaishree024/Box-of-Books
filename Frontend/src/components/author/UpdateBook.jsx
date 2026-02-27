import { useState, useEffect } from "react";

const UpdateBook = ({ book, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    genre: "",
  });

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title,
        description: book.description,
        genre: book.genre,
      });
    }
  }, [book]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(form);
  };

  if (!book) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Book</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />

          <input
            name="genre"
            value={form.genre}
            onChange={handleChange}
            required
          />

          <div className="modal-actions">
            <button type="submit">Update</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBook;
