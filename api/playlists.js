const express = require("express");
const router = express.Router();
module.exports = router;

//Authentication Required import
const { authenticate } = require("./auth/auth");

//Primsa Client import
const prisma = require("../prisma");
const { connect } = require("./tracks");

router.get("/", authenticate, async (req, res, next) => {
  try {
    const playlists = await prisma.playlist.findMany();

    if (req.user.admin === false) {
      // Add admin bolean to user model
      next({ status: 403, message: "You do not have authorized access." });
    }
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
    if (playlist.userId !== req.user.id) {
      next({ status: 403, message: "You do not own this playlist." });
    }
    res.status(201).json(playlist);
  } catch (e) {
    next(e);
  }
});

// Add single or multiple tracks to a user-owned playlist
router.patch("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { trackIds } = req.body;
  console.log(req.body);

  // if (track.userId !== req.user.id) {
  //   return null;
  // }

  try {
    const tracks = trackIds.map((id) => ({ id }));
    // console.log(tracks);
    const playlists = await prisma.playlist.update({
      where: {
        id: +id,
      },
      data: {
        tracks: { connect: tracks },
      },
      include: { tracks: true },
    });
    res.json(playlists);
  } catch (error) {
    next(error);
  }
});
