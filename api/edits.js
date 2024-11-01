const express = require("express");
const router = express.Router();
module.exports = router;

//Authentication Required import
const { authenticate } = require("./auth/auth");

//Primsa Client import
const prisma = require("../prisma");

router.get("/", async (req, res, next) => {
  try {
    const edits = await prisma.track.findMany();
    res.json(edits);
  } catch (e) {
    next(e);
  }
});
