const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "box-of-books-frontend.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ ok: true, message: "Backend is running" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/author", require("./routes/authorRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
