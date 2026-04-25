const express = require("express");
const router = express.Router();
const { createUser, validateLogin } = require("../models/User");

// POST /api/auth/login — Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const result = validateLogin(email, password);
  if (result.error) {
    return res.status(401).json({ error: result.error });
  }

  res.json({ message: "Login successful", user: result.user });
});

// POST /api/auth/register — Register a new user
router.post("/register", (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "Email, password, and role are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const result = createUser({ email, password, role });
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  res.status(201).json({ message: "User registered successfully", user: result.user });
});

module.exports = router;
