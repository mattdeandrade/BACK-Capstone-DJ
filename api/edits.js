const express = require("express");
const router = express.Router();
module.exports = router;

// For handling audio file uploads
// multer: Middleware for handling multipart/form-data, which is commonly used for file uploads.
const multer = require("multer");

// Require Upload audio file function import
const { audiofileUpload } = require("./multer"); 

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

router.post(
  "/",
  authenticate,
  audiofileUpload.single("mp3"),
  async (req, res, next) => {
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

  const file = req.file;
    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    try {
      const newEdit = await prisma.edit.create({
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
          audioDataUrl: file.path,
        },
      });
      res.status(201).json({
        message: "MP3 Edit uploaded successfully!",
        file: newEdit,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update edit choices as the user works on an edit
router.patch("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
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
    const updatedEdit = await prisma.edit.update({
      where: { id: +id },
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
        bitrate,
        samplingrate,
        channelmode,
        userId: req.user.id,
      },
    });

    if (req.user.id !== updatedEdit.userId) {
      return next({
        status: 403,
        message: "You do not have access to this edit.",
      });
    }

    res.status(200).json(updatedEdit);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const edit = await prisma.edit.findUnique({ where: { id: +id } });
    if (req.user.id !== edit.userId) {
      return next({
        status: 403,
        message: "You do not have access to this.",
      });
    }
    await prisma.edit.delete({ where: { id: +id } });
    res.status(204).send(); // No content to send back
  } catch (e) {
    next(e);
  }
});
