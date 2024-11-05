const express = require("express");
const router = express.Router();
module.exports = router;

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
