const express = require("express");
const router = express.Router();
module.exports = router;

// Require Upload audio file function import
const { audiofileUpload } = require("./multer");

//Authentication Required import
const { authenticate } = require("./auth/auth");
//Primsa Client import
const prisma = require("../prisma");

// Admin users can access all tracks users have in the database
router.get("/", authenticate, async (req, res, next) => {
  try {
    const tracks = await prisma.track.findMany();

    if (req.user.admin === false) {
      next({ status: 403, message: "You do not authorized access." });
    }

    res.json(tracks);
  } catch (e) {
    next(e);
  }
});

// Users can get info for a specific track (trackId) as long as they are the owner
router.get("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const includePlaylists = req.user
    ? { where: { ownerId: req.user.id } }
    : false;
  try {
    const track = await prisma.track.findUniqueOrThrow({
      where: { id: +id },
    });
    if (track.userId !== req.user.id) {
      return null;
    }
    res.json(track);
  } catch (e) {
    next(e);
  }
});

// POST request: Users can upload a new track to the database and it will be owned by them.
// This uses multer to store the new audio file uploaded by the user.
router.post(
  "/",
  audiofileUpload.single("mp3"),
  authenticate,
  async (req, res, next) => {
    const file = req.file;

    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    const {
      trackName,
      artistName,
      bitrate,
      bpm,
      genre,
      instrumental,
      vocals,
      duration,
      playlistId,
    } = req.body;
    try {
      const newTrack = await prisma.track.create({
        data: {
          trackName: file.originalname,
          artistName,
          bitrate,
          bpm,
          genre,
          instrumental,
          vocals,
          duration,
          userId: req.user.id,
          playlistId,
          audioDataUrl: file.path,
        },
      });
      // Return successful response with file metadata
      res.status(201).json({
        message: "MP3 uploaded successfully!",
        file: newTrack,
      });
    } catch (e) {
      next(e);
    }
  }
);

// Users can delete a specific track as long as they are the owner
router.delete("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;

  try {
    const track = await prisma.track.findUnique({ where: { id: +id } });

    if (req.user.id !== track.userId) {
      return next({
        status: 403,
        message: "You do not have access to this.",
      });
    }
    await prisma.track.delete({ where: { id: +id } });
    res.status(204).send(); // No content to send back
  } catch (e) {
    next(e);
  }
});
