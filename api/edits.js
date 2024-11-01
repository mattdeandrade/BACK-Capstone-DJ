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
