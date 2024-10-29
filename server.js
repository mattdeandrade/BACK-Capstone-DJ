const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/edits", require("./api/edits"));
app.use("/playlists", require("./api/playlists"));
app.use("/tracks", require("./api/tracks"));
app.use("/uploads", require("./api/uploads.js"));
app.use("/users", require("./api/users.js"));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// 404
app.use((req, res, next) => {
  next({ status: 404, message: "Endpoint not found." });
});

// Error-handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Sorry, something went wrong :(");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
