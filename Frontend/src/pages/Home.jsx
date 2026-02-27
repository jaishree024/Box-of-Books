import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAllBooks } from "../api/books";
import BookCardPublic from "../components/BookCardPublic";
import { useLocation } from "react-router-dom";

const Home = () => {
  const [books, setBooks] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchBooks = async () => {
      const params = Object.fromEntries(new URLSearchParams(location.search));

      const res = await getAllBooks(params);
      setBooks(res.data);
    };

    fetchBooks();
  }, [location.search]);

  return (
    <>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          Welcome to Box of Books 📚
        </h1>

        <div className="books-grid">
          {books.map((book) => (
            <BookCardPublic key={book._id} book={book} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
