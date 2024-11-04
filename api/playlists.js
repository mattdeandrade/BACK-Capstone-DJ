const express = require("express");
const router = express.Router();
module.exports = router;

//Authentication Required import
const { authenticate } = require("./auth/auth");

//Primsa Client import
const prisma = require("../prisma");

// Get all playlists for the logged-in user
router.get("/", authenticate, async (req, res, next) => {
  try {
    const playlists = await prisma.playlist.findMany({
      where: { userId: req.user.id }, // Ensure only the logged-in user's playlists are returned
    });
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

// Edit (add tracks to) a specific playlist
router.patch("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { trackIds } = req.body;
  console.log(req.body);

  try {
    // console.log(tracks);
    const playlist = await prisma.playlist.findUnique({ where: { id: +id } });

    if (!playlist || playlist.userId !== req.user.id) {
      return next({
        status: 403,
        message: "You do not have access to this playlist.",
      });
    }

    const tracks = trackIds.map((trackId) => ({ id: trackId }));

    const updatedPlaylist = await prisma.playlist.update({
      where: {
        id: +id,
      },
      data: {
        tracks: { connect: tracks },
      },
      include: { tracks: true },
    });

    res.json(updatedPlaylist);
  } catch (e) {
    next(e);
  }
});

// Delete a playlist
router.delete("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;

  try {
    const playlist = await prisma.playlist.findUnique({ where: { id: +id } });

    if (!playlist || playlist.userId !== req.user.id) {
      return next({ status: 403, message: "You do not have access to this playlist." });
    }

    await prisma.playlist.delete({ where: { id: +id } });
    res.status(204).send(); // No content to send back
  } catch (e) {
    next(e);
  }
});


// Play a playlist
router.post("/play/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const playlist = await prisma.playlist.findUnique({
      where: { id: +id },
      include: { tracks: true },
    });

    if (!playlist) {
      return next({ status: 404, message: "Playlist not found." });
    }

    // Logic for playing the playlist (e.g., return playlist data)
    res.json({ message: "Playing playlist.", playlist });
  } catch (error) {
    next(error);
  }
});


// Share a playlist
router.post("/share/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const playlist = await prisma.playlist.findUnique({
      where: { id: +id },
      include: { tracks: true },
    });

    if (!playlist) {
      return next({ status: 404, message: "Playlist not found." });
    }

    // Implement your sharing logic here, e.g., creating a shareable link
    res.json({ message: "Playlist shared successfully!", playlist });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
