const db = require("../db");

// Valid enums
const CATEGORIES = ["Technical", "Cultural", "Sports", "Workshop", "Seminar"];
const STATUSES = ["pending", "approved", "rejected"];

// Prepared statements for performance
const insertStmt = db.prepare(`
  INSERT INTO events (title, category, date, venue, description, status, createdAt, createdBy, image)
  VALUES (@title, @category, @date, @venue, @description, @status, @createdAt, @createdBy, @image)
`);

const selectAllStmt = db.prepare(`
  SELECT e.*, COUNT(r.id) AS registrationCount
  FROM events e
  LEFT JOIN registrations r ON r.eventId = e.id
  GROUP BY e.id
  ORDER BY e.id DESC
`);

const selectByIdStmt = db.prepare(`
  SELECT e.*, COUNT(r.id) AS registrationCount
  FROM events e
  LEFT JOIN registrations r ON r.eventId = e.id
  WHERE e.id = ?
  GROUP BY e.id
`);

const updateStatusStmt = db.prepare(`UPDATE events SET status = @status WHERE id = @id`);

const updateFieldsStmt = db.prepare(`
  UPDATE events SET title = @title, category = @category, date = @date,
  venue = @venue, description = @description, image = @image, status = 'pending'
  WHERE id = @id
`);

const deleteStmt = db.prepare(`DELETE FROM events WHERE id = ?`);

// Create a new event
function createEvent({ title, category, date, venue, description, createdBy, image }) {
  const createdAt = new Date().toISOString();
  const info = insertStmt.run({
    title,
    category,
    date,
    venue,
    description,
    status: "pending",
    createdAt,
    createdBy: createdBy || "",
    image: image || "",
  });
  return {
    id: info.lastInsertRowid,
    title,
    category,
    date,
    venue,
    description,
    status: "pending",
    createdAt,
    createdBy: createdBy || "",
    image: image || "",
    registrationCount: 0,
  };
}

// Get all events
function getAllEvents() {
  return selectAllStmt.all();
}

// Get event by ID
function getEventById(id) {
  return selectByIdStmt.get(id) || null;
}

// Update event status (for approve/reject)
function updateEventStatus(id, status) {
  updateStatusStmt.run({ status, id });
  return getEventById(id);
}

// Update event fields (for edit — resets status to pending)
function updateEventFields(id, { title, category, date, venue, description, image }) {
  updateFieldsStmt.run({ title, category, date, venue, description, image: image || "", id });
  return getEventById(id);
}

// Delete an event
function deleteEvent(id) {
  const event = getEventById(id);
  if (!event) return null;
  deleteStmt.run(id);
  return event;
}

module.exports = {
  CATEGORIES,
  STATUSES,
  createEvent,
  getAllEvents,
  getEventById,
  updateEventStatus,
  updateEventFields,
  deleteEvent,
};
