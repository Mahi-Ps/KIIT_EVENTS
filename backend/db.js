const Database = require("better-sqlite3");
const path = require("path");

// Store database file in the backend directory
const DB_PATH = path.join(__dirname, "events.db");

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma("journal_mode = WAL");

// Create events table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    venue TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    createdAt TEXT NOT NULL,
    createdBy TEXT NOT NULL DEFAULT ''
  )
`);

// Migration: add createdBy column if table already existed without it
try {
  db.exec(`ALTER TABLE events ADD COLUMN createdBy TEXT NOT NULL DEFAULT ''`);
} catch (e) {
  // Column already exists, ignore
}

// Migration: add image column if table already existed without it
try {
  db.exec(`ALTER TABLE events ADD COLUMN image TEXT NOT NULL DEFAULT ''`);
} catch (e) {
  // Column already exists, ignore
}

// Create registrations table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    eventId INTEGER NOT NULL,
    userEmail TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    UNIQUE(eventId, userEmail),
    FOREIGN KEY (eventId) REFERENCES events(id)
  )
`);

// Create users table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    createdAt TEXT NOT NULL
  )
`);

// Seed a default admin if no users exist
const userCount = db.prepare(`SELECT COUNT(*) as count FROM users`).get();
if (userCount.count === 0) {
  const seedStmt = db.prepare(`
    INSERT INTO users (email, password, role, createdAt) VALUES (@email, @password, @role, @createdAt)
  `);
  const now = new Date().toISOString();
  seedStmt.run({ email: 'admin@kiit.ac.in', password: 'admin123', role: 'admin', createdAt: now });
  seedStmt.run({ email: 'society@kiit.ac.in', password: 'society123', role: 'society', createdAt: now });
  seedStmt.run({ email: 'student@kiit.ac.in', password: 'student123', role: 'student', createdAt: now });
  console.log('Seeded default users');
}

module.exports = db;
