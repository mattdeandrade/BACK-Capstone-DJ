const express = require("express");
const router = express.Router();
module.exports = router;

//Authentication Required import
const { authenticate } = require("./auth/auth");

//Primsa Client import
const prisma = require("../prisma");

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

router.get("/tracks", authenticate, async (req, res, next) => {
  const user = user.id;

  try {
    if (req.user.id !== +id) {
      next({
        status: 403,
        message: "You do not have access to these tracks. Knuck if you buck.",
      });
    }
    const userTracks = await prisma.track.findMany({ where: { userId: +id } });

    res.json(userTracks);
  } catch (error) {
    next(error);
  }
});

router.get("/playlists", authenticate, async (req, res, next) => {
  const { id } = req.params;

  try {
    if (req.user.id !== +id) {
      next({
        status: 403,
        message:
          "You do not have access to these playlists. Knuck if you buck.",
      });
    }
    const userPlaylists = await prisma.playlist.findMany({
      where: { userId: +id },
    });

    res.json(userPlaylists);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/edits", authenticate, async (req, res, next) => {
  const { id } = req.params;

  try {
    if (req.user.id !== +id) {
      next({
        status: 403,
        message: "You do not have access to these edits. Knuck if you buck.",
      });
    }
    const userEdits = await prisma.edit.findMany({ where: { userId: +id } });

    res.json(userEdits);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/uploads", authenticate, async (req, res, next) => {
  const { id } = req.params;

  try {
    if (req.user.id !== +id) {
      next({
        status: 403,
        message: "You do not have access to these uploads. Knuck if you buck.",
      });
    }
    const userUploads = await prisma.upload.findMany({
      where: { userId: +id },
    });

    res.json(userUploads);
  } catch (error) {
    next(error);
  }
});
