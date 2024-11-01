const express = require("express");
const router = express.Router();
module.exports = router;

//Authentication Required import
const { authenticate } = require("./auth/auth");

//Primsa Client import
const prisma = require("../prisma");
const { connect } = require("./tracks");

router.get("/", async (req, res, next) => {
  try {
    const playlists = await prisma.track.findMany();
    res.json(playlists);
  } catch (e) {
    next(e);
  }
});

//Post a new playlist
router.post("/", authenticate, async (req, res, next) => {
  const { name, description, trackIds } = req.body;
  try {
    const tracks = trackIds.map((id) => ({ id }));
    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        userId: req.user.id,
        tracks: { connect: tracks },
      },
      include: { tracks: true },
    });
    res.status(201).json(playlist);
  } catch (e) {
    next(e);
  }
});
