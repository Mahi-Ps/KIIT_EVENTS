const express = require("express");
const router = express.Router();
const {
  CATEGORIES,
  createEvent,
  getAllEvents,
  getEventById,
  updateEventStatus,
  updateEventFields,
  deleteEvent,
} = require("../models/Event");

// POST /api/events — Create a new event
router.post("/", (req, res) => {
  const { title, category, date, venue, description, createdBy, image } = req.body;

  // Validation
  if (!title || !category || !date || !venue || !description || !createdBy) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!CATEGORIES.includes(category)) {
    return res
      .status(400)
      .json({ error: `Category must be one of: ${CATEGORIES.join(", ")}` });
  }

  const event = createEvent({ title, category, date, venue, description, createdBy, image });
  res.status(201).json({ message: "Event created successfully", event });
});

// GET /api/events — Get all events
router.get("/", (req, res) => {
  const events = getAllEvents();
  res.json({ count: events.length, events });
});

// PUT /api/events/:id — Edit an event (fields only, resets status to pending)
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const event = getEventById(id);

  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  const { title, category, date, venue, description, image } = req.body;

  if (!title || !category || !date || !venue || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!CATEGORIES.includes(category)) {
    return res
      .status(400)
      .json({ error: `Category must be one of: ${CATEGORIES.join(", ")}` });
  }

  const updated = updateEventFields(id, { title, category, date, venue, description, image });
  res.json({ message: "Event updated", event: updated });
});

// PUT /api/events/:id/approve — Approve an event
router.put("/:id/approve", (req, res) => {
  const id = parseInt(req.params.id);
  const event = getEventById(id);

  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  const updated = updateEventStatus(id, "approved");
  res.json({ message: "Event approved", event: updated });
});

// PUT /api/events/:id/reject — Reject an event
router.put("/:id/reject", (req, res) => {
  const id = parseInt(req.params.id);
  const event = getEventById(id);

  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  const updated = updateEventStatus(id, "rejected");
  res.json({ message: "Event rejected", event: updated });
});

// DELETE /api/events/:id — Delete an event
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const event = deleteEvent(id);

  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  res.json({ message: "Event deleted", event });
});

module.exports = router;
