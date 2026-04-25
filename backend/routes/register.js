const express = require("express");
const router = express.Router();
const { registerForEvent, getRegistrationsByEmail } = require("../models/Registration");
const { getEventById } = require("../models/Event");

// POST /api/register — Register for an event
router.post("/", (req, res) => {
  const { eventId, userEmail } = req.body;

  if (!eventId || !userEmail) {
    return res.status(400).json({ error: "eventId and userEmail are required" });
  }

  // Check that the event exists and is approved
  const event = getEventById(eventId);
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }
  if (event.status !== "approved") {
    return res.status(400).json({ error: "Can only register for approved events" });
  }

  const result = registerForEvent(eventId, userEmail);
  if (result.duplicate) {
    return res.status(409).json({ error: "Already registered for this event" });
  }

  res.status(201).json({ message: "Registered successfully", registration: result });
});

// GET /api/register/:email — Get all registrations for a user
router.get("/:email", (req, res) => {
  const { email } = req.params;
  const registrations = getRegistrationsByEmail(email);
  res.json({ count: registrations.length, registrations });
});

module.exports = router;
