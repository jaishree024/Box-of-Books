const BookCard = ({ book, onEdit, onDelete }) => {
  return (
    <div className="book-card">
      <h3>{book.title}</h3>
      <p>{book.description}</p>
      <p>
        <b>Genre:</b> {book.genre}
      </p>

      <div className="actions">
        <button style={{ cursor: "pointer" }} onClick={() => onEdit(book)}>
          Edit
        </button>
        <button
          style={{ cursor: "pointer" }}
          onClick={() => onDelete(book._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default BookCard;
