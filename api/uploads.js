// Import Express and define Express router to export
const express = require("express");
const router = express.Router();
module.exports = router;

// For handling audio file uploads
// multer: Middleware for handling multipart/form-data, which is commonly used for file uploads.
const multer = require("multer");
const audiofiles = multer({ dest: "uploads/" }); // Temporarily save file to local storage

//Authentication Required import
const { authenticate } = require("./auth/auth");

//Primsa Client import
const prisma = require("../prisma");

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

// Store audiofile uploads metadata in Prisma
router.post("/", authenticate, async (req, res, next) => {
  const { name, duration, bitrate, samplingrate } = req.body;

  try {
    const upload = await prisma.upload.create({
      data: {
        name,
        userId: req.user.id,
        duration,
        bitrate,
        samplingrate,
      },
    });
    res.status(201).json(upload);
  } catch (error) {
    next({ error });
  }
});

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
