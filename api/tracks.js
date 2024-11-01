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
  const { name, description, trackIds } = req.body;
  try {
    const tracks = trackIds.map((id) => ({ id }));
    const playlist = await prisma.playlist.create({
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
        playlist: { connect: playlist },
      },
    });
    res.status(201).json(playlist);
  } catch (e) {
    next(e);
  }
});
