// Import Express and define Express router to export
const express = require("express");
const router = express.Router();
module.exports = router;

//Authentication Required import
const { authenticate } = require("./auth/auth");

// Require Upload audio file import
const { audiofileUpload } = require("./multer");

//Primsa Client import
const prisma = require("../prisma");

// Admins can use this router to get all edits created by users in our database
router.get("/", authenticate, async (req, res, next) => {
  if (req.user.admin === false) {
    next({ status: 403, message: "You do not authorized access." });
  }

  try {
    const uploads = await prisma.track.findMany();
    res.json(uploads);
  } catch (e) {
    next(e);
  }
});

// Post audiofile uploads metadata in Prisma and add to multer storage
// This uses multer to store the new audio file uploaded by the user.
router.post(
  "/",
  authenticate,
  audiofileUpload.single("mp3"),
  async (req, res, next) => {
    const { duration, bitrate, samplingrate } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    try {
      const newUpload = await prisma.upload.create({
        data: {
          name: file.originalname,
          userId: req.user.id,
          duration,
          bitrate,
          samplingrate,
          audioDataUrl: file.path,
        },
      });
      // Return successful response with file metadata
      res.status(201).json({
        message: "MP3 uploaded successfully!",
        file: newUpload,
      });
    } catch (error) {
      next({ error });
    }
  }
);

// Update the name of an upload
router.patch("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedUpload = await prisma.upload.update({
      where: { id: +id },
      data: {
        name,
        userId: req.user.id,
      },
    });

    if (req.user.id !== updatedUpload.userId) {
      return next({
        status: 403,
        message: "You do not have access to this upload.",
      });
    }

    res.status(200).json(updatedUpload);
  } catch (error) {
    next(error);
  }
});

// User can delete an upload as long as they are the owner
router.delete("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const upload = await prisma.upload.findUnique({ where: { id: +id } });
    if (req.user.id !== upload.userId) {
      return next({
        status: 403,
        message: "You do not have access to this.",
      });
    }
    await prisma.upload.delete({ where: { id: +id } });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});
