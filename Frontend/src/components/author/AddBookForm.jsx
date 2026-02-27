import { useState } from "react";

const AddBookForm = ({ onSubmit, initialData }) => {
  const [form, setForm] = useState(
    initialData || {
      title: "",
      description: "",
      genre: "",
    }
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="add-book" onSubmit={handleSubmit}>
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      />

      <input
        name="genre"
        placeholder="Genre"
        value={form.genre}
        onChange={handleChange}
        required
      />

      <button type="submit" style={{ cursor: "pointer" }}>
        {initialData ? "Update Book" : "Add Book"}
      </button>
    </form>
  );
};

export default AddBookForm;
