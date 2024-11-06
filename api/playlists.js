const express = require("express");
const router = express.Router();
module.exports = router;
//Authentication Required import
const { authenticate } = require("./auth/auth");
//Primsa Client import
const prisma = require("../prisma");
// GET all playlists for the public (unauthenticated)
router.get("/", async (req, res, next) => {
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
router.patch("/", authenticate, async (req, res, next) => {
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
// // Share a playlist
// router.post("/share/:id", authenticate, async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     const playlist = await prisma.playlist.findUnique({
//       where: { id: +id },
//       include: { tracks: true },
//     });
//     if (!playlist) {
//       return next({ status: 404, message: "Playlist not found." });
//     }
//     // Implement your sharing logic here, e.g., creating a shareable link
//     res.json({ message: "Playlist shared successfully!", playlist });
//   } catch (error) {
//     next(error);
//   }
// });
module.exports = router;
