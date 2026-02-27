const BookCardPublic = ({ book }) => {
  return (
    <div className="book-card">
      <h3>{book.title}</h3>
      <p>{book.description}</p>
      <p>
        <b>Genre:</b> {book.genre}
      </p>
      <p>
        <b>Author:</b> {book.author?.name}
      </p>
    </div>
  );
};

export default BookCardPublic;
