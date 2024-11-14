const express = require("express");
const router = express.Router();
module.exports = router;

//Authentication Required import
const { authenticate } = require("./auth/auth");

//Primsa Client import
const prisma = require("../prisma");

// Admin can get a list of all users
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

// Get all account info for the signed-in user
router.get("/myprofile", authenticate, async (req, res, next) => {
  const user = req.user;
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: +user.id },
    });

    if (req.user.id !== user.id) {
      next({ status: 403, message: "You are not the authorized user." });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// Get all of the signed-in user's tracks
router.get("/tracks", authenticate, async (req, res, next) => {
  const user = req.user;

  try {
    const userTracks = await prisma.track.findMany({
      where: { userId: +user.id },
    });

    res.json(userTracks);
  } catch (error) {
    next(error);
  }
});

// Get all of the signed-in user's playlists
router.get("/playlists", authenticate, async (req, res, next) => {
  const user = req.user;

  try {
    const userPlaylists = await prisma.playlist.findMany({
      where: { userId: +user.id },
      include: { tracks: true, user: true },
    });
    res.json(userPlaylists);
  } catch (error) {
    next(error);
  }
});

// Get all of the signed-in user's edits
router.get("/:id/edits", authenticate, async (req, res, next) => {
  const { id } = req.params;

  try {
    const userEdits = await prisma.edit.findMany({
      where: { userId: user.id },
    });

    res.json(userEdits);
  } catch (error) {
    next(error);
  }
});

// Get all of the signed in user's uploads
router.get("/:id/uploads", authenticate, async (req, res, next) => {
  const { id } = req.params;

  try {
    const userUploads = await prisma.upload.findMany({
      where: { userId: user.id },
    });

    res.json(userUploads);
  } catch (error) {
    next(error);
  }
});

/** GETBYID ROUTES FOR A SINGLE USER */

// Get a specific track owned by the signed-in user
router.get("/:id/tracks/:trackId", authenticate, async (req, res, next) => {
  const { id, trackId } = req.params;

  if (req.user.id !== +id) {
    next({
      status: 403,
      message: "You do not have access to these tracks.",
    });
  }
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: +id },
    });

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

// Get a specific playlist owned by the signed-in user
router.get(
  "/:id/playlists/:playlistId",
  authenticate,
  async (req, res, next) => {
    const { id, playlistId } = req.params;

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
  }
);

// Gets a specific edit owned by the signed-in user
router.get("/:id/edits/:editId", authenticate, async (req, res, next) => {
  const { id, editId } = req.params;

  if (req.user.id !== +id) {
    next({
      status: 403,
      message: "You do not have access to these edits.",
    });
  }
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: +id },
    });

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

// Gets a specific upload owned by the signed in user
router.get("/:id/uploads/:uploadId", authenticate, async (req, res, next) => {
  const { id, uploadId } = req.params;

  if (req.user.id !== +id) {
    next({
      status: 403,
      message: "You do not have access to these uploads.",
    });
  }
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: +id },
    });

    const userUpload = await prisma.upload.findUniqueOrThrow({
      where: { id: +uploadId },
    });

    if (user.id !== userUpload.userId) {
      next({
        status: 403,
        message: "User does not own this upload.",
      });
    }

    res.json(userUpload);
  } catch (error) {
    next(error);
  }
});
