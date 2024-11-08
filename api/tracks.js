const express = require("express");
const router = express.Router();
module.exports = router;

// For handling audio file uploads
// multer: Middleware for handling multipart/form-data, which is commonly used for file uploads.
const multer = require("multer");

// Require Upload audio file function import
const { audiofileUpload } = require("./multer"); 



//Authentication Required import
const { authenticate } = require("./auth/auth");
//Primsa Client import
const prisma = require("../prisma");

//All Tracks can only be accessed by developrs and admin.
// Create admin soon!
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

// Tracks are assigned to user. Login required.
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

// POST Tracks from seed.
router.post("/", audiofileUpload.single("mp3"),authenticate, async (req, res, next) => {
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
    // Return success response with file metadata
    res.status(201).json({
      message: "MP3 uploaded successfully!",
      file: newTrack,
    });
  } catch (e) {
    next(e);
  }
});


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
