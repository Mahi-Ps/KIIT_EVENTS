const db = require("../db");

const ROLES = ["student", "admin", "society"];

// Prepared statements
const insertStmt = db.prepare(`
  INSERT INTO users (email, password, role, createdAt)
  VALUES (@email, @password, @role, @createdAt)
`);

const findByEmailStmt = db.prepare(`SELECT * FROM users WHERE email = ?`);

// Register a new user
function createUser({ email, password, role }) {
  if (!ROLES.includes(role)) return { error: "Invalid role" };

  const existing = findByEmailStmt.get(email);
  if (existing) return { error: "Email already registered" };

  const createdAt = new Date().toISOString();
  const info = insertStmt.run({ email, password, role, createdAt });
  return { user: { id: info.lastInsertRowid, email, role, createdAt } };
}

// Find user by email
function findUserByEmail(email) {
  return findByEmailStmt.get(email) || null;
}

// Validate login credentials
function validateLogin(email, password) {
  const user = findByEmailStmt.get(email);
  if (!user) return { error: "User not found" };
  if (user.password !== password) return { error: "Incorrect password" };
  return { user: { id: user.id, email: user.email, role: user.role } };
}

module.exports = {
  ROLES,
  createUser,
  findUserByEmail,
  validateLogin,
};
