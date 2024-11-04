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

router.get("/:id/tracks", authenticate, async (req, res, next) => {
  const { id } = req.params;

  try {
    if (req.user.id !== +id) {
      next({
        status: 403,
        message: "You do not have access to these tracks.",
      });
    }
    const userTracks = await prisma.track.findMany({ where: { userId: +id } });

    res.json(userTracks);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/playlists", authenticate, async (req, res, next) => {
  const { id } = req.params;

  try {
    if (req.user.id !== +id) {
      next({
        status: 403,
        message: "You do not have access to these playlists.",
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
        message: "You do not have access to these edits.",
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
        message: "You do not have access to these uploads.",
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

//getbyid routes for a single user

router.get("/:id/tracks/:trackId", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { trackId } = req.params;

  try {
    if (req.user.id !== +id) {
      next({
        status: 403,
        message: "You do not have access to these tracks.",
      });
    }

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

router.get("/:id/playlists", authenticate, async (req, res, next) => {
  const { id } = req.params;

  try {
    if (req.user.id !== +id) {
      next({
        status: 403,
        message: "You do not have access to these playlists.",
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
        message: "You do not have access to these edits.",
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
        message: "You do not have access to these uploads.",
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
