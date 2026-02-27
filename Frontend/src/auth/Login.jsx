import { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import API from "../api/auth";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(form);
      const token = res.data.token;

      // ✅ Set token in memory AFTER login
      API.defaults.headers.Authorization = `Bearer ${token}`;

      // Try admin route
      try {
        await API.get("/admin/authors");
        navigate("/admin");
        return;
      } catch {}

      // Try author route
      try {
        await API.get("/author/allbooks");
        navigate("/author");
        return;
      } catch (authorErr) {
        const msg = authorErr.response?.data?.message;
        setError(msg || "Access denied");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Login</h2>

        <button onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          Back to Home
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button style={{ cursor: "pointer" }} type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
