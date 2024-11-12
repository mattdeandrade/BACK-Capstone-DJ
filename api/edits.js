const express = require("express");
const router = express.Router();
module.exports = router;

// Require Upload audio file function import
const { audiofileUpload } = require("./multer");

//Authentication Required import
const { authenticate } = require("./auth/auth");

//Primsa Client import
const prisma = require("../prisma");

// Admins can use this router to get all edits created by users in our database
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

// Creates a new edit made by a logged in user. Requires authentication.
// This uses multer to store the new audio file uploaded by the user.
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

// Update edit specifications as the user works on an edit
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

// Deletes an edit from the database
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
