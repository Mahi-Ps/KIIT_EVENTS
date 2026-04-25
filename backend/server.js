const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API Running");
});

// Event APIs
const eventRoutes = require("./routes/events");
app.use("/api/events", eventRoutes);

// Registration APIs
const registerRoutes = require("./routes/register");
app.use("/api/register", registerRoutes);

// Auth APIs
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
