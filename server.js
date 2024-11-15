// Import Enviroment
require("dotenv").config();

// Define Express App
const express = require("express");
const app = express();
const PORT = 3000;
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cors = require("cors");

// Logging middleware
app.use(morgan("dev"));

// Connects frontend and backend
app.use(cors({ origin: "https://resonant-creponne-9c1895.netlify.app" }));

// Define the rate limiter
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 10000, // Limit each IP to 10,000 requests per windowMs
  message: "Rate limit exceeded. Try again after an hour.",
  standardHeaders: true, // Sends rate limit info in headers
  legacyHeaders: false, // Disables `X-RateLimit-*` headers
});

// Applies rate limiter to all api routes
app.use("/api", limiter);

// JSON Parsing
app.use(express.json());

// API routes
app.use(require("./api/auth/auth.js").router);
app.use("/tracks", require("./api/tracks"));
app.use("/edits", require("./api/edits"));
app.use("/playlists", require("./api/playlists"));
app.use("/uploads", require("./api/uploads.js"));
app.use("/users", require("./api/users.js"));

// 404
app.use((req, res, next) => {
  next({ status: 404, message: "Endpoint not found." });
});

// Error-handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.send(err.message ?? "Sorry, something went wrong :(");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
