const express = require("express");
const router = express.Router();
module.exports = router;

//Authentication Required import
const { authenticate } = require("./auth/auth");

//Primsa Client import
const prisma = require("../prisma");
//get all routes for a single user
router.get("/", authenticate, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();

    if (req.user.admin === false) {
      next({ status: 403, message: "You do not have authorized access" });
    }

    res.json(users);
  } catch (error) {
    next(error);
  }
});
//UPDATED BY MATT
router.get("/tracks", authenticate, async (req, res, next) => {
  const user = req.user;
  try {
    const userTracks = await prisma.track.findMany({
      where: { userId: user.id },
    });
    res.json(userTracks);
  } catch (error) {
    next(error);
  }
});
//UPDATED BY MATT
router.get("/playlists", authenticate, async (req, res, next) => {
  const user = req.user;

  try {
    const userPlaylists = await prisma.playlist.findMany({
      where: { userId: user.id },
    });
    res.json(userPlaylists);
  } catch (error) {
    next(error);
  }
});
//UPDATED BY MATT
router.get("/edits", authenticate, async (req, res, next) => {
  const user = req.user;

  try {
    const userEdits = await prisma.edit.findMany({
      where: { userId: user.id },
    });

    res.json(userEdits);
  } catch (error) {
    next(error);
  }
});
// UPDATED BY MATT
router.get("/uploads", authenticate, async (req, res, next) => {
  const user = req.user;

  try {
    const userUploads = await prisma.upload.findMany({
      where: { userId: user.id },
    });

    res.json(userUploads);
  } catch (error) {
    next(error);
  }
});

//getbyid routes for a single user
//UPDATED BY MATT
router.get("/tracks/:trackId", authenticate, async (req, res, next) => {
  const user = req.user;
  const { trackId } = req.params;

  try {
    const userTrack = await prisma.track.findUniqueOrThrow({
      where: { id: +trackId },
    });

    if (user.id !== userTrack.userId) {
      next({
        status: 403,
        message: "User does not own this track.",
      });
    }

    res.json(userTrack);
  } catch (error) {
    next(error);
  }
});
//UPDATED BY MATT
router.get("/playlists/:playlistId", authenticate, async (req, res, next) => {
  const user = req.user;
  const { playlistId } = req.params;

  try {
    const userPlaylist = await prisma.playlist.findUniqueOrThrow({
      where: { id: +playlistId },
      include: { tracks: true },
    });

    if (user.id !== userPlaylist.userId) {
      next({
        status: 403,
        message: "User does not own this playlist.",
      });
    }

    res.json(userPlaylist);
  } catch (error) {
    next(error);
  }
});
//UPDATED BY MATT
router.get("/edits/:editId", authenticate, async (req, res, next) => {
  const user = req.user;
  const { editId } = req.params;

  try {
    const userEdit = await prisma.edit.findUniqueOrThrow({
      where: { id: +editId },
    });

    if (user.id !== userEdit.userId) {
      next({
        status: 403,
        message: "User does not own this Edit.",
      });
    }

    res.json(userEdit);
  } catch (error) {
    next(error);
  }
});
//UPDATED BY MATT
router.get("/uploads/:uploadId", authenticate, async (req, res, next) => {
  const user = req.user;
  const { uploadId } = req.params;

  try {
    const userUpload = await prisma.upload.findUniqueOrThrow({
      where: { id: +uploadId },
    });

    if (user.id !== userUpload.userId) {
      next({
        status: 403,
        message: "User does not own this.",
      });
    }

    res.json(userUpload);
  } catch (error) {
    next(error);
  }
});
