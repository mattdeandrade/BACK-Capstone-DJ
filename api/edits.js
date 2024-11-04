const express = require("express");
const router = express.Router();
module.exports = router;

//Authentication Required import
const { authenticate } = require("./auth/auth");

//Primsa Client import
const prisma = require("../prisma");

router.get("/", authenticate, async (req, res, next) => {
  try {
    if (req.user.admin === false) {
      // Add admin bolean to user model
      next({ status: 403, message: "You do not have authorized access." });
    }

    const edits = await prisma.track.findMany();
    res.json(edits);
  } catch (e) {
    next(e);
  }
});

router.post("/", authenticate, async (req, res, next) => {
  const {
    editName,
    artistName,
    vocals,
    instrumental,
    duration,
    pitch,
    bpm,
    genre,
    loop,
    effects,
    bitrate,
    samplingrate,
    channelmode,
  } = req.body;

  try {
    const edit = await prisma.edit.create({
      data: {
        editName,
        artistName,
        vocals,
        instrumental,
        duration,
        pitch,
        bpm,
        genre,
        loop,
        effects,
        userId: req.user.id,
        bitrate,
        samplingrate,
        channelmode,
      },
    });
    res.json(edit);
  } catch (error) {
    next(error);
  }
});
