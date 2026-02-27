const generateToken = require("../utils/generateToken");
const { registerAuthor, loginUser } = require("../services/authService");

const register = async (req, res) => {
  const user = await registerAuthor(req.body);
  res.status(201).json({ message: "Registration successful. Await approval." });
};

const login = async (req, res) => {
  try {
    const user = await loginUser(req.body.email, req.body.password);

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      token: generateToken(user._id),
      role: user.role,
    });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

module.exports = { register, login };
