import { Link, useNavigate } from "react-router-dom";
import API from "../api/auth";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const token = API.defaults.headers.Authorization;
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("title");

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (!confirmLogout) return;

    delete API.defaults.headers.Authorization;
    navigate("/", { replace: true });
  };
  const handleSearch = () => {
    navigate(`/?${filterType}=${encodeURIComponent(search)}`);
  };
  const handleResetFilters = () => {
    setSearch("");
    setFilterType("title");
    navigate("/");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "15px 30px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <h3>📚 Box of Books</h3>

      <div>
        {!token && (
          <>
            <Link to="/login">
              <button style={{ marginRight: "10px", cursor: "pointer" }}>
                Login
              </button>
            </Link>

            <Link to="/register">
              <button style={{ cursor: "pointer" }}>Register</button>
            </Link>
          </>
        )}

        {token && (
          <button onClick={handleLogout} style={{ cursor: "pointer" }}>
            Logout
          </button>
        )}
      </div>
      {isHome && (
        <div style={{ display: "flex", gap: "10px" }}>
          <select
            style={{ cursor: "pointer" }}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="genre">Genre</option>
            <option value="author">Author</option>
          </select>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button style={{ cursor: "pointer" }} onClick={handleSearch}>
            Search
          </button>

          <button
            style={{ cursor: "pointer", fontSize: "12px", padding: "4px 8px" }}
            onClick={handleResetFilters}
          >
            Reset
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
