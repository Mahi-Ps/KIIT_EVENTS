const db = require("../db");

// Prepared statements
const insertStmt = db.prepare(`
  INSERT INTO registrations (eventId, userEmail, createdAt)
  VALUES (@eventId, @userEmail, @createdAt)
`);

const selectByEmailStmt = db.prepare(`
  SELECT r.id, r.eventId, r.userEmail, r.createdAt,
         e.title, e.category, e.date, e.venue, e.description, e.status
  FROM registrations r
  JOIN events e ON r.eventId = e.id
  WHERE r.userEmail = ?
  ORDER BY r.id DESC
`);

const checkExistsStmt = db.prepare(`
  SELECT id FROM registrations WHERE eventId = ? AND userEmail = ?
`);

// Register a student for an event
function registerForEvent(eventId, userEmail) {
  const existing = checkExistsStmt.get(eventId, userEmail);
  if (existing) return { duplicate: true };

  const createdAt = new Date().toISOString();
  const info = insertStmt.run({ eventId, userEmail, createdAt });
  return { id: info.lastInsertRowid, eventId, userEmail, createdAt };
}

// Get all registrations for a user (with event details)
function getRegistrationsByEmail(userEmail) {
  return selectByEmailStmt.all(userEmail);
}

module.exports = {
  registerForEvent,
  getRegistrationsByEmail,
};
