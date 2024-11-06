// Import Enviroment
require("dotenv").config();

// Define Express App
const express = require("express");
const app = express();
const PORT = 3000;
const rateLimit = require("express-rate-limit");

const morgan = require("morgan");

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});
app.use(morgan("dev"));

// Define the rate limiter
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 10000, // Limit each IP to 10,000 requests per windowMs
  message: "Rate limit exceeded. Try again after an hour.",
  standardHeaders: true, // Sends rate limit info in headers
  legacyHeaders: false, // Disables `X-RateLimit-*` headers
});

app.use("/api", limiter);

// JSON Parsing
app.use(express.json());

app.use(require("./api/auth/auth.js").router);
app.use("/tracks", require("./api/tracks"));
app.use("/edits", require("./api/edits"));
app.use("/playlists", require("./api/playlists"));
app.use("/uploads", require("./api/uploads.js"));
app.use("/users", require("./api/users.js"));

/// Need to connect mp3 files on repo to send upload requests ???
// require ("./mp3") add to app.use/uploads

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
