const express = require("express");
const router = express.Router();
module.exports = router;

//Authentication Required import
const { authenticate } = require("./auth/auth");
//Primsa Client import
const prisma = require("../prisma");

//All Tracks can only be accessed by developrs and admin.
// Create admin soon!
router.get("/", authenticate, async (req, res, next) => {
  try {
    const tracks = await prisma.track.findMany();
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
    res.json(track);
  } catch (e) {
    next(e);
  }
});

// POST Tracks
router.post("/", authenticate, async (req, res, next) => {
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
  console.log(req.body);
  try {
    const track = await prisma.track.create({
      data: {
        trackName,
        artistName,
        bitrate,
        bpm,
        genre,
        instrumental,
        vocals,
        duration,
        userId: req.user.id,
        playlistId,
      },
    });
    res.status(201).json(track);
  } catch (e) {
    next(e);
  }
});
