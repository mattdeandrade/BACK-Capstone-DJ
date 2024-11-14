const express = require("express");
const router = express.Router();
module.exports = router;
//Authentication Required import
const { authenticate } = require("./auth/auth");
//Primsa Client import
const prisma = require("../prisma");

// Admin users can access all playlists users create in the database
router.get("/", authenticate, async (req, res, next) => {
  try {
    // Fetch all playlists (no user authentication required)
    const playlists = await prisma.playlist.findMany({
      // We don't filter by userId here, so all playlists will be returned
    });
    if (playlists.length === 0) {
      return res.status(200).json([]); // If no playlists are found, return an empty array
    }
    res.json(playlists); // Return the playlists to the client
  } catch (error) {
    console.error("Error fetching public playlists:", error);
    next(error); // Pass the error to the next middleware
  }
});

// POST request: creates a new playlist assigned to the current userId
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

// Add single or multiple tracks to a specific user-owned playlist
router.patch("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { trackIds } = req.body;

  const playlist = await prisma.playlist.findUnique({ where: { id: +id } });

  try {
    if (playlist.userId !== req.user.id) {
      return next({
        status: 403,
        message: "User does not have access to this playlist.",
      });
    }
<<<<<<< HEAD
    const tracks = trackIds.map((trackId) => ({ id: trackId }));
    const updatedPlaylist = await prisma.playlist.update({
=======

    const tracks = trackIds.map((trackId) => ({ id: +trackId })); //mapping over trackId instead or req param id **

    const playlists = await prisma.playlist.update({
>>>>>>> 9ba0c29d4af05ba84f587476bf196d0766c0d560
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

// This router deletes the specified playlist as long as it is owned by the current user
router.delete("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const playlist = await prisma.playlist.findUnique({ where: { id: +id } });
    if (!playlist || playlist.userId !== req.user.id) {
      return next({
        status: 403,
        message: "You do not have access to this playlist.",
      });
    }
    await prisma.playlist.delete({ where: { id: +id } });
    res.status(204).send(); // No content to send back
  } catch (e) {
    next(e);
  }
});
